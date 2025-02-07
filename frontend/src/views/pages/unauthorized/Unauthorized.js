import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user_role')
    navigate('/login')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">403</h1>
              <h4 className="pt-3">Unauthorized</h4>
              <p className="text-medium-emphasis float-start">
                You do not have permission to view this page.
              </p>
            </div>
            <CButton color="primary" onClick={handleLogout}>
              Go to Home
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Unauthorized
