import React, { useState } from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import MenuTable from '../../components/MenuTable'
import Cart from '../../components/Cart'

const UserDashboard = () => {
  const [menuItems] = useState([
    { id: 1, name: 'Nasi Goreng', price: 25000 },
    { id: 2, name: 'Ayam Bakar', price: 30000 },
    { id: 3, name: 'Es Teh Manis', price: 5000 },
  ])

  const [cartItems, setCartItems] = useState([])

  const addToCart = (item, quantity) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ))
    } else {
      setCartItems([...cartItems, { ...item, quantity }])
    }
  }

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong, tambahkan item terlebih dahulu!')
      return
    }

    let orderDetails = "Pesanan Anda:\n"
    cartItems.forEach(item => {
      orderDetails += `${item.name} - ${item.quantity} pcs (Rp ${(item.price * item.quantity).toLocaleString()})\n`
    })

    alert(orderDetails + "\nPesanan berhasil dibuat!")
    setCartItems([])
  }

  return (
    <CContainer>
      <h2>Menu Makanan</h2>
      <CRow>
        <CCol md={8}>
          <MenuTable menuItems={menuItems} addToCart={addToCart} />
        </CCol>
        <CCol md={4}>
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} placeOrder={placeOrder} />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default UserDashboard
