import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMaintenances,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../../api/actions/MaintenanceActions'
import { CRow, CCol, CCard, CCardBody, CCardHeader, CFormInput, CSpinner } from '@coreui/react'
import MaintenanceDetailsModal from './MaintenanceDetailsModal'
import MaintenanceTable from './MaintenanceTable'
import MaintenanceProfessionalForm from './MaintenanceProfessionalForm'
import TenantRequestForm from './TenantRequestForm'
import MaintenanceDeleteModal from './MaintenanceDeleteModal'
import MaintenanceEditForm from './MaintenanceEditForm'
import '../Super.scss'
import { decryptData } from '../../api/utils/crypto'

const ViewMaintenance = () => {
  const dispatch = useDispatch()
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
    edit: { visible: false, maintenance: null },
    delete: { visible: false, maintenance: null },
    tenantRequest: { visible: false },
  })

  const [userPermissions, setUserPermissions] = useState(null)

  const ITEMS_PER_PAGE = 5

  const fetchMaintenanceRequests = useCallback(() => {
    console.log('Fetching with params:', {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchState.debouncedTerm,
    })

    dispatch(
      fetchMaintenances({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchState.debouncedTerm,
      }),
    )
  }, [dispatch, currentPage, searchState.debouncedTerm])

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user')
    if (encryptedUser) {
      try {
        const decryptedUser = decryptData(encryptedUser)
        setUserPermissions(decryptedUser?.permissions || null)
      } catch (error) {
        console.error('Failed to decrypt user data', error)
      }
    }
  }, [])

  // useEffect(() => {
  useEffect(() => {
    try {
      console.log('Fetching maintenance requests...')
      fetchMaintenanceRequests()
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
    }
  }, [fetchMaintenanceRequests])

  useSelector((state) => {
    console.log('Current maintenance state:', state.maintenance)
    return state.maintenance
  })

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchState((prev) => ({
        ...prev,
        debouncedTerm: prev.term,
      }))
    }, 500)

    return () => clearTimeout(timerId)
  }, [searchState.term])

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

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(
        fetchMaintenance({
          page,
          limit: ITEMS_PER_PAGE,
          search: searchState.debouncedTerm,
        }),
      )
    }
  }

  const handleDelete = async () => {
    const maintenanceToDelete = modalStates.delete.maintenance
    if (maintenanceToDelete?._id) {
      try {
        await dispatch(deleteMaintenance(maintenanceToDelete._id))
        handleCloseModal('delete')
        fetchMaintenanceRequests()
      } catch (error) {
        console.error('Delete error', error)
      }
    }
  }

  const handleSubmit = async (formData, isEdit = false) => {
    try {
      if (isEdit && modalStates.edit.maintenance?._id) {
        await dispatch(
          updateMaintenance({
            id: modalStates.edit.maintenance._id,
            maintenanceData: formData,
          }),
        )
      } else {
        await dispatch(addMaintenance(formData))
      }
      handleCloseModal(isEdit ? 'edit' : 'tenantRequest')
      fetchMaintenanceRequests()
    } catch (error) {
      console.error('Submission error', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Maintenance Records</strong>
            {userPermissions?.addMaintenanceRecord && (
              <div id="container">
                <button className="learn-more" onClick={() => handleOpenModal('tenantRequest')}>
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Add Request</span>
                </button>
              </div>
            )}
          </CCardHeader>
          <CCardBody>
            <CFormInput
              type="text"
              placeholder="Search by tenant name or maintenance type"
              value={searchState.term}
              onChange={(e) => setSearchState((prev) => ({ ...prev, term: e.target.value }))}
              className="mb-3"
            />
            {loading ? (
              <CSpinner />
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : maintenances && maintenances.length > 0 ? (
              <MaintenanceTable
                maintenanceList={maintenances}
                currentPage={currentPage}
                totalPages={totalPages}
                handleDelete={(maintenance) => handleOpenModal('delete', maintenance)}
                handleEdit={(maintenance) => handleOpenModal('edit', maintenance)}
                handleViewDetails={(maintenance) => handleOpenModal('details', maintenance)}
                handlePageChange={handlePageChange}
              />
            ) : (
              <div className="text-center text-muted">No maintenance records found.</div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modals */}
      <MaintenanceDetailsModal
        visible={modalStates.details.visible}
        setVisible={() => handleCloseModal('details')}
        maintenance={modalStates.details.maintenance}
      />

      <MaintenanceEditForm
        visible={modalStates.edit.visible}
        setVisible={() => handleCloseModal('edit')}
        maintenance={modalStates.edit.maintenance}
        onSubmit={(formData) => handleSubmit(formData, true)}
      />

      <TenantRequestForm
        visible={modalStates.tenantRequest.visible}
        setVisible={() => handleCloseModal('tenantRequest')}
        onSubmit={handleSubmit}
      />

      <MaintenanceDeleteModal
        visible={modalStates.delete.visible}
        setDeleteModalVisible={() => handleCloseModal('delete')}
        maintenanceToDelete={modalStates.delete.maintenance}
        confirmDelete={handleDelete}
      />
    </CRow>
  )
}

export default ViewMaintenance
