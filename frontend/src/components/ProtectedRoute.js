import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!sessionStorage.getItem('access_token')
  const userRole = sessionStorage.getItem('user_role')

  console.log('🔍 Debugging ProtectedRoute:')
  console.log('✅ isAuthenticated:', isAuthenticated)
  console.log('🔑 userRole:', userRole)
  console.log('📜 allowedRoles:', allowedRoles)

  if (!isAuthenticated) {
    console.warn('⛔ User not authenticated, redirecting to login')
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`🚫 Access denied for role: ${userRole}, allowed: ${allowedRoles}`)
    return <Navigate to="/unauthorized" />
  }

  return children
}


export default ProtectedRoute
