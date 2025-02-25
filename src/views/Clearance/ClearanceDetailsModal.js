// ClearanceDetailsModal.js
import React, { useState, useEffect } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CButton,
    CTable, CTableRow, CTableHeaderCell, CTableDataCell,
    CTableHead, CTableBody, CModalFooter
} from '@coreui/react';
import { useDispatch } from 'react-redux';
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
import { fetchClearanceById } from "../../api/actions/ClearanceAction";

const ClearanceDetailsModal = ({ visible, setVisible, selectedClearanceData }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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

    return (
        <CModal size="lg" visible={visible} onClose={handleCloseModal}>
            <CModalHeader>
                <CModalTitle>Clearance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {loading ? (
                    <p>Loading...</p>
                ) : (selectedClearanceData) ? (
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
                                <CTableDataCell>{selectedClearanceData?.tenant?.tenantName || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Contact Email:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.contactInformation?.email || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Contact Phone:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.contactInformation?.phoneNumber || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Status:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.status || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Created At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(selectedClearanceData?.tenant?.createdAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Updated At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(selectedClearanceData?.tenant?.updatedAt) || 'N/A'}</CTableDataCell>
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
                                <CTableDataCell>{formatDate(selectedClearanceData?.tenant?.leaseAgreement?.startDate) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilCalendar} className="me-1" />Lease End Date:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(selectedClearanceData?.tenant?.leaseAgreement?.endDate) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilMoney} className="me-1" />Rent Amount:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.leaseAgreement?.rentAmount || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilMoney} className="me-1" />Security Deposit:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.leaseAgreement?.securityDeposit || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilDescription} className="me-1" />Special Terms:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.tenant?.leaseAgreement?.specialTerms || 'N/A'}</CTableDataCell>
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
                                <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Title:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.property?.title || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Address:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.property?.address || 'N/A'}</CTableDataCell>
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
                                <CTableDataCell>{formatDate(selectedClearanceData?.moveOutDate) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Status:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.status || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Inspection Status:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.inspectionStatus || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilDescription} className="me-1" />Notes:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.notes || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Created At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(selectedClearanceData?.createdAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilClock} className="me-1" />Updated At:</strong></CTableDataCell>
                                <CTableDataCell>{formatDate(selectedClearanceData?.updatedAt) || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilUser} className="me-1" />Approved By:</strong></CTableDataCell>
                                <CTableDataCell>{selectedClearanceData?.approvedBy?.name || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                ) : (
                    <p>
                        {
                            (!loading) ? "No clearance request found." : ""
                        }
                    </p>
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