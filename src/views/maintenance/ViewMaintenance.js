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
} from '@coreui/react';
import MaintenanceDetailsModal from './MaintenanceDetailsModal';
import MaintenanceTable from './MaintenanceTable';
import MaintenanceProfessionalForm from './MaintenanceProfessionalForm';
import TenantRequestForm from './TenantRequestForm';
import MaintenanceDeleteModal from './MaintenanceDeleteModal';
import MaintenanceEditForm from './MaintenanceEditForm';
import '../Super.scss';

const ViewMaintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalMaintenanceRequests, setTotalMaintenanceRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
  const [tenantRequestVisible, setTenantRequestVisible] = useState(false); // Track TenantRequestForm visibility
  const itemsPerPage = 5;

  const fetchMaintenance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://pms-backend-sncw.onrender.com/api/v1//maintenances', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm },
      });
      const { maintenanceRequests = [], totalPages = 0, totalMaintenanceRequests = 0 } =
        response.data?.data || {};

      setMaintenanceList(maintenanceRequests);
      setTotalPages(totalPages);
      setTotalMaintenanceRequests(totalMaintenanceRequests);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setDetailsModalVisible(true);
  };

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance);
    setEditModalVisible(true);
  };

  const handleDelete = (maintenance) => {
    setMaintenanceToDelete(maintenance);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!maintenanceToDelete?._id) return;

    try {
      await axios.delete(`https://pms-backend-sncw.onrender.com/api/v1//maintenances/${maintenanceToDelete._id}`);
      fetchMaintenance();
      setDeleteModalVisible(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete maintenance record.');
    }
  };

  const handleUpdateMaintenance = async (formData) => {
    try {
      await axios.put(
        `https://pms-backend-sncw.onrender.com/api/v1//maintenances/${editingMaintenance._id}`,
        formData
      );
      fetchMaintenance();
      setEditModalVisible(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update maintenance record.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMaintenance?._id) {
        await axios.put(
          `https://pms-backend-sncw.onrender.com/api/v1//maintenances/${editingMaintenance._id}`,
          formData
        );
      } else {
        await axios.post('https://pms-backend-sncw.onrender.com/api/v1//maintenances', formData);
      }
      fetchMaintenance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit maintenance form.');
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Maintenance Records</strong>
            <div id="container">
              <button
                className="learn-more"
                onClick={() => setTenantRequestVisible(true)} // Open TenantRequestForm
              >
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
              placeholder="Search by tenant name or maintenance type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            {loading ? (
              <CSpinner />
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : maintenanceList.length > 0 ? (
              <MaintenanceTable
                maintenanceList={maintenanceList}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleViewDetails={handleViewDetails}
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
        visible={detailsModalVisible}
        setVisible={setDetailsModalVisible}
        maintenance={selectedMaintenance}
      />

      <MaintenanceEditForm
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        maintenance={editingMaintenance}
        onSubmit={handleUpdateMaintenance}
      />

      <MaintenanceProfessionalForm
        visible={false}
        setVisible={() => {}}
        editingMaintenance={null}
        onSubmit={handleFormSubmit}
      />

      <TenantRequestForm
        visible={tenantRequestVisible} // Control visibility
        setVisible={setTenantRequestVisible} // Pass setter
        onSubmit={() => setTenantRequestVisible(false)} // Close modal on submit
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
