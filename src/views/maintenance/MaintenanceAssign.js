/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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
import { fetchMaintainers } from '../../api/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './MaintenanceAssign.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { cilCalendar } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'

const MaintenanceAssign = ({ maintenance, onAssign }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState(null)
  const [schedule, setSchedule] = useState({ date: '', time: '' })
  const [estimatedCompletion, setEstimatedCompletion] = useState({ date: '', time: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchInputRef = useRef(null)
  const { maintainers = [], loading, error: fetchError } = useSelector((state) => state.user)

  const itemsPerPage = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchMaintainers({ page: 1, limit: 50 }))
      } catch (err) {
        console.error('Error fetching maintainers:', err)
        setError('Failed to fetch maintainers')
      }
    }
    fetchData()
  }, [dispatch])

  const handleCheckboxChange = (user) => {
    setSelectedUser(user)
  }

  const handleScheduleChange = (field, value, type) => {
    if (type === 'preferredAccessTimes') {
      setSchedule((prevSchedule) => ({ ...prevSchedule, [field]: value }))
    } else if (type === 'estimatedCompletionTime') {
      setEstimatedCompletion((prevCompletion) => ({ ...prevCompletion, [field]: value }))
    }
  }

  const handleAssignUsers = useCallback(
    async (e) => {
      e.preventDefault() // Prevent default form submission

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
        // const assignedMaintainer = maintainers.find((user) => user._id === selectedUsers[0]);  // No need to find again, already selected
        const preferredAccessTimes = new Date(`${schedule.date}T${schedule.time}`)
        const estimatedCompletionTime = new Date(
          `${estimatedCompletion.date}T${estimatedCompletion.time}`,
        )

        const updatedData = {
          assignedMaintainer: selectedUser._id,
          scheduledDate: preferredAccessTimes.toISOString(),
          estimatedCompletionTime: estimatedCompletionTime.toISOString(),
          // status: 'In Progress',
        }
        await onAssign(maintenance._id, updatedData)
        navigate('/maintenance')
        setSelectedUser(null)
        setSchedule({ date: '', time: '' })
        setEstimatedCompletion({ date: '', time: '' })
        setError(null)
      } catch (error) {
        setError('Failed to assign users with a schedule.')
        console.error('Assign error:', error)
      }
    },
    [
      maintenance,
      selectedUser,
      schedule,
      navigate,
      onAssign,
      estimatedCompletion,
    ], //selectedUser is replaced by User ID
  )

  const handleClose = useCallback(() => {
    navigate('/maintenance')
    setSelectedUser(null)
    setSchedule({ date: '', time: '' })
    setEstimatedCompletion({ date: '', time: '' })
    setError(null)
  }, [navigate])

  const filteredMaintainers = useMemo(
    () =>
      maintainers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [maintainers, searchTerm],
  )

  const totalPages = Math.ceil(filteredMaintainers.length / itemsPerPage)
  const paginatedMaintainers = filteredMaintainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="maintenance-assign-container">
      <div className="text-center mt-4">
        <h2 className="assign-title">Assign User to Maintenance Request</h2>
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
      <div className="search-container mb-3">
        <div className={`search-box ${isSearchExpanded ? 'expanded' : ''}`}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchClick} />
          <CFormInput
            type="text"
            placeholder="Search maintainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            ref={searchInputRef}
          />
        </div>
      </div>
      <div className="form-container mb-4">
        <CForm onSubmit={handleAssignUsers}>
          <CRow className="">
            <CCol md={6}>
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
            <CCol md={6}>
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
          <CRow className="">
            <CCol md={6}>
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
            <CCol md={6}>
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
                    <CTableDataCell colSpan="4">Loading maintainers...</CTableDataCell>
                  </CTableRow>
                )}
                {!loading &&
                  paginatedMaintainers.map((user) => {
                    const isSelected = selectedUser?._id === user._id
                    const isDisabled = selectedUser !== null && selectedUser._id !== user._id

                    return (
                      <CTableRow
                        key={user._id}
                        className={`user-row ${isDisabled ? 'blurred-row' : ''}`}
                      >
                        <CTableDataCell>
                          <CFormCheck
                            className="user-checkbox"
                            id={`user-checkbox-${user._id}`}
                            onChange={() => handleCheckboxChange(user)}
                            checked={isSelected}
                            disabled={isDisabled}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{user.role}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                {!loading && paginatedMaintainers.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan="4">No maintainers found.</CTableDataCell>
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
          <div className="button-container d-flex justify-content-end mt-4 gap-2 w-75 mx-auto">
            <CButton color="secondary" onClick={handleClose} className="cancel-button">
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

export default MaintenanceAssign