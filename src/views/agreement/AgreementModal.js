import React from "react";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from "@coreui/react";
import PropTypes from "prop-types";

const AgreementDocModal = ({ visible, onClose, documents = [] }) => (
  <CModal visible={visible} onClose={onClose}>
    <CModalHeader closeButton>
      <h5>Agreement Documents</h5>
    </CModalHeader>
    <CModalBody>
      {documents.length > 0 ? (
        <ul className="list-group">
          {documents.map((doc, idx) => {
            const docUrl = doc.url || "#";
            const docName = doc.name || `Document ${idx + 1}`;
            const docType = doc.type || "Download";

            return (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${docName}`}
                  className="text-decoration-none text-dark"
                >
                  {docName}
                </a>
                <span className="badge bg-dark rounded-pill">{docType}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center text-muted">
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

AgreementDocModal.propTypes = {
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

export default AgreementDocModal;
