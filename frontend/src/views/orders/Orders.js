import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CPagination,
  CPaginationItem,
  CAlert, // Import CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModalAlert, setShowModalAlert] = useState(false) // State untuk alert di modal
  const [modalAlertMessage, setModalAlertMessage] = useState('') // Pesan alert di modal

  const itemsPerPage = 5

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan()
      console.log('Data pesanan yang didapat:', data) // Debugging
      setPesananList(data)
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

    const selectedPesanan = pesananList.find((pesanan) => pesanan._id === selectedPesananId)
    const isSame =
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
      let newPesanan
      if (editMode) {
        await updatePesanan(selectedPesananId, formData)
      } else {
        newPesanan = await addPesanan(formData) // Simpan pesanan yang baru ditambahkan
        setPesananList([...pesananList, newPesanan]) // Tambahkan ke state pesananList
      }
      fetchPesanan() // Pastikan tetap ambil data terbaru
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
          onChange={handleDateChange}
          placeholderText="Filter Tanggal"
          dateFormat="yyyy-MM-dd"
          className="form-control"
          minDate={new Date()}
        />
        <CButton color="secondary" onClick={handleClearDate} className="ms-2">
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
                        <CTableDataCell></CTableDataCell>
                        <CTableDataCell className="text-center">
                          <h6>Total Harga:</h6>
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <h6>Rp {pesanan['total harga'].toLocaleString()}</h6>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
            <CButton color="warning" className="me-2" onClick={() => handleEdit(pesanan)}>
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton color="danger" onClick={() => handleDelete(pesanan._id)}>
              <CIcon icon={cilTrash} />
            </CButton>
          </CCardBody>
        </CCard>
      ))}

      <CPagination align="center" className="mt-4">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {[...Array(Math.ceil(filteredPesananList.length / itemsPerPage)).keys()].map((number) => (
          <CPaginationItem
            key={number + 1}
            active={currentPage === number + 1}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === Math.ceil(filteredPesananList.length / itemsPerPage)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>

      <CModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setShowModalAlert(false) // Reset alert saat modal ditutup
        }}
      >
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Pesanan' : 'Tambah Pesanan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Tampilkan alert di dalam modal */}
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
            <label className="form-label">Tanggal</label>
            <div className="d-flex align-items-center">
              {/* DatePicker dengan custom input CFormInput */}
              <DatePicker
                selected={formData.Tanggal ? new Date(formData.Tanggal) : null}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    Tanggal: date ? date.toISOString().split('T')[0] : '',
                  })
                }
                dateFormat="yyyy-MM-dd"
                customInput={<CustomDateInput />}
              />
              <CButton color="secondary" size="sm" className="ms-2" onClick={handleClearDate2}>
                Clear
              </CButton>
            </div>
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
    </div>
  )
}

export default Orders
