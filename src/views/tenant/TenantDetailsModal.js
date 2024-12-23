import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CButton,
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
} from '@coreui/react';
import PropTypes from 'prop-types';

const TenantDetailsModal = ({ visible, setVisible, tenantDetails }) => {
    const handleClose = () => {
        setVisible(false);
    };

    if (!tenantDetails) return null;

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader onClose={handleClose}>
                <CModalTitle>Tenant Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
               <CTable bordered hover responsive>
                    <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong>Tenant Name:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails?.tenantName || "N/A"}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Email:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.contactInformation?.email || "N/A"}</CTableDataCell>
                            </CTableRow>
                           <CTableRow>
                                <CTableDataCell><strong>Phone Number:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.contactInformation?.phoneNumber || "N/A"}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong>Address:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.contactInformation?.address || "N/A"}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Start Date:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.leaseAgreement?.startDate || "N/A"}</CTableDataCell>
                           </CTableRow>
                           <CTableRow>
                              <CTableDataCell><strong>End Date:</strong></CTableDataCell>
                                 <CTableDataCell>{tenantDetails.leaseAgreement?.endDate || "N/A"}</CTableDataCell>
                          </CTableRow>
                           <CTableRow>
                               <CTableDataCell><strong>Security Deposit:</strong></CTableDataCell>
                                <CTableDataCell>${tenantDetails.leaseAgreement?.securityDeposit || "N/A"}</CTableDataCell>
                            </CTableRow>
                             <CTableRow>
                                <CTableDataCell><strong>Rent Amount:</strong></CTableDataCell>
                               <CTableDataCell>${tenantDetails.leaseAgreement?.rentAmount || "N/A"}</CTableDataCell>
                           </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Payment Frequency:</strong></CTableDataCell>
                                <CTableDataCell>{tenantDetails.leaseAgreement?.paymentFrequency || "N/A"}</CTableDataCell>
                            </CTableRow>
                    </CTableBody>
                </CTable>

                <div className="mt-3 d-flex justify-content-end">
                    <CButton color="secondary" onClick={handleClose}>
                        Close
                    </CButton>
                </div>
            </CModalBody>
        </CModal>
    );
};

TenantDetailsModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    tenantDetails: PropTypes.shape({
        tenantName: PropTypes.string,
        contactInformation: PropTypes.shape({
            email: PropTypes.string,
            phoneNumber: PropTypes.string,
            address: PropTypes.string,
        }),
        leaseAgreement: PropTypes.shape({
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            securityDeposit: PropTypes.number,
            rentAmount: PropTypes.number,
            paymentFrequency: PropTypes.string,
        }),
    }),
};

export default TenantDetailsModal;