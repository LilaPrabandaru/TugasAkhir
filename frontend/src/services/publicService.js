import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_URL}`;

// Ambil token dari sessionStorage
const getAuthHeaders = () => {
  const access_token = sessionStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
};

// Ambil data publik (tampilan user)
export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Ambil daftar produk
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Ambil detail produk berdasarkan ID
export const getUserDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/dashboard`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    throw error;
  }
};

// Kirim data pesanan ke backend
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/user/dashboard/order`, orderData, getAuthHeaders());
    return response.data; // Return the response from the server (e.g., order ID)
  } catch (error) {
    console.error('Error placing order:', error);
    throw error; // Re-throw the error for handling in the frontend
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/user/update_status/${orderId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getPaymentUrl = async (orderId, totalAmount) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/dashboard/order`,
      { 
        Nama_Pelanggan: userEmail,
        Tanggal: tableDate,
        Waktu: tableTime,
        Detail: cartItems,
        total_harga: totalAmount
      },
      getAuthHeaders()
    );
    return response.data.payment_url;
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/order-status/${orderId}`,
      getAuthHeaders()
    );
    return response.data.status; // Returns "Not Paid", "Pending", or "Paid"
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
};