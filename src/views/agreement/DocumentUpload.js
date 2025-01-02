import React from "react";
import PropTypes from "prop-types";
import { CCol, CFormInput, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const DocumentUpload = ({ formData, fileErrors, handleFileChange, handleRemoveDocument }) => {
  const onFileChange = (e) => {
    handleFileChange(Array.from(e.target.files));
  };

  return (
    <CCol xs={12} className="form-group">
      <label>Upload Documents</label>
      <CFormInput
        type="file"
        multiple
        accept="application/pdf,image/jpeg,image/png"
        onChange={onFileChange}
        className="form-control-animation"
      />
      {fileErrors.length > 0 && (
        <ul className="text-danger mt-2">
          {fileErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {formData.documents.length > 0 && (
        <ul className="mt-2">
          {formData.documents.map((file, index) => (
            <li key={index} className="d-flex align-items-center">
              {file.name || "Existing Document"}
              <CButton
                color="light"
                style={{ color: "red" }}
                size="sm"
                className="ms-2"
                onClick={() => handleRemoveDocument(index)}
                title="Remove Document"
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </li>
          ))}
        </ul>
      )}
    </CCol>
  );
};

DocumentUpload.propTypes = {
  formData: PropTypes.object.isRequired,
  fileErrors: PropTypes.array.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleRemoveDocument: PropTypes.func.isRequired,
};

export default DocumentUpload;
