import React, { useEffect, useState, useCallback } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilSearch } from '@coreui/icons';
import { getMenu, addMenu, updateMenu, deleteMenu } from 'src/services/menuService';

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMenu, setNewMenu] = useState({ Nama: '', Harga: '', Tipe: '', Kategori: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [updateAlertVisible, setUpdateAlertVisible] = useState(false);
  const [updateAlertMessage, setUpdateAlertMessage] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = useCallback(async () => {
    try {
      const data = await getMenu();
      console.log('Fetched menu data:', data);
      setMenuData(data);
      setFilteredMenuData(data); // Initialize filtered data with all menu items
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter menu data based on the search query
    const filtered = menuData.filter((menu) =>
      menu.Nama.toLowerCase().includes(query) || menu.Kategori.toLowerCase().includes(query)
    );
    setFilteredMenuData(filtered);
  };

  const handleAddMenu = async () => {
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setAlertVisible(true);
      return;
    }
    try {
      await addMenu(newMenu);
      fetchMenuData();
      setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' });
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to add menu:', error);
    }
  };

  const handleUpdateMenu = async () => {
    if (!newMenu.Nama || !newMenu.Harga || !newMenu.Tipe || !newMenu.Kategori) {
      setUpdateAlertMessage('Semua Kolom Harus Di Isi');
      setUpdateAlertVisible(true);
      return;
    }
    if (
      currentMenu.Nama === newMenu.Nama &&
      currentMenu.Harga === newMenu.Harga &&
      currentMenu.Tipe === newMenu.Tipe &&
      currentMenu.Kategori === newMenu.Kategori
    ) {
      setUpdateAlertMessage('Tidak Ada Menu Yang Di Update');
      setUpdateAlertVisible(true);
      return;
    }

    try {
      await updateMenu(currentMenu._id, newMenu);
      fetchMenuData();
      setUpdateModalVisible(false);
    } catch (error) {
      console.error('Failed to update menu:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await deleteMenu(menuToDelete);
      fetchMenuData();
      setConfirmDeleteVisible(false);
    } catch (error) {
      console.error('Failed to delete menu:', error);
    }
  };

  const handleOpenUpdateModal = (menu) => {
    setCurrentMenu(menu);
    setNewMenu(menu);
    setUpdateModalVisible(true);
  };

  const handleOpenConfirmDeleteModal = (menuId) => {
    setMenuToDelete(menuId);
    setConfirmDeleteVisible(true);
  };

  const handleCloseModal = () => {
    setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' });
    setModalVisible(false);
    setAlertVisible(false);
  };

  const handleCloseUpdateModal = () => {
    setNewMenu({ Nama: '', Harga: '', Tipe: '', Kategori: '' });
    setUpdateModalVisible(false);
    setUpdateAlertVisible(false);
  };

  const handleCloseConfirmDeleteModal = () => {
    setConfirmDeleteVisible(false);
    setMenuToDelete(null);
  };

  // Group filtered menu data by category
  const groupedMenuData = filteredMenuData.reduce((acc, menu) => {
    const { Kategori } = menu;
    if (!acc[Kategori]) {
      acc[Kategori] = [];
    }
    acc[Kategori].push(menu);
    return acc;
  }, {});

  return (
    <div className="container-fluid p-4">
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white text-center">Daftar Menu</CCardHeader>
        <CCardBody>
          {/* Search Bar */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <CFormInput
              placeholder="Cari Menu..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: '70%' }}
            />
            <CButton onClick={() => setModalVisible(true)} className="btn-success">
              Tambah Menu
            </CButton>
          </div>

          {Object.keys(groupedMenuData).map((kategori) => (
            <div key={kategori} className="mb-5">
              <h3 className="text-primary">{kategori}</h3>
              <CTable bordered hover responsive className="table table-striped">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nama</CTableHeaderCell>
                    <CTableHeaderCell>Harga</CTableHeaderCell>
                    <CTableHeaderCell>Tipe</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {groupedMenuData[kategori].map((menu) => (
                    <CTableRow key={menu._id}>
                      <CTableDataCell>{menu.Nama}</CTableDataCell>
                      <CTableDataCell>Rp{menu.Harga.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{menu.Tipe}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          onClick={() => handleOpenUpdateModal(menu)}
                          className="btn-warning me-2"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          onClick={() => handleOpenConfirmDeleteModal(menu._id)}
                          className="btn-danger"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
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
            <CAlert color="danger" onClose={() => setAlertVisible(false)} dismissible>
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
            <option>Pilih Tipe</option>
            <option>Makanan</option>
            <option>Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            className="mb-3"
          >
            <option>Pilih Kategori</option>
            <option>Ayam</option>
            <option>Steak</option>
            <option>Nasi Goreng</option>
            <option>Minuman</option>
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
            <CAlert color="danger" onClose={() => setUpdateAlertVisible(false)} dismissible>
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
            <option>Pilih Tipe</option>
            <option>Makanan</option>
            <option>Minuman</option>
          </CFormSelect>
          <CFormSelect
            value={newMenu.Kategori}
            onChange={(e) => setNewMenu({ ...newMenu, Kategori: e.target.value })}
            className="mb-3"
          >
            <option>Pilih Kategori</option>
            <option>Ayam</option>
            <option>Steak</option>
            <option>Nasi Goreng</option>
            <option>Minuman</option>
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
    </div>
  );
};

export default Menu;