import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilClipboard, cilFastfood, cilAccountLogout, cilHistory } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// Ambil role dari sessionStorage
const userRole = sessionStorage.getItem('user_role')

const menuItems = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

// Jika user admin, tambahkan menu tambahan
if (userRole === 'admin') {
  menuItems.push(
    { component: CNavTitle, name: 'Admin' },
    {
      component: CNavItem,
      name: 'Orders',
      to: '/admin/orders',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Menu',
      to: '/admin/menu',
      icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Karyawan',
      to: '/admin/karyawan',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Order History',
      to: '/admin/orderhistory',
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
    sessionStorage.removeItem('user_role')
    window.location.href = '/login'
  },
})

export default menuItems
