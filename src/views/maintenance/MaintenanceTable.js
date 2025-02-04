/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CPagination,
  CPaginationItem,
  CBadge,
  CAlert,
  CProgress,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import '../paggination.scss'
import {
  cilCheckCircle,
  cilXCircle,
  cilThumbUp,
  cilThumbDown,
  cilCheck,
  cilX,
  cilTransfer,
  cilUserPlus,
  cilTask,
  cilShare,
  cilPhone,
  cilEnvelopeOpen,
  cilOptions,
} from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilFullscreen,
  cilArrowTop,
  cilArrowBottom,
  cilPeople,
  cilZoom,
} from '@coreui/icons'
import { decryptData } from '../../api/utils/crypto'
import { useNavigate } from 'react-router-dom'
import MaintenanceApproveModal from './MaintenanceApproveModal'
import MaintenanceRejectModal from './MaintenanceRejectModal'
import { updateMaintenance } from '../../api/actions/MaintenanceActions'
import { useDispatch } from 'react-redux'
import MaintenanceInspectionModal from './MaintenanceInspectionModal'
import MaintenanceCompletionModal from './MaintenanceCompletionModal'
import { format } from 'date-fns'

const MaintenanceTable = ({
  maintenanceList = [],
  currentPage,
  totalPages,
  totalRequests,
  searchTerm,
  setSearchTerm,
  handleDelete,
  handleEdit,
  handleViewDetails,
  handlePageChange,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [userPermissions, setUserPermissions] = useState(null)
  const [role, setRole] = useState(null)
  const [error, setError] = useState(null)
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false)
  const [completionModalVisible, setCompletionModalVisible] = useState(false)
  const [maintenanceToApprove, setMaintenanceToApprove] = useState(null)
  const [maintenanceToReject, setMaintenanceToReject] = useState(null)
  const [maintenanceToInspect, setMaintenanceToInspect] = useState(null)
  const [maintenanceToComplete, setMaintenanceToComplete] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const dropdownRefs = useRef({})

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

  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }, [])

  const handleApprove = useCallback((maintenance) => {
    setMaintenanceToApprove(maintenance)
    setApproveModalVisible(true)
  }, [])

  const confirmApprove = useCallback(async () => {
    if (maintenanceToApprove) {
      try {
        await dispatch(
          updateMaintenance({
            id: maintenanceToApprove._id,
            maintenanceData: { status: 'Approved' },
          }),
        )

        setApproveModalVisible(false)
      } catch (error) {
        console.error('Failed to approve maintenance:', error)
      }
    }
  }, [dispatch, maintenanceToApprove])

  const handleReject = useCallback((maintenance) => {
    setMaintenanceToReject(maintenance)
    setRejectModalVisible(true)
  }, [])

  const confirmReject = useCallback(async () => {
    if (maintenanceToReject) {
      try {
        await dispatch(
          updateMaintenance({
            id: maintenanceToReject._id,
            maintenanceData: { status: 'Cancelled' },
          }),
        ).unwrap()
        setRejectModalVisible(false)
      } catch (error) {
        console.error('Failed to reject maintenance:', error)
      }
    }
  }, [dispatch, maintenanceToReject])

  const handleInspection = useCallback((maintenance) => {
    setMaintenanceToInspect(maintenance)
    setInspectionModalVisible(true)
  }, [])

  const confirmInspection = useCallback(
    async (expenseData) => {
      if (maintenanceToInspect) {
        try {
          await dispatch(
            updateMaintenance({
              id: maintenanceToInspect._id,
              maintenanceData: {
                status: 'Inspected',
                expense: expenseData,
              },
            }),
          )
          setInspectionModalVisible(false)
        } catch (error) {
          console.error('Failed to update and set to inspected:', error)
        }
      }
    },
    [dispatch, maintenanceToInspect],
  )

  const handleDone = useCallback((maintenance) => {
    setMaintenanceToComplete(maintenance)
    setCompletionModalVisible(true)
  }, [])

  const confirmCompletion = useCallback(
    async (status, notes = '') => {
      if (maintenanceToComplete) {
        try {
          await dispatch(
            updateMaintenance({
              id: maintenanceToComplete._id,
              maintenanceData: { status, notes },
            }),
          )
          setCompletionModalVisible(false)
        } catch (error) {
          console.error('Failed to update status:', error)
        }
      }
    },
    [dispatch, maintenanceToComplete],
  )

  const handleAssign = useCallback(
    (maintenance) => {
      navigate(`/maintenance/assign/${maintenance._id}`)
    },
    [navigate],
  )

  const generateUsage = (status) => {
    const statusValues = {
      Pending: 20,
      Approved: 40,
      'In Progress': 60,
      Completed: 100,
      Cancelled: 0,
      Inspected: 80,
      Incomplete: 80,
    }

    const value = status ? statusValues[status] || 0 : 0
    let color = 'success'

    if (value === 0) {
      color = 'danger'
    } else if (value <= 20) {
      color = 'warning'
    } else if (value <= 60) {
      color = 'info'
    } else if (value < 80) {
      color = 'primary'
    } else if (value < 100) {
      color = 'secondary'
    }

    return {
      value,
      period: 'status',
      color,
    }
  }

  const getStatusColor = useCallback((status) => {
    const statusColorMap = {
      pending: 'warning',
      approved: 'primary',
      'in progress': 'info',
      completed: 'success',
      cancelled: 'danger',
      inspected: 'info',
      incomplete: 'dark',
    }
    return statusColorMap[status?.toLowerCase()] || 'secondary'
  }, [])

  const getStatusIcon = useCallback((status) => {
    const statusIconMap = {
      pending: cilTransfer,
      approved: cilCheckCircle,
      'in progress': cilTask,
      completed: cilThumbUp,
      cancelled: cilXCircle,
      inspected: cilZoom,
      incomplete: cilThumbDown,
    }
    return statusIconMap[status?.toLowerCase()] || null
  }, [])

  const sortedMaintenance = useMemo(() => {
    if (!sortConfig.key) return maintenanceList

    return [...maintenanceList].sort((a, b) => {
      const aValue = (
        a.tenant?.[sortConfig.key]?.toString() ||
        a[sortConfig.key]?.toString() ||
        ''
      ).toLowerCase()
      const bValue = (
        b.tenant?.[sortConfig.key]?.toString() ||
        b[sortConfig.key]?.toString() ||
        ''
      ).toLowerCase()

      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })
  }, [maintenanceList, sortConfig])

  const filteredMaintenance = useMemo(() => {
    if (!searchTerm) return sortedMaintenance

    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    return sortedMaintenance.filter((maintenance) => {
      const tenantName = maintenance.tenant?.name || ''
      const status = maintenance.status || ''

      return (
        tenantName.toLowerCase().includes(lowerCaseSearchTerm) ||
        status.toLowerCase().includes(lowerCaseSearchTerm)
      )
    })
  }, [sortedMaintenance, searchTerm])

  const toggleDropdown = (maintenanceId) => {
    setDropdownOpen((prevState) => (prevState === maintenanceId ? null : maintenanceId))
  }

  const closeDropdown = () => {
    setDropdownOpen(null)
  }

  const CustomDropdownToggle = React.forwardRef((props, ref) => (
    <CDropdownToggle color="light" caret={false} size="sm" title="Actions" ref={ref} {...props}>
      <CIcon icon={cilOptions} />
    </CDropdownToggle>
  ))

  return (
    <div>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}
      <MaintenanceApproveModal
        visible={approveModalVisible}
        setApproveModalVisible={setApproveModalVisible}
        maintenanceToApprove={maintenanceToApprove}
        confirmApprove={confirmApprove}
      />
      <MaintenanceRejectModal
        visible={rejectModalVisible}
        setRejectModalVisible={setRejectModalVisible}
        maintenanceToReject={maintenanceToReject}
        confirmReject={confirmReject}
      />
      <MaintenanceInspectionModal
        visible={inspectionModalVisible}
        setInspectionModalVisible={setInspectionModalVisible}
        maintenanceToInspect={maintenanceToInspect}
        confirmInspection={confirmInspection}
      />
      <MaintenanceCompletionModal
        visible={completionModalVisible}
        setCompletionModalVisible={setCompletionModalVisible}
        maintenanceToComplete={maintenanceToComplete}
        confirmCompletion={confirmCompletion}
      />

      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="bg-body-tertiary text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell
              className="bg-body-tertiary"
              onClick={() => handleSort('name')}
              style={{ cursor: 'pointer' }}
            >
              Tenant
              {sortConfig.key === 'name' && (
                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
              )}
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Contact</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredMaintenance.map((maintenance, index) => {
            const rowNumber = (currentPage - 1) * 10 + index + 1
            const usage = generateUsage(maintenance?.status)
            const statusIcon = getStatusIcon(maintenance?.status)
            const assignableStatuses = [
              'In Progress',
              'Completed',
              'Inspected',
              'Incomplete',
              'Approved',
            ]

            return (
              <CTableRow key={maintenance?._id || index}>
                <CTableDataCell className="text-center">{rowNumber}</CTableDataCell>
                <CTableDataCell>
                  <div>{maintenance?.tenant?.name || 'N/A'}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="small text-body-secondary text-nowrap">
                    <CIcon icon={cilEnvelopeOpen} size="sm" className="me-1" />
                    {maintenance?.tenant?.email || 'N/A'}
                  </div>
                  <div className="small text-body-secondary text-nowrap">
                    <CIcon icon={cilPhone} size="sm" className="me-1" />
                    {maintenance?.tenant?.phoneNumber || 'N/A'}
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusColor(maintenance?.status)}>
                    {statusIcon && <CIcon icon={statusIcon} size="sm" className="me-1" />}
                    {maintenance?.status || 'N/A'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex justify-content-between text-nowrap">
                    <div className="fw-semibold">{usage.value}%</div>
                    <div className="ms-3">
                      <small className="text-body-secondary">{usage.period}</small>
                    </div>
                  </div>
                  <CProgress thin color={usage.color} value={usage.value} />
                </CTableDataCell>
                <CTableDataCell>
                  <CDropdown
                    variant="btn-group"
                    isOpen={dropdownOpen === maintenance?._id}
                    onToggle={() => toggleDropdown(maintenance?._id)}
                    onMouseLeave={closeDropdown}
                  >
                    <CustomDropdownToggle />
                    <CDropdownMenu>
                      {role === 'Tenant' && (
                        <CDropdownItem onClick={() => handleEdit(maintenance)} title="Edit">
                          <CIcon icon={cilPencil} className="me-2" />
                          Edit
                        </CDropdownItem>
                      )}
                      {role === 'Maintainer' && (
                        <CDropdownItem onClick={() => handleInspection(maintenance)} title="Edit">
                          <CIcon icon={cilPencil} className="me-2" />
                          Edit
                        </CDropdownItem>
                      )}
                      {role === 'Inspector' && (
                        <CDropdownItem onClick={() => handleDone(maintenance)} title="Edit">
                          <CIcon icon={cilPencil} className="me-2" />
                          Edit
                        </CDropdownItem>
                      )}
                      {role === 'Tenant' && (
                        <CDropdownItem
                          onClick={() => handleDelete(maintenance)}
                          title="Delete"
                          style={{ color: 'red' }}
                        >
                          <CIcon icon={cilTrash} className="me-2" />
                          Delete
                        </CDropdownItem>
                      )}
                      {role === 'Admin' && (
                        <CDropdownItem
                          onClick={() => handleApprove(maintenance)}
                          style={{ color: `green` }}
                          title="Approve"
                        >
                          <CIcon icon={cilCheck} className="me-2" />
                          Approve
                        </CDropdownItem>
                      )}
                      {role === 'Admin' && (
                        <CDropdownItem
                          onClick={() => handleReject(maintenance)}
                          style={{ color: `red` }}
                          title="Reject"
                        >
                          <CIcon icon={cilX} className="me-2" />
                          Reject
                        </CDropdownItem>
                      )}
                      {assignableStatuses.includes(maintenance?.status) && role === 'Admin' && (
                        <CDropdownItem onClick={() => handleAssign(maintenance)} title="Assign">
                          <CIcon icon={cilShare} className="me-2" />
                          Assign
                        </CDropdownItem>
                      )}
                      <CDropdownItem
                        onClick={() => handleViewDetails(maintenance)}
                        title="View Details"
                      >
                        <CIcon icon={cilZoom} className="me-2" />
                        Details
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>

      <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
        <span>Total Requests: {totalRequests}</span>
        <CPagination className="d-inline-flex">
          <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
            «
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹
          </CPaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ›
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            »
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  )
}

export default React.memo(MaintenanceTable)
