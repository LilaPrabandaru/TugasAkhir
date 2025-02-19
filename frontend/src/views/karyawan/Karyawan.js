import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
} from '@coreui/react'
import {
  getKaryawan,
  addKaryawan,
  updateKaryawan,
  deleteKaryawan,
} from 'src/services/karyawanService'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

// Komponen custom untuk input datepicker dengan menggunakan CFormInput
const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }, ref) => (
  <CFormInput
    value={value}
    onClick={onClick}
    onChange={onChange}
    placeholder={placeholder}
    ref={ref}
  />
))

const Karyawan = () => {
  const [karyawanList, setKaryawanList] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedKaryawan, setSelectedKaryawan] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [formData, setFormData] = useState({
    Email: '',
    Nama_Lengkap: '',
    Nomor_Telp: '',
    Tanggal_Lahir: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getKaryawan()
      setKaryawanList(data)
    } catch (error) {
      console.error('Error fetching karyawan:', error)
    }
  }

  const handleSave = async () => {
    try {
      if (selectedKaryawan) {
        await updateKaryawan(selectedKaryawan._id, formData)
      } else {
        await addKaryawan(formData)
      }
      fetchData()
      setModal(false)
    } catch (error) {
      console.error('Error saving karyawan:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteKaryawan(deleteId)
      fetchData()
      setConfirmDelete(false)
    } catch (error) {
      console.error('Error deleting karyawan:', error)
    }
  }

  const openDeleteModal = (_id) => {
    setDeleteId(_id)
    setConfirmDelete(true)
  }

  const openModal = (karyawan = null) => {
    setSelectedKaryawan(karyawan)
    setFormData(karyawan || { Email: '', Nama_Lengkap: '', Nomor_Telp: '', Tanggal_Lahir: '' })
    setModal(true)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const clearDate = () => {
    setFormData({ ...formData, Tanggal_Lahir: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <CButton color="primary" onClick={() => openModal()}>
          Tambah Karyawan
        </CButton>
      </div>
      <CCard className="mt-4">
        <CCardHeader>Karyawan</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Nama Lengkap</CTableHeaderCell>
                <CTableHeaderCell>Nomor Telpon</CTableHeaderCell>
                <CTableHeaderCell>Tanggal Lahir</CTableHeaderCell>
                <CTableHeaderCell>Aksi</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {karyawanList.map((karyawan) => (
                <CTableRow key={karyawan._id}>
                  <CTableDataCell>{karyawan.Email}</CTableDataCell>
                  <CTableDataCell>{karyawan.Nama_Lengkap}</CTableDataCell>
                  <CTableDataCell>{karyawan.Nomor_Telp}</CTableDataCell>
                  <CTableDataCell>{formatDate(karyawan.Tanggal_Lahir)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" onClick={() => openModal(karyawan)}>
                      <CIcon icon={cilPencil} />
                    </CButton>{' '}
                    <CButton color="danger" onClick={() => openDeleteModal(karyawan._id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>{selectedKaryawan ? 'Update Karyawan' : 'Tambah Karyawan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Email"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
            <CFormInput
              label="Nama Lengkap"
              value={formData.Nama_Lengkap}
              onChange={(e) => setFormData({ ...formData, Nama_Lengkap: e.target.value })}
            />
            <CFormInput
              label="Nomor Telepon"
              value={formData.Nomor_Telp}
              onChange={(e) => setFormData({ ...formData, Nomor_Telp: e.target.value })}
            />
            <label className="form-label">Tanggal Lahir</label>
            <div className="d-flex align-items-center">
              {/* DatePicker dengan custom input CFormInput */}
              <DatePicker
                selected={formData.Tanggal_Lahir ? new Date(formData.Tanggal_Lahir) : null}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    Tanggal_Lahir: date ? date.toISOString().split('T')[0] : '',
                  })
                }
                dateFormat="yyyy-MM-dd"
                customInput={<CustomDateInput />}
              />
              <CButton color="secondary" size="sm" className="ms-2" onClick={clearDate}>
                Clear
              </CButton>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModal(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <CModalHeader>
          <CModalTitle>Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah anda ingin menghapus karyawan ini?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Karyawan
