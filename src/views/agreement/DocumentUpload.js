import React from "react";
import { CCol, CFormInput, CAlert, CButton } from "@coreui/react";
import PropTypes from "prop-types";

const DocumentUpload = ({
  formData,
  fileErrors = [],
  handleFileChange,
  handleRemoveDocument,
}) => {
  return (
    <CCol xs={12} className="mb-3">
      <CFormInput
        type="file"
        label="Upload Documents"
        multiple
        onChange={(e) => handleFileChange(Array.from(e.target.files))}
      />
      {fileErrors.length > 0 && (
        <CAlert color="danger" className="mt-2">
          {fileErrors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </CAlert>
      )}
      <ul className="list-unstyled mt-3">
        {formData.documents.map((doc, idx) => (
          <li key={idx} className="d-flex align-items-center mb-2">
            <span>{doc.name || doc}</span>
            <CButton
              color="danger"
              size="sm"
              onClick={() => handleRemoveDocument(idx)}
              className="ms-3"
            >
              Remove
            </CButton>
          </li>
        ))}
      </ul>
    </CCol>
  );
};

DocumentUpload.propTypes = {
  formData: PropTypes.shape({
    documents: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string }),
      ])
    ).isRequired,
  }).isRequired,
  fileErrors: PropTypes.arrayOf(PropTypes.string),
  handleFileChange: PropTypes.func.isRequired,
  handleRemoveDocument: PropTypes.func.isRequired,
};

DocumentUpload.defaultProps = {
  fileErrors: [],
};

export default DocumentUpload;
