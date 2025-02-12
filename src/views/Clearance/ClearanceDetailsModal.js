// ClearanceDetailsModal.js
import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CButton,
    CTable, CTableRow, CTableHeaderCell, CTableDataCell,
    CTableHead, CTableBody,CModalFooter 
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { fetchTenantById } from '../../api/actions/TenantActions';
import propertyService from '../../api/services/property.service';
import clearanceService from '../../api/services/clearance.service' // Import the clearance service
import { CIcon } from '@coreui/icons-react';
import {
    cilUser,
    cilHome,
    cilCalendar,
    cilDescription,
    cilInfo,
    cilMoney,
    cilClock
} from '@coreui/icons';
import { format } from 'date-fns';

const ClearanceDetailsModal = ({ visible, setVisible, tenantId }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [tenantDetails, setTenantDetails] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [existingClearance, setExistingClearance] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return 'N/A';
        }
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    useEffect(() => {
        const fetchTenantAndClearance = async () => {
            setLoading(true);
            try {
                const tenantResponse = await dispatch(fetchTenantById(tenantId)).unwrap();
                setTenantDetails(tenantResponse);
                const allProperties = await propertyService.getProperties();
                const associatedProperty = allProperties.find(
                    (property) => property._id === tenantResponse?.propertyInformation?.propertyId
                );
                setSelectedProperty(associatedProperty);

                const existingClearanceResponse = await clearanceService.fetchClearances(1, 1, '', '', tenantId);

                if (existingClearanceResponse && existingClearanceResponse.data && existingClearanceResponse.data.clearances && existingClearanceResponse.data.clearances.length > 0) {
                    setExistingClearance(existingClearanceResponse.data.clearances[0]);
                } else {
                    setExistingClearance(null);
                }

            } catch (error) {
                console.error('Error fetching tenant, properties, or clearance:', error);
            } finally {
                setLoading(false);
            }
        };

        if (visible && tenantId) {
            fetchTenantAndClearance();
        }
    }, [visible, tenantId, dispatch]);

    return (
        <CModal size="lg" visible={visible} onClose={handleCloseModal}>
            <CModalHeader>
                <CModalTitle>Clearance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {loading ? (
                    <p>Loading...</p>
                ) : tenantDetails && (
                    <CTable bordered hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                    <h5>Tenant Information</h5>
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilUser} className="me-1" />Tenant Name:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.tenantName || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Contact Email:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.contactInformation?.email || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Contact Phone:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.contactInformation?.phoneNumber || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Status:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.status || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Created At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(tenantDetails?.createdAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Updated At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(tenantDetails?.updatedAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>

                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                    <h5>Lease Agreement</h5>
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilCalendar} className="me-1" />Lease Start Date:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(tenantDetails?.leaseAgreement?.startDate) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilCalendar} className="me-1" />Lease End Date:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(tenantDetails?.leaseAgreement?.endDate) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilMoney} className="me-1" />Rent Amount:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.leaseAgreement?.rentAmount || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilMoney} className="me-1" />Security Deposit:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.leaseAgreement?.securityDeposit || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilDescription} className="me-1" />Special Terms:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.leaseAgreement?.specialTerms || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>

                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                    <h5>Property Information</h5>
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Unit:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.propertyInformation?.unit || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Title:</strong></CTableDataCell>
                                <CTableDataCell>{selectedProperty?.title || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>

                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                    <h5>Clearance Request</h5>
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilCalendar} className="me-1" />Move Out Date:</strong></CTableDataCell>
                                <CTableDataCell>{existingClearance ? formatDate(existingClearance.moveOutDate) : 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Status:</strong></CTableDataCell>
                                <CTableDataCell>{existingClearance?.status || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Inspection Status:</strong></CTableDataCell>
                                <CTableDataCell>{existingClearance?.inspectionStatus || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilDescription} className="me-1" />Notes:</strong></CTableDataCell>
                                <CTableDataCell>{existingClearance?.notes || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Created At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(existingClearance?.createdAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Updated At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(existingClearance?.updatedAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ClearanceDetailsModal;