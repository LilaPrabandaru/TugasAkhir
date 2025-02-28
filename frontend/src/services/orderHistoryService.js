import axios from 'axios'
import config from '../config'

const API_URL = `${config.API_URL}`
const access_token = sessionStorage.getItem('access_token')

// Ambil semua pesanan
export const getAllPesanan = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/pesanan`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching pesanan data:', error)
    throw error
  }
}

// Tambah pesanan
export const addPesanan = async (pesananData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/add_pesanan`, pesananData, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    return response.data
  } catch (error) {
    console.error('Error adding pesanan:', error)
    throw error
  }
}

// Update pesanan
export const updatePesanan = async (pesananId, pesananData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/update_pesanan/${pesananId}`, pesananData, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    return response.data
  } catch (error) {
    console.error('Error updating pesanan:', error)
    throw error
  }
}

// Hapus pesanan
export const deletePesanan = async (pesananId) => {
  try {
    await axios.delete(`${API_URL}/admin/delete_pesanan/${pesananId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  } catch (error) {
    console.error('Error deleting pesanan:', error)
    throw error
  }
}
