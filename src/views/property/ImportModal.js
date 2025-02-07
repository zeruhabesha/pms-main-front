import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importProperties } from "../../api/actions/PropertyAction";
import { toast } from "react-toastify";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CFormInput,
  CForm,
  CAlert,
} from "@coreui/react";

const ImportModal = ({ visible, onClose }) => {
  const [file, setFile] = useState(null); // Keep the file state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the File object directly
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file); // Append actual file

      console.log("Uploading file:", file.name);

      const response = await dispatch(importProperties(formData)).unwrap();

      if (response.properties && Array.isArray(response.properties)) {
        // Assuming response contains { properties: [], success: boolean, message: string }
        toast.success("Properties imported successfully!");
        setFile(null); // reset if succes
      } else {
        setError(
          response.message || "Import failed. Check the file format and data."
        ); // error should show error response (check console on fetch properties with filter)
      }
      onClose();

      setLoading(false); // update for both ontry!! catch - this why has always final on call!!! its import for error to ensure can perform next
    } catch (err) {
      console.error("Import error:", err); //error and log - must use!!! error has more check then message!!! error should come has error and stack where it coming, not always error msg
      setError(
        err.message || "Import failed. Please check the file and try again."
      );

      setLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Import Properties</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm>
          <CFormInput
            type="file"
            accept=".xlsx, .xls"
            label="Choose Excel File"
            onChange={handleFileChange}
          />
          <CButton
            className="mt-3"
            color="primary"
            onClick={handleImport}
            disabled={loading}
          >
            {loading ? "Importing..." : "Import"}
          </CButton>
        </CForm>
      </CModalBody>
    </CModal>
  );
};

export default ImportModal;
