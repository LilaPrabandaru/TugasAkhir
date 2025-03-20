import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CButtonGroup,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getAllPesanan } from 'src/services/orderHistoryService'
import { cilList } from '@coreui/icons'

const Dashboard = () => {
  // State untuk metrics
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [previousTotalCustomers, setPreviousTotalCustomers] = useState(0)
  const [customerDelta, setCustomerDelta] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)

  // State untuk chart
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })
  const [chartMode, setChartMode] = useState('monthly') // 'monthly' atau 'yearly'

  useEffect(() => {
    fetchMetrics()
    fetchChartData(chartMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartMode])

  const fetchMetrics = async () => {
    try {
      const orders = await getAllPesanan()

      // Menghitung TOTAL CUSTOMER dari nama pelanggan unik
      const uniqueCustomers = new Set(orders.map((order) => order.Nama_Pelanggan))
      const newTotalCustomers = uniqueCustomers.size

      // Menghitung selisih dibandingkan dengan nilai sebelumnya
      const delta = newTotalCustomers - previousTotalCustomers
      setTotalCustomers(newTotalCustomers)
      setCustomerDelta(delta)
      setPreviousTotalCustomers(newTotalCustomers)

      // Mendapatkan tanggal hari ini dalam format "YYYY-MM-DD"
      const today = new Date().toISOString().slice(0, 10)
      // Filter PESNAN yang terjadi hari ini
      const todayOrders = orders.filter((order) => order.Tanggal === today)
      setTotalTransactions(todayOrders.length)

      // Menghitung TOTAL REVENUE hari ini
      const revenueToday = todayOrders.reduce((acc, order) => acc + (order['total harga'] || 0), 0)
      setTodayRevenue(revenueToday)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const fetchChartData = async (mode) => {
    try {
      const data = await getAllPesanan() // Mengembalikan array pesanan
      // Filter order yang sudah "Done" (atau sesuai kebutuhan)
      const filteredData = data.filter((order) => order.Status === 'Done')

      if (mode === 'monthly') {
        const revenuePerMonth = {}
        filteredData.forEach((order) => {
          const date = new Date(order.Tanggal)
          // Format label sebagai "MMM YYYY" (contoh: "Jan 2023")
          const label = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
          const total = order['total harga'] || 0
          revenuePerMonth[label] = (revenuePerMonth[label] || 0) + total
        })
        const labels = Object.keys(revenuePerMonth)
        const datasetData = labels.map((label) => revenuePerMonth[label])
        setChartData({
          labels,
          datasets: [
            {
              label: 'Monthly Revenue',
              data: datasetData,
              fill: true,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        })
      } else if (mode === 'yearly') {
        const revenuePerYear = {}
        filteredData.forEach((order) => {
          const year = new Date(order.Tanggal).getFullYear() // Ambil tahun
          const total = order['total harga'] || 0
          revenuePerYear[year] = (revenuePerYear[year] || 0) + total
        })
        // Urutkan tahun secara ascending
        const labels = Object.keys(revenuePerYear).sort()
        const datasetData = labels.map((year) => revenuePerYear[year])
        setChartData({
          labels,
          datasets: [
            {
              label: 'Yearly Revenue',
              data: datasetData,
              fill: true,
              backgroundColor: 'rgba(153,102,255,0.2)',
              borderColor: 'rgba(153,102,255,1)',
            },
          ],
        })
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  return (
    <CContainer>
      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard>
            <CCardHeader>Total Customer</CCardHeader>
            <CCardBody>
              <h2>
                {totalCustomers}{' '}
                {customerDelta > 0 && (
                  <span style={{ color: 'green', fontSize: '16px' }}> ▲ {customerDelta}</span>
                )}
              </h2>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard>
            <CCardHeader>Total Transactions Today</CCardHeader>
            <CCardBody>
              <h2>{totalTransactions}</h2>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard>
            <CCardHeader>Total Revenue Today</CCardHeader>
            <CCardBody>
              <h2>Rp {todayRevenue.toLocaleString()}</h2>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Revenue Chart with Mode Toggle */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Revenue Chart
              <CButtonGroup className="float-end">
                <CButton
                  color="outline-secondary"
                  active={chartMode === 'monthly'}
                  onClick={() => setChartMode('monthly')}
                >
                  Monthly
                </CButton>
                <CButton
                  color="outline-secondary"
                  active={chartMode === 'yearly'}
                  onClick={() => setChartMode('yearly')}
                >
                  Yearly
                </CButton>
              </CButtonGroup>
            </CCardHeader>
            <CCardBody>
              <CChartLine
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => 'Rp ' + value.toLocaleString(),
                      },
                    },
                  },
                  plugins: {
                    legend: { display: true },
                  },
                }}
                style={{ height: '300px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
