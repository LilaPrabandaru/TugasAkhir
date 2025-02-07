import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!sessionStorage.getItem('access_token')
  const userRole = sessionStorage.getItem('user_role')

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

export default ProtectedRoute
