import React, {useState , useMemo, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CPagination,
  CPaginationItem,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
} from '@coreui/react'
import '../paggination.scss'
import { CIcon } from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
  cilFile,
  cilClipboard,
  cilCloudDownload,
  cilFullscreen,
  cilPrint,
  cilPeople,
  cilUser,
  cilEnvelopeOpen,
  cilCalendar,
  cilOptions,
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  cilSearch,
  // cilFolderDownload // New icon for download
} from '@coreui/icons'
import { CSVLink } from 'react-csv'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import placeholder from '../image/placeholder.png'
import { decryptData } from '../../api/utils/crypto'
import TenantDetailsModal from './TenantDetailsModal'
import { setSelectedTenant, clearError } from '../../api/slice/TenantSlice'
// import './TenantTable.scss' // Import the dedicated CSS file
import ClearanceDetailsModal from '../Clearance/ClearanceDetailsModal' // Import the ClearanceDetailsModal
import clearanceService from '../../api/services/clearance.service' // Import the clearance service
import { fetchTenants } from '../../api/actions/TenantActions'
import { toast } from 'react-toastify'

const TenantTable = ({
  tenants,
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handleEditPhoto,
  handleEdit,
  handleDelete,
  handlePageChange,
  loading,
  itemsPerPage,
  handleFetchTenants,
  //Receive props
  handleViewDetails,
  handleClearance,
}) => {
  const dispatch = useDispatch()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [userPermissions, setUserPermissions] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const selectedTenant = useSelector((state) => state.tenant.selectedTenant)
  const tenantDetails = useSelector((state) => state.tenant.tenantDetails)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const dropdownRefs = useRef({})

  // New state for clearance modal
  const [isClearanceModalVisible, setIsClearanceModalVisible] = useState(false)
  const [clearanceTenantId, setClearanceTenantId] = useState(null)
  const [clearanceStatuses, setClearanceStatuses] = useState({})

  // Memoized pagination click handler

  const handlePaginationClick = useCallback(
    (event, page) => {
      event.preventDefault()
      handlePageChange(page)
    },
    [handlePageChange],
  )

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user')
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser)
      if (decryptedUser && decryptedUser.permissions) {
        setUserPermissions(decryptedUser.permissions)
      }
    }
  }, [])

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
      return { key, direction }
    })
  }

  const sortedTenants = useMemo(() => {
    if (!sortConfig.key) return tenants

    return [...tenants].sort((a, b) => {
      const aKey = a[sortConfig.key] || ''
      const bKey = b[sortConfig.key] || ''

      if (aKey < bKey) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aKey > bKey) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }, [tenants, sortConfig])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (e) {
      return 'N/A'
    }
  }

  const calculateDaysUntilEnd = (endDate) => {
    if (!endDate) return null
    try {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const diffInTime = end - now
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24))
      return diffInDays
    } catch (e) {
      return null
    }
  }

  const getStatusDetails = (endDate) => {
    const days = calculateDaysUntilEnd(endDate)
    if (days === null) {
      return {
        text: 'N/A',
        color: 'text-secondary',
        icon: null,
      }
    } else if (days > 30) {
      return {
        text: `${days} days`,
        color: 'text-success',
        icon: cilCheckCircle,
      }
    } else if (days < 30 && days >= 0) {
      return {
        text: `${days} days`,
        color: 'text-warning',
        icon: cilWarning,
      }
    } else if (days < 0) {
      return {
        text: `${days} days`,
        color: 'text-danger',
        icon: cilXCircle,
      }
    }
    return {
      text: `${days} days`,
      color: 'text-secondary',
      icon: null,
    }
  }

  const getClearanceStatusDetails = (tenantId) => {
    const status = clearanceStatuses[tenantId]
    if (!status) {
      return {
        text: 'N/A',
        color: 'text-secondary',
        icon: null,
      }
    }
    if (status === 'Approved') {
      return {
        text: `Approved`,
        color: 'text-success',
        icon: cilCheckCircle,
      }
    } else if (status === 'Pending') {
      return {
        text: `Pending`,
        color: 'text-warning',
        icon: cilWarning,
      }
    } else if (status === 'Rejected') {
      return {
        text: `Rejected`,
        color: 'text-danger',
        icon: cilXCircle,
      }
    }
    return {
      text: 'N/A',
      color: 'text-secondary',
      icon: null,
    }
  }

  const csvData = tenants.map((tenant, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    name: tenant?.tenantName || 'N/A',
    email: tenant.contactInformation?.email || 'N/A',
    startDate: formatDate(tenant.leaseAgreement?.startDate),
    endDate: formatDate(tenant.leaseAgreement?.endDate),
    status: getStatusDetails(tenant.leaseAgreement?.endDate)?.text || 'N/A',
  }))

  const clipboardData = tenants
    .map(
      (tenant, index) =>
        `${(currentPage - 1) * itemsPerPage + index + 1}. ${
          tenant?.tenantName || 'N/A'
        } - ${tenant.contactInformation?.email || 'N/A'}`,
    )
    .join('\n')

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Tenant Data', 14, 10)

    const tableData = tenants.map((tenant, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      tenant?.tenantName || 'N/A',
      tenant.contactInformation?.email || 'N/A',
      formatDate(tenant.leaseAgreement?.startDate) || 'N/A',
      formatDate(tenant.leaseAgreement?.endDate) || 'N/A',
      getStatusDetails(tenant.leaseAgreement?.endDate)?.text || 'N/A',
    ])

    doc.autoTable({
      head: [['#', 'Name', 'Email', 'Start Date', 'End Date', 'Status']],
      body: tableData,
      startY: 20,
    })

    doc.save('tenant_data.pdf')
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (typeof handleFetchTenants === 'function') {
        handleFetchTenants({ search: searchTerm })
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, handleFetchTenants])

  useEffect(() => {
    const fetchClearanceStatuses = async () => {
      const statuses = {}
      if (tenants && tenants.length > 0) {
        for (const tenant of tenants) {
          try {
            const clearance = await clearanceService.fetchClearances(
              1,
              1,
              '',
              '',
              tenant._id,
            )
            if (clearance?.clearances && clearance.clearances.length > 0) {
              statuses[tenant._id] = clearance.clearances[0].status
            }
          } catch (error) {
            console.error(`Error fetching clearance status for tenant ${tenant._id}:`, error)
          }
        }
        setClearanceStatuses(statuses)
      }
    }

    fetchClearanceStatuses()
  }, [tenants])

  const toggleDropdown = (tenantId) => {
    setDropdownOpen((prevState) => (prevState === tenantId ? null : tenantId))
  }

  const closeDropdown = () => {
    setDropdownOpen(null)
  }
  // const handleViewDetails = async (id) => {
  //     try {
  //         // Fetch the tenant details using the fetchTenantById action
  //         //Call handleViewDetails and pass id
  //         handleViewDetails(id);

  //     } catch (error) {
  //         console.error('Error fetching tenant details:', error);
  //         toast.error(error.message || 'Failed to fetch tenant details');
  //     }
  // };

  useEffect(() => {
    if (tenants.length === 0 && currentPage > 1) {
      // If there are no tenants and we are not on the first page, move back a page
      handlePageChange(currentPage - 1)
    }
  }, [tenants, currentPage, handlePageChange])
  // Function to handle download ID proof - placeholder, implement actual download logic
  // Function to handle download ID proof - placeholder, implement actual download logic
  const handleDownloadIdProof = (idProof) => {
    if (idProof && idProof.length > 0) {
      idProof.forEach((url) => {
        // Create a new link element
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank' // Open in a new tab
        link.download = url.substring(url.lastIndexOf('/') + 1) // Extract filename from URL

        // Programmatically trigger the download
        document.body.appendChild(link)
        link.click()

        // Clean up: remove the link after the download starts
        document.body.removeChild(link)
      })
    } else {
      toast.info('No ID Proofs to download.')
    }
  }

  // CSS class for blurring
  const blurredClass = 'blurred-column'

  // Determine if blurring should be applied
  const shouldBlurClearance = !userPermissions?.viewClearanceStatus

  // Modified handleClearance to show modal
  // const handleClearance = (tenantId) => {
  //      setClearanceTenantId(tenantId);
  //      setIsClearanceModalVisible(true);
  // };

  //  handleClearanceAdded
  const handleClearanceAdded = () => {
    // Refresh data to reflect changes after adding a clearance
    if (handleFetchTenants) {
      handleFetchTenants({ search: searchTerm })
    }
  }

  return (
    <div className="tenant-table-container">
      <div className="d-flex justify-content-between mb-3">
        {/* Export and Search Tools */}
        <div className="d-flex gap-2">
          <CSVLink
            data={csvData}
            headers={[
              { label: '#', key: 'index' },
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Start Date', key: 'startDate' },
              { label: 'End Date', key: 'endDate' },
              { label: 'Status', key: 'status' },
            ]}
            filename="tenant_data.csv"
            className="btn btn-dark btn-sm"
          >
            <CIcon icon={cilFile} title="Export CSV" />
          </CSVLink>
          <CopyToClipboard text={clipboardData}>
            <CButton color="dark" size="sm" title="Copy to Clipboard">
              <CIcon icon={cilClipboard} />
            </CButton>
          </CopyToClipboard>
          <CButton color="dark" size="sm" onClick={exportToPDF} title="Export PDF">
            <CIcon icon={cilCloudDownload} />
          </CButton>
        </div>

        <div className="d-flex align-items-center">
          <CIcon icon={cilSearch} className="me-2" />
          <CFormInput
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap bg-light">
            <CTableRow>
              <CTableHeaderCell className="text-center bg-body-tertiary">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Photo</CTableHeaderCell>
              <CTableHeaderCell
                onClick={() => handleSort('tenantName')}
                className="bg-body-tertiary"
                style={{ cursor: 'pointer' }}
              >
                Tenant
                {sortConfig.key === 'tenantName' && (
                  <CIcon
                    icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom}
                    className="ms-1"
                  />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Contact</CTableHeaderCell>
              {/* REMOVED PAYMENT COLUMN */}
              {/* <CTableHeaderCell>Payment</CTableHeaderCell> */}
              <CTableHeaderCell className="bg-body-tertiary">
                Download ID
              </CTableHeaderCell>{' '}
              {/* NEW COLUMN */}
              {/* <CTableHeaderCell>Lease Status</CTableHeaderCell> */}
              <CTableHeaderCell className="bg-body-tertiary">
                Clearance Status
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={7} className="text-center">
                  <CSpinner color="primary" />
                </CTableDataCell>
              </CTableRow>
            ) : tenants.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={7} className="text-center">
                  No tenants found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              tenants?.map((tenant, index) => (
                <CTableRow key={tenant?._id || index}>
                  <CTableDataCell className="text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="tenant-photo-container">
                      <img src={placeholder} alt="Tenant" className="me-2"
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                      {/* {userPermissions?.editTenantPhotos && ( */}
                        <CButton
                          color="light"
                          size="sm"
                          onClick={() => handleEditPhoto(tenant)}
                          title="Edit photo"
                          className="edit-photo-btn"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                      {/* )} */}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{tenant?.tenantName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <div className="small text-body-secondary text-nowrap">
                      <CIcon icon={cilEnvelopeOpen} size="sm" className="me-1" />
                      {tenant.contactInformation?.email || 'N/A'}
                    </div>
                    <div className="small text-body-secondary text-nowrap">
                      <CIcon icon={cilUser} size="sm" className="me-1" />
                      {tenant.contactInformation?.phoneNumber || 'N/A'}
                    </div>
                  </CTableDataCell>
                  {/* REMOVED PAYMENT DATA CELL */}
                  {/* <CTableDataCell>
                                    <div className="small text-body-secondary text-nowrap">
                                        <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                        Security Deposit: {tenant.leaseAgreement?.securityDeposit || 'N/A'}
                                    </div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                        Rent Amount:{tenant.leaseAgreement?.rentAmount || 'N/A'}
                                    </div>
                                </CTableDataCell> */}
                  <CTableDataCell>
                    {' '}
                    {/* NEW DOWNLOAD ID CELL */}
                    {tenant.idProof && tenant.idProof.length > 0 ? (
                      <CButton
                        color="ghost-dark" // Or any suitable style
                        size="sm"
                        onClick={() => handleDownloadIdProof(tenant.idProof)}
                        title="Download ID Proof"
                      >
                        <CIcon icon={cilCloudDownload} /> Download ID
                      </CButton>
                    ) : (
                      'N/A'
                    )}
                  </CTableDataCell>
                  {/* <CTableDataCell>
                                      <div className={`status-badge ${getStatusDetails(tenant.leaseAgreement?.endDate)?.color}`}>
                                     {getStatusDetails(tenant.leaseAgreement?.endDate)?.text}
                                    {
                                    getStatusDetails(tenant.leaseAgreement?.endDate)?.icon && (
                                            <CIcon
                                                icon={getStatusDetails(tenant.leaseAgreement?.endDate)?.icon}
                                                 className="ms-1"
                                             />
                                        )}
                                    </div>
                                </CTableDataCell> */}
                  <CTableDataCell className={shouldBlurClearance ? blurredClass : ''}>
                    <div
                      className={`status-badge ${getClearanceStatusDetails(tenant?._id)?.color}`}
                    >
                      {getClearanceStatusDetails(tenant?._id)?.text}
                      {getClearanceStatusDetails(tenant?._id)?.icon && (
                        <CIcon
                          icon={getClearanceStatusDetails(tenant?._id)?.icon}
                          className="ms-1"
                        />
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CDropdown
                      variant="btn-group"
                      isOpen={dropdownOpen === tenant?._id}
                      onToggle={() => toggleDropdown(tenant?._id)}
                      onMouseLeave={closeDropdown}
                      innerRef={(ref) => (dropdownRefs.current[tenant?._id] = ref)}
                    >
                      <CDropdownToggle
                        color="light"
                        size="sm"
                        caret={false}
                        title="Actions"
                        className="action-dropdown-btn"
                      >
                        <CIcon icon={cilOptions} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {userPermissions?.editTenant && (
                          <CDropdownItem onClick={() => handleEdit(tenant?._id)} title="Edit">
                            <CIcon icon={cilPencil} className="me-2" />
                            Edit
                          </CDropdownItem>
                        )}
                        {userPermissions?.deleteTenant && (
                          <CDropdownItem
                            onClick={() => handleDelete(tenant?._id)}
                            title="Delete"
                            style={{ color: 'red' }}
                          >
                            <CIcon icon={cilTrash} className="me-2" />
                            Delete
                          </CDropdownItem>
                        )}
                        <CDropdownItem
                          onClick={() => handleViewDetails(tenant?._id)}
                          title="View Details"
                        >
                          <CIcon icon={cilFullscreen} className="me-2" />
                          Details
                        </CDropdownItem>

                        {/* <CDropdownItem
                                                 onClick={() => handleClearance(tenant?._id)}
                                                title="Clearance"
                                            >
                                                <CIcon icon={cilClipboard} className="me-2" />
                                                Clearance
                                            </CDropdownItem> */}
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
      <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
        <span>Total Tenants: {totalPages * itemsPerPage}</span>
        <CPagination className="mt-3">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={(e) => handlePaginationClick(e, 1)}
          >
            «
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={(e) => handlePaginationClick(e, currentPage - 1)}
          >
            ‹
          </CPaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i
            if (page > totalPages) return null
            return (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={(e) => handlePaginationClick(e, page)}
              >
                {page}
              </CPaginationItem>
            )
          })}

          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={(e) => handlePaginationClick(e, currentPage + 1)}
          >
            ›
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={(e) => handlePaginationClick(e, totalPages)}
          >
            »
          </CPaginationItem>
        </CPagination>
      </div>

      {/* Conditionally render ClearanceDetailsModal */}
      {isClearanceModalVisible && (
        <ClearanceDetailsModal
          visible={isClearanceModalVisible}
          setVisible={setIsClearanceModalVisible}
          tenantId={clearanceTenantId}
          onClearanceAdded={handleClearanceAdded}
        />
      )}
    </div>
  )
}

export default TenantTable