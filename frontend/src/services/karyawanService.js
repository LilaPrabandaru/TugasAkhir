import axios from 'axios'
import config from '../config'

const access_token = sessionStorage.getItem('access_token')
const API_URL = `${config.API_URL}`

export const getKaryawan = async () => {
  try {
    const response = await axios.get(`${API_URL}/karyawan`, {
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

export const addKaryawan = async (karyawan) => {
  try {
    const response = await axios.post(`${API_URL}/add_karyawan`, karyawan, {
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

export const updateKaryawan = async (id, karyawan) => {
  try {
    const response = await axios.post(`${API_URL}/update_karyawan/${id}`, karyawan, {
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

export const deleteKaryawan = async (id) => {
  try {
    await axios.delete(`${API_URL}/delete_karyawan/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  } catch (error) {
    console.error('Error deleting karyawan:', error)
    throw error
  }
}
