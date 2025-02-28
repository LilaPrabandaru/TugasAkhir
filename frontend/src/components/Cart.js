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

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isCartVisible, setCartVisible] = useState(true);
  const [tableNumber, setTableNumber] = useState('');
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState(
    new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const togglePaymentModal = (state) => {
    setPaymentModalOpen(state);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong, tambahkan item terlebih dahulu!');
      return;
    }
    console.log('Opening payment modal...');
    setPaymentModalOpen(true); // Ensure modal opens
  };

  const confirmPayment = async () => {
    if (!selectedPayment) {
      alert('Pilih metode pembayaran terlebih dahulu!');
      return;
    }
    if (!tableNumber.trim()) {
      alert('Masukkan nama pemesan!');
      return;
    }
  
    // Prepare order data
    const orderData = {
      Nama_Pelanggan: tableNumber,
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
      // Send the order data to the backend
      const response = await fetch('http://localhost:5000/user/dashboard/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Order successfully added:', result);
        alert('Pesanan berhasil dibuat! Nomor Pesanan: ' + result.order_id);
  
        // Clear the cart and close modals
        clearCart();
        setCartVisible(false);
        setPaymentModalOpen(false);
        setSuccessModalOpen(true);
      } else {
        console.error('Failed to add order:', result.message);
        alert('Gagal membuat pesanan: ' + result.message);
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      alert('Terjadi kesalahan saat mengirim pesanan.');
    }
  };

  return (
    <>
      {/* Cart UI */}
      {isCartVisible && cartItems.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '280px',
            transition: 'right 0.3s ease-in-out',
            background: '#1e1e1e',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
            padding: '10px',
          }}
        >
          <CCard>
            <CCardHeader>
              <h5>🛒 Keranjang</h5>
            </CCardHeader>
            <CCardBody>
              {cartItems.length === 0 ? (
                <p>Keranjang kosong</p>
              ) : (
                <CListGroup flush>
                  {cartItems.map((item, index) => (
                    <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        {item.name} ({item.quantity}x)
                      </div>
                      <CButton color="danger" size="sm" onClick={() => removeFromCart(index)}>
                        ❌
                      </CButton>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
              {cartItems.length > 0 && (
                <>
                  <hr />
                  <p>
                    <strong>Total: </strong>Rp{' '}
                    {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                  </p>
                  <CButton color="success" block onClick={handlePlaceOrder}>
                    Pesan Sekarang
                  </CButton>
                </>
              )}
            </CCardBody>
          </CCard>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      <CModal visible={isPaymentModalOpen} onClose={() => togglePaymentModal(false)}>
        <CModalHeader>
          <h5>Konfirmasi Pesanan</h5>
        </CModalHeader>
        <CModalBody>
          <p>
            <strong>Detail Pesanan:</strong>
          </p>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Item</CTableHeaderCell>
                <CTableHeaderCell>Qty</CTableHeaderCell>
                <CTableHeaderCell>Harga</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {cartItems.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>Rp {item.price.toLocaleString()}</CTableDataCell>
                  <CTableDataCell>Rp {(item.price * item.quantity).toLocaleString()}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <hr />
          <p>
            <strong>Total Bayar: </strong>Rp{' '}
            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
          </p>
          <CForm>
            <CFormLabel>Nama Pemesan</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Masukkan nama pemesan"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
            <CFormLabel>Tanggal Pemesanan</CFormLabel>
            <CFormInput
              type="date"
              value={tableDate}
              onChange={(e) => setTableDate(e.target.value)}
            />
            <CFormLabel>Waktu Pemesanan</CFormLabel>
            <CFormInput
              type="time"
              step="1"
              value={tableTime}
              onChange={(e) => setTableTime(e.target.value)}
            />
          </CForm>
          <p>
            <strong>Pilih Metode Pembayaran:</strong>
          </p>
          <CButton
            color={selectedPayment === 'Transfer Bank' ? 'primary' : 'secondary'}
            className="m-1"
            onClick={() => setSelectedPayment('Transfer Bank')}
          >
            Transfer Bank
          </CButton>
          <CButton
            color={selectedPayment === 'E-Wallet' ? 'primary' : 'secondary'}
            className="m-1"
            onClick={() => setSelectedPayment('E-Wallet')}
          >
            E-Wallet
          </CButton>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={togglePaymentModal}>
            Batal
          </CButton>
          <CButton color="success" onClick={confirmPayment}>
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