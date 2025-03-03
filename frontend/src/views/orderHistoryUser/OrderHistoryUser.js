import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CContainer,
} from '@coreui/react';
import { getAllPesananByEmail } from '../../services/orderHistoryUserService'; // Updated service function

const OrderHistoryUser = () => {
  const [pesananList, setPesananList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    try {
      // Retrieve the email from sessionStorage
      const email = sessionStorage.getItem('email');
      if (!email) {
        console.error('Email not found in sessionStorage');
        return;
      }

      // Fetch orders filtered by email
      const data = await getAllPesananByEmail(email);
      console.log('Data pesanan yang didapat:', data);

      // Sort orders by date (newest first)
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.Tanggal); // Convert string to Date object
        const dateB = new Date(b.Tanggal);
        return dateB - dateA; // Descending order (newest first)
      });

      console.log('Data pesanan yang diurutkan:', sortedData);
      setPesananList(sortedData);
    } catch (error) {
      console.error('Error fetching pesanan:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter orders by selected month and year (ignore day)
  const filteredPesananList = selectedDate
    ? pesananList.filter((pesanan) => {
        const pesananDate = new Date(pesanan.Tanggal);
        return (
          pesananDate.getFullYear() === selectedDate.getFullYear() &&
          pesananDate.getMonth() === selectedDate.getMonth()
        );
      })
    : pesananList;

  const currentItems = filteredPesananList.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <CContainer>
        <div>
        {/* Date Picker for Filtering */}
        <div className="d-flex justify-content-center mb-4">
            <DatePicker
            selected={selectedDate}
            onChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1); // Reset to the first page when the filter changes
            }}
            placeholderText="Filter Bulan dan Tahun"
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="form-control"
            />
        </div>

        {/* Display Orders */}
        {currentItems.map((pesanan) => (
            <CCard className="mb-3" key={pesanan._id}>
            <CCardHeader>
                <p>Nama Pelanggan: {pesanan.Nama_Pelanggan}</p>
                <p>Tanggal: {formatDate(pesanan.Tanggal)}</p>
                <p>Waktu: {pesanan.Waktu}</p>
                <p style={{ color: pesanan.Status === 'Pending' ? 'red' : 'green' }}>
                <b>Status: {pesanan.Status}</b>
                </p>
            </CCardHeader>
            <CCardBody>
                <CAccordion>
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
                            <CTableDataCell colSpan={2} className="text-end">
                            <h6>Total Harga:</h6>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">
                            <h6>Rp{pesanan['total harga'].toLocaleString()}</h6>
                            </CTableDataCell>
                        </CTableRow>
                        </CTableBody>
                    </CTable>
                    </CAccordionBody>
                </CAccordionItem>
                </CAccordion>
            </CCardBody>
            </CCard>
        ))}

        {/* Pagination */}
        <CPagination align="center" className="mt-4">
            <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            >
            Previous
            </CPaginationItem>
            {[...Array(Math.ceil(filteredPesananList.length / itemsPerPage)).keys()].map((number) => (
            <CPaginationItem
                key={number + 1}
                active={currentPage === number + 1}
                onClick={() => setCurrentPage(number + 1)}
            >
                {number + 1}
            </CPaginationItem>
            ))}
            <CPaginationItem
            disabled={currentPage === Math.ceil(filteredPesananList.length / itemsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
            >
            Next
            </CPaginationItem>
        </CPagination>
        </div>
    </CContainer>
  );
};

export default OrderHistoryUser;