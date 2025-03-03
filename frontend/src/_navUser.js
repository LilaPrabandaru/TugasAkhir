import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilAccountLogout, cilHistory } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// Ambil role dari sessionStorage
const userRole = sessionStorage.getItem('user_role')

const menuItems = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/user/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

// Jika user dengan role 'user', tambahkan menu tambahan
if (userRole === 'user') {
  menuItems.push(
    { component: CNavTitle, name: 'User' },
    {
      component: CNavItem,
      name: 'Order History',
      to: '/user/orderhistory',
      icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    },
  )
}

// Logout
menuItems.push({
  component: CNavItem,
  name: 'Logout',
  to: '#',
  icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  onClick: () => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('user_role')
    window.location.href = '/login'
  },
})

export default menuItems
