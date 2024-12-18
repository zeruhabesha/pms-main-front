import React, { useState, useCallback } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateProperty } from '../../api/actions/PropertyAction';
// import './AddImage.css'; // Import custom styles

const AddImage = ({
  visible,
  onClose,
  propertyId,
  propertyTitle,
  propertyType,
}) => {
  const dispatch = useDispatch();
  const [newImageFile, setNewImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useSelector((state) => state.property);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFile(files);
  };

  const handleAddImageSubmit = async (e) => {
    e.preventDefault();
  
    if (!newImageFile || !propertyId) {
      setErrors({ general: 'No file selected or invalid property data.' });
      return;
    }
  
    try {
      const formData = new FormData();
      newImageFile.forEach((file) => formData.append('photos', file)); // Add photos
      formData.append('title', propertyTitle); // Add title
      formData.append('propertyType', propertyType); // Add property type
  
      setIsSubmitting(true);
  
      // Send request
      await dispatch(updateProperty({ id: propertyId, propertyData: formData })).unwrap();
  
      setNewImageFile(null);
      onClose();
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update photo' });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleCancel = useCallback(() => {
    setNewImageFile(null);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <div className={`custom-modal ${visible ? 'slide-in' : 'slide-out'}`}>
      <CModal visible={visible} onClose={handleCancel} backdrop="static">
        <CModalHeader>
          <CModalTitle>Add New Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          <CForm onSubmit={handleAddImageSubmit}>
            <CFormLabel htmlFor="photos">Photos (Max 5)</CFormLabel>
            <CFormInput
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <div className="mt-3 d-flex justify-content-end">
              <CButton color="secondary" onClick={handleCancel}>
                Cancel
              </CButton>
              <CButton
                color="primary"
                className="ms-2"
                type="submit"
                disabled={isSubmitting || loading}
              >
                Upload
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  );
};

AddImage.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  propertyId: PropTypes.string.isRequired,
  propertyTitle: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default AddImage;
