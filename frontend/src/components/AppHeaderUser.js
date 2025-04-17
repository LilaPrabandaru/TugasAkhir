import React, { useEffect, useRef, useState } from 'react'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilMoon, cilSun, cilAccountLogout } from '@coreui/icons'

const AppHeaderUser = () => {
  const headerRef = useRef(null)
  const { colorMode, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme',
    'light',
  )
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }
    document.addEventListener('scroll', onScroll)
    const today = new Date()
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    setCurrentDate(formattedDate)

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('user_role')
    window.location.href = '/login'
  }

  return (
    <CHeader position="sticky" className="p-0" ref={headerRef}>
      <CContainer
        fluid
        className="border-bottom px-4 d-flex justify-content-between align-items-center"
      >
        {/* Bagian kiri (kosong/dapat diisi logo jika diperlukan) */}
        <div style={{ width: '33.33%' }} />

        {/* Bagian tengah: Menu dan Order History */}
        <CHeaderNav
          className="d-flex align-items-center justify-content-center"
          style={{ width: '33.33%' }}
        >
          <CNavItem>
            <a href="/user/dashboard" className="nav-link">
              Menu
            </a>
          </CNavItem>
          <CNavItem>
            <a href="/user/orderhistory" className="nav-link">
              Order History
            </a>
          </CNavItem>
        </CHeaderNav>

        {/* Bagian kanan: Pengaturan tema, tanggal, dan Logout */}
        <CHeaderNav
          className="d-flex align-items-center justify-content-end"
          style={{ width: '33.33%' }}
        >
          <CDropdown variant="nav-item" placement="bottom-end" className="me-2">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon icon={cilSun} size="lg" className="me-2" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon icon={cilMoon} size="lg" className="me-2" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon icon={cilContrast} size="lg" className="me-2" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          {/* Pembatas */}
          <CNavItem className="py-1">
            <div className="vr mx-2"></div>
          </CNavItem>

          {/* Tanggal */}
          <CNavItem className="d-flex align-items-center me-3">
            <span>{currentDate}</span>
          </CNavItem>

          {/* Pembatas */}
          <CNavItem className="py-1">
            <div className="vr mx-2"></div>
          </CNavItem>

          {/* Logout */}
          <CNavItem className="d-flex align-items-center">
            <a href="#" className="nav-link d-flex align-items-center" onClick={handleLogout}>
              <CIcon icon={cilAccountLogout} size="lg" className="me-2" /> Logout
            </a>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeaderUser
