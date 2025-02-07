import React from 'react'

// Admin
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Orders = React.lazy(() => import('./views/orders/Orders'))
const Menu = React.lazy(() => import('./views/menu/Menu'))
const Karyawan = React.lazy(() => import('./views/karyawan/Karyawan'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/orders', name: 'Orders', element: Orders },
  { path: '/menu', name: 'Menu', element: Menu },
  { path: '/karyawan', name: 'Karyawan', element: Karyawan },
]

export default routes
