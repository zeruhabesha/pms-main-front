import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CAlert,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { fetchInspectors } from '../../api/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import './ComplaintAssign.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { cilCalendar } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import { useParams, useNavigate } from 'react-router-dom' // Import useParams and useNavigate

const ComplaintAssign = ({ onAssign }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: complaintId } = useParams() // Get the complaintId from the URL params
  console.log('onAssign props value in ComplaintAssign: ', onAssign) // Log the onAssign prop

  const [selectedUser, setSelectedUser] = useState(null)
  const [schedule, setSchedule] = useState({ date: '', time: '' })
  const [estimatedCompletion, setEstimatedCompletion] = useState({ date: '', time: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [assignedInspector, setAssignedInspector] = useState(null)
  const searchInputRef = useRef(null)

  const { inspectors = [], loading, error: fetchError } = useSelector((state) => state.user)
  const itemsPerPage = 5
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchInspectors({ page: 1, limit: 50 }))
      } catch (err) {
        console.error('Error fetching inspectors:', err)
        setError('Failed to fetch inspectors')
      }
    }
    fetchData()
  }, [dispatch])
  const handleCheckboxChange = (userId) => {
    setSelectedUser(userId)
    setAssignedInspector(inspectors.find((inspector) => inspector._id === userId) || null)
  }
  const handleScheduleChange = (field, value, type) => {
    if (type === 'preferredAccessTimes') {
      setSchedule((prevSchedule) => ({ ...prevSchedule, [field]: value }))
    } else if (type === 'estimatedCompletionTime') {
      setEstimatedCompletion((prevCompletion) => ({ ...prevCompletion, [field]: value }))
    }
  }
  const handleAssignUser = useCallback(
    async (e) => {
      e.preventDefault()
      if (!selectedUser) {
        setError('Please select a user to assign.')
        return
      }
      if (!schedule.date || !schedule.time) {
        setError('Please provide both a date and time for the schedule.')
        return
      }
      if (!estimatedCompletion.date || !estimatedCompletion.time) {
        setError('Please provide both a date and time for the estimated completion.')
        return
      }
      try {
        const preferredAccessTimes = new Date(`${schedule.date}T${schedule.time}`)
        const estimatedCompletionTime = new Date(
          `${estimatedCompletion.date}T${estimatedCompletion.time}`,
        )
        if (!assignedInspector) {
          setError('Error, the selected user was not found in the database, please try again.')
          return
        }
        const updatedData = {
          assignedTo: assignedInspector._id,
          // other params
        }

        await onAssign(complaintId, updatedData) // Correct call
        navigate(`/complaints`) // Redirect to the complaints list after assigning
        setError(null)
        setSelectedUser(null)
        setSchedule({ date: '', time: '' })
        setEstimatedCompletion({ date: '', time: '' })
      } catch (error) {
        setError('Failed to assign user.')
        console.error('Assign error:', error)
      }
    },
    [
      complaintId,
      selectedUser,
      schedule,
      assignedInspector,
      onAssign,
      estimatedCompletion,
      navigate,
    ],
  )
  const filteredInspectors = inspectors.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredInspectors.length / itemsPerPage)
  const paginatedInspectors = filteredInspectors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }
  const handleCancel = () => {
    navigate(`/complaints`)
  }

  return (
    <div className="complaint-assign-page">
      <div className="page-header">
        <h2 className="assign-title">Assign User to Complaint</h2>
      </div>
      <div className="alert-container">
        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}
        {fetchError && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {fetchError}
          </CAlert>
        )}
      </div>
      <div className="search-container">
        <div className={`search-box ${isSearchExpanded ? 'expanded' : ''}`}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchClick} />
          <CFormInput
            type="text"
            placeholder="Search inspectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            ref={searchInputRef}
          />
        </div>
      </div>
      <div className="form-container">
        <CForm onSubmit={handleAssignUser}>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormLabel htmlFor="schedule-date">Schedule Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  id="schedule-date"
                  value={schedule.date}
                  onChange={(e) =>
                    handleScheduleChange('date', e.target.value, 'preferredAccessTimes')
                  }
                  required
                />
              </CInputGroup>
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormLabel htmlFor="schedule-time">Schedule Time</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="time"
                  id="schedule-time"
                  value={schedule.time}
                  onChange={(e) =>
                    handleScheduleChange('time', e.target.value, 'preferredAccessTimes')
                  }
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormLabel htmlFor="completion-date">Estimated Completion Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  id="completion-date"
                  value={estimatedCompletion.date}
                  onChange={(e) =>
                    handleScheduleChange('date', e.target.value, 'estimatedCompletionTime')
                  }
                  required
                />
              </CInputGroup>
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormLabel htmlFor="completion-time">Estimated Completion Time</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="time"
                  id="completion-time"
                  value={estimatedCompletion.time}
                  onChange={(e) =>
                    handleScheduleChange('time', e.target.value, 'estimatedCompletionTime')
                  }
                  required
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <div className="table-container">
            <CTable striped bordered hover className="user-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Select</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading && (
                  <CTableRow>
                    <CTableDataCell colSpan="4">Loading inspectors...</CTableDataCell>
                  </CTableRow>
                )}
                {!loading &&
                  paginatedInspectors.map((user) => {
                    const isSelected = selectedUser === user._id
                    return (
                      <CTableRow key={user._id} className={`user-row`}>
                        <CTableDataCell>
                          <CFormCheck
                            className="user-checkbox"
                            id={`user-checkbox-${user._id}`}
                            onChange={() => handleCheckboxChange(user._id)}
                            checked={isSelected}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{user.role}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                {!loading && paginatedInspectors.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan="4">No inspectors found.</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
          <div className="pagination-container d-flex justify-content-end">
            <CPagination>
              <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                «
              </CPaginationItem>
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                ‹
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                ›
              </CPaginationItem>
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                »
              </CPaginationItem>
            </CPagination>
          </div>
          <div className="button-container d-flex justify-content-end mt-4 gap-2">
            <CButton color="secondary" onClick={handleCancel} className="cancel-button">
              Cancel
            </CButton>
            <CButton color="dark" type="submit" className="assign-button">
              Assign
            </CButton>
          </div>
        </CForm>
      </div>
    </div>
  )
}

export default ComplaintAssign