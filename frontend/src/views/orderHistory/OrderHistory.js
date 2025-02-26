import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CButton,
} from '@coreui/react'
import { getAllPesanan } from 'src/services/orderHistoryService'

const OrderHistory = () => {
  const [pesananList, setPesananList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const itemsPerPage = 5

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan()
      const filteredData = data.filter((pesanan) => pesanan.Status === 'Done')
      setPesananList(filteredData)
    } catch (error) {
      console.error('Error fetching pesanan:', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const filteredPesananList = selectedDate
    ? pesananList.filter((pesanan) => {
        const pesananDate = new Date(pesanan.Tanggal)
        return (
          pesananDate.getFullYear() === selectedDate.getFullYear() &&
          pesananDate.getMonth() === selectedDate.getMonth() &&
          pesananDate.getDate() === selectedDate.getDate()
        )
      })
    : pesananList
  const currentItems = filteredPesananList.slice(indexOfFirstItem, indexOfLastItem)
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <div>
      <div className="d-flex justify-content-center mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          placeholderText="Filter Tanggal"
          dateFormat="yyyy-MM-dd"
          className="form-control"
          minDate={new Date()}
        />
        <CButton color="secondary" onClick={() => setSelectedDate(null)} className="ms-2">
          Clear
        </CButton>
      </div>

      {currentItems.map((pesanan) => (
        <CCard className="mb-3" key={pesanan._id}>
          <CCardHeader>
            <p>Nama Pelanggan: {pesanan.Nama_Pelanggan}</p>
            <p>Tanggal: {formatDate(pesanan.Tanggal)}</p>
            <p>Waktu: {pesanan.Waktu}</p>
            <p style={{ color: pesanan.Status === 'Pending' ? 'red' : 'green' }}>
              Status: {pesanan.Status}
            </p>
          </CCardHeader>
          <CCardBody>
            <CAccordion className="mb-4 mt-2">
              <CAccordionItem>
                <CAccordionHeader>Detail Pesanan</CAccordionHeader>
                <CAccordionBody>
                  <CTable bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Nama Menu</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Jumlah</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Harga</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {pesanan.Detail.map((item, index) => (
                        <CTableRow key={index}>
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
                          <h6>Rp{pesanan['total harga'].toLocaleString()}</h6>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCardBody>
        </CCard>
      ))}

      <CPagination align="center" className="mt-4">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {[...Array(Math.ceil(filteredPesananList.length / itemsPerPage)).keys()].map((number) => (
          <CPaginationItem
            key={number + 1}
            active={currentPage === number + 1}
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === Math.ceil(filteredPesananList.length / itemsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </div>
  )
}

export default OrderHistory
