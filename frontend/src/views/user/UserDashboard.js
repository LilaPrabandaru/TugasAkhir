import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import MenuTable from '../../components/MenuTable'
import Cart from '../../components/Cart'
import { getUserDashboard } from '../../services/publicService'
import LenteraGrill from '../../assets/images/LenteraGrill_1.png'

const UserDashboard = () => {
  const [menuData, setMenuData] = useState([]) // State to store raw menu data
  const [error, setError] = useState(null) // Error state
  const [cartItems, setCartItems] = useState([])
  const [isCartVisible, setIsCartVisible] = useState(false)
  const [showSplash, setShowSplash] = useState(true) // Splash screen state

  // Fetch menu data from the backend
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getUserDashboard() // Fetch data from /user/dashboard
        setMenuData(data) // Store raw data
      } catch (err) {
        setError(err.message)
      }
    }
    fetchMenuData()
  }, [])

  // Add item to cart
  const addToCart = (item, quantity) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        ),
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity }])
    }
    setIsCartVisible(true) // Auto-open cart when item is added
  }

  // Remove item from cart
  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    setCartItems(newCart)

    if (newCart.length === 0) {
      setIsCartVisible(false) // Hide cart if empty
    }
  }

  // Clear cart
  const clearCart = () => {
    console.log('Clearing cart...')
    setCartItems([]) // Empty the cart
    console.log('Cart closed')
  }

  // Place order
  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong, tambahkan item terlebih dahulu!')
      return
    }
    let orderDetails = '📜 **Pesanan Anda:**\n\n'
    cartItems.forEach((item) => {
      orderDetails += `• ${item.name} - ${item.quantity} pcs (Rp ${(item.price * item.quantity).toLocaleString()})\n`
    })
    alert(orderDetails + '\n✅ Pesanan berhasil dibuat!')
    setCartItems([])
    setIsCartVisible(false)
  }

  // Group menu items by Kategori
  const groupedMenuItems = menuData.reduce((acc, item) => {
    const category = item.Kategori || 'Lainnya' // Default category if Kategori is missing
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push({
      id: item._id,
      name: item.Nama,
      price: item.Harga,
    })
    return acc
  }, {})

  if (error) {
    return <div>Error: {error}</div>
  }

  if (showSplash) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '84vh',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <img
          src={LenteraGrill}
          alt="Lentera Grill"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <CButton
          size="lg"
          onClick={() => setShowSplash(false)}
          style={{
            backgroundColor: 'transparent',
            color: 'black',
            border: '2px solid black',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            padding: '0.5rem 2rem', // vertical 0.5rem, horizontal 2rem
            borderRadius: '2rem', // sudut sangat melengkung → pill
          }}
        >
          Menu
        </CButton>
      </div>
    )
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol xs={12}>
          <h2 className="text-center">Menu Makanan</h2>
        </CCol>
      </CRow>
      {/* Render grouped menu items */}
      {Object.keys(groupedMenuItems).map((category) => (
        <CCard key={category} className="shadow-sm mb-3">
          <CCardBody>
            <h3>
              <strong>{category}</strong>
            </h3>
            <MenuTable menuItems={groupedMenuItems[category]} addToCart={addToCart} />
          </CCardBody>
        </CCard>
      ))}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <CButton
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1100,
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.2)',
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
