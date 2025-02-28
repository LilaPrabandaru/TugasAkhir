import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import MenuTable from '../../components/MenuTable';
import Cart from '../../components/Cart';
import { getUserDashboard } from '../../services/publicService';

const UserDashboard = () => {
  const [menuData, setMenuData] = useState([]); // State to store raw menu data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Fetch menu data from the backend
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getUserDashboard(); // Fetch data from /user/dashboard
        setMenuData(data); // Store raw data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  // Add item to cart
  const addToCart = (item, quantity) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity }]);
    }
    setIsCartVisible(true); // Auto-open cart when item is added
  };

  // Remove item from cart
  const removeFromCart = index => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);

    if (newCart.length === 0) {
      setIsCartVisible(false); // Hide cart if empty
    }
  };

  // Clear cart
  const clearCart = () => {
    console.log('Clearing cart...');
    setCartItems([]); // Empty the cart
    console.log('Cart closed');
  };

  // Place order
  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong, tambahkan item terlebih dahulu!');
      return;
    }
    let orderDetails = '📜 **Pesanan Anda:**\n\n';
    cartItems.forEach(item => {
      orderDetails += `• ${item.name} - ${item.quantity} pcs (Rp ${(item.price * item.quantity).toLocaleString()})\n`;
    });
    alert(orderDetails + '\n✅ Pesanan berhasil dibuat!');
    setCartItems([]);
    setIsCartVisible(false);
  };

  // Group menu items by Kategori
  const groupedMenuItems = menuData.reduce((acc, item) => {
    const category = item.Kategori || 'Lainnya'; // Default category if Kategori is missing
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      id: item._id,
      name: item.Nama,
      price: item.Harga,
    });
    return acc;
  }, {});

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CContainer>
      <h2>Menu Makanan</h2>

      {/* Render grouped menu items */}
      {Object.keys(groupedMenuItems).map(category => (
        <CCard key={category} className="mb-4">
          <CCardHeader>{category}</CCardHeader>
          <CCardBody>
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
            display: 'flex',
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
  );
};

export default UserDashboard;