import React, { useState } from 'react';
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
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { uploadSuperAdminPhoto } from '../../api/actions/superAdminActions';

const SuperAdminPhotoModal = ({ visible, setVisible, editingSuperAdmin, handleSave }) => {
  const dispatch = useDispatch();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedPhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handlePhotoSave = async () => {
    if (editingSuperAdmin && selectedPhoto) {
      try {
        const formData = new FormData();
        formData.append('photo', selectedPhoto);

        await dispatch(uploadSuperAdminPhoto({ id: editingSuperAdmin._id, photo: formData })).unwrap();
        handleSave();
        setVisible(false);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      alignment="center"
      backdrop="static"
      className="shadow-lg"
    >
      <CModalHeader className="bg-light border-bottom border-2">
        <CModalTitle className="h4 fw-bold text-dark">Update Photo</CModalTitle>
      </CModalHeader>
      
      <CModalBody className="p-4">
        <CContainer>
          <div className="mb-4">
            <CFormLabel htmlFor="photoUpload" className="form-label fw-semibold mb-2">
              Upload New Photo
            </CFormLabel>
            <CFormInput
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control-lg"
            />
          </div>

          {previewUrl && (
            <CCard className="mt-3 border-0 shadow-sm">
              <CCardImage
                orientation="top"
                src={previewUrl}
                className="img-fluid rounded"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            </CCard>
          )}
        </CContainer>
      </CModalBody>

      <CModalFooter className="bg-light border-top border-2">
        <CButton 
          color="dark"
          variant="outline"
          onClick={() => setVisible(false)}
          className="px-4 me-2"
        >
          Cancel
        </CButton>
        <CButton 
          color="dark"
          onClick={handlePhotoSave}
          className="px-4"
          disabled={!selectedPhoto}
        >
          Save Photo
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SuperAdminPhotoModal;