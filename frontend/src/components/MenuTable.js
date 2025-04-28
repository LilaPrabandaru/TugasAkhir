import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
} from '@coreui/react'

const MenuTable = ({ menuItems, addToCart }) => {
  const [quantities, setQuantities] = useState({})

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: parseInt(value) || 1 })
  }

  return (
    <CTable bordered hover responsive striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell style={{ width: '45%', textAlign: 'center' }}>
            Nama Menu
          </CTableHeaderCell>
          <CTableHeaderCell style={{ width: '20%', textAlign: 'right' }}>Harga</CTableHeaderCell>
          <CTableHeaderCell style={{ width: '15%', textAlign: 'center' }}>Jumlah</CTableHeaderCell>
          <CTableHeaderCell style={{ width: '10%', textAlign: 'center' }}>Aksi</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {menuItems.map((item) => (
          <CTableRow key={item.id}>
            <CTableDataCell style={{ textAlign: 'left' }}>{item.name}</CTableDataCell>
            <CTableDataCell style={{ textAlign: 'right' }}>
              Rp {item.price.toLocaleString()}
            </CTableDataCell>
            <CTableDataCell style={{ textAlign: 'center' }}>
              <CFormInput
                type="number"
                min="1"
                value={quantities[item.id] || 1}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                style={{ width: '70px', margin: '0 auto' }}
              />
            </CTableDataCell>
            <CTableDataCell style={{ textAlign: 'center' }}>
              <CButton color="primary" onClick={() => addToCart(item, quantities[item.id] || 1)}>
                Tambah
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default MenuTable
