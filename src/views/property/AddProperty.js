import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addProperty, updateProperty } from '../../api/actions/PropertyAction';
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
import { decryptData } from '../../api/utils/crypto';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const MAX_PHOTOS = 5;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddProperty = ({ visible, setVisible, editingProperty = {} }) => {
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

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.property);

  useEffect(() => {
    if (editingProperty?.id || editingProperty?._id) {
      setFormData({
        ...editingProperty,
        amenities: Array.isArray(editingProperty.amenities)
          ? editingProperty.amenities.join(', ')
          : '',
        photos: editingProperty.photos || [],
      });
    } else {
      setFormData(initialState);
    }
  }, [editingProperty]);

  useEffect(() => {
    if (error) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
      setIsSubmitting(false);
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.numberOfUnits || isNaN(formData.numberOfUnits) || Number(formData.numberOfUnits) <= 0) {
      newErrors.numberOfUnits = 'Valid number of units is required';
    }
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const sanitizedValue = type === 'number' ? (value ? Number(value) : '') : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validatePhoto = (file) => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_PHOTOS) {
      setErrors((prev) => ({ ...prev, photos: `Maximum ${MAX_PHOTOS} photos allowed` }));
      return;
    }

    for (const file of files) {
      const error = validatePhoto(file);
      if (error) {
        setErrors((prev) => ({ ...prev, photos: error }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, photos: files }));
    setErrors((prev) => ({ ...prev, photos: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const encryptedUser = localStorage.getItem('user');
      const user = decryptData(encryptedUser);
      const adminId = user?.registeredBy;

      if (!adminId) {
        setErrors({ general: 'Admin ID is missing. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      const propertyData = {
        ...formData,
        amenities: formData.amenities.split(',').map((item) => item.trim()),
        admin: adminId,
      };

      if (editingProperty?._id || editingProperty?.id) {
        await dispatch(updateProperty({ id: editingProperty._id || editingProperty.id, propertyData })).unwrap();
      } else {
        await dispatch(addProperty(propertyData)).unwrap();
      }

      setVisible(false);
      setFormData(initialState);
    } catch (err) {
      setErrors({ general: err.message || 'Failed to save property' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    setVisible(false);
  };

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingProperty?._id || editingProperty?.id ? 'Edit Property' : 'Add Property'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {errors.general && (
              <CAlert color="danger" className="mb-4">
                {errors.general}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit} noValidate>
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
      <option value="">Select Property Type</option>
      {PROPERTY_TYPES.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </CFormSelect>
    {errors.propertyType && <div className="invalid-feedback d-block">{errors.propertyType}</div>}
  </CCol>

  <CCol xs={12}>
    <CFormLabel htmlFor="floorPlan">Floor Plan</CFormLabel>
    <CFormInput
      type="text"
      id="floorPlan"
      name="floorPlan"
      value={formData.floorPlan}
      onChange={handleInputChange}
      placeholder="Enter Floor Plan URL (optional)"
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
      placeholder="Enter Amenities, separated by commas"
    />
  </CCol>

  <CCol xs={12}>
    <CFormLabel htmlFor="photos">Photos (Max 5)</CFormLabel>
    <CFormInput
      type="file"
      id="photos"
      name="photos"
      multiple
      accept="image/*"
      onChange={handlePhotoUpload}
    />
    {errors.photos && <div className="invalid-feedback d-block">{errors.photos}</div>}
  </CCol>
</CRow>

              <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading
                    ? editingProperty?._id || editingProperty?.id
                      ? 'Updating...'
                      : 'Adding...'
                    : editingProperty?._id || editingProperty?.id
                    ? 'Update Property'
                    : 'Add Property'}
                </CButton>
              </CModalFooter>
            </CForm>
          </CCardBody>
        </CCard>
      </CModalBody>
    </CModal>
  );
};

AddProperty.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  editingProperty: PropTypes.object,
};

export default AddProperty;
