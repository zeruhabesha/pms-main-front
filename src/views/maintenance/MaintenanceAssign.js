import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from '@coreui/react';
import { fetchMaintainers } from '../../api/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MaintenanceAssign.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const MaintenanceAssign = ({ maintenance, onAssign }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);
  const { maintainers = [], loading, error: fetchError } = useSelector(
    (state) => state.user
  );

  const itemsPerPage = 5; // Adjust the number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchMaintainers({ page: 1, limit: 50 })); // Fetch a larger list to enable pagination
      } catch (err) {
        console.error('Error fetching maintainers:', err);
        setError('Failed to fetch maintainers');
      }
    };
    fetchData();
  }, [dispatch]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId) ? [] : [userId] // Toggle selection
    );
  };

  const handleScheduleChange = (field, value) => {
    setSchedule((prevSchedule) => ({ ...prevSchedule, [field]: value }));
  };

  const handleAssignUsers = useCallback(async () => {
    if (selectedUsers.length !== 1) {
      setError('Please select exactly one user to assign.');
      return;
    }

    if (!schedule.date || !schedule.time) {
      setError('Please provide both a date and time for the schedule.');
      return;
    }

    try {
      const assignedTo = maintainers.find((user) => user._id === selectedUsers[0]);
      const preferredAccessTimes = `${schedule.date}T${schedule.time}`;
      const updatedData = {
        assignedTo: assignedTo.name,
        preferredAccessTimes,
        status: 'In Progress',
      };

      await onAssign(maintenance._id, updatedData);
      navigate('/maintenance');
      setSelectedUsers([]);
      setSchedule({ date: '', time: '' });
      setError(null);
    } catch (error) {
      setError('Failed to assign users with a schedule.');
      console.error('Assign error:', error);
    }
  }, [maintenance, selectedUsers, schedule, navigate, onAssign, maintainers]);

  const handleClose = useCallback(() => {
    navigate('/maintenance');
    setSelectedUsers([]);
    setSchedule({ date: '', time: '' });
    setError(null);
  }, [navigate]);

  // Filter maintainers based on search term
  const filteredMaintainers = maintainers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered maintainers
  const totalPages = Math.ceil(filteredMaintainers.length / itemsPerPage);
  const paginatedMaintainers = filteredMaintainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    const handleSearchClick = () => {
        setIsSearchExpanded(!isSearchExpanded);
        if (!isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

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
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="schedule-date">Schedule Date</CFormLabel>
              <CFormInput
                type="date"
                id="schedule-date"
                value={schedule.date}
                onChange={(e) => handleScheduleChange('date', e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="schedule-time">Schedule Time</CFormLabel>
              <CFormInput
                type="time"
                id="schedule-time"
                value={schedule.time}
                onChange={(e) => handleScheduleChange('time', e.target.value)}
                required
              />
            </CCol>
          </CRow>
        </CForm>
      </div>
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
                const isSelected = selectedUsers.includes(user._id);
                const isDisabled = selectedUsers.length > 0 && !isSelected;

                return (
                  <CTableRow
                    key={user._id}
                    className={`user-row ${isDisabled ? 'blurred-row' : ''}`}
                  >
                    <CTableDataCell>
                      <CFormCheck
                         className="user-checkbox"
                        id={`user-checkbox-${user._id}`}
                        onChange={() => handleCheckboxChange(user._id)}
                        checked={isSelected}
                        disabled={isDisabled && !isSelected}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                  </CTableRow>
                );
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
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
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
        <CButton color="dark" onClick={handleAssignUsers} className="assign-button">
          Assign
        </CButton>
      </div>
    </div>
  );
};

export default MaintenanceAssign;