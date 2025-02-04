/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react'
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
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import '../paggination.scss'
import { CIcon } from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilUser,
  cilFile,
  cilClipboard,
  cilCloudDownload,
  cilOptions,
  cilDescription,
  cilCalendar,
  cilInfo,
  cilHome,
  cilList,
} from '@coreui/icons'
import { CSVLink } from 'react-csv'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchInspectors } from '../../api/actions/userActions'
import ComplaintsTableActions from './ComplaintsTableActions'
import ComplaintsTableData from './ComplaintsTableData'
import { decryptData } from '../../api/utils/crypto'
import ComplaintAssign from './ComplaintAssign'
import Feedback from './Feedback'

const ComplaintsTable = ({
  complaints = [],
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  totalComplaints,
  handleDelete,
  handleEdit,
  handlePageChange,
}) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [feedbackText, setFeedbackText] = useState({})
  const [assignee, setAssignee] = useState({})
  const [inspectors, setInspectors] = useState([])
  const { users } = useSelector((state) => state.user)
  const [role, setRole] = useState(null)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser)
        setRole(decryptedUser?.role || null)
      }
    } catch (err) {
      setError('Failed to load user role')
      console.error('Role loading error:', err)
    }
  }, [])

  useEffect(() => {
    const fetchAllInspectors = async () => {
      try {
        const response = await dispatch(fetchInspectors()).unwrap()
        setInspectors(response.inspectors || []) // Safely handle undefined
      } catch (error) {
        console.error('Failed to load inspectors:', error)
      }
    }

    fetchAllInspectors()
  }, [dispatch])

  const handleModalOpen = (complaint) => {
    setSelectedComplaint(complaint)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedComplaint(null)
  }

  const handleAssignModalOpen = (complaint) => {
    setSelectedComplaint(complaint)
    setAssignModalVisible(true)
  }
  const handleAssignModalClose = () => {
    setAssignModalVisible(false)
    setSelectedComplaint(null)
  }

  const handleFeedbackModalOpen = (complaint) => {
    setSelectedComplaint(complaint)
    setFeedbackModalVisible(true)
  }
  const handleFeedbackModalClose = () => {
    setFeedbackModalVisible(false)
    setSelectedComplaint(null)
  }
  const handleAssigneeChange = (e, complaintId) => {
    setAssignee((prevAssignee) => ({
      ...prevAssignee,
      [complaintId]: e.target.value,
    }))
  }

  const handleAssignClick = (complaintId) => {
    const userId = assignee[complaintId]
    if (userId) {
      // handleAssign(complaintId, userId)
      console.log(complaintId, userId)
      setAssignModalVisible(false)
      setSelectedComplaint(null)
    } else {
      toast.error('Please select an assignee')
    }
  }

  const handleFeedbackChange = (e, complaintId) => {
    setFeedbackText((prevFeedbackText) => ({
      ...prevFeedbackText,
      [complaintId]: e.target.value,
    }))
  }

  const handleFeedbackSubmit = (complaintId) => {
    //handleFeedback(complaintId, feedbackText[complaintId] || '');
    console.log(complaintId, feedbackText[complaintId])
    setFeedbackModalVisible(false)
    setSelectedComplaint(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString()
    } catch (error) {
      return 'N/A'
    }
  }

  const sortedComplaints = useMemo(() => {
    if (!sortConfig.key) return complaints

    return [...complaints].sort((a, b) => {
      const aKey =
        a[sortConfig.key] && typeof a[sortConfig.key] === 'object'
          ? a[sortConfig.key]?.name || ''
          : a[sortConfig.key] || ''
      const bKey =
        b[sortConfig.key] && typeof b[sortConfig.key] === 'object'
          ? b[sortConfig.key]?.name || ''
          : b[sortConfig.key] || ''

      if (aKey < bKey) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aKey > bKey) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }, [complaints, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
      return { key, direction }
    })
  }

  const csvData = complaints.map((complaint, index) => ({
    index: (currentPage - 1) * 10 + index + 1,
    tenant: complaint.createdBy?.name || 'N/A',
    property: complaint.property?.title || 'N/A',
    complaintType: complaint?.complaintType || 'N/A',
    status: complaint?.status || 'N/A',
  }))

  const clipboardData = complaints
    .map(
      (complaint, index) =>
        `${(currentPage - 1) * 10 + index + 1}. Tenant: ${complaint.createdBy?.name || 'N/A'}, Property: ${
          complaint.property?.title || 'N/A'
        }, Type: ${complaint.complaintType || 'N/A'}, Status: ${complaint.status || 'N/A'}`,
    )
    .join('\n')
  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Complaint Data', 14, 10)

    const tableData = complaints.map((complaint, index) => [
      (currentPage - 1) * 10 + index + 1,
      complaint.createdBy?.name || 'N/A',
      complaint.property?.title || 'N/A',
      complaint.complaintType || 'N/A',
      complaint.status || 'N/A',
    ])

    doc.autoTable({
      head: [['#', 'Tenant', 'Property', 'Type', 'Status']],
      body: tableData,
      startY: 20,
    })

    doc.save('complaint_data.pdf')
  }

  return (
    <div>
      <ComplaintsTableActions
        csvData={csvData}
        clipboardData={clipboardData}
        exportToPDF={exportToPDF}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ComplaintsTableData
        complaints={complaints}
        currentPage={currentPage}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        handleSort={handleSort}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleModalOpen={handleModalOpen}
        users={users}
        handleAssignModalOpen={handleAssignModalOpen}
        handleFeedbackModalOpen={handleFeedbackModalOpen}
        role={role}
      />
      <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
        <span>Total Complaints: {totalComplaints}</span>
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
              style={{ background: `black` }}
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
      {/* Complaint Details Modal */}
      <CModal size="lg" visible={modalVisible} onClose={handleModalClose}>
        <CModalHeader onClose={handleModalClose}>
          <CModalTitle>Complaint Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedComplaint && (
            <div>
              <p>
                <strong>
                  <CIcon icon={cilDescription} className="me-1" />
                  Description:
                </strong>{' '}
                {selectedComplaint?.description || 'N/A'}
              </p>
              <p>
                <strong>
                  {' '}
                  <CIcon icon={cilCalendar} className="me-1" />
                  Submitted Date:
                </strong>{' '}
                {formatDate(selectedComplaint?.submittedDate)}
              </p>
              <p>
                <strong>
                  <CIcon icon={cilCalendar} className="me-1" />
                  Resolved Date:
                </strong>{' '}
                {formatDate(selectedComplaint?.resolvedDate)}
              </p>
              <p>
                <strong>
                  {' '}
                  <CIcon icon={cilInfo} className="me-1" />
                  Priority:
                </strong>{' '}
                {selectedComplaint?.priority || 'N/A'}
              </p>
              <p>
                <strong>
                  {' '}
                  <CIcon icon={cilDescription} className="me-1" />
                  Notes:
                </strong>{' '}
                {selectedComplaint?.notes || 'N/A'}
              </p>
              <p>
                <strong>
                  <CIcon icon={cilDescription} className="me-1" />
                  Feedback:
                </strong>{' '}
                {selectedComplaint?.feedback || 'N/A'}
              </p>
              {selectedComplaint.supportingFiles &&
                selectedComplaint.supportingFiles.length > 0 && (
                  <div>
                    <p>
                      <strong>
                        <CIcon icon={cilFile} className="me-1" />
                        Supporting Files:
                      </strong>
                    </p>
                    <ul>
                      {selectedComplaint.supportingFiles.map((file, index) => (
                        <li key={index}>
                          <a href={file} target="_blank" rel="noopener noreferrer">
                            {file.split('/').pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Assign Modal */}
      <CModal visible={assignModalVisible} onClose={handleAssignModalClose}>
        <CModalHeader>
          <CModalTitle>Assign Complaint</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedComplaint && (
            <ComplaintAssign
              inspectors={inspectors}
              assignee={assignee[selectedComplaint._id] || ''}
              handleAssigneeChange={handleAssigneeChange}
              complaintId={selectedComplaint._id}
              handleAssignClick={handleAssignClick}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleAssignModalClose}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Feedback Modal */}
      <CModal visible={feedbackModalVisible} onClose={handleFeedbackModalClose}>
        <CModalHeader>
          <CModalTitle>Feedback</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedComplaint && (
            <Feedback
              feedbackText={feedbackText[selectedComplaint._id] || ''}
              handleFeedbackChange={handleFeedbackChange}
              complaintId={selectedComplaint._id}
              handleFeedbackSubmit={handleFeedbackSubmit}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleFeedbackModalClose}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ComplaintsTable