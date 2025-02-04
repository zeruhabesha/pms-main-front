import React, { useState, useEffect, useRef } from 'react';
import {
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CButton,
    CSpinner,
} from '@coreui/react';
import { toast } from 'react-toastify';
import './PermissionsModal.scss';
import httpCommon from "../../api/http-common";

const PermissionsModal = ({ visible, user, onClose, handleSavePermissions }) => {
    const [permissions, setPermissions] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef(null); // Ref for the modal container


    useEffect(() => {
        if (user) {
            fetchPermissions();
        }
    }, [user]);


    const fetchPermissions = async () => {
        try {
            const response = await httpCommon.get(`/users/${user._id}/permissions`);
            const defaultPermissions = {
                addProperty: false,
                editProperty: false,
                deleteProperty: false,
                viewProperty: false,
                editPropertyPhotos: false,
                addTenant: false,
                editTenant: false,
                deleteTenant: false,
                editTenantPhotos: false,
                addAgreement: false,
                editAgreement: false,
                deleteAgreement: false,
                downloadAgreement: false,
                // addMaintenanceRecord: false,
                // editMaintenance: false,
                // deleteMaintenance: false,
            };

            setPermissions({ ...defaultPermissions, ...(response.data.data.permissions || {}) });
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            toast.error('Failed to load user permissions.');
        }
    };

    const handleSwitchChange = (permissionKey) => (e) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionKey]: e.target.checked,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await handleSavePermissions(user._id, permissions);
            toast.success('Permissions updated successfully!');
            onClose();
        } catch (error) {
            console.error('Save error:', error);
            if (error.response?.status === 403) {
                toast.error('You do not have the necessary permissions to perform this action.');
            } else {
                toast.error(error.message || 'Failed to update permissions');
            }
        } finally {
            setIsSaving(false);
        }
    };

   // Custom onClose handler that only triggers when the backdrop is clicked.
    const handleModalClose = (e) => {
      // Check if the click occurred on the modal backdrop itself (the area outside the modal content).
      if (modalRef.current && e.target === modalRef.current) {
        onClose(); // Only close if the backdrop was clicked.
      }
    };

    const permissionGroups = {
        properties: {
            title: 'Properties Management',
            icon: '🏠',
            permissions: {
                addProperty: 'Add Property',
                editProperty: 'Edit Property',
                deleteProperty: 'Delete Property',
                viewProperty: 'View Property',
                editPropertyPhotos: 'Edit Property Photos',
            },
        },
        tenants: {
            title: 'Tenants Management',
            icon: '👥',
            permissions: {
                addTenant: 'Add Tenant',
                editTenant: 'Edit Tenant',
                deleteTenant: 'Delete Tenant',
                editTenantPhotos: 'Edit Tenant Photos',
            },
        },
        agreements: {
            title: 'Agreements Management',
            icon: '📄',
            permissions: {
                addAgreement: 'Add Agreement',
                editAgreement: 'Edit Agreement',
                deleteAgreement: 'Delete Agreement',
                downloadAgreement: 'Download Agreement',
            },
        },
        // maintenance: {
        //   title: 'Maintenance Management',
        //   icon: '🔧',
        //   permissions: {
        //     addMaintenanceRecord: 'Add Maintenance',
        //     editMaintenance: 'Edit Maintenance',
        //     deleteMaintenance: 'Delete Maintenance',
        //   },
        // },
    };

    return (
       <CModal
          visible={visible}
          onClose={onClose}
          size="lg"
          backdrop="static" // Prevent closing when clicking outside the modal
          keyboard={false} // Prevent closing with the Escape key
        >
            <CModalHeader>
                <CModalTitle>Permissions for {user?.name}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div className="permissions-container">
                    <div className="user-info">
                        <span className="user-role">Role: {user?.role || 'N/A'}</span>
                    </div>
                    {Object.entries(permissionGroups).map(([groupKey, group]) => (
                        <div key={groupKey} className="permission-group">
                            <div className="group-header">
                                <span className="group-icon">{group.icon}</span>
                                <h3 className="group-title">{group.title}</h3>
                            </div>
                            <div className="switches-grid">
                                {Object.entries(group.permissions).map(([permKey, label]) => (
                                    <div key={permKey} className="switch-container">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={permissions[permKey] || false}
                                                onChange={handleSwitchChange(permKey)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                        <span className="switch-label">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose} disabled={isSaving}>
                    Cancel
                </CButton>
                <CButton color="dark" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <CSpinner size="sm" /> : 'Save Changes'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default PermissionsModal;