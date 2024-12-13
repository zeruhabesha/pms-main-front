import React from "react";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from "@coreui/react";
import PropTypes from "prop-types";

const AgreementModal = ({ visible, onClose, documents = [] }) => (
  <CModal visible={visible} onClose={onClose} size="lg" aria-labelledby="agreement-documents-modal">
    <CModalHeader closeButton>
      <h5 id="agreement-documents-modal">Agreement Documents</h5>
    </CModalHeader>
    <CModalBody>
      {documents.length > 0 ? (
        <div className="list-group">
          {documents.map((doc, idx) => {
            const docUrl = doc.url || "#";
            const docName = doc.name || `Document ${idx + 1}`;
            const docType = doc.type || "Download";

            return (
              <a
                key={idx}
                href={docUrl}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${docName}`}
              >
                {docName}
                <span className="badge bg-dark rounded-pill">{docType}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted py-3">
          No documents available for this agreement.
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

AgreementModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired, // Ensure URL is provided
      name: PropTypes.string,           // Optional: Display name
      type: PropTypes.string,           // Optional: Document type
    })
  ),
};

AgreementModal.defaultProps = {
  documents: [],
};

export default AgreementModal;
