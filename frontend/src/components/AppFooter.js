import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">Jalan Senjoyo Tenda Biru Salatiga, Jawa Tengah</span>
        <span className="ms-1"> | </span>
        <span className="ms-1">
          WA/CALL
          <span className="ms-1"></span>
          <a href="https://wa.me/+6289504047380" target="_blank" rel="noopener noreferrer">
            089504047380
          </a>
        </span>
        <span className="ms-1"> | </span>
        <span className="ms-1">
          <a
            href="https://www.instagram.com/lenteragrill?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
