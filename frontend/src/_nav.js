import React, { useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartLine,
  cilCash,
  cilSpeedometer,
  cilUser,
  cilClipboard,
  cilFastfood,
  cilAccountLogout,
  cilHistory,
  cilChevronBottom,
  cilChevronTop,
} from '@coreui/icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

// Ambil role dari sessionStorage
const userRole = sessionStorage.getItem('user_role')

// Menu utama (General)
const generalMenu = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

// Menu admin (hanya ditampilkan jika user adalah admin)
const adminMenu = []
if (userRole === 'admin') {
  adminMenu.push(
    { component: CNavTitle, name: 'Admin' },
    {
      component: CNavGroup,
      name: 'Orders',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Current Orders',
          to: '/admin/orders',
          icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
          style: { paddingLeft: '8vh' },
        },
        {
          component: CNavItem,
          name: 'Order History',
          to: '/admin/orderhistory',
          icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
          style: { paddingLeft: '8vh' },
        },
      ],
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
      component: CNavGroup,
      name: 'Laporan',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Pendapatan',
          to: '/admin/pendapatan',
          icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
          style: { paddingLeft: '8vh' },
        },
        {
          component: CNavItem,
          name: 'Pengeluaran',
          to: '/admin/pengeluaran',
          icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
          style: { paddingLeft: '8vh' },
        },
      ],
    },
  )
}

// Menu logout
const logoutMenu = [
  {
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
  },
]

// Gabungkan semua menu
const menuItems = [...generalMenu, ...adminMenu, ...logoutMenu]

export default menuItems
