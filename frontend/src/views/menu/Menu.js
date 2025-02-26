import React, { useEffect, useState, useCallback } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { getMenu, addMenu, updateMenu, deleteMenu } from 'src/services/menuService'

const Menu = () => {
  const [menuData, setMenuData] = useState([])
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
    } catch (error) {
      console.error('Failed to fetch menu data:', error)
    }
  }, [])

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
    // Periksa apakah semua field sudah terisi
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setUpdateAlertMessage('Semua Kolom Harus Di Isi')
      setUpdateAlertVisible(true)
      return
    }
    // Jika tidak ada perubahan data
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

  // Mengelompokkan data menu berdasarkan kategori
  const groupedMenuData = menuData.reduce((acc, menu) => {
    const { Kategori } = menu
    if (!acc[Kategori]) {
      acc[Kategori] = []
    }
    acc[Kategori].push(menu)
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          Tambah Menu
        </CButton>
      </div>
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle onClose={handleCloseModal}>Tambah Menu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {alertVisible && (
            <CAlert color="warning" onClose={() => setAlertVisible(false)}>
              Semua Kolom Harus Di Isi
            </CAlert>
          )}
          <CFormInput
            type="text"
            placeholder="Nama"
            value={newMenu.Nama}
            onChange={(e) => setNewMenu({ ...newMenu, Nama: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <CFormInput
            type="text"
            placeholder="Harga"
            value={newMenu.Harga}
            onChange={(e) => setNewMenu({ ...newMenu, Harga: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <CFormSelect
            value={newMenu.Tipe}
            onChange={(e) => setNewMenu({ ...newMenu, Tipe: e.target.value })}
            style={{ marginBottom: '10px' }}
          >
            <option value="" disabled>
              Pilih Tipe
            </option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            style={{ marginBottom: '10px' }}
          >
            <option value="" disabled>
              Pilih Kategori
            </option>
            <option value="Ayam">Ayam</option>
            <option value="Steak Original & Crispy">Steak Original & Crispy</option>
            <option value="Spesial Nasi Goreng">Spesial Nasi Goreng</option>
            <option value="Pelengkap">Pelengkap</option>
            <option value="Minuman Es/Panas">Minuman Es/Panas</option>
            <option value="Menu Baru">Menu Baru</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleAddMenu}>
            Tambah
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={updateModalVisible} onClose={handleCloseUpdateModal}>
        <CModalHeader>
          <CModalTitle onClose={handleCloseUpdateModal}>Update Menu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {updateAlertVisible && (
            <CAlert color="warning" onClose={() => setUpdateAlertVisible(false)}>
              {updateAlertMessage}
            </CAlert>
          )}
          <CFormInput
            type="text"
            placeholder="Nama"
            value={newMenu.Nama}
            onChange={(e) => setNewMenu({ ...newMenu, Nama: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <CFormInput
            type="text"
            placeholder="Harga"
            value={newMenu.Harga}
            onChange={(e) => setNewMenu({ ...newMenu, Harga: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <CFormSelect
            value={newMenu.Tipe}
            onChange={(e) => setNewMenu({ ...newMenu, Tipe: e.target.value })}
            style={{ marginBottom: '10px' }}
          >
            <option value="" disabled>
              Pilih Tipe
            </option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            style={{ marginBottom: '10px' }}
          >
            <option value="" disabled>
              Pilih Kategori
            </option>
            <option value="Ayam">Ayam</option>
            <option value="Steak Original & Crispy">Steak Original & Crispy</option>
            <option value="Spesial Nasi Goreng">Spesial Nasi Goreng</option>
            <option value="Pelengkap">Pelengkap</option>
            <option value="Minuman Es/Panas">Minuman Es/Panas</option>
            <option value="Menu Baru">Menu Baru</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseUpdateModal}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleUpdateMenu}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmDeleteVisible} onClose={handleCloseConfirmDeleteModal}>
        <CModalHeader onClose={handleCloseConfirmDeleteModal}>
          <CModalTitle>Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Apakah Anda yakin ingin menghapus menu ini?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseConfirmDeleteModal}>
            Batal
          </CButton>
          <CButton color="danger" onClick={handleDeleteMenu}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>
      {Object.keys(groupedMenuData).map((kategori) => (
        <CCard className="mb-4" key={kategori}>
          <CCardHeader><b>{kategori}</b></CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '40%', textAlign: 'left'}}>Nama</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '20%', textAlign: 'right' }}>Harga</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '20%', textAlign: 'center' }}>Tipe</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '30%', textAlign: 'center' }}>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {groupedMenuData[kategori].map((menu) => (
                <CTableRow key={menu._id}>
                  <CTableDataCell style={{ width: '40%', textAlign: 'left' }}>{menu.Nama}</CTableDataCell>
                  <CTableDataCell style={{ width: '20%', textAlign: 'right' }}>Rp{menu.Harga.toLocaleString()}</CTableDataCell>
                  <CTableDataCell style={{ width: '20%', textAlign: 'center' }}>{menu.Tipe}</CTableDataCell>
                  <CTableDataCell style={{ width: '30%', textAlign: 'center' }}>
                      <CButton
                        color="warning"
                        onClick={() => handleOpenUpdateModal(menu)}
                        style={{ marginRight: '10px' }}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        onClick={() => handleOpenConfirmDeleteModal(menu._id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                  </CTableDataCell>
                </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )
}

export default Menu
