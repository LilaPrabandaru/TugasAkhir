import React from 'react'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBug } from '@coreui/icons'

const Page500 = () => {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary text-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} className="d-flex align-items-center justify-content-center">
            <CIcon icon={cilBug} size="5xl" className="text-warning me-3" />
            <h1 className="display-1 fw-bold text-warning">500</h1>
          </CCol>
          <CCol md={8}>
            <h4 className="text-white fw-semibold">Oops! Terjadi kesalahan server.</h4>
            <p className="text-muted">
              Server sedang mengalami gangguan atau ada kesalahan teknis.
            </p>
            <p className="text-muted">
              Silakan coba beberapa saat lagi atau hubungi tim teknis jika masalah berlanjut.
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

export default Page500
