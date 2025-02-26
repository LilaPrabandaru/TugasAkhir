import React from 'react'
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton } from '@coreui/react'

const Cart = ({ cartItems, removeFromCart, placeOrder }) => {
  return (
    <div>
      <h3>Keranjang Belanja</h3>
      {cartItems.length === 0 ? <p>Keranjang kosong</p> : (
        <>
          <CTable hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nama Menu</CTableHeaderCell>
                <CTableHeaderCell>Harga</CTableHeaderCell>
                <CTableHeaderCell>Jumlah</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Aksi</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {cartItems.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>Rp {item.price.toLocaleString()}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>Rp {(item.price * item.quantity).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" onClick={() => removeFromCart(index)}>Hapus</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CButton color="success" className="mt-2" onClick={placeOrder}>Pesan Sekarang</CButton>
        </>
      )}
    </div>
  )
}

export default Cart
