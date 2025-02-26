import React, { useState } from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import MenuTable from '../../components/MenuTable'
import Cart from '../../components/Cart'

const UserDashboard = () => {
  const [menuItems] = useState([
    { id: 1, name: 'Nasi Goreng Sambal Ijo Khas Bali', price: 25000 },
    { id: 2, name: 'Ayam Bakar', price: 30000 },
    { id: 3, name: 'Es Teh Manis', price: 5000 },
  ])

  const [cartItems, setCartItems] = useState([])
  const [isCartVisible, setIsCartVisible] = useState(false)

  const addToCart = (item, quantity) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ))
    } else {
      setCartItems([...cartItems, { ...item, quantity }])
    }

    // Auto-open cart when item is added
    setIsCartVisible(true)
  }

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    setCartItems(newCart)
    
    if (newCart.length === 0) {
      setIsCartVisible(false) // Hide cart if empty
    }
  }

  const clearCart = () => {
    console.log("Clearing cart...");
    setCartItems([]); // Mengosongkan keranjang
    console.log("Cart closed")
  };

  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong, tambahkan item terlebih dahulu!')
      return
    }

    let orderDetails = "📜 **Pesanan Anda:**\n\n"
    cartItems.forEach(item => {
      orderDetails += `• ${item.name} - ${item.quantity} pcs (Rp ${(item.price * item.quantity).toLocaleString()})\n`
    })

    alert(orderDetails + "\n✅ Pesanan berhasil dibuat!")
    setCartItems([])
    setIsCartVisible(false)
  }

  return (
    <CContainer>
      <h2>Menu Makanan</h2>
      <CRow>
        <MenuTable menuItems={menuItems} addToCart={addToCart} />
      </CRow>
      
      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <CButton 
          style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100, borderRadius: '50%', 
            width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '24px', boxShadow: '2px 4px 10px rgba(0,0,0,0.2)'
          }} 
          color="dark" 
          onClick={() => setIsCartVisible(!isCartVisible)}
        >
          🛒
        </CButton>
      )}

      {/* Floating Cart */}
      {isCartVisible && (
        <Cart 
          cartItems={cartItems} 
          removeFromCart={removeFromCart} 
          placeOrder={placeOrder} 
          isCartVisible={isCartVisible} 
          clearCart={clearCart}
        />
      )}
    </CContainer>
  )
}

export default UserDashboard
