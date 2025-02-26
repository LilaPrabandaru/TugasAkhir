import React, { useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CButton, CFormInput } from '@coreui/react'

const MenuTable = ({ menuItems, addToCart }) => {
  const [quantities, setQuantities] = useState({})

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: parseInt(value) || 1 })
  }

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Nama Menu</CTableHeaderCell>
          <CTableHeaderCell style={ {textAlign: 'right' }}>Harga</CTableHeaderCell>
          <CTableHeaderCell>Jumlah</CTableHeaderCell>
          <CTableHeaderCell>Aksi</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {menuItems.map((item) => (
          <CTableRow key={item.id}>
            <CTableDataCell>{item.name}</CTableDataCell>
            <CTableDataCell style={ {textAlign: 'right' }}>Rp {item.price.toLocaleString()}</CTableDataCell>
            <CTableDataCell>
              <CFormInput
                type="number"
                min="1"
                value={quantities[item.id] || 1}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                style={{ width: '70px' }}
              />
            </CTableDataCell>
            <CTableDataCell>
              <CButton color="primary" onClick={() => addToCart(item, quantities[item.id] || 1)}>Tambah</CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default MenuTable
