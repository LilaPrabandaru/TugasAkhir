import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ID from 'date-fns/locale/id'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { getAllPesanan } from 'src/services/orderHistoryService'
import { cilList, cilChevronLeft, cilChevronRight } from '@coreui/icons'

const OrderHistory = () => {
  const [pesananList, setPesananList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [detailModal, setDetailModal] = useState(false)
  const [selectedPesanan, setSelectedPesanan] = useState(null)

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan()
      console.log('Data pesanan yang didapat:', data)

      // Filter hanya pesanan dengan status 'Done'
      const filteredData = data.filter((pesanan) => pesanan.Status === 'Done')

      // Urutkan data berdasarkan Tanggal (dari yang terbaru)
      const sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.Tanggal)
        const dateB = new Date(b.Tanggal)
        return dateB - dateA
      })

      console.log('Data pesanan yang difilter dan diurutkan:', sortedData)
      setPesananList(sortedData)
    } catch (error) {
      console.error('Error fetching pesanan:', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Filter berdasarkan bulan dan tahun saja
  const filteredPesananList = selectedDate
    ? pesananList
        .filter((pesanan) => {
          const pesananDate = new Date(pesanan.Tanggal)
          return (
            pesananDate.getFullYear() === selectedDate.getFullYear() &&
            pesananDate.getMonth() === selectedDate.getMonth()
          )
        })
        .sort((a, b) => new Date(a.Tanggal) - new Date(b.Tanggal))
    : pesananList.slice().sort((a, b) => new Date(a.Tanggal) - new Date(b.Tanggal))

  const currentItems = filteredPesananList.slice(indexOfFirstItem, indexOfLastItem)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const openDetailModal = (pesanan) => {
    setSelectedPesanan(pesanan)
    setDetailModal(true)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <CContainer>
      {/* Filter & Items per Page */}
      <CRow className="mb-4" alignItems="center">
        <CCol md={6}>
          <CRow>
            <CCol xs={9} className="w-auto">
              <DatePicker
                locale={ID}
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date)
                  setCurrentPage(1)
                }}
                placeholderText="Filter Bulan dan Tahun"
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="form-control"
              />
            </CCol>
            <CCol xs={3}>
              <CButton color="secondary" onClick={() => setSelectedDate(null)}>
                Clear
              </CButton>
            </CCol>
          </CRow>
        </CCol>
        <CCol md={6} className="d-flex justify-content-end align-items-center">
          <CFormLabel className="me-2">Show</CFormLabel>
          <CFormSelect
            className="mx-2"
            style={{ width: '100px' }}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </CFormSelect>
          <CFormLabel>items per page</CFormLabel>
        </CCol>
      </CRow>

      {/* Order History Card */}
      <CCard>
        <CCardBody>
          <h3>Order History</h3>
          <CTable hover responsive bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell width="5%">No</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Pelanggan</CTableHeaderCell>
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
                    Rp{pesanan['total harga'].toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span
                      className={`badge ${pesanan.Status === 'Done' ? 'bg-success' : 'bg-danger'}`}
                    >
                      {pesanan.Status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="primary"
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailModal(pesanan)}
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
      <CRow className="mt-4 align-items-center">
        <CCol md="auto">
          <span>
            Showing {indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, filteredPesananList.length)} of {filteredPesananList.length}{' '}
            entries
          </span>
        </CCol>
        <CCol>
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {[
              ...Array(Math.min(5, Math.ceil(filteredPesananList.length / itemsPerPage))).keys(),
            ].map((number) => {
              const pageNumber =
                currentPage > 3 && Math.ceil(filteredPesananList.length / itemsPerPage) > 5
                  ? currentPage - 3 + number
                  : number + 1

              if (pageNumber <= Math.ceil(filteredPesananList.length / itemsPerPage)) {
                return (
                  <CPaginationItem
                    key={pageNumber}
                    active={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </CPaginationItem>
                )
              }
              return null
            })}
            <CPaginationItem
              disabled={currentPage === Math.ceil(filteredPesananList.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol md="auto" style={{ width: '220px' }}></CCol>
      </CRow>

      {/* Modal for Order Details */}
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
                    <strong>Status:</strong>
                    <span
                      className={`badge ${
                        selectedPesanan.Status === 'Done' ? 'bg-success' : 'bg-danger'
                      } ms-2`}
                    >
                      {selectedPesanan.Status}
                    </span>
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
                    <CTableDataCell className="text-end" colSpan={2}>
                      <h6>Total Harga:</h6>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      <h6>Rp{selectedPesanan['total harga'].toLocaleString()}</h6>
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

export default OrderHistory
