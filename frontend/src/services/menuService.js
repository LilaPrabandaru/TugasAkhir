import axios from 'axios'

const API_URL = 'http://localhost:5000'

const access_token = sessionStorage.getItem('access_token')

export const getMenu = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching menu data:', error)
    throw error
  }
}

export const addMenu = async (menuData) => {
  try {
    const response = await axios.post(`${API_URL}/add_menu`, menuData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error adding menu:', error)
    throw error
  }
}

export const updateMenu = async (menuId, menuData) => {
  try {
    const response = await axios.post(`${API_URL}/update_menu/${menuId}`, menuData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating menu:', error)
    throw error
  }
}

export const deleteMenu = async (menuId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_menu/${menuId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting menu:', error)
    throw error
  }
}
