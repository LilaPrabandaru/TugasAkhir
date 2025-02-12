import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user_role')
    navigate('/login')
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary text-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} className="d-flex align-items-center justify-content-center">
            <CIcon icon={cilLockLocked} size="5xl" className="text-danger me-3" />
            <h1 className="display-1 fw-bold text-danger">403</h1>
          </CCol>
          <CCol md={8}>
            <h4 className="text-white fw-semibold">Akses Ditolak</h4>
            <p className="text-muted">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <CButton color="primary" onClick={handleLogout}>
              Kembali ke Login
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Unauthorized
