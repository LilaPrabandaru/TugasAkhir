import React, { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { getAllPesananByEmail } from '../../services/orderHistoryUserService'
import { cilChevronRight, cilChevronLeft, cilList } from '@coreui/icons'

const OrderHistoryUser = () => {
  const [pesananList, setPesananList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [detailModal, setDetailModal] = useState(false)
  const [selectedPesanan, setSelectedPesanan] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = async () => {
    try {
      // Ambil email dari sessionStorage
      const email = sessionStorage.getItem('email')
      if (!email) {
        console.error('Email not found in sessionStorage')
        return
      }
      // Ambil data pesanan berdasarkan email
      const data = await getAllPesananByEmail(email)
      console.log('Data pesanan yang didapat:', data)

      // Urutkan pesanan: tanggal descending dan jika tanggal sama, waktu ascending
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.Tanggal)
        const dateB = new Date(b.Tanggal)
        if (dateA.getTime() === dateB.getTime()) {
          const timeA = new Date(`1970-01-01T${a.Waktu}:00`)
          const timeB = new Date(`1970-01-01T${b.Waktu}:00`)
          return timeA - timeB // ascending jika tanggal sama
        } else {
          return dateB - dateA // descending berdasarkan tanggal
        }
      })

      console.log('Data pesanan yang diurutkan:', sortedData)
      setPesananList(sortedData)
    } catch (error) {
      console.error('Error fetching pesanan:', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Karena tidak ada filter tanggal, langsung gunakan pesananList yang sudah diurutkan
  const currentItems = pesananList.slice(indexOfFirstItem, indexOfLastItem)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'warning'
    if (status === 'Not Paid') return 'danger'
    if (status === 'Done') return 'success'
    return 'secondary'
  }

  const showOrderDetail = (pesanan) => {
    setSelectedPesanan(pesanan)
    setDetailModal(true)
  }

  return (
    <CContainer className='mt-5'>
      <CCard className="mb-3">
        <CCardBody>
          <h3 className="text-center">Order History</h3>
          <CTable bordered hover responsive striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell width="5%">No</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nama Pelanggan</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Tanggal</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Waktu</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total Harga</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Detail Pesanan</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((pesanan, index) => (
                <CTableRow key={pesanan._id}>
                  <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                  <CTableDataCell>{pesanan.Nama_Pelanggan}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {formatDate(pesanan.Tanggal)}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{pesanan.Waktu}</CTableDataCell>
                  <CTableDataCell className="text-end">
                    Rp {pesanan['total harga']?.toLocaleString() || 0}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge color={getStatusColor(pesanan.Status)}>{pesanan.Status}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="primary"
                      size="sm"
                      variant="outline"
                      onClick={() => showOrderDetail(pesanan)}
                    >
                      <CIcon icon={cilList} /> Detail
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Pagination */}
      <CRow className="mt-4">
        <CCol className="d-flex justify-content-center">
          <CPagination>
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {[...Array(Math.ceil(pesananList.length / itemsPerPage)).keys()].map((number) => (
              <CPaginationItem
                key={number + 1}
                active={currentPage === number + 1}
                onClick={() => setCurrentPage(number + 1)}
              >
                {number + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(pesananList.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>

      {/* Modal Detail Pesanan */}
      <CModal visible={detailModal} onClose={() => setDetailModal(false)} size="lg">
        <CModalHeader onClose={() => setDetailModal(false)}>
          <CModalTitle>Detail Pesanan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPesanan && (
            <>
              <CRow className="mb-4">
                <CCol md={6}>
                  <p>
                    <strong>Nama Pelanggan:</strong> {selectedPesanan.Nama_Pelanggan}
                  </p>
                  <p>
                    <strong>Tanggal:</strong> {formatDate(selectedPesanan.Tanggal)}
                  </p>
                </CCol>
                <CCol md={6}>
                  <p>
                    <strong>Waktu:</strong> {selectedPesanan.Waktu}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <CBadge color={getStatusColor(selectedPesanan.Status)}>
                      {selectedPesanan.Status}
                    </CBadge>
                  </p>
                </CCol>
              </CRow>
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nama Menu</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Jumlah</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Harga</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedPesanan.Detail.map((item, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{item['Nama Menu']}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.Jumlah}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        {item.Harga.toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  <CTableRow>
                    <CTableDataCell colSpan={2} className="text-end">
                      <h6>Total Harga:</h6>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      <h6>Rp {selectedPesanan['total harga'].toLocaleString()}</h6>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default OrderHistoryUser
