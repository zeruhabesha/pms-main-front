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
  CButton
} from '@coreui/react';
import { fetchUsers } from '../../api/actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MaintenanceAssign = ({ maintenance, onAssign }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
       dispatch(fetchUsers());
  }, [dispatch]);


  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

    const handleAssignUsers = useCallback(async () => {
        if (selectedUsers.length === 0) {
            setError('Please select at least one user.');
            return;
        }
        try {
            await onAssign(maintenance._id, selectedUsers);
             navigate('/maintenances');
             setSelectedUsers([])
             setError(null)
        }
        catch(error) {
           setError('Failed to assign users');
           console.error('Assign error:', error)
        }

    }, [maintenance, selectedUsers, navigate, onAssign])
    
     const handleClose = useCallback(() => {
        navigate('/maintenance');
         setSelectedUsers([])
         setError(null)
    }, [navigate]);

  return (
    <div>
        <div className="text-center mt-4">
            <h2>Assign Users to Maintenance Request</h2>
        </div>
        <div className="d-flex justify-content-center">
           {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}
        <CTable striped hover className="">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Select</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users?.map((user) => (
              <CTableRow key={user._id}>
                <CTableDataCell>
                  <CFormCheck
                    id={`user-checkbox-${user._id}`}
                    onChange={() => handleCheckboxChange(user._id)}
                    checked={selectedUsers.includes(user._id)}
                  />
                </CTableDataCell>
                <CTableDataCell>{user.firstName} {user.lastName}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
         </div>
          <div className="d-flex justify-content-end mt-4 gap-2 w-75 mx-auto">
              <CButton color="secondary" onClick={handleClose}>
                  Cancel
              </CButton>
              <CButton color="primary" onClick={handleAssignUsers}>
                  Assign
              </CButton>
          </div>
    </div>
  );
};

export default MaintenanceAssign;