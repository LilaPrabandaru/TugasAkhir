import React from 'react'

// Admin
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Orders = React.lazy(() => import('./views/orders/Orders'))
const Menu = React.lazy(() => import('./views/menu/Menu'))
const Karyawan = React.lazy(() => import('./views/karyawan/Karyawan'))
const OrderHistory = React.lazy(() => import('./views/orderHistory/OrderHistory'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/orders', name: 'Orders', element: Orders },
  { path: '/admin/menu', name: 'Menu', element: Menu },
  { path: '/admin/karyawan', name: 'Karyawan', element: Karyawan },
  { path: '/admin/orderhistory', name: 'Order History', element: OrderHistory },
]

export default routes
