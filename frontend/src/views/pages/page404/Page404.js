import React from 'react'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const Page404 = () => {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary text-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} className="d-flex align-items-center justify-content-center">
            <CIcon icon={cilWarning} size="5xl" className="text-danger me-3" />
            <h1 className="display-1 fw-bold text-danger">404</h1>
          </CCol>
          <CCol md={8}>
            <h4 className="text-white fw-semibold">Oops! Halaman tidak ditemukan.</h4>
            <p className="text-muted">
              Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            </p>
            <p className="text-muted">
              Silakan kembali ke dashboard untuk melanjutkan pengelolaan Lentera Steak & Grill.
            </p>
            <CButton color="primary" href="/">
              Kembali ke Dashboard
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
