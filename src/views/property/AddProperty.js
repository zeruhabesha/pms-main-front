import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addProperty, updateProperty } from '../../api/actions/PropertyAction';
import {
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
    CContainer,
} from '@coreui/react';
import { decryptData } from '../../api/utils/crypto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';


const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
];

const MAX_PHOTOS = 5;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddProperty = () => {
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
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
      const { error, loading } = useSelector((state) => state.property);
    const editingProperty = useSelector((state) => state.property.selectedProperty); // access selected property from state

      useEffect(() => {
          if (editingProperty && (editingProperty.id || editingProperty._id)) {
            const {
                amenities = '', // Ensure default to empty string
                description = '', // Ensure default to empty string
                rentPrice = '', // Ensure default to empty string
                numberOfUnits = '',// Ensure default to empty string
                ...property
              } = editingProperty;
              const normalizedAmenities = Array.isArray(amenities) ? amenities.join(', ') : amenities;
               setFormData({
                    ...initialState,
                    ...property,
                    amenities: normalizedAmenities,
                    description,
                    rentPrice,
                    numberOfUnits,
                 });
          } else {
               setFormData(initialState);
          }
    }, [editingProperty, id]);

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
            setErrors((prev) => ({
                ...prev,
                photos: `You can upload a maximum of ${MAX_PHOTOS} photos.`,
            }));
            e.target.value = null;
            return;
        }

        const newPhotos = [];
        let hasError = false;

        for (const file of files) {
            const validationError = validatePhoto(file);
            if (validationError) {
                setErrors((prev) => ({ ...prev, photos: validationError }));
                hasError = true;
                break;
            }
            newPhotos.push(file);
        }

        if (!hasError) {
            setSelectedPhotos((prev) => [...prev, ...newPhotos]);
            setErrors((prev) => ({ ...prev, photos: '' }));
        } else {
             setSelectedPhotos([])
             e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const encryptedUser = localStorage.getItem('user');
            const user = decryptData(encryptedUser);
            const adminId = user?.registeredBy;

            if (!adminId) {
                setErrors({ general: 'Admin ID is missing. Please try again.' });
                 setIsSubmitting(false);
                 return;
            }

          const propertyData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'amenities') {
                    const amenitiesArray = formData[key]
                        ? formData[key].split(',').map((item) => item.trim())
                        : [];
                         amenitiesArray.forEach((amenity, index) => {
                             propertyData.append(`amenities[${index}]`, amenity);
                         })
                  } else if (key !== 'photos') {
                         propertyData.append(key, formData[key]);
                     }
                });
             selectedPhotos.forEach((photo, index) => {
                 propertyData.append(`photos[${index}]`, photo)
            });

            propertyData.append('admin', adminId);
            if (editingProperty && (editingProperty?._id || editingProperty?.id)) {
                 await dispatch(updateProperty({ id: editingProperty._id || editingProperty.id, propertyData })).unwrap();
             } else {
                 await dispatch(addProperty(propertyData)).unwrap();
            }

           toast.success(
                editingProperty?._id || editingProperty?.id
                     ? 'Property updated successfully'
                     : 'Property added successfully'
             );
           navigate('/property');

       } catch (err) {
            setErrors({ general: err.message || 'Failed to save property' });
             toast.error(err.message || 'Failed to save property');
        } finally {
             setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialState);
        setErrors({});
         setSelectedPhotos([]);
         navigate('/property');
    };

    return (
        <CContainer>
                <CRow className="justify-content-center">
                    <CCol xs={12} >
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
                                        {errors.description && (
                                            <div className="invalid-feedback d-block">
                                                {errors.description}
                                            </div>
                                        )}
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
                                        {errors.address && (
                                            <div className="invalid-feedback d-block">
                                                {errors.address}
                                            </div>
                                        )}
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
                                        {errors.price && (
                                            <div className="invalid-feedback d-block">
                                                {errors.price}
                                            </div>
                                        )}
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
                                            {errors.numberOfUnits && (
                                                 <div className="invalid-feedback d-block">
                                                       {errors.numberOfUnits}
                                                  </div>
                                            )}
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
                                        {errors.propertyType && (
                                            <div className="invalid-feedback d-block">
                                                {errors.propertyType}
                                            </div>
                                        )}
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
                                            invalid={!!errors.photos}
                                         />
                                         {errors.photos && <div className="invalid-feedback d-block">{errors.photos}</div>}
                                    </CCol>
                                </CRow>
                                <div className='mt-4 d-flex justify-content-end gap-2'>
                                     <CButton color="secondary" onClick={handleCancel}>
                                        Cancel
                                    </CButton>
                                <CButton color="dark" type="submit" disabled={isSubmitting || loading}>
                                       {isSubmitting || loading
                                            ? editingProperty?._id || editingProperty?.id
                                                ? 'Updating...'
                                                : 'Adding...'
                                            : editingProperty?._id || editingProperty?.id
                                                ? 'Update Property'
                                                : 'Add Property'}
                                    </CButton>
                              </div>
                            </CForm>
                            </CCardBody>
                         </CCard>
                </CCol>
            </CRow>
             <ToastContainer position="top-right" autoClose={3000} />
        </CContainer>
    );
};
AddProperty.propTypes = {
    // visible: PropTypes.bool.isRequired,
    // setVisible: PropTypes.func.isRequired,
    // editingProperty: PropTypes.object,
};


export default AddProperty;