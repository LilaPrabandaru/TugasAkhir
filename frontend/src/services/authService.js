import axios from 'axios'
import config from '../config'

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${config.API_URL}/login`, { email, password })
    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const register = async (email, password, role = 'user') => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, role })
    return response.data
  } catch (error) {
    console.error('Error registering:', error)
    throw error
  }
}
