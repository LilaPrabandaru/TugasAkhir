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
  CForm,
  CFormInput,
  CFormLabel,
  CBadge,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilCheck,
  cilList,
  cilChevronRight,
  cilChevronLeft,
} from '@coreui/icons'
import { getAllPesanan, addPesanan, updatePesanan, deletePesanan } from 'src/services/orderService'

const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }, ref) => (
  <CFormInput
    value={value}
    onClick={onClick}
    onChange={onChange}
    placeholder={placeholder}
    ref={ref}
  />
))

const Orders = () => {
  const [pesananList, setPesananList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    Nama_Pelanggan: '',
    Tanggal: '',
    Waktu: '',
    Detail: [],
    Status: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [selectedPesananId, setSelectedPesananId] = useState(null)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [pesananToDelete, setPesananToDelete] = useState(null)
  const [confirmDoneVisible, setConfirmDoneVisible] = useState(false)
  const [pesananToDone, setPesananToDone] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModalAlert, setShowModalAlert] = useState(false)
  const [modalAlertMessage, setModalAlertMessage] = useState('')
  const [detailModal, setDetailModal] = useState(false)
  const [selectedPesanan, setSelectedPesanan] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  useEffect(() => {
    fetchPesanan()
  }, [])

  // Reset halaman saat jumlah item per page berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan()
      // Filter hanya pesanan dengan status Pending atau Not Paid
      const filteredData = data.filter(
        (pesanan) => pesanan.Status === 'Pending' || pesanan.Status === 'Not Paid',
      )
      // Urutkan berdasarkan tanggal terbaru
      const sortedData = filteredData.sort((a, b) => new Date(b.Tanggal) - new Date(a.Tanggal))
      setPesananList(sortedData)
    } catch (error) {
      console.error('Error fetching pesanan:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleClearDate = () => {
    setSelectedDate(null)
  }

  const handleClearDate2 = () => {
    setFormData({ ...formData, Tanggal: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validasi: Pastikan semua field diisi
    if (
      !formData.Nama_Pelanggan ||
      !formData.Tanggal ||
      !formData.Waktu ||
      !formData.Status ||
      (Array.isArray(formData.Detail) && formData.Detail.length === 0)
    ) {
      setModalAlertMessage('Semua field harus diisi')
      setShowModalAlert(true)
      return
    }

    // Cek apakah ada perubahan saat update
    const selectedPesanan = pesananList.find((pesanan) => pesanan._id === selectedPesananId)
    const isSame =
      selectedPesanan &&
      selectedPesanan.Nama_Pelanggan === formData.Nama_Pelanggan &&
      selectedPesanan.Tanggal === formData.Tanggal &&
      selectedPesanan.Waktu === formData.Waktu &&
      JSON.stringify(selectedPesanan.Detail) === JSON.stringify(formData.Detail) &&
      selectedPesanan.Status === formData.Status

    if (isSame) {
      setModalAlertMessage('Tidak Ada Orders Yang Di Update')
      setShowModalAlert(true)
      return
    }

    try {
      if (editMode) {
        await updatePesanan(selectedPesananId, formData)
      } else {
        const newPesanan = await addPesanan(formData)
        setPesananList([...pesananList, newPesanan])
      }
      fetchPesanan()
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving pesanan:', error)
    }
  }

  const handleEdit = (pesanan) => {
    setEditMode(true)
    setSelectedPesananId(pesanan._id)
    setFormData({ ...pesanan })
    setModalOpen(true)
  }

  const handleDelete = (pesananId) => {
    setPesananToDelete(pesananId)
    setConfirmDeleteVisible(true)
  }

  const confirmDelete = async () => {
    try {
      await deletePesanan(pesananToDelete)
      fetchPesanan()
      setConfirmDeleteVisible(false)
      setPesananToDelete(null)
    } catch (error) {
      console.error('Error deleting pesanan:', error)
    }
  }

  const handleMarkDone = (pesanan) => {
    setPesananToDone(pesanan)
    setConfirmDoneVisible(true)
  }

  const confirmMarkDone = async () => {
    try {
      const updatedData = { ...pesananToDone, Status: 'Done' }
      await updatePesanan(pesananToDone._id, updatedData)
      fetchPesanan()
      setConfirmDoneVisible(false)
      setPesananToDone(null)
    } catch (error) {
      console.error('Error marking pesanan as done:', error)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Jika selectedDate/pilih tanggal ada, filter berdasarkan tanggal dan urutkan berdasarkan waktu,
  // jika selectedDate/pilih tanggal tidak ada, urutkan berdasarkan tanggal ascending dan jika tanggal sama, urutkan berdasarkan waktu ascending
  //==================== FCFS ====================
  const filteredPesananList = selectedDate
    ? pesananList
        .filter((pesanan) => {
          const pesananDate = new Date(pesanan.Tanggal)
          return (
            pesananDate.getFullYear() === selectedDate.getFullYear() &&
            pesananDate.getMonth() === selectedDate.getMonth() &&
            pesananDate.getDate() === selectedDate.getDate()
          )
        })
        .sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.Waktu}:00`)
          const timeB = new Date(`1970-01-01T${b.Waktu}:00`)
          return timeA - timeB
        })
    : pesananList.slice().sort((a, b) => {
        const dateA = new Date(a.Tanggal)
        const dateB = new Date(b.Tanggal)
        // Jika tanggal sama, bandingkan waktu
        if (dateA.getTime() === dateB.getTime()) {
          const timeA = new Date(`1970-01-01T${a.Waktu}:00`)
          const timeB = new Date(`1970-01-01T${b.Waktu}:00`)
          return timeA - timeB
        }
        return dateA - dateB
      })
  //==================== FCFS ====================

  const currentItems = filteredPesananList.slice(indexOfFirstItem, indexOfLastItem)
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const showOrderDetail = (pesanan) => {
    setSelectedPesanan(pesanan)
    setDetailModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning'
      case 'Not Paid':
        return 'danger'
      case 'Done':
        return 'success'
      default:
        return 'secondary'
    }
  }

  return (
    <CContainer>
      {/* Filter Tanggal dan Items per Page */}
      <CRow className="mb-4" alignItems="center">
        <CCol md={6}>
          <CRow>
            <CCol xs={9} className="w-auto">
              <DatePicker
                locale={ID}
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Filter Tanggal"
                dateFormat="dd MMMM yyyy"
                className="form-control"
              />
            </CCol>
            <CCol xs={3}>
              <CButton color="secondary" onClick={handleClearDate}>
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

      {/* Tabel Order di dalam Card */}
      <CCard>
        <CCardBody>
          <h3>Current Order</h3>
          <CTable bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell width="5%">No</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nama Pelanggan</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Tanggal</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Waktu</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total Harga</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Detail Pesanan</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Aksi</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((pesanan, index) => (
                <CTableRow key={pesanan._id} vertical-align="middle">
                  <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                  <CTableDataCell>{pesanan.Nama_Pelanggan}</CTableDataCell>
                  <CTableDataCell>{formatDate(pesanan.Tanggal)}</CTableDataCell>
                  <CTableDataCell>{pesanan.Waktu}</CTableDataCell>
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
                  <CTableDataCell className="text-center">
                    <CButton
                      color="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleMarkDone(pesanan)}
                    >
                      <CIcon icon={cilCheck} />
                    </CButton>
                    <CButton
                      color="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(pesanan)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(pesanan._id)}>
                      <CIcon icon={cilTrash} />
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
        <CCol md={4}>
          <p>
            Showing {Math.min(indexOfFirstItem + 1, filteredPesananList.length)} to{' '}
            {Math.min(indexOfLastItem, filteredPesananList.length)} of {filteredPesananList.length}{' '}
            entries
          </p>
        </CCol>
        <CCol md={4} className="text-center">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {[...Array(Math.ceil(filteredPesananList.length / itemsPerPage)).keys()].map(
              (number) => (
                <CPaginationItem
                  key={number + 1}
                  active={currentPage === number + 1}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </CPaginationItem>
              ),
            )}
            <CPaginationItem
              disabled={currentPage === Math.ceil(filteredPesananList.length / itemsPerPage)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol md={4}>
          <div style={{ width: '220px' }}></div>
        </CCol>
      </CRow>

      {/* Modal untuk Edit/Tambah Pesanan */}
      <CModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setShowModalAlert(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Pesanan' : 'Tambah Pesanan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {showModalAlert && (
            <CAlert color="warning" onClose={() => setShowModalAlert(false)} dismissible>
              {modalAlertMessage}
            </CAlert>
          )}
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Nama Pelanggan</CFormLabel>
            <CFormInput
              name="Nama_Pelanggan"
              value={formData.Nama_Pelanggan}
              onChange={handleChange}
              required
            />
            <CFormLabel className="mt-3">Tanggal</CFormLabel>
            <CRow className="align-items-center">
              <CCol xs={9}>
                <DatePicker
                  selected={formData.Tanggal ? new Date(formData.Tanggal) : null}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      Tanggal: date ? date.toISOString().split('T')[0] : '',
                    })
                  }
                  dateFormat="dd MMMM yyyy"
                  minDate={new Date()}
                  customInput={<CustomDateInput />}
                />
              </CCol>
              <CCol xs={3}>
                <CButton color="secondary" size="sm" onClick={handleClearDate2}>
                  Clear
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setModalOpen(false)
              setShowModalAlert(false)
            }}
          >
            Batal
          </CButton>
          <CButton type="submit" color="primary" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Tambah'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Konfirmasi Hapus */}
      <CModal visible={confirmDeleteVisible} onClose={() => setConfirmDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Apakah Anda yakin ingin menghapus pesanan ini?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmDeleteVisible(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Konfirmasi Selesaikan Pesanan */}
      <CModal visible={confirmDoneVisible} onClose={() => setConfirmDoneVisible(false)}>
        <CModalHeader>
          <CModalTitle>Konfirmasi Selesaikan Pesanan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Apakah Anda yakin ingin menyelesaikan pesanan ini?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmDoneVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={confirmMarkDone}>
            Selesai
          </CButton>
        </CModalFooter>
      </CModal>

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
                    <span
                      className={`badge ${selectedPesanan.Status === 'Done' ? 'bg-success' : 'bg-warning'} ms-2`}
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

export default Orders
