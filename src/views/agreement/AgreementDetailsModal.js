import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';
import PropTypes from 'prop-types';
import {
    cilMoney,
    cilSettings,
    cilDescription,
    cilPeople,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';


const AgreementDetailsModal = ({ visible, onClose, agreement }) => {
    if (!agreement) return null;

    return (
        <CModal visible={visible} onClose={onClose} alignment="center" backdrop="static">
            <CModalHeader onClose={onClose}>
                <CModalTitle>Agreement Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
               <CTable bordered hover responsive>
                     <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Detail</CTableHeaderCell>
                            <CTableHeaderCell>Value</CTableHeaderCell>
                       </CTableRow>
                   </CTableHead>
                     <CTableBody>
                         <CTableRow>
                              <CTableDataCell><strong><CIcon icon={cilMoney} className="me-1" /> Security Deposit:</strong></CTableDataCell>
                             <CTableDataCell>${agreement.securityDeposit || "N/A"}</CTableDataCell>
                        </CTableRow>
                          <CTableRow>
                             <CTableDataCell><strong> <CIcon icon={cilSettings} className="me-1" /> Payment Terms:</strong></CTableDataCell>
                              <CTableDataCell>
                                 {agreement.paymentTerms?.dueDate || "N/A"} - {agreement.paymentTerms?.paymentMethod || "N/A"}
                           </CTableDataCell>
                        </CTableRow>
                          <CTableRow>
                             <CTableDataCell><strong> <CIcon icon={cilDescription} className="me-1" /> Rules and Conditions:</strong></CTableDataCell>
                            <CTableDataCell>{agreement.rulesAndConditions || "N/A"}</CTableDataCell>
                           </CTableRow>
                           <CTableRow>
                             <CTableDataCell><strong><CIcon icon={cilPeople} className="me-1" /> Additional Occupants:</strong></CTableDataCell>
                               <CTableDataCell>
                                {agreement.additionalOccupants?.join(", ") || "None"}
                                </CTableDataCell>
                           </CTableRow>
                           <CTableRow>
                               <CTableDataCell><strong> <CIcon icon={cilSettings} className="me-1" /> Utilities and Services:</strong></CTableDataCell>
                               <CTableDataCell>{agreement.utilitiesAndServices || "N/A"}</CTableDataCell>
                         </CTableRow>
                    </CTableBody>
                 </CTable>
                 <div className="mt-3 d-flex justify-content-end">
                        <CButton color="secondary" onClick={onClose}>
                            Close
                         </CButton>
                    </div>
            </CModalBody>
        </CModal>
    );
};

AgreementDetailsModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    agreement: PropTypes.shape({
        securityDeposit: PropTypes.number,
        paymentTerms: PropTypes.shape({
            dueDate: PropTypes.string,
            paymentMethod: PropTypes.string,
        }),
        rulesAndConditions: PropTypes.string,
        additionalOccupants: PropTypes.arrayOf(PropTypes.string),
        utilitiesAndServices: PropTypes.string,
    }),
};

export default AgreementDetailsModal;