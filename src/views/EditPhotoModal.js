import React, { useState, useRef, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput } from '@coreui/react';
import placeholder from '../image/placeholder.png';

const EditPhotoModal = ({ visible, setVisible, admin, onSavePhoto, isLoading, error }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(placeholder);

  useEffect(() => {
    // Set the preview to the current admin photo if it exists, or to the placeholder
    setPreviewUrl(admin?.photo ? `http://localhost:4000/api/v1/users/${admin._id}/photo` : placeholder);
    setSelectedFile(null); // Reset selected file when admin changes
  }, [admin]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file under 5MB');
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSavePhoto(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      setVisible(false);
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle>Edit Photo</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        <img src={previewUrl} className="me-2"  alt="Admin" style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }} />
        <CButton color="dark" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
          Select Photo
        </CButton>
        <CFormInput
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {error && <div className="text-danger mt-2">{error}</div>}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={!selectedFile || isLoading}>
          {isLoading ? 'Uploading...' : 'Save Photo'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditPhotoModal;
