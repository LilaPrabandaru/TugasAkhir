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
  CPagination,
  CPaginationItem,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CBadge,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilList, cilChevronLeft, cilChevronRight } from '@coreui/icons'
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

// Generate pilihan waktu (dari jam 5:00 PM sampai 11:00 PM, interval 15 menit)
const timeOptions = []
for (let hour = 17; hour <= 22; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    if (hour === 22 && minute > 0) continue
    const formattedHour = hour.toString().padStart(2, '0')
    const formattedMinute = minute.toString().padStart(2, '0')
    const timeValue = `${formattedHour}:${formattedMinute}`
    const displayHour = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayTime = `${displayHour}:${formattedMinute} ${period}`
    timeOptions.push({ value: timeValue, label: displayTime })
  }
}

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('Not Paid')
  const [isTimeValid, setIsTimeValid] = useState(false)
  // Simpan tableDate sebagai objek Date agar mudah diproses oleh DatePicker
  const [tableDate, setTableDate] = useState(new Date())
  const [tableTime, setTableTime] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderId, setOrderId] = useState(null)

  const userEmail = sessionStorage.getItem('email')

  // Validasi: jika tableTime diisi, waktu valid
  useEffect(() => {
    setIsTimeValid(!!tableTime)
  }, [tableTime])

  const confirmPayment = async () => {
    if (!isTimeValid) {
      alert('Silakan isi waktu pemesanan terlebih dahulu!')
      return
    }
    // Siapkan data order
    const orderData = {
      Nama_Pelanggan: userEmail,
      Tanggal: tableDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
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
      const newOrderId = orderResult.order_id // Backend mengembalikan order ID
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

  return (
    <>
      {/* Floating Cart Button */}
      <CCard
        className="position-fixed shadow bg-dark text-white"
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
        <CModalHeader>
          <CModalTitle className="fw-bold">🛒 Keranjang</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {cartItems.length === 0 ? (
            <CRow className="justify-content-center mt-4">
              <CCol xs={12} className="fs-5 text-center">
                Keranjang kosong
              </CCol>
            </CRow>
          ) : (
            <>
              <CTable striped hover responsive>
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
                  {/* Total Row */}
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
              <CForm>
                <CRow className="mb-3">
                  {/* Tanggal Pemesanan */}
                  <CCol xs={12} md={6}>
                    <CFormLabel className="fs-6 fw-bold">Tanggal Pemesanan</CFormLabel>
                    <div className="mt-2">
                      <DatePicker
                        locale={ID}
                        selected={tableDate}
                        onChange={(date) => setTableDate(date)}
                        dateFormat="dd MMMM yyyy"
                        customInput={<CustomDateInput />}
                        className="fs-6 w-100"
                      />
                    </div>
                  </CCol>

                  {/* Waktu Pemesanan */}
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
                    {!isTimeValid && (
                      <small className="text-danger">Waktu pemesanan wajib diisi!</small>
                    )}
                  </CCol>
                </CRow>
              </CForm>
            </>
          )}
        </CModalBody>
        <CModalFooter>
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
            Bayar Sekarang
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
        <CCard className="p-4 bg-dark text-center" style={{ background: '#212631' }}>
          {paymentStatus === 'Not Paid' ? (
            <>
              <h2>🎉 Pembayaran Berhasil!</h2>
              <p>Terima kasih telah melakukan pembayaran.</p>
            </>
          ) : paymentStatus === 'Pending' ? (
            <>
              <h2>📱 Pembayaran Terkonfirmasi</h2>
              <p>Silahkan menunggu pesanan anda dibuat.</p>
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
            <CCol xs="auto">
              <CButton
                color="secondary"
                onClick={() => setSuccessModalOpen(false)}
                style={{ width: '150px' }}
              >
                Tutup
              </CButton>
            </CCol>
          </CRow>
        </CCard>
      </CModal>
    </>
  )
}

export default Cart
