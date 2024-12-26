import React, { useState, useEffect, useCallback } from 'react';
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
} from '@coreui/react';
import { fetchMaintainers } from '../../api/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MaintenanceAssign.scss';

const MaintenanceAssign = ({ maintenance, onAssign }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  const [error, setError] = useState(null);
  const { maintainers, loading, error: fetchError } = useSelector((state) => state.user);

  // Fetch maintainers when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchMaintainers({ page: 1, limit: 10, searchTerm: '' }));
      } catch (err) {
        console.error('Error fetching maintainers:', err);
        setError('Failed to fetch maintainers');
      }
    };

    fetchData();
  }, [dispatch]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers([userId]); // Allow only one user to be assigned
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
      const updatedMaintenance = {
        assignedTo: assignedTo.name,
        preferredAccessTimes,
        status: 'In Progress',
      };

      await onAssign(maintenance._id, updatedMaintenance);
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
              maintainers?.map((user) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>
                    <CFormCheck
                      id={`user-checkbox-${user._id}`}
                      onChange={() => handleCheckboxChange(user._id)}
                      checked={selectedUsers.includes(user._id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                </CTableRow>
              ))}
            {!loading && maintainers.length === 0 && (
              <CTableRow>
                <CTableDataCell colSpan="4">No maintainers found.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
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
