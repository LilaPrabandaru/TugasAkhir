import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import {
  AppFooter,
  AppFooterUser,
  AppHeader,
  AppHeaderUser,
  AppSidebar,
  AppSidebarUser,
} from '../components/index'
import UserDashboard from '../views/user/UserDashboard'
import OrderHistoryUser from '../views/orderHistoryUser/OrderHistoryUser'

const DefaultUserLayout = () => {
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeaderUser />
        <div className="body flex-grow-1">
          <Routes>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orderhistory" element={<OrderHistoryUser />} />
          </Routes>
        </div>
        <AppFooterUser />
      </div>
    </div>
  )
}

export default DefaultUserLayout
