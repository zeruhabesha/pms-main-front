import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
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
        <div className="row g-3">
          {/* Basic Information */}
          <div className="col-md-6">
            <h6>Basic Information</h6>
            <dl className="row">
              <dt className="col-sm-4">Tenant</dt>
              <dd className="col-sm-8">{agreement.tenant || "N/A"}</dd>

              <dt className="col-sm-4">Property</dt>
              <dd className="col-sm-8">{agreement.property || "N/A"}</dd>

              <dt className="col-sm-4">Lease Period</dt>
              <dd className="col-sm-8">
                {formatDate(agreement.leaseStart)} - {formatDate(agreement.leaseEnd)}
              </dd>
            </dl>
          </div>

          {/* Financial Details */}
          <div className="col-md-6">
            <h6>Financial Details</h6>
            <dl className="row">
              <dt className="col-sm-4">Rent Amount</dt>
              <dd className="col-sm-8">{formatCurrency(agreement.rentAmount)}</dd>

              <dt className="col-sm-4">Security Deposit</dt>
              <dd className="col-sm-8">{formatCurrency(agreement.securityDeposit)}</dd>
            </dl>
          </div>

          {/* Payment Terms */}
          <div className="col-12">
            <h6>Payment Terms</h6>
            <dl className="row">
              <dt className="col-sm-2">Due Date</dt>
              <dd className="col-sm-10">{agreement.paymentTerms?.dueDate || "N/A"}</dd>

              <dt className="col-sm-2">Method</dt>
              <dd className="col-sm-10">{agreement.paymentTerms?.paymentMethod || "N/A"}</dd>
            </dl>
          </div>

          {/* Additional Details */}
          <div className="col-12">
            <h6>Additional Details</h6>
            <dl className="row">
              <dt className="col-sm-2">Occupants</dt>
              <dd className="col-sm-10">
                {agreement.additionalOccupants?.length
                  ? agreement.additionalOccupants.join(", ")
                  : "None"}
              </dd>

              <dt className="col-sm-2">Utilities</dt>
              <dd className="col-sm-10">{agreement.utilitiesAndServices || "None"}</dd>
            </dl>
          </div>

          {/* Rules and Conditions */}
          <div className="col-12">
            <h6>Rules and Conditions</h6>
            <p className="mb-0">{agreement.rulesAndConditions || "None"}</p>
          </div>

          {/* Documents */}
          {agreement.documents?.length > 0 && (
            <div className="col-12">
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
        </div>
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
