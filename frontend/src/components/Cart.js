import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import axios from 'axios';
import config from '../config'
import { placeOrder, updateOrderStatus, getOrderStatus } from '../services/publicService';


const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Controls cart modal visibility
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('Not Paid');
  const [isTimeValid, setIsTimeValid] = useState(false);
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState()
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);

  const userEmail = sessionStorage.getItem('email');

  useEffect(() => {
    if (tableTime) {
      setIsTimeValid(true);
    } else {
      setIsTimeValid(false);
    }
  }, [tableTime]);

  const confirmPayment = async () => {

    console.log('Table Time:', tableTime);
    console.log('Is Time Valid:', isTimeValid);

    if (!isTimeValid) {
      alert('Silakan isi waktu pemesanan terlebih dahulu!');
      return;
    }
    // Prepare order data
    const orderData = {
      Nama_Pelanggan: userEmail,
      Tanggal: tableDate,
      Waktu: tableTime,
      Detail: cartItems.map((item) => ({
        "Nama Menu": item.name,
        Harga: item.price,
        Jumlah: item.quantity,
      })),
      total_harga: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    };

    try {
      // Use the placeOrder function from publicService.js
      
      const orderResult = await placeOrder(orderData);
      if(orderResult.status){
        console.log(orderResult.payment_url)
        window.open(orderResult.payment_url)
      }
      const newOrderId = orderResult.order_id; // Assuming backend returns order ID
      setOrderId(newOrderId);
      
      console.log('Order successfully added:', orderResult);

      const total = cartItems.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
      setOrderTotal(total);

      // Clear the cart and close modals
      clearCart();
      setIsCartModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error during order submission:', error);
      alert('Gagal membuat pesanan: ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
    }
  };
  
    // Function to manually update status to Pending
    const updateToPending = async () => {
      try {
        await updateOrderStatus(orderId, 'Pending');
        setPaymentStatus('Pending');
        console.log('Status berhasil diperbarui menjadi Pending.');
      } catch (error) {
        console.error('Error updating status to Pending:', error);
        console.log('Gagal memperbarui status ke Pending.');
      }
    };
  

  return (
    <>
      {/* Floating Cart Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '280px',
          background: '#1e1e1e',
          color: '#fff',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() => setIsCartModalOpen(true)} // Open cart modal on click
      >
        <div>
          🛒 Keranjang{' '}
          {cartItems.length >= 0 && (
            <span
              style={{
                background: 'red',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
                marginLeft: '5px',
              }}
            >
              {cartItems.length}
            </span>
          )}
        </div>
        <div>
          Rp{' '}
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
        </div>
      </div>

      {/* Cart Modal */}
      <CModal
        visible={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        size="lg" // Increase the modal size
      >
        <CModalHeader>
          <h4 style={{ fontWeight: 'bold' }}>🛒 Keranjang</h4> {/* Larger header */}
        </CModalHeader>
        <CModalBody>
          {cartItems.length === 0 ? (
            <p style={{ fontSize: '18px', textAlign: 'center', marginTop: '20px' }}>
              Keranjang kosong
            </p>
          ) : (
            <>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Item</CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell>Harga</CTableHeaderCell>
                    <CTableHeaderCell>Total</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell> {/* Added column for actions */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cartItems.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell style={{ fontSize: '16px' }}>{item.name}</CTableDataCell>
                      <CTableDataCell style={{ fontSize: '16px' }}>{item.quantity}</CTableDataCell>
                      <CTableDataCell style={{ fontSize: '16px' }}>
                        Rp {item.price.toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '16px' }}>
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => removeFromCart(index)} // Remove item from cart
                        >
                          ❌ Hapus
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {/* Total Row */}
                  <CTableRow>
                    <CTableDataCell
                      colSpan="4"
                      style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        padding: '15px',
                      }}
                    >
                      Total:
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        padding: '15px',
                      }}
                    >
                      Rp{' '}
                      {cartItems
                        .reduce((total, item) => total + item.price * item.quantity, 0)
                        .toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell></CTableDataCell> {/* Empty cell for alignment */}
                  </CTableRow>
                </CTableBody>
              </CTable>
              <hr />
              <CForm>
                <CFormLabel style={{ fontSize: '16px', fontWeight: 'bold' }}>Tanggal Pemesanan</CFormLabel>
                <CFormInput
                  type="date"
                  value={tableDate}
                  onChange={(e) => setTableDate(e.target.value)}
                  style={{ marginBottom: '15px', fontSize: '16px' }}
                />
                <CFormLabel style={{ fontSize: '16px', fontWeight: 'bold' }}>Waktu Pemesanan</CFormLabel>
                <CFormInput
                  type="time"
                  value={tableTime}
                  onChange={(e) => setTableTime(e.target.value)}
                  style={{ marginBottom: '15px', fontSize: '16px' }}
                />
                {!isTimeValid && (
                  <small style={{ color: 'red' }}>Waktu pemesanan wajib diisi!</small>
                )}
              </CForm>
              {/* <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Pilih Metode Pembayaran:
              </p> */}
              {/* <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <CButton
                  color={selectedPayment === 'QRIS' ? 'primary' : 'secondary'}
                  className="m-1"
                  onClick={() => setSelectedPayment('QRIS')}
                  style={{ fontSize: '16px', padding: '10px 20px' }}
                >
                  QRIS
                </CButton>
              </div> */}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setIsCartModalOpen(false)}
            style={{ fontSize: '16px', padding: '10px 20px' }}
          >
            Batal
          </CButton>
          <CButton
            onClick={confirmPayment}
            color='success'
            style={{ fontSize: '16px', padding: '10px 20px' }}
            disabled={!isTimeValid} // Nonaktifkan tombol jika waktu tidak valid
          >
            Bayar Sekarang
          </CButton>
        </CModalFooter>
      </CModal>

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
        <CModalBody style={{ textAlign: 'center', padding: 40, background: '#212631', borderRadius: 15 }}>
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

          {/* Button to manually update status to Pending */}
          {paymentStatus === 'Not Paid' && (
            <CButton
              color="warning"
              onClick={updateToPending}
              style={{ marginTop: 20, width: 150, marginRight: 10 }}
            >
              Cek Pembayaran
            </CButton>
          )}

          {/* Close Button */}
          <CButton
            color="secondary"
            onClick={() => setSuccessModalOpen(false)}
            style={{ marginTop: 20, width: 150 }}
          >
            Tutup
          </CButton>
        </CModalBody>
      </CModal>

      {/* Animation CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default Cart;