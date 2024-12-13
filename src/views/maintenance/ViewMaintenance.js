import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../../api/actions/MaintenanceActions';
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
import { decryptData } from '../../api/utils/crypto';

const ViewMaintenance = () => {
  const dispatch = useDispatch();
  const {
    maintenanceRequests,
    loading,
    error,
    totalPages,
    totalMaintenanceRequests,
    currentPage,
  } = useSelector((state) => state.maintenance);

  const [searchTerm, setSearchTerm] = useState('');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
  const [tenantRequestVisible, setTenantRequestVisible] = useState(false);
  const itemsPerPage = 5;

  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      if (decryptedUser && decryptedUser.permissions) {
        setUserPermissions(decryptedUser.permissions);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchMaintenance({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(fetchMaintenance({ page, limit: itemsPerPage, search: searchTerm }));
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
    if (maintenanceToDelete?._id) {
      await dispatch(deleteMaintenance(maintenanceToDelete._id));
      setDeleteModalVisible(false);
    }
  };

  const handleUpdateMaintenance = async (formData) => {
    if (editingMaintenance?._id) {
      await dispatch(updateMaintenance({ id: editingMaintenance._id, maintenanceData: formData }));
      setEditModalVisible(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingMaintenance?._id) {
      await dispatch(updateMaintenance({ id: editingMaintenance._id, maintenanceData: formData }));
    } else {
      await dispatch(addMaintenance(formData));
    }
    setTenantRequestVisible(false);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Maintenance Records</strong>
            {userPermissions?.addMaintenanceRecord && (
              <div id="container">
                <button
                  className="learn-more"
                  onClick={() => setTenantRequestVisible(true)}
                >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            {loading ? (
              <CSpinner />
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : maintenanceRequests.length > 0 ? (
              <MaintenanceTable
                maintenanceList={maintenanceRequests}
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
        visible={tenantRequestVisible}
        setVisible={setTenantRequestVisible}
        onSubmit={handleFormSubmit}
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
