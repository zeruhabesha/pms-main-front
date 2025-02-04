import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMaintenances,
  deleteMaintenance,
  fetchMaintenanceById,
} from '../../api/actions/MaintenanceActions'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CSpinner,
  CButton,
} from '@coreui/react'
import MaintenanceTable from './MaintenanceTable'
import '../Super.scss'
import { decryptData } from '../../api/utils/crypto'
import { CIcon } from '@coreui/icons-react'
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons'
import { CSVLink } from 'react-csv'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useNavigate } from 'react-router-dom'
import MaintenanceDetailsModal from './MaintenanceDetailsModal'
import MaintenanceDeleteModal from './MaintenanceDeleteModal'

const ViewMaintenance = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    maintenances = [],
    loading = false,
    error = null,
    totalPages = 0,
    totalMaintenanceRequests = 0,
    currentPage = 1,
  } = useSelector((state) => state.maintenance)

  const [searchState, setSearchState] = useState({
    term: '',
    debouncedTerm: '',
  })

  const [modalStates, setModalStates] = useState({
    details: { visible: false, maintenance: null },
  })

  const [userPermissions, setUserPermissions] = useState(null)
  const [role, setRole] = useState(null)

  const ITEMS_PER_PAGE = 10

  const fetchMaintenanceRequests = useCallback(() => {
    dispatch(
      fetchMaintenances({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchState.debouncedTerm,
      }),
    )
  }, [dispatch, currentPage, searchState.debouncedTerm])

  useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser)
        setUserPermissions(decryptedUser?.permissions || null)
        setRole(decryptedUser?.role || null)
      }
    } catch (err) {
      setError('Failed to load user permissions')
      console.error('Permission loading error:', err)
    }
  }, [])

  useEffect(() => {
    fetchMaintenanceRequests()
  }, [fetchMaintenanceRequests])

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchState((prev) => ({
        ...prev,
        debouncedTerm: prev.term,
      }))
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchState.term])

  const handlePageChange = useCallback(
    (page) => {
      if (page !== currentPage) {
        dispatch(
          fetchMaintenances({
            page,
            limit: ITEMS_PER_PAGE,
            search: searchState.debouncedTerm,
          }),
        )
      }
    },
    [dispatch, currentPage, searchState.debouncedTerm, ITEMS_PER_PAGE],
  )

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null)

  const handleDelete = (maintenance) => {
    setMaintenanceToDelete(maintenance)
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    try {
      if (maintenanceToDelete?._id) {
        await dispatch(deleteMaintenance(maintenanceToDelete._id))
        fetchMaintenanceRequests() // Refresh the list
        setDeleteModalVisible(false)
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleSearchChange = (value) => {
    setSearchState((prev) => ({ ...prev, term: value }))
  }

  const csvData = useMemo(
    () =>
      maintenances.filter(Boolean).map((maintenance, index) => {
        if (!maintenance) return {} // Skip undefined maintenance records
        const tenant = maintenance.tenant || {} // Default to an empty object if tenant is undefined
        return {
          index: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
          tenantName: tenant.name || 'N/A',
          email: tenant.email || 'N/A',
          phone: tenant.phoneNumber || 'N/A',
          status: maintenance.status || 'N/A',
        }
      }),
    [maintenances, currentPage],
  )

  // Data for clipboard
  const clipboardData = useMemo(
    () =>
      maintenances
        .filter(Boolean)
        .map((maintenance, index) => {
          if (!maintenance) return 'Invalid record'
          const tenant = maintenance.tenant || {}
          return `${(currentPage - 1) * ITEMS_PER_PAGE + index + 1}. ${
            tenant.name || 'N/A'
          } - ${tenant.email || 'N/A'} - ${maintenance.status || 'N/A'}`
        })
        .join('\n'),
    [maintenances, currentPage],
  )

  // Export to PDF
  const exportToPDF = useCallback(() => {
    try {
      const doc = new jsPDF()
      doc.text('Maintenance Requests', 14, 10)

      const tableData = maintenances.filter(Boolean).map((maintenance, index) => {
        if (!maintenance) return []
        const tenant = maintenance.tenant || {}
        return [
          (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
          tenant.name || 'N/A',
          tenant.email || 'N/A',
          tenant.phoneNumber || 'N/A',
          maintenance.status || 'N/A',
        ]
      })

      doc.autoTable({
        head: [['#', 'Tenant Name', 'Email', 'Phone', 'Status']],
        body: tableData,
        startY: 20,
      })

      doc.save('maintenance_requests.pdf')
    } catch (error) {
      console.error('PDF export error:', error)
    }
  }, [maintenances, currentPage])

  const handleAddRequest = () => {
    navigate('/maintenance/add')
  }

  const handleEdit = async (maintenance) => {
    try {
      const response = await dispatch(fetchMaintenanceById(maintenance._id)).unwrap()

      if (response) {
        navigate(`/maintenance/edit/${maintenance._id}`, {
          state: { editingRequest: response },
        })
      } else {
        console.error('No data returned for the selected maintenance.')
        alert('No data returned for the selected maintenance.')
      }
    } catch (error) {
      console.error('Failed to fetch maintenance details for editing:', error)
      alert('Failed to fetch maintenance details for editing. Please try again.')
    }
  }
  const handleViewDetails = (maintenance) => {
    handleOpenModal('details', maintenance)
  }

  const handleAssign = (maintenance) => {
    navigate(`/maintenance/assign/${maintenance._id}`)
  }

  const handleOpenModal = (type, maintenance = null) => {
    setModalStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        visible: true,
        maintenance,
      },
    }))
  }

  const handleCloseModal = (type) => {
    setModalStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        visible: false,
        maintenance: null,
      },
    }))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Maintenance Records</strong>
            {role === 'Tenant' && (
              <div id="container">
                <button className="learn-more" onClick={handleAddRequest}>
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Add Request</span>
                </button>
              </div>
            )}
          </CCardHeader>
          <CCardBody>
            <div className="d-flex mb-3 gap-2">
              <div className="d-flex gap-2">
                <CSVLink
                  data={csvData}
                  headers={[
                    { label: '#', key: 'index' },
                    { label: 'Tenant Name', key: 'tenantName' },
                    { label: 'Email', key: 'email' },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Status', key: 'status' },
                  ]}
                  filename="maintenance_requests.csv"
                  className="btn btn-dark"
                  title="Export CSV"
                >
                  <CIcon icon={cilFile} size="lg" />
                </CSVLink>
                <CopyToClipboard text={clipboardData}>
                  <CButton color="dark" title="Copy to Clipboard">
                    <CIcon icon={cilClipboard} size="lg" />
                  </CButton>
                </CopyToClipboard>
                <CButton color="dark" onClick={exportToPDF} title="Export PDF">
                  <CIcon icon={cilCloudDownload} size="lg" />
                </CButton>
              </div>
              <CFormInput
                type="text"
                placeholder="Search by tenant name or maintenance type"
                value={searchState.term}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="me-2"
              />
            </div>
            {loading ? (
              <CSpinner />
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : maintenances && maintenances.length > 0 ? (
              <MaintenanceTable
                maintenanceList={maintenances.filter(Boolean).map((maintenance) => ({
                  ...maintenance,
                  tenantName: maintenance.tenant?.name || 'N/A',
                  email: maintenance.tenant?.email || 'N/A',
                  phone: maintenance.tenant?.phoneNumber || 'N/A',
                }))}
                currentPage={currentPage}
                totalPages={totalPages}
                totalRequests={totalMaintenanceRequests}
                searchTerm={searchState.term}
                setSearchTerm={handleSearchChange}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleViewDetails={handleViewDetails}
                handleAssign={handleAssign}
                handlePageChange={handlePageChange}
              />
            ) : (
              <div className="text-center text-muted">No maintenance records found.</div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <MaintenanceDetailsModal
        visible={modalStates.details.visible}
        setVisible={() => handleCloseModal('details')}
        maintenance={modalStates.details.maintenance}
      />
      <MaintenanceDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        maintenanceToDelete={maintenanceToDelete}
        confirmDelete={confirmDelete}
      />
    </CRow>
  )
}

export default ViewMaintenance
