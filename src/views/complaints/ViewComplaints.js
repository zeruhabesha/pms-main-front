import React, { useEffect, useState, useMemo,useCallback  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert, CFormSelect } from '@coreui/react'
import {
  fetchComplaints,
  deleteComplaint,
  addComplaint,
  updateComplaint,
  assignComplaint,
  submitComplaintFeedback,
} from '../../api/actions/ComplaintAction'
import ComplaintsTable from './ComplaintsTable'
import ComplaintModal from './ComplaintModal'
import ComplaintDeleteModal from './ComplaintDeleteModal'
import { ToastContainer, toast } from 'react-toastify'
import '../Super.scss'
import 'react-toastify/dist/ReactToastify.css'
import { createSelector } from 'reselect'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ComplaintAssign from './ComplaintAssign' // Import the component
import { decryptData } from '../../api/utils/crypto'

const selectComplaintState = (state) =>
  state.complaint || {
    complaints: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    totalComplaints: 0,
  }

const ViewComplaints = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const complaintSelector = useMemo(
    () =>
      createSelector(selectComplaintState, (complaint) => ({
        complaints: complaint.complaints || [],
        loading: complaint.loading || false,
        error: complaint.error || null,
        totalPages: complaint.totalPages || 0,
        currentPage: complaint.currentPage || 1,
        totalComplaints: complaint.totalComplaints || 0,
      })),
    [],
  )
  const { complaints, loading, error, totalPages, currentPage, totalComplaints } =
    useSelector(complaintSelector)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [complaintModalVisible, setComplaintModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [complaintToDelete, setComplaintToDelete] = useState(null)
  const [editingComplaint, setEditingComplaint] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    dispatch(
      fetchComplaints({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
      }),
    )
  }, [dispatch, currentPage, searchTerm, statusFilter])
    const [userPermissions, setUserPermissions] = useState(null);
  const [role, setRole] = useState(null)
useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser)
        setUserPermissions(decryptedUser?.permissions || null)
        setRole(decryptedUser?.role || null)
      }
    } catch (err) {
      console.error('Permission loading error:', err)
    }
  }, [])

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(
        fetchComplaints({ page, limit: itemsPerPage, search: searchTerm, status: statusFilter }),
      )
    }
  }
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
  }
  const handleDelete = (complaint) => {
    setComplaintToDelete(complaint)
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    if (!complaintToDelete?._id) {
      toast.error('No complaint selected for deletion')
      return
    }

    try {
      await dispatch(deleteComplaint(complaintToDelete._id)).unwrap()
      dispatch(
        fetchComplaints({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusFilter,
        }),
      )
      setDeleteModalVisible(false)
      toast.success('Complaint deleted successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete complaint')
    }
  }
  const handleEdit = (complaint) => {
    setEditingComplaint(complaint)
    setComplaintModalVisible(true)
  }
  const handleSave = async (updatedData) => {
    if (!editingComplaint?._id) {
      toast.error('No complaint selected for editing')
      return
    }

    try {
      await dispatch(
        updateComplaint({ id: editingComplaint._id, complaintData: updatedData }),
      ).unwrap()
      dispatch(
        fetchComplaints({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusFilter,
        }),
      )
      setComplaintModalVisible(false)
      setEditingComplaint(null)
      toast.success('Complaint updated successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to update complaint')
    }
  }
  // Wrap with useCallback to prevent unnecessary recreations
const handleAssign = useCallback(async (complaintId, updatedData) => {
    try {
      await dispatch(assignComplaint({
        id: complaintId,
        updatedData
      })).unwrap();

      toast.success('Assigned successfully');
    } catch (error) {
      toast.error(error?.message || 'Assignment failed');
    }
  }, [dispatch]);


  const handleAddComplaint = async (complaintData) => {
    try {
      await dispatch(addComplaint(complaintData)).unwrap()
      dispatch(
        fetchComplaints({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusFilter,
        }),
      )
      toast.success('Complaint added successfully')
      setComplaintModalVisible(false)
    } catch (error) {
      toast.error(error?.message || 'Failed to add Complaint')
    }
  }
  const handleFeedback = async (complaintId, feedback) => {
    try {
      await dispatch(submitComplaintFeedback({ id: complaintId, feedback })).unwrap()
      dispatch(
        fetchComplaints({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusFilter,
        }),
      )
      toast.success('Complaint feedback submitted successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to submit feedback')
    }
  }

  console.log("Type of handleAssign in ViewComplaints:", typeof handleAssign); // ADD THIS LINE

  const AssignRoute = () => {
    console.log("AssignRoute component is rendering!");
    console.log("handleAssign in AssignRoute:", handleAssign);
    const propsForComplaintAssign = { onAssign: handleAssign }; // Explicitly create props object
    console.log("Props being passed to ComplaintAssign:", propsForComplaintAssign); // Log props object
    return <ComplaintAssign {...propsForComplaintAssign} /> // Use spread operator
  }

  

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Complaint</strong>
            {role === 'Tenant' && (
              <div id="container">
              <button
                className="learn-more"
                onClick={() => {
                  setEditingComplaint(null)
                  setComplaintModalVisible(true)
                }}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Complaint</span>
              </button>
            </div>
            )}
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error.message}
              </CAlert>
            )}
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
            <div className="d-flex justify-content-between mb-3">
              <CFormSelect
                style={{ width: '200px' }}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </CFormSelect>
              <div style={{ width: '100%', marginLeft: '20px' }}></div>
            </div>
            <Routes>
              <Route
                path="/"
                element={<ComplaintsTable
                    complaints={complaints}
                    totalComplaints={totalComplaints}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handlePageChange={handlePageChange}
                  />
                }
              />
  <Route
  path="/assign/:id"
  element={
    <ComplaintAssign
      onAssign={handleAssign}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      searchTerm={searchTerm}
      statusFilter={statusFilter}
    />
    }
  />
</Routes>
          </CCardBody>
        </CCard>
      </CCol>
      {complaintModalVisible && (
        <ComplaintModal
          visible={complaintModalVisible}
          setVisible={setComplaintModalVisible}
          editingComplaint={editingComplaint}
        />
      )}
      <ComplaintDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        complaintToDelete={complaintToDelete}
        confirmDelete={confirmDelete}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  )
}

export default ViewComplaints