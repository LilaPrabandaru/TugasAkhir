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

// Mengambil list transaksi oleh user berdasarkan email
export const getAllPesananByEmail = async () => {
  try {
    const email = sessionStorage.getItem('email');
    if (!email) {
      throw new Error("Email not found in sessionStorage");
    }

    const response = await axios.get(`${API_URL}/user/orderhistory?email=${encodeURIComponent(email)}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error in getAllPesananByEmail:", error);
    throw error; // Re-throw the error for handling in the frontend
  }
};