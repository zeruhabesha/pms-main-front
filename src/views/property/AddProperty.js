import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CAlert,
} from '@coreui/react';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const AddProperty = ({ visible, setVisible, editingProperty, refreshProperties }) => {
  const initialState = {
    title: '',
    description: '',
    address: '',
    price: '',
    rentPrice: '',
    numberOfUnits: '',
    propertyType: '',
    floorPlan: '',
    amenities: '',
    photos: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        ...editingProperty,
        amenities: editingProperty.amenities?.join(', ') || '',
        photos: editingProperty.photos || [],
      });
    } else {
      setFormData(initialState);
    }
    setErrorMessage('');
  }, [editingProperty]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.numberOfUnits || formData.numberOfUnits <= 0) newErrors.numberOfUnits = 'Valid number of units is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors((prev) => ({ ...prev, photos: 'Maximum 5 photos allowed' }));
      return;
    }
    setFormData((prev) => ({ ...prev, photos: files }));
    setErrors((prev) => ({ ...prev, photos: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
  
    try {
      const propertyData = {
        ...formData,
        amenities: formData.amenities.split(',').map((item) => item.trim()),
      };
  
      const formDataToSend = new FormData();
      for (const key in propertyData) {
        if (key === 'photos') {
          propertyData.photos.forEach((photo) => formDataToSend.append('photos', photo));
        } else {
          formDataToSend.append(key, propertyData[key]);
        }
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${yourAccessToken}`, // Replace with your actual token
          'Content-Type': 'multipart/form-data',
        },
      };
  
      if (editingProperty) {
        await axios.put(`http://localhost:4000/api/v1/properties/${editingProperty._id}`, formDataToSend, config);
      } else {
        await axios.post('http://localhost:4000/api/v1/properties', formDataToSend, config);
      }
  
      setVisible(false);
      refreshProperties();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    setErrorMessage('');
    setVisible(false);
  };

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingProperty ? 'Edit Property' : 'Add Property'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-4">
                <CCol xs={12}>
                  <CFormLabel htmlFor="title">Title</CFormLabel>
                  <CFormInput
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    invalid={!!errors.title}
                    placeholder="Enter Property Title"
                  />
                  {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    invalid={!!errors.description}
                    placeholder="Enter Property Description"
                    rows={4}
                  />
                  {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="address">Address</CFormLabel>
                  <CFormInput
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    invalid={!!errors.address}
                    placeholder="Enter Property Address"
                  />
                  {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="price">Price</CFormLabel>
                  <CFormInput
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    invalid={!!errors.price}
                    placeholder="Enter Price"
                  />
                  {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="rentPrice">Rent Price (optional)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="rentPrice"
                    name="rentPrice"
                    value={formData.rentPrice}
                    onChange={handleInputChange}
                    placeholder="Enter Rent Price"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="numberOfUnits">Number of Units</CFormLabel>
                  <CFormInput
                    type="number"
                    id="numberOfUnits"
                    name="numberOfUnits"
                    value={formData.numberOfUnits}
                    onChange={handleInputChange}
                    invalid={!!errors.numberOfUnits}
                    placeholder="Enter Number of Units"
                  />
                  {errors.numberOfUnits && <div className="invalid-feedback d-block">{errors.numberOfUnits}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="propertyType">Property Type</CFormLabel>
                  <CFormSelect
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    invalid={!!errors.propertyType}
                  >
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.propertyType && <div className="invalid-feedback d-block">{errors.propertyType}</div>}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="floorPlan">Floor Plan (optional)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="floorPlan"
                    name="floorPlan"
                    value={formData.floorPlan}
                    onChange={handleInputChange}
                    placeholder="Enter Floor Plan URL or Description"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="amenities">Amenities</CFormLabel>
                  <CFormInput
                    type="text"
                    id="amenities"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="Enter amenities, separated by commas"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="photos">Photos (max 5)</CFormLabel>
                  <CFormInput
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    invalid={!!errors.photos}
                  />
                  {errors.photos && <div className="invalid-feedback d-block">{errors.photos}</div>}
                </CCol>
              </CRow>
              <CModalFooter className="border-top-0">
                <CButton color="secondary" variant="" onClick={handleClose}>
                  Cancel
                </CButton>
                <CButton color="dark" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : editingProperty ? 'Update Property' : 'Add Property'}
                </CButton>
              </CModalFooter>
            </CForm>
          </CCardBody>
        </CCard>
      </CModalBody>
    </CModal>
  );
};

export default AddProperty;
