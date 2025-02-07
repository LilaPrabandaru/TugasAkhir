import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CAlert,
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
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getMenu()
        console.log('Fetched menu data:', data)
        setMenuData(data)
      } catch (error) {
        console.error('Failed to fetch menu data:', error)
      }
    }

    fetchMenuData()
  }, [])

  const handleAddMenu = async () => {
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setAlertVisible(true)
      return
    }
    try {
      const addedMenu = await addMenu(newMenu)
      setMenuData([...menuData, addedMenu])
      setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' })
      setModalVisible(false)
      window.location.reload()
    } catch (error) {
      console.error('Failed to add menu:', error)
    }
  }

  const handleUpdateMenu = async () => {
    if (
      currentMenu.Nama === newMenu.Nama &&
      currentMenu.Harga === newMenu.Harga &&
      currentMenu.Tipe === newMenu.Tipe &&
      currentMenu.Kategori === newMenu.Kategori
    ) {
      setUpdateAlertVisible(true)
      return
    }

    try {
      const updatedMenu = await updateMenu(currentMenu._id, newMenu)
      setMenuData(menuData.map((menu) => (menu._id === currentMenu._id ? updatedMenu : menu)))
      setUpdateModalVisible(false)
      window.location.reload() // Refresh halaman setelah mengupdate menu
    } catch (error) {
      console.error('Failed to update menu:', error.response ? error.response.data : error.message)
    }
  }

  const handleDeleteMenu = async () => {
    try {
      await deleteMenu(menuToDelete)
      setMenuData(menuData.filter((menu) => menu._id !== menuToDelete))
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
          Tambah
        </CButton>
      </div>
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader onClose={handleCloseModal}>Tambah Menu</CModalHeader>
        <CModalBody>
          {alertVisible && (
            <CAlert color="danger" onClose={() => setAlertVisible(false)}>
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
        <CModalHeader onClose={handleCloseUpdateModal}>Update Menu</CModalHeader>
        <CModalBody>
          {updateAlertVisible && (
            <CAlert color="warning" onClose={() => setUpdateAlertVisible(false)}>
              Tidak Ada Yang Di Update
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
        <CModalHeader onClose={handleCloseConfirmDeleteModal}>Konfirmasi Hapus</CModalHeader>
        <CModalBody>Apakah Anda yakin ingin menghapus menu ini?</CModalBody>
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
          <CCardHeader>{kategori}</CCardHeader>
          <CCardBody>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40%', textAlign: 'left' }}>Nama</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Harga</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Tipe</th>
                  <th style={{ width: '30%', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groupedMenuData[kategori].map((menu) => (
                  <tr key={menu._id}>
                    <td style={{ width: '40%', textAlign: 'left' }}>{menu.Nama}</td>
                    <td style={{ width: '20%', textAlign: 'center' }}>{menu.Harga}</td>
                    <td style={{ width: '20%', textAlign: 'center' }}>{menu.Tipe}</td>
                    <td style={{ width: '30%', textAlign: 'center' }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )
}

export default Menu
