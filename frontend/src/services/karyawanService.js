import axios from 'axios'
import config from '../config'

const API_URL = `${config.API_URL}`
const access_token = sessionStorage.getItem('access_token')

// Ambil semua karyawan
export const getKaryawan = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/karyawan`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching karyawan data:', error)
    throw error
  }
}

// Tambah karyawan
export const addKaryawan = async (karyawan) => {
  try {
    const response = await axios.post(`${API_URL}/admin/add_karyawan`, karyawan, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error adding karyawan:', error)
    throw error
  }
}

// Update karyawan
export const updateKaryawan = async (karyawanId, karyawan) => {
  try {
    const response = await axios.post(`${API_URL}/admin/update_karyawan/${karyawanId}`, karyawan, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating karyawan:', error)
    throw error
  }
}

// Hapus karyawan
export const deleteKaryawan = async (karyawanId) => {
  try {
    await axios.delete(`${API_URL}/admin/delete_karyawan/${karyawanId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  } catch (error) {
    console.error('Error deleting karyawan:', error)
    throw error
  }
}
