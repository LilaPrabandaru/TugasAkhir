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
  const [karyawanData, setkaryawanData] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedKaryawan, setSelectedKaryawan] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [newKaryawan, setnewKaryawan] = useState({
    Email: '',
    Nama_Lengkap: '',
    Nomor_Telp: '',
    Tanggal_Lahir: '',
  })
  const [showModalAlert, setShowModalAlert] = useState(false) // State untuk alert di modal
  const [modalAlertMessage, setModalAlertMessage] = useState('') // Pesan alert di modal

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getKaryawan()
      setkaryawanData(data)
    } catch (error) {
      console.error('Error fetching karyawan:', error)
    }
  }

  const handleUpdateMenu = async () => {
    // Validasi: pastikan semua field terisi
    if (
      !newKaryawan.Email.trim() ||
      !newKaryawan.Nama_Lengkap.trim() ||
      !newKaryawan.Nomor_Telp.trim() ||
      !newKaryawan.Tanggal_Lahir.trim()
    ) {
      setModalAlertMessage('Semua Kolom Harus Di Isi')
      setShowModalAlert(true)
      return
    }

    try {
      if (selectedKaryawan) {
        // Bandingkan data lama dengan data baru
        const isSame =
          selectedKaryawan.Email === newKaryawan.Email &&
          selectedKaryawan.Nama_Lengkap === newKaryawan.Nama_Lengkap &&
          selectedKaryawan.Nomor_Telp === newKaryawan.Nomor_Telp &&
          selectedKaryawan.Tanggal_Lahir === newKaryawan.Tanggal_Lahir

        if (isSame) {
          setModalAlertMessage('Tidak Ada Karyawan Yang Di Update')
          setShowModalAlert(true)
          return
        }
        await updateKaryawan(selectedKaryawan._id, newKaryawan)
      } else {
        await addKaryawan(newKaryawan)
      }
      fetchData()
      handleCloseUpdateModal()
    } catch (error) {
      console.error('Error saving karyawan:', error)
    }
  }

  const handleCloseUpdateModal = () => {
    setModal(false)
    setShowModalAlert(false)
    setSelectedKaryawan(null)
    setnewKaryawan({
      Email: '',
      Nama_Lengkap: '',
      Nomor_Telp: '',
      Tanggal_Lahir: '',
    })
  }

  const handleDeleteKaryawan = async () => {
    try {
      await deleteKaryawan(deleteId)
      fetchData()
      setConfirmDelete(false)
    } catch (error) {
      console.error('Error deleting karyawan:', error)
    }
  }

  const handleOpenDeleteModal = (_id) => {
    setDeleteId(_id)
    setConfirmDelete(true)
  }

  const handleOpenModal = (karyawan = null) => {
    setSelectedKaryawan(karyawan)
    setnewKaryawan(karyawan || { Email: '', Nama_Lengkap: '', Nomor_Telp: '', Tanggal_Lahir: '' })
    setModal(true)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const handleClearDate = () => {
    setnewKaryawan({ ...newKaryawan, Tanggal_Lahir: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <CButton color="primary" onClick={() => handleOpenModal()}>
          Tambah Karyawan
        </CButton>
      </div>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ width: '30%', textAlign: 'center'}}>Email</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '20%', textAlign: 'center'}}>Nama Lengkap</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '20%', textAlign: 'center'}}>Nomor Telpon</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '20%', textAlign: 'center'}}>Tanggal Lahir</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%', textAlign: 'center'}}>Aksi</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {karyawanData.map((karyawan) => (
                <CTableRow key={karyawan._id}>
                  <CTableDataCell>{karyawan.Email}</CTableDataCell>
                  <CTableDataCell>{karyawan.Nama_Lengkap}</CTableDataCell>
                  <CTableDataCell>{karyawan.Nomor_Telp}</CTableDataCell>
                  <CTableDataCell>{formatDate(karyawan.Tanggal_Lahir)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" onClick={() => handleOpenModal(karyawan)}>
                      <CIcon icon={cilPencil} />
                    </CButton>{' '}
                    <CButton color="danger" onClick={() => handleOpenDeleteModal(karyawan._id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

      {/* Modal untuk Tambah/Update */}
      <CModal visible={modal} onClose={handleCloseUpdateModal}>
        <CModalHeader>
          <CModalTitle>{selectedKaryawan ? 'Update Karyawan' : 'Tambah Karyawan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {showModalAlert && (
            <CAlert color="warning" onClose={() => setShowModalAlert(false)} dismissible>
              {modalAlertMessage}
            </CAlert>
          )}
          <CForm>
            <CFormInput
              label="Email"
              value={newKaryawan.Email}
              onChange={(e) => setnewKaryawan({ ...newKaryawan, Email: e.target.value })}
            />
            <CFormInput
              label="Nama Lengkap"
              value={newKaryawan.Nama_Lengkap}
              onChange={(e) => setnewKaryawan({ ...newKaryawan, Nama_Lengkap: e.target.value })}
            />
            <CFormInput
              label="Nomor Telepon"
              value={newKaryawan.Nomor_Telp}
              onChange={(e) => setnewKaryawan({ ...newKaryawan, Nomor_Telp: e.target.value })}
            />
            <label className="form-label">Tanggal Lahir</label>
            <div className="d-flex align-items-center">
              {/* DatePicker dengan custom input CFormInput */}
              <DatePicker
                selected={newKaryawan.Tanggal_Lahir ? new Date(newKaryawan.Tanggal_Lahir) : null}
                onChange={(date) =>
                  setnewKaryawan({
                    ...newKaryawan,
                    Tanggal_Lahir: date ? date.toISOString().split('T')[0] : '',
                  })
                }
                dateFormat="yyyy-MM-dd"
                customInput={<CustomDateInput />}
              />
              <CButton color="secondary" size="sm" className="ms-2" onClick={handleClearDate}>
                Clear
              </CButton>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseUpdateModal}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleUpdateMenu}>
            {selectedKaryawan ? 'Update' : 'Tambah'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Konfirmasi Hapus */}
      <CModal visible={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <CModalHeader>
          <CModalTitle>Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah anda ingin menghapus karyawan ini?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={handleDeleteKaryawan}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Karyawan
