import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ID from 'date-fns/locale/id'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { placeOrder, updateOrderStatus, getOrderStatus } from '../services/publicService'

// Custom input untuk DatePicker menggunakan CoreUI CFormInput
const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }, ref) => (
  <CFormInput
    value={value}
    onClick={onClick}
    onChange={onChange}
    placeholder={placeholder}
    ref={ref}
  />
))

// Generate pilihan waktu (dari jam 5:00 PM sampai 11:00 PM, interval 30 menit)
const timeOptions = []
for (let hour = 17; hour <= 20; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    if (hour === 20 && minute > 0) continue // Batasi sampai pukul 20:00 tepat
    const formattedHour = hour.toString().padStart(2, '0')
    const formattedMinute = minute.toString().padStart(2, '0')
    const timeValue = `${formattedHour}:${formattedMinute}`
    const displayHour = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayTime = `${displayHour}:${formattedMinute} ${period}`
    timeOptions.push({ value: timeValue, label: displayTime })
  }
}

/* 
  Menambahkan properti theme (default "light") agar styling dapat disesuaikan.
  Anda bisa mengintegrasikan properti theme ini dengan context, redux, atau mekanisme tema lain.
*/
const Cart = ({ cartItems, removeFromCart, clearCart, theme = 'light' }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('Not Paid')
  const [isTimeValid, setIsTimeValid] = useState(false)
  const [tableDate, setTableDate] = useState(new Date())
  const [tableTime, setTableTime] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderId, setOrderId] = useState(null)

  const userEmail = sessionStorage.getItem('email')

  useEffect(() => {
    setIsTimeValid(!!tableTime)
  }, [tableTime])

  const confirmPayment = async () => {
    if (!isTimeValid) {
      alert('Silakan isi waktu pemesanan terlebih dahulu!')
      return
    }
    const orderData = {
      Nama_Pelanggan: userEmail,
      Tanggal: tableDate.toISOString().split('T')[0],
      Waktu: tableTime,
      Detail: cartItems.map((item) => ({
        'Nama Menu': item.name,
        Harga: item.price,
        Jumlah: item.quantity,
      })),
      total_harga: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    }
    try {
      const orderResult = await placeOrder(orderData)
      if (orderResult.status) {
        window.open(orderResult.payment_url)
      }
      const newOrderId = orderResult.order_id
      setOrderId(newOrderId)
      setOrderTotal(cartItems.reduce((total, item) => total + item.price * item.quantity, 0))
      clearCart()
      setIsCartModalOpen(false)
      setSuccessModalOpen(true)
    } catch (error) {
      console.error('Error during order submission:', error)
      alert('Gagal membuat pesanan: ' + (error.response?.data?.message || 'Terjadi kesalahan.'))
    }
  }

  const updateToPending = async () => {
    try {
      await updateOrderStatus(orderId, 'Pending')
      setPaymentStatus('Pending')
    } catch (error) {
      console.error('Error updating status to Pending:', error)
    }
  }

  // Menentukan kelas yang digunakan berdasarkan tema
  const cardThemeClass = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
  const successCardThemeClass = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'

  return (
    <>
      {/* Floating Cart Button */}
      <CCard
        className={`position-fixed shadow ${cardThemeClass}`}
        style={{ bottom: '20px', right: '20px', width: '280px', cursor: 'pointer', zIndex: 1000 }}
        onClick={() => setIsCartModalOpen(true)}
      >
        <CCardBody className="d-flex align-items-center justify-content-between">
          <div>
            🛒 Keranjang{' '}
            {cartItems.length >= 0 && (
              <span className="bg-danger text-white rounded-circle px-2 fs-6 ms-1">
                {cartItems.length}
              </span>
            )}
          </div>
          <div>
            Rp{' '}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString()}
          </div>
        </CCardBody>
      </CCard>

      {/* Cart Modal */}
      <CModal visible={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} size="lg">
        <CModalHeader className={cardThemeClass}>
          <CModalTitle className="fw-bold">🛒 Keranjang</CModalTitle>
        </CModalHeader>
        <CModalBody className={cardThemeClass}>
          {cartItems.length === 0 ? (
            <CRow className="justify-content-center mt-4">
              <CCol xs={12} className="fs-5 text-center">
                Keranjang kosong
              </CCol>
            </CRow>
          ) : (
            <>
              <CTable striped hover responsive className={cardThemeClass}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Item</CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '120px' }}>Harga</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '150px' }}>Total</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cartItems.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell className="fs-6">{item.name}</CTableDataCell>
                      <CTableDataCell className="fs-6">{item.quantity}</CTableDataCell>
                      <CTableDataCell className="fs-6">
                        Rp {item.price.toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell className="fs-6">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => removeFromCart(index)}>
                          ❌ Hapus
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-end fw-bold fs-5 p-3">
                      Total:
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold fs-5 p-3">
                      Rp{' '}
                      {cartItems
                        .reduce((total, item) => total + item.price * item.quantity, 0)
                        .toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell />
                  </CTableRow>
                </CTableBody>
              </CTable>
              <hr />
              <CForm className={cardThemeClass}>
                <CRow className="mb-3">
                  <CCol xs={12} md={6}>
                    <CFormLabel className="fs-6 fw-bold">Tanggal Pemesanan</CFormLabel>
                    <div className="mt-2">
                      <DatePicker
                        locale={ID}
                        selected={tableDate}
                        onChange={(date) => setTableDate(date)}
                        dateFormat="dd MMMM yyyy"
                        minDate={new Date()}
                        filterDate={(date) => date.getDay() !== 0} // disable Hari Minggu
                        customInput={<CustomDateInput />}
                        className="fs-6 w-100"
                      />
                    </div>
                  </CCol>
                  <CCol xs={12} md={6}>
                    <CFormLabel className="fs-6 fw-bold">Waktu Pemesanan</CFormLabel>
                    <CFormSelect
                      value={tableTime}
                      onChange={(e) => setTableTime(e.target.value)}
                      className="fs-6"
                      style={{ width: '58%' }}
                    >
                      <option value="">Pilih waktu</option>
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <small className="text-muted d-block">
                      Lentera Grill buka dari jam 5:00 PM sampai 10:00 PM
                    </small>
                    <small className="text-muted d-block">
                      Open Order dari jam 5:00 PM sampai 08:00 PM
                    </small>
                    {!isTimeValid && (
                      <small className="text-danger">Waktu pemesanan wajib diisi!</small>
                    )}
                  </CCol>
                </CRow>
              </CForm>
            </>
          )}
        </CModalBody>
        <CModalFooter className={cardThemeClass}>
          <CButton
            color="secondary"
            onClick={() => setIsCartModalOpen(false)}
            className="fs-6 py-2 px-3"
          >
            Batal
          </CButton>
          <CButton
            onClick={confirmPayment}
            color="success"
            className="fs-6 py-2 px-3"
            disabled={!isTimeValid || cartItems.length === 0}
          >
            Bayar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Success Modal */}
      <CModal
        visible={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        backdrop="static"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <CCard className={`p-4 text-center ${successCardThemeClass}`}>
          {paymentStatus === 'Not Paid' ? (
            <>
              <h2>🎉 Pembayaran Berhasil!</h2>
              <p>Terima kasih telah melakukan pembayaran.</p>
            </>
          ) : paymentStatus === 'Pending' ? (
            <>
              <h2>📱 Pembayaran Terkonfirmasi</h2>
              <p>Silahkan datang menunggu pesanan anda dibuat.</p>
              <CCol xs="auto">
                <CButton
                  color="secondary"
                  onClick={() => setSuccessModalOpen(false)}
                  style={{ width: '150px' }}
                >
                  Tutup
                </CButton>
              </CCol>
            </>
          ) : (
            <>
              <h2>❌ Pembayaran Belum Dilakukan</h2>
              <p>Silakan selesaikan pembayaran untuk melanjutkan.</p>
            </>
          )}
          <CRow className="justify-content-center mt-3">
            {paymentStatus === 'Not Paid' && (
              <CCol xs="auto">
                <CButton color="warning" onClick={updateToPending} style={{ width: '150px' }}>
                  Cek Pembayaran
                </CButton>
              </CCol>
            )}
          </CRow>
        </CCard>
      </CModal>
    </>
  )
}

export default Cart
