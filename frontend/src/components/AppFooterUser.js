import React from 'react'
import { CFooter, CContainer, CRow, CCol, CLink } from '@coreui/react'

const AppFooterUser = () => {
  return (
    <CFooter className="px-4">
      <CContainer fluid>
        <CRow className="align-items-center justify-content-center">
          <CCol xs="auto" className="d-flex align-items-center">
            <span className="me-2">Jalan Senjoyo Tenda Biru Salatiga, Jawa Tengah</span>
            <span className="me-2">|</span>
            <span className="me-2">
              WA/CALL:&nbsp;
              <CLink href="https://wa.me/+6289504047380" target="_blank" rel="noopener noreferrer">
                089504047380
              </CLink>
            </span>
            <span className="me-2">|</span>
            <CLink
              href="https://www.instagram.com/lenteragrill?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="me-2"
            >
              Instagram
            </CLink>
          </CCol>
        </CRow>
      </CContainer>
    </CFooter>
  )
}

export default React.memo(AppFooterUser)
