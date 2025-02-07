import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Dashboard from '../views/dashboard/Dashboard'
import Orders from '../views/orders/Orders'
import Menu from '../views/menu/Menu'
import Karyawan from '../views/karyawan/Karyawan'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="order" element={<Orders />} />
              <Route path="menu" element={<Menu />} />
              <Route path="karyawan" element={<Karyawan />} />
            </Routes>
          </AppContent>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
