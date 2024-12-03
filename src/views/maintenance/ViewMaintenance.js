import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CSpinner,
  CButton,
} from '@coreui/react';
import MaintenanceDetailsModal from './MaintenanceDetailsModal'; // Import the modal
import MaintenanceTable from './MaintenanceTable';
import MaintenanceProfessionalForm from './MaintenanceProfessionalForm';
import TenantRequestForm from './TenantRequestForm';
import MaintenanceDeleteModal from './MaintenanceDeleteModal';
import '../Super.scss';

const ViewMaintenance = () => {
  const [expandedRows, setExpandedRows] = useState({}); // State for expanded rows
  const [tenantRequestVisible, setTenantRequestVisible] = useState(false); // Fix for tenantRequestVisible
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalMaintenanceRequests, setTotalMaintenanceRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
  const [maintenanceFormVisible, setMaintenanceFormVisible] = useState(false);

  const itemsPerPage = 5;
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const handleViewDetails = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setDetailsModalVisible(true);
  };
  const fetchMaintenance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:4000/api/v1/maintenances', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm },
      });
      console.log('API Response:', response.data); // Debugging log
      const { maintenanceRequests = [], totalPages = 0, totalMaintenanceRequests = 0 } = response.data?.data || {};
  
      // Ensure maintenanceRequests have valid _id
      const validMaintenanceRequests = maintenanceRequests.map((item) => ({
        ...item,
        _id: item._id || item.id, // Use fallback if _id is missing
      }));
  
      setMaintenance(validMaintenanceRequests);
      setTotalPages(totalPages);
      setTotalMaintenanceRequests(totalMaintenanceRequests);
    } catch (err) {
      console.error('Error fetching maintenance records:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch maintenance records.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expansion state for the given row ID
    }));
  };

  useEffect(() => {
    fetchMaintenance();
  }, [currentPage, searchTerm]);

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance || null);
    setMaintenanceFormVisible(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMaintenance?._id) {
        await axios.put(`http://localhost:4000/api/v1/maintenances/${editingMaintenance._id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/v1/maintenances', formData);
      }
      fetchMaintenance();
      setMaintenanceFormVisible(false);
    } catch (error) {
      console.error('Failed to submit maintenance form:', error.message);
      setError(error.response?.data?.message || 'Failed to submit the form.');
    }
  };
  

  const openDeleteModal = (maintenance) => {
    if (!maintenance || !maintenance._id) {
      console.error('Invalid maintenance object:', maintenance); // Debugging log
      return;
    }
    setMaintenanceToDelete(maintenance);
    setDeleteModalVisible(true);
  };
  

  const confirmDelete = async () => {
    console.log('maintenanceToDelete:', maintenanceToDelete); // Debugging log
  
    if (!maintenanceToDelete?._id) {
      console.error('Invalid maintenance ID'); // Debugging log
      return;
    }
  
    try {
      console.log('Deleting maintenance:', maintenanceToDelete); // Debugging log
      await axios.delete(`http://localhost:4000/api/v1/maintenances/${maintenanceToDelete._id}`);
      fetchMaintenance();
      setDeleteModalVisible(false);
    } catch (err) {
      console.error('Failed to delete maintenance record:', err.message);
      setError(err.response?.data?.message || 'Failed to delete maintenance record.');
    }
  };
  
  
  

  const handleAddMaintenance = () => {
    setEditingMaintenance(null);
    setMaintenanceFormVisible(true);
  };
  const handleAddTenantRequest = () => {
    setTenantRequestVisible(true); // Open Tenant Request Modal
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Maintenance Records</strong>
            <div>
              {/* <button className="learn-more" onClick={handleAddMaintenance}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Maintenance Record</span>
              </button> */}
              <button className="learn-more" onClick={handleAddTenantRequest}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Request</span>
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              type="text"
              placeholder="Search by title or maintenance type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            {loading ? (
              <CSpinner />
            ) : error ? (
              <div className="text-danger">Error: {error}</div>
            ) : maintenance.length > 0 ? (
              <MaintenanceTable
              maintenanceList={maintenance}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
              onViewDetails={handleViewDetails} // Pass the onViewDetails function
            />
            ) : (
              <div className="text-center text-muted">No maintenance records found.</div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <MaintenanceDetailsModal
        visible={detailsModalVisible}
        setVisible={setDetailsModalVisible}
        maintenance={selectedMaintenance}
      />

      <MaintenanceProfessionalForm
        visible={maintenanceFormVisible}
        setVisible={setMaintenanceFormVisible}
        editingMaintenance={editingMaintenance}
        onSubmit={handleFormSubmit}
      />

<TenantRequestForm
  visible={tenantRequestVisible}
  setVisible={setTenantRequestVisible}
  onSubmit={(data) => {
    console.log('Submitted Tenant Request:', data); // Debug log
    setTenantRequestVisible(false);
  }}
  editingRequest={null}
/>

      <MaintenanceDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        maintenanceToDelete={maintenanceToDelete}
        confirmDelete={confirmDelete}
      />
    </CRow>
  );
};

export default ViewMaintenance;
