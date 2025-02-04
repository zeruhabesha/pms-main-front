import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { importProperties } from '../../api/actions/PropertyAction';
import { toast } from 'react-toastify';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CButton,
    CFormInput,
    CForm,
    CAlert
} from '@coreui/react';

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
            setError('Please select a file to import.');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('file', file); // Append actual file
    
            console.log("Uploading file:", file.name);
    
            const response = await dispatch(importProperties(formData)).unwrap();
    
            if (response.success) {
                toast.success('Properties imported successfully!');
                setImportModalVisible(false);
                onClose(); // Close the modal on success
            } else {
                setError(response.message || 'Failed to import properties.');
            }
        } catch (err) {
            setError(err.message || 'Failed to import properties.');
        } finally {
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
                    <CButton className="mt-3" color="primary" onClick={handleImport} disabled={loading}>
                        {loading ? 'Importing...' : 'Import'}
                    </CButton>
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default ImportModal;
