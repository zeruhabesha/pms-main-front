import React from "react";
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from "@coreui/react";
import PropTypes from "prop-types";

const AgreementDetails = ({ visible, onClose, agreement }) => {
    if (!agreement) return null;

    const formatCurrency = (value) =>
        value !== undefined && value !== null ? `$${value.toFixed(2)}` : "N/A";

    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toLocaleDateString() : "N/A";

    return (
        <CModal visible={visible} onClose={onClose} size="lg" aria-labelledby="agreement-details-modal">
            <CModalHeader closeButton>
                <CModalTitle id="agreement-details-modal">Agreement Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CTable bordered hover responsive>
                      <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}><h6>Basic Information</h6></CTableHeaderCell>
                             </CTableRow>
                        </CTableHead>
                     <CTableBody>
                          <CTableRow>
                               <CTableDataCell><strong>Tenant:</strong></CTableDataCell>
                               <CTableDataCell>{agreement.tenant || "N/A"}</CTableDataCell>
                          </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Property:</strong></CTableDataCell>
                                <CTableDataCell>{agreement.property || "N/A"}</CTableDataCell>
                           </CTableRow>
                           <CTableRow>
                               <CTableDataCell><strong>Lease Period:</strong></CTableDataCell>
                                <CTableDataCell>
                                     {formatDate(agreement.leaseStart)} - {formatDate(agreement.leaseEnd)}
                                </CTableDataCell>
                          </CTableRow>
                    </CTableBody>

                    <CTableHead>
                        <CTableRow>
                             <CTableHeaderCell colSpan={2}><h6>Financial Details</h6></CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                   <CTableBody>
                     <CTableRow>
                           <CTableDataCell><strong>Rent Amount:</strong></CTableDataCell>
                               <CTableDataCell>{formatCurrency(agreement.rentAmount)}</CTableDataCell>
                         </CTableRow>
                           <CTableRow>
                           <CTableDataCell> <strong>Security Deposit:</strong> </CTableDataCell>
                                 <CTableDataCell>{formatCurrency(agreement.securityDeposit)}</CTableDataCell>
                          </CTableRow>
                    </CTableBody>
                 <CTableHead>
                        <CTableRow>
                             <CTableHeaderCell colSpan={2}><h6>Payment Terms</h6></CTableHeaderCell>
                       </CTableRow>
                    </CTableHead>
                   <CTableBody>
                       <CTableRow>
                            <CTableDataCell><strong>Due Date:</strong></CTableDataCell>
                                <CTableDataCell>{agreement.paymentTerms?.dueDate || "N/A"}</CTableDataCell>
                       </CTableRow>
                        <CTableRow>
                           <CTableDataCell><strong>Method:</strong></CTableDataCell>
                              <CTableDataCell>{agreement.paymentTerms?.paymentMethod || "N/A"}</CTableDataCell>
                        </CTableRow>
                   </CTableBody>

                   <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell colSpan={2}> <h6>Additional Details</h6></CTableHeaderCell>
                       </CTableRow>
                   </CTableHead>
                    <CTableBody>
                           <CTableRow>
                                <CTableDataCell><strong>Occupants:</strong></CTableDataCell>
                                 <CTableDataCell>
                                     {agreement.additionalOccupants?.length
                                         ? agreement.additionalOccupants.join(", ")
                                         : "None"}
                                 </CTableDataCell>
                             </CTableRow>
                             <CTableRow>
                              <CTableDataCell> <strong>Utilities:</strong> </CTableDataCell>
                                  <CTableDataCell>{agreement.utilitiesAndServices || "None"}</CTableDataCell>
                            </CTableRow>
                   </CTableBody>

                     <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell colSpan={2}><h6>Rules and Conditions</h6></CTableHeaderCell>
                         </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow>
                             <CTableDataCell colSpan={2}>{agreement.rulesAndConditions || "None"}</CTableDataCell>
                            </CTableRow>
                     </CTableBody>
                </CTable>

                    {/* Documents Section */}
                    {agreement.documents?.length > 0 && (
                      <div className="mt-3">
                        <h6>Documents</h6>
                        <div className="list-group">
                          {agreement.documents.map((doc, idx) => (
                             <a
                                key={idx}
                                href={doc}
                                className="list-group-item list-group-item-action"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Download Document ${idx + 1}`}
                            >
                                Document {idx + 1}
                            </a>
                          ))}
                     </div>
                  </div>
              )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

AgreementDetails.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    agreement: PropTypes.shape({
        tenant: PropTypes.string,
        property: PropTypes.string,
        leaseStart: PropTypes.string,
        leaseEnd: PropTypes.string,
        rentAmount: PropTypes.number,
        securityDeposit: PropTypes.number,
        paymentTerms: PropTypes.shape({
            dueDate: PropTypes.string,
            paymentMethod: PropTypes.string,
        }),
        rulesAndConditions: PropTypes.string,
        additionalOccupants: PropTypes.arrayOf(PropTypes.string),
        utilitiesAndServices: PropTypes.string,
        documents: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default AgreementDetails;