import React, { useState } from 'react';
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
import { placeOrder } from '../services/publicService'; // Import the placeOrder function

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Controls cart modal visibility
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState(
    new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })
  )

  const userEmail = sessionStorage.getItem('email');

  const confirmPayment = async () => {
    if (!selectedPayment) {
      alert('Pilih metode pembayaran terlebih dahulu!');
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
      const result = await placeOrder(orderData);
      console.log('Order successfully added:', result);

      // Clear the cart and close modals
      clearCart();
      setIsCartModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error during order submission:', error);
      alert('Gagal membuat pesanan: ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
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
              </CForm>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Pilih Metode Pembayaran:
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <CButton
                  color={selectedPayment === 'Transfer Bank' ? 'primary' : 'secondary'}
                  className="m-1"
                  onClick={() => setSelectedPayment('Transfer Bank')}
                  style={{ fontSize: '16px', padding: '10px 20px' }}
                >
                  Transfer Bank
                </CButton>
                <CButton
                  color={selectedPayment === 'E-Wallet' ? 'primary' : 'secondary'}
                  className="m-1"
                  onClick={() => setSelectedPayment('E-Wallet')}
                  style={{ fontSize: '16px', padding: '10px 20px' }}
                >
                  E-Wallet
                </CButton>
              </div>
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
            color="success"
            onClick={confirmPayment}
            style={{ fontSize: '16px', padding: '10px 20px' }}
          >
            Bayar Sekarang
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Success Modal with Centered Message & Blur Background */}
      <CModal
        visible={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        backdrop="static"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <CModalBody style={{ textAlign: 'center', padding: '40px' }}>
          <h2>🎉 Pembayaran Berhasil!</h2>
          <p>Terima kasih telah berbelanja. Pesanan Anda sedang diproses.</p>
          <CButton color="success" onClick={() => setSuccessModalOpen(false)}>
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