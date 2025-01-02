import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CForm,
    CFormTextarea,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CInputGroup,
    CFormSelect,
    CAlert,
    CSpinner,
    CFormInput,
} from '@coreui/react';
import { addComplaint, updateComplaint } from '../../api/actions/ComplaintAction';
import PropertySelect from './PropertySelect';
import { decryptData } from '../../api/utils/crypto';

const ComplaintModal = ({ visible, setVisible, editingComplaint = null }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { tenants } = useSelector((state) => state.tenant);
    const { user } = useSelector((state) => state.auth);
    const [complaintData, setComplaintData] = useState({
        tenant: '',
        property: '',
        complaintType: 'Noise',
        description: '',
        status: 'Pending',
        priority: 'Low',
        supportingFiles: [],
        feedback: '',
    });
    const [tenantName, setTenantName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Set initial tenant based on logged-in user from Redux state
         if (user?.id) {
             const decryptedUserId = decryptData(localStorage.user?._id);
            const tenant = tenants?.find(t => t._id === decryptedUserId);

            setComplaintData((prev) => ({
                ...prev,
                tenant: decryptedUserId,
            }));
             setTenantName(tenant?.name || '');
        }

        // Set complaint data for editing mode
        if (editingComplaint) {
            setComplaintData({
                tenant: editingComplaint?.tenant?._id || '',
                property: editingComplaint?.property?._id || '',
                complaintType: editingComplaint?.complaintType || 'Noise',
                description: editingComplaint?.description || '',
                status: editingComplaint?.status || 'Pending',
                priority: editingComplaint?.priority || 'Low',
                supportingFiles: [],
                feedback: editingComplaint?.feedback || '',
            });

            const tenant = tenants?.find(t => t._id === editingComplaint?.tenant?._id);
            setTenantName(tenant?.name || '');
        } else {
            setComplaintData((prev) => ({
                ...prev,
                property: '',
                complaintType: 'Noise',
                description: '',
                status: 'Pending',
                priority: 'Low',
                supportingFiles: [],
                feedback: '',
            }));
            setTenantName('');
        }

        setErrorMessage('');
    }, [dispatch, editingComplaint, user, tenants]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setComplaintData((prev) => ({
                ...prev,
                supportingFiles: Array.from(files),
            }));
        } else {
            setComplaintData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!complaintData.tenant || !complaintData.property || !complaintData.description) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            for (const key in complaintData) {
                if (key === 'supportingFiles' && complaintData.supportingFiles.length > 0) {
                    complaintData.supportingFiles.forEach((file) => {
                        formData.append('supportingFiles', file);
                    });
                } else {
                    formData.append(key, complaintData[key]);
                }
            }

            if (editingComplaint && editingComplaint._id) {
                await dispatch(updateComplaint({ id: editingComplaint._id, complaintData: formData })).unwrap();
            } else {
                await dispatch(addComplaint(formData)).unwrap();
            }

            handleClose();
        } catch (error) {
            setErrorMessage(error.message || 'Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
         setComplaintData({
            tenant: user?.id ? decryptData(user?.id) : '',
            property: '',
            complaintType: 'Noise',
            description: '',
            status: 'Pending',
            priority: 'Low',
            supportingFiles: [],
            feedback: '',
        });
        setTenantName('');
        setErrorMessage('');
        setVisible(false);
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader className="bg-dark text-white">
                <CModalTitle>{editingComplaint ? 'Edit Complaint' : 'Add Complaint'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCard className="border-0 shadow-sm">
                    <CCardBody>
                        {errorMessage && (
                            <CAlert color="danger" className="mb-4">
                                {errorMessage}
                            </CAlert>
                        )}
                        <CForm>
                            <CRow className="g-4">
                                <CCol xs={12}>
                                    <CFormInput
                                        label="Tenant"
                                        name="tenant"
                                        value={tenantName}
                                        disabled
                                        required
                                    />
                                </CCol>
                                <CCol xs={12}>
                                    <PropertySelect
                                        value={complaintData.property}
                                        onChange={handleChange}
                                        required
                                    />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormSelect
                                        name="complaintType"
                                        value={complaintData.complaintType}
                                        onChange={handleChange}
                                    >
                                        <option value="Noise">Noise</option>
                                        <option value="Property Damage">Property Damage</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Harassment">Harassment</option>
                                        <option value="Other">Other</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup>
                                        <CFormTextarea
                                            name="description"
                                            value={complaintData.description}
                                            onChange={handleChange}
                                            placeholder="Enter Complaint Description"
                                            required
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormSelect
                                        name="priority"
                                        value={complaintData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput
                                        type="file"
                                        name="supportingFiles"
                                        multiple
                                        onChange={handleChange}
                                    />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CModalBody>
            <CModalFooter className="border-top-0">
                <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </CButton>
                <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <CSpinner size="sm" className="me-2" />
                            {editingComplaint ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        editingComplaint ? 'Update Complaint' : 'Add Complaint'
                    )}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ComplaintModal;