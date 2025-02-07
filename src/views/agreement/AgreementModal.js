// src/views/agreement/AgreementModal.js
import React from "react";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from "@coreui/react";
import PropTypes from "prop-types";

const AgreementModal = ({ visible, onClose, documents = [] }) => (
  <CModal visible={visible} onClose={onClose} size="lg" aria-labelledby="agreement-documents-modal">
    <CModalHeader closeButton>
      <h5 id="agreement-documents-modal">Agreement Documents</h5>
    </CModalHeader>
    <CModalBody>
      {documents && documents.length > 0 ? ( // Check if documents exists before accessing length
        <div className="list-group">
          {documents.map((doc, idx) => {
            // Assuming doc is the file path from backend, construct download URL
            const docUrl = `/lease/download/${doc}`; // Use backend download endpoint
            const docName = doc.split('/').pop() || `Document ${idx + 1}`; // Extract filename
            const docType = doc.split('.').pop().toUpperCase() || "File"; // Extract file extension

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
  documents: PropTypes.arrayOf(PropTypes.string), // documents are now expected to be array of strings (file paths)
};

AgreementModal.defaultProps = {
  documents: [],
};

export default AgreementModal;