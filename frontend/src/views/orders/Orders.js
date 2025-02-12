import React, { useState, useEffect } from 'react'
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
  CCol,
  CRow,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { getAllPesanan, addPesanan, updatePesanan, deletePesanan } from 'src/services/orderService'

const Orders = () => {
  const [pesananList, setPesananList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    Nama_Pelanggan: '',
    Tanggal: '',
    Waktu: '',
    Detail: [],
  })
  const [editMode, setEditMode] = useState(false)
  const [selectedPesananId, setSelectedPesananId] = useState(null)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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

  const handleDelete = async (pesananId) => {
    if (window.confirm('Yakin ingin menghapus pesanan ini?')) {
      try {
        await deletePesanan(pesananId)
        fetchPesanan()
      } catch (error) {
        console.error('Error deleting pesanan:', error)
      }
    }
  }

  return (
    <div>
      {pesananList.map((pesanan) => (
        <CCard className="mb-3">
          <CCardHeader>
            <p>Nama Pelanggan: {pesanan.Nama_Pelanggan}</p>
            <p>Tanggal: {pesanan.Tanggal}</p>
            <p>Waktu: {pesanan.Waktu}</p>
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
                        <CTableHeaderCell className="text-end">Harga</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Jumlah</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {pesanan.Detail.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item['Nama Menu']}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            {item.Harga.toLocaleString()}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">{item.Jumlah}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <h6 className="mt-3">
                    Total Harga: Rp {pesanan['total harga'].toLocaleString()}
                  </h6>
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

      <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Pesanan' : 'Tambah Pesanan'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Nama Pelanggan</CFormLabel>
            <CFormInput
              name="Nama_Pelanggan"
              value={formData.Nama_Pelanggan}
              onChange={handleChange}
              required
            />
            <CFormLabel>Tanggal</CFormLabel>
            <CFormInput
              type="date"
              name="Tanggal"
              value={formData.Tanggal}
              onChange={handleChange}
              required
            />
            <CModalFooter>
              <CButton type="submit" color="primary">
                {editMode ? 'Update' : 'Tambah'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Orders
