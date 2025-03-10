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
  CFormSelect,
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
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCheck, cilList } from '@coreui/icons'
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
  const [showModalAlert, setShowModalAlert] = useState(false) // State untuk alert di modal
  const [modalAlertMessage, setModalAlertMessage] = useState('') // Pesan alert di modal
  const [detailModal, setDetailModal] = useState(false) // Updated variable name to match your code
  const [selectedPesanan, setSelectedPesanan] = useState(null) // State untuk menyimpan pesanan yang dipilih
  const [itemsPerPage, setItemsPerPage] = useState(25) // Default items per page is now 25

  useEffect(() => {
    fetchPesanan()
  }, [])

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan();
      console.log('Data pesanan yang didapat:', data);
  
      // Filter only pending orders
      const filteredData = data.filter((pesanan) => pesanan.Status === 'Pending' || pesanan.Status === 'Not Paid');
  
      // Sort by the newest date (Tanggal)
      const sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.Tanggal);
        const dateB = new Date(b.Tanggal);
        return dateB - dateA; // Descending order (newest first)
      });
  
      console.log('Data pesanan yang difilter dan diurutkan:', sortedData);
      setPesananList(sortedData); // Update state with sorted data
    } catch (error) {
      console.error('Error fetching pesanan:', error);
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
      if (editMode) {
        await updatePesanan(selectedPesananId, formData)
      } else {
        const newPesanan = await addPesanan(formData) // Simpan pesanan yang baru ditambahkan
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

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
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

  // Fungsi baru untuk menampilkan detail pesanan dalam modal
  const showOrderDetail = (pesanan) => {
    setSelectedPesanan(pesanan)
    setDetailModal(true) // Updated to use detailModal instead of detailModalOpen
  }

  // Fungsi untuk mendapatkan warna status
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
    <div>
      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex">
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
        <div className="d-flex align-items-center">
          <span className="me-2">Show</span>
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
          <span>items per page</span>
        </div>
      </div>

      <CCard>
      <CCardHeader>
          <h5>Current Order</h5>
        </CCardHeader>
        <CCardBody>
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
                  <CTableDataCell className='text-center'>
                    <CBadge color={getStatusColor(pesanan.Status)}>{pesanan.Status}</CBadge>
                  </CTableDataCell>

                  <CTableDataCell className="text-center">
                    <CButton 
                      color="primary" 
                      size="sm" 
                      variant="outline"
                      onClick={() => showOrderDetail(pesanan)}>
                      <CIcon icon={cilList} /> Detail
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" size="sm" className="me-2" onClick={() => handleMarkDone(pesanan)}>
                      <CIcon icon={cilCheck} />
                    </CButton>
                    <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(pesanan)}>
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

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          Showing {Math.min(indexOfFirstItem + 1, filteredPesananList.length)} to {Math.min(indexOfLastItem, filteredPesananList.length)} of {filteredPesananList.length} entries
        </div>
        <CPagination align="center">
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
        <div style={{width: '220px'}}></div> {/* Empty div for even spacing */}
      </div>

      {/* Modal untuk edit pesanan */}
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

      {/* Modal konfirmasi hapus */}
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

      {/* Modal konfirmasi menyelesaikan pesanan */}
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

      {/* Modal untuk menampilkan detail pesanan - Updated to match your code */}
      <CModal 
        visible={detailModal} 
        onClose={() => setDetailModal(false)}
        size="lg"
      >
        <CModalHeader onClose={() => setDetailModal(false)}>
          <CModalTitle>Detail Pesanan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPesanan && (
            <>
              <div className="mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nama Pelanggan:</strong> {selectedPesanan.Nama_Pelanggan}</p>
                    <p><strong>Tanggal:</strong> {formatDate(selectedPesanan.Tanggal)}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Waktu:</strong> {selectedPesanan.Waktu}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`badge ${selectedPesanan.Status === 'Done' ? 'bg-success' : 'bg-danger'} ms-2`}>
                        {selectedPesanan.Status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
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
    </div>
  )
}

export default Orders