import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel,
  CCard,
  CCardImage,
  CContainer,
  CAlert,
} from '@coreui/react';
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import './TenantPhotoModal.scss'; // We'll create this file next
import { uploadUserPhoto } from '../../api/actions/userActions';

const TenantPhotoModal = ({ visible, setVisible, tenant, handleSave }) => {
  const dispatch = useDispatch();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedPhoto(null);
      setPreviewUrl(tenant?.photoUrl || null);
      setErrorMessage('');
    } else if (tenant?.photoUrl) {
      setPreviewUrl(tenant.photoUrl);
    }
  }, [visible, tenant]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5 MB.');
        return;
      }

      setSelectedPhoto(file);
      setErrorMessage('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = async () => {
    if (!selectedPhoto) {
      setErrorMessage('Please select a photo to upload.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      await dispatch(uploadUserPhoto({ 
        id: tenant._id, 
        photo: selectedPhoto // Send the file directly
      })).unwrap();
      
      toast.success('Photo updated successfully');
      handleSave();
      setVisible(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to upload photo');
      toast.error('Failed to update photo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      alignment="center"
      backdrop="static"
      className="tenant-photo-modal"
    >
      <CModalHeader>
        <CModalTitle>Update Tenant Photo</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CContainer>
          {errorMessage && (
            <CAlert color="danger" dismissible>
              {errorMessage}
            </CAlert>
          )}
          
          <div className="upload-section">
            <CFormLabel htmlFor="photoUpload" className="upload-label">
              {previewUrl ? 'Change Photo' : 'Select Photo'}
            </CFormLabel>
            <div className="upload-wrapper">
              <CFormInput
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handleFileChange}
                className="photo-input"
              />
            </div>
          </div>

          <div className="preview-section">
            {previewUrl ? (
              <CCard className="preview-card">
                <CCardImage
                  src={previewUrl}
                  className="preview-image"
                />
              </CCard>
            ) : (
              <div className="no-preview">
                <i className="fas fa-user-circle"></i>
                <p>No photo selected</p>
              </div>
            )}
          </div>
        </CContainer>
      </CModalBody>

      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => setVisible(false)}
          className="btn-cancel"
        >
          Cancel
        </CButton>
        <CButton
          color="dark"
          onClick={handlePhotoSave}
          disabled={!selectedPhoto || isLoading}
          className="btn-save"
        >
          {isLoading ? 'Uploading...' : 'Save Photo'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TenantPhotoModal;