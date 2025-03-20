import React, { useEffect, useState, useCallback } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilSearch } from '@coreui/icons'
import { getMenu, addMenu, updateMenu, deleteMenu } from 'src/services/menuService'

const Menu = () => {
  const [menuData, setMenuData] = useState([])
  const [filteredMenuData, setFilteredMenuData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [newMenu, setNewMenu] = useState({ Nama: '', Harga: '', Tipe: '', Kategori: '' })
  const [modalVisible, setModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [currentMenu, setCurrentMenu] = useState(null)
  const [alertVisible, setAlertVisible] = useState(false)
  const [updateAlertVisible, setUpdateAlertVisible] = useState(false)
  const [updateAlertMessage, setUpdateAlertMessage] = useState('')
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = useCallback(async () => {
    try {
      const data = await getMenu()
      console.log('Fetched menu data:', data)
      setMenuData(data)
      setFilteredMenuData(data) // Initialize filtered data with all menu items
    } catch (error) {
      console.error('Failed to fetch menu data:', error)
    }
  }, [])

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    // Filter menu data based on the search query
    const filtered = menuData.filter(
      (menu) =>
        menu.Nama.toLowerCase().includes(query) || menu.Kategori.toLowerCase().includes(query),
    )
    setFilteredMenuData(filtered)
  }

  const handleAddMenu = async () => {
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setAlertVisible(true)
      return
    }
    try {
      await addMenu(newMenu)
      fetchMenuData()
      setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' })
      setModalVisible(false)
    } catch (error) {
      console.error('Failed to add menu:', error)
    }
  }

  const handleUpdateMenu = async () => {
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setUpdateAlertMessage('Semua Kolom Harus Di Isi')
      setUpdateAlertVisible(true)
      return
    }
    if (
      currentMenu.Nama === newMenu.Nama &&
      currentMenu.Harga === newMenu.Harga &&
      currentMenu.Tipe === newMenu.Tipe &&
      currentMenu.Kategori === newMenu.Kategori
    ) {
      setUpdateAlertMessage('Tidak Ada Menu Yang Di Update')
      setUpdateAlertVisible(true)
      return
    }

    try {
      await updateMenu(currentMenu._id, newMenu)
      fetchMenuData()
      setUpdateModalVisible(false)
    } catch (error) {
      console.error('Failed to update menu:', error.response ? error.response.data : error.message)
    }
  }

  const handleDeleteMenu = async () => {
    try {
      await deleteMenu(menuToDelete)
      fetchMenuData()
      setConfirmDeleteVisible(false)
    } catch (error) {
      console.error('Failed to delete menu:', error)
    }
  }

  const handleOpenUpdateModal = (menu) => {
    setCurrentMenu(menu)
    setNewMenu(menu)
    setUpdateModalVisible(true)
  }

  const handleOpenConfirmDeleteModal = (menuId) => {
    setMenuToDelete(menuId)
    setConfirmDeleteVisible(true)
  }

  const handleCloseModal = () => {
    setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' })
    setModalVisible(false)
    setAlertVisible(false)
  }

  const handleCloseUpdateModal = () => {
    setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' })
    setUpdateModalVisible(false)
    setUpdateAlertVisible(false)
  }

  const handleCloseConfirmDeleteModal = () => {
    setConfirmDeleteVisible(false)
    setMenuToDelete(null)
  }

  // Group filtered menu data by category
  const groupedMenuData = filteredMenuData.reduce((acc, menu) => {
    const { Kategori } = menu
    if (!acc[Kategori]) {
      acc[Kategori] = []
    }
    acc[Kategori].push(menu)
    return acc
  }, {})

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol xs={12}>
          <h2 className="text-center">
            Daftar Menu
          </h2>
        </CCol>
      </CRow>

      {/* Search Bar */}
      <CRow className="mb-3 align-items-center">
        <CCol xs={10}>
          <CFormInput placeholder="Cari Menu..." value={searchQuery} onChange={handleSearch} />
        </CCol>
        <CCol xs={2} className="text-end">
          <CButton onClick={() => setModalVisible(true)} color="primary">
            Tambah Menu
          </CButton>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardBody>
          {Object.keys(groupedMenuData).map((kategori) => (
            <CRow key={kategori} className="mb-3">
              <CCol xs={12}>
                <h3>
                  <strong>{kategori}</strong>
                </h3>
              </CCol>
              <CCol xs={12}>
                <CTable bordered hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '45%', textAlign: 'center' }}>
                        Nama Menu
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '20%', textAlign: 'right' }}>
                        Harga
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '15%', textAlign: 'center' }}>
                        Tipe
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '10%', textAlign: 'center' }}>
                        Aksi
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {groupedMenuData[kategori].map((menu) => (
                      <CTableRow key={menu._id}>
                        <CTableDataCell style={{ width: '45%', textAlign: 'left' }}>
                          {menu.Nama}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '20%', textAlign: 'right' }}>
                          Rp{menu.Harga.toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '15%', textAlign: 'center' }}>
                          {menu.Tipe}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '10%', textAlign: 'center' }}>
                          <CButton
                            onClick={() => handleOpenUpdateModal(menu)}
                            color="warning"
                            className="me-2"
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            onClick={() => handleOpenConfirmDeleteModal(menu._id)}
                            color="danger"
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          ))}
        </CCardBody>
      </CCard>

      {/* Add Menu Modal */}
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Tambah Menu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {alertVisible && (
            <CAlert color="warning" onClose={() => setAlertVisible(false)} dismissible>
              Semua Kolom Harus Di Isi
            </CAlert>
          )}
          <CFormInput
            placeholder="Nama"
            value={newMenu.Nama}
            onChange={(e) => setNewMenu({ ...newMenu, Nama: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            placeholder="Harga"
            value={newMenu.Harga}
            onChange={(e) => setNewMenu({ ...newMenu, Harga: e.target.value })}
            className="mb-3"
          />
          <CFormSelect
            value={newMenu.Tipe}
            onChange={(e) => setNewMenu({ ...newMenu, Tipe: e.target.value })}
            className="mb-3"
          >
            <option value="">Pilih Tipe</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            className="mb-3"
          >
            <option value="">Pilih Kategori</option>
            <option value="Ayam">Ayam</option>
            <option value="Steak Original & Crispy">Steak Original & Crispy</option>
            <option value="Spesial Nasi Goreng">Spesial Nasi Goreng</option>
            <option value="Pelengkap">Pelengkap</option>
            <option value="Menu Baru">Menu Baru</option>
            <option value="Minuman Es/Panas">Minuman Es/Panas</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={handleCloseModal} color="secondary">
            Batal
          </CButton>
          <CButton onClick={handleAddMenu} color="success">
            Tambah
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update Menu Modal */}
      <CModal visible={updateModalVisible} onClose={handleCloseUpdateModal}>
        <CModalHeader closeButton>
          <CModalTitle>Update Menu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {updateAlertVisible && (
            <CAlert color="warning" onClose={() => setUpdateAlertVisible(false)} dismissible>
              {updateAlertMessage}
            </CAlert>
          )}
          <CFormInput
            placeholder="Nama"
            value={newMenu.Nama}
            onChange={(e) => setNewMenu({ ...newMenu, Nama: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            placeholder="Harga"
            value={newMenu.Harga}
            onChange={(e) => setNewMenu({ ...newMenu, Harga: e.target.value })}
            className="mb-3"
          />
          <CFormSelect
            value={newMenu.Tipe}
            onChange={(e) => setNewMenu({ ...newMenu, Tipe: e.target.value })}
            className="mb-3"
          >
            <option value="">Pilih Tipe</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            className="mb-3"
          >
            <option value="">Pilih Kategori</option>
            <option value="Ayam">Ayam</option>
            <option value="Steak">Steak</option>
            <option value="Nasi Goreng">Nasi Goreng</option>
            <option value="Minuman">Minuman</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={handleCloseUpdateModal} color="secondary">
            Batal
          </CButton>
          <CButton onClick={handleUpdateMenu} color="success">
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Confirm Delete Modal */}
      <CModal visible={confirmDeleteVisible} onClose={handleCloseConfirmDeleteModal}>
        <CModalHeader closeButton>
          <CModalTitle>Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah Anda yakin ingin menghapus menu ini?</CModalBody>
        <CModalFooter>
          <CButton onClick={handleCloseConfirmDeleteModal} color="secondary">
            Batal
          </CButton>
          <CButton onClick={handleDeleteMenu} color="danger">
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Menu
