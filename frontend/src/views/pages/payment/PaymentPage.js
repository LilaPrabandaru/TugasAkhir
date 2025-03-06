// PaymentPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { CContainer, CCard, CCardBody, CButton } from '@coreui/react';
import { updatePaymentStatus } from '../services/publicService';

const PaymentPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  const handleConfirmPayment = async () => {
    try {
      await updatePaymentStatus(order.orderId, 'Pending');
      alert('Pembayaran berhasil! Status diperbarui menjadi Pending');
    } catch (error) {
      console.error('Gagal memperbarui status:', error);
      alert('Gagal memperbarui status pembayaran');
    }
  };

  return (
    <CContainer className="d-flex justify-content-center align-items-center vh-100">
      <CCard style={{ width: '400px' }}>
        <CCardBody>
          <h3 className="text-center mb-4">Konfirmasi Pembayaran</h3>
          
          <div className="text-center mb-3">
            <QRCode 
              value={`ORDER_${order.orderId}`} 
              size={128} 
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
            />
          </div>

          <div className="mb-3">
            <strong>Total Pembayaran:</strong> 
            <p className="h4">Rp {order.total_harga.toLocaleString()}</p>
          </div>

          <div className="mb-3">
            <strong>Metode Pembayaran:</strong> 
            <p>{order.paymentMethod}</p>
          </div>

          <CButton 
            color="success" 
            className="w-100" 
            onClick={handleConfirmPayment}
          >
            Konfirmasi Pembayaran
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default PaymentPage;