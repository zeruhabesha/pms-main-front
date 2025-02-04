// src/components/property/AddProperty.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProperty, updateProperty, getProperty } from '../../api/actions/PropertyAction';
import {
    CForm,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CRow,
    CCol,
    CButton,
    CCard,
    CCardBody,
    CAlert,
    CContainer,
    CInputGroup,
    CInputGroupText,
    CFormInput,
} from '@coreui/react';
import { decryptData } from '../../api/utils/crypto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
    cilHome,
    cilDescription,
    cilLocationPin,
    cilMoney,
    cilBuilding,
    cilList,
    cilImage,
    cilTags,
    cilMap,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'condominium', label: 'Condominium' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Office' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'retail', label: 'Retail' },
    { value: 'farm', label: 'Farm' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'studio', label: 'Studio' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'mobile_home', label: 'Mobile Home' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'resort', label: 'Resort' },
    { value: 'motel', label: 'Motel' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'mixed_use', label: 'Mixed Use' },
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
    const editingProperty = useSelector((state) => state.property.selectedProperty);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (id) { // Check if ID exists, indicating edit mode
            setIsEditMode(true);
            dispatch(getProperty(id)); // Fetch property data by ID
        } else {
            setIsEditMode(false);
            setFormData(initialState);
            // dispatch(clearSelectedProperty()); // Clear selected property when not in edit mode
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (editingProperty) {
            const {
                amenities = [], // Ensure amenities is initialized as an array
                description = '',
                rentPrice = '',
                numberOfUnits = '',
                floorPlan = '',
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
                floorPlan,
            });
            setSelectedPhotos([]); // Optionally clear selected photos in edit mode if needed, or handle existing photos display
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
        if (
            !formData.numberOfUnits ||
            isNaN(formData.numberOfUnits) ||
            Number(formData.numberOfUnits) <= 0
        ) {
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
            return;
        }

        const validFiles = files.filter((file) => {
            const error = validatePhoto(file);
            if (error) {
                setErrors((prev) => ({ ...prev, photos: error }));
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setSelectedPhotos(validFiles);
            setErrors((prev) => ({ ...prev, photos: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const encryptedUser = localStorage.getItem('user');
            const user = decryptData(encryptedUser);
            const adminId = user?.registeredBy;

            if (!adminId) {
                throw new Error('Admin ID is missing');
            }

            if (!validateForm()) {
                setIsSubmitting(false);
                return;
            }

            // Create submission data
            const submissionData = {
                ...formData,
                admin: adminId,
                photos: selectedPhotos, // Use selectedPhotos array directly
                amenities: formData.amenities
                    ? formData.amenities.split(',').map((item) => item.trim())
                    : [],
            };

            // Debug log
            console.log('Submission data:', submissionData);

            if (isEditMode && id) { // Use isEditMode and id
                await dispatch(
                    updateProperty({
                        id: id, // Use id from useParams
                        payload: submissionData,
                    }),
                ).unwrap();
            } else {
                await dispatch(addProperty(submissionData)).unwrap();
            }

            toast.success(
                isEditMode && id
                    ? 'Property updated successfully'
                    : 'Property added successfully',
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
                <CCol xs={12}>
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
                                        <CFormLabel htmlFor="title"><CIcon icon={cilHome} className="me-1"/>Title</CFormLabel>
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
                                        <CFormLabel htmlFor="description"><CIcon icon={cilDescription} className="me-1"/>Description</CFormLabel>
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
                                            <div className="invalid-feedback d-block">{errors.description}</div>
                                        )}
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="address">
                                          <CIcon icon={cilLocationPin} className="me-1"/>Address
                                        </CFormLabel>
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
                                            <div className="invalid-feedback d-block">{errors.address}</div>
                                        )}
                                    </CCol>

                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="price">
                                           <CIcon icon={cilMoney} className="me-1"/>Price
                                         </CFormLabel>
                                        <CInputGroup>
                                            <CInputGroupText>$</CInputGroupText>
                                          <CFormInput
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                invalid={!!errors.price}
                                                placeholder="Enter Price"
                                            />
                                          </CInputGroup>

                                        {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="rentPrice">
                                           <CIcon icon={cilMoney} className="me-1"/>Rent Price (optional)
                                        </CFormLabel>
                                        <CInputGroup>
                                            <CInputGroupText>$</CInputGroupText>
                                              <CFormInput
                                                  type="number"
                                                  id="rentPrice"
                                                  name="rentPrice"
                                                  value={formData.rentPrice}
                                                  onChange={handleInputChange}
                                                  placeholder="Enter Rent Price"
                                              />
                                        </CInputGroup>

                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="numberOfUnits">
                                        <CIcon icon={cilBuilding} className="me-1"/>Number of Units
                                        </CFormLabel>
                                        <CInputGroup>

                                        <CFormInput
                                                type="number"
                                                id="numberOfUnits"
                                                name="numberOfUnits"
                                                value={formData.numberOfUnits}
                                                onChange={handleInputChange}
                                                invalid={!!errors.numberOfUnits}
                                                placeholder="Enter Number of Units"
                                            />
                                              <CInputGroupText>Units</CInputGroupText>
                                            </CInputGroup>

                                        {errors.numberOfUnits && (
                                            <div className="invalid-feedback d-block">{errors.numberOfUnits}</div>
                                        )}
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="propertyType"><CIcon icon={cilHome} className="me-1"/>Property Type</CFormLabel>
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
                                            <div className="invalid-feedback d-block">{errors.propertyType}</div>
                                        )}
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="floorPlan">
                                            <CIcon icon={cilMap} className="me-1"/>Floor Plan
                                         </CFormLabel>
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
                                        <CFormLabel htmlFor="amenities"><CIcon icon={cilList} className="me-1"/>Amenities</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="amenities"
                                            name="amenities"
                                            value={formData.amenities}
                                            onChange={handleInputChange}
                                            placeholder="Enter Amenities, separated by commas"
                                        />
                                    </CCol>
                                     {!isEditMode && ( <CCol xs={12}>
                                        <CFormLabel htmlFor="photos"><CIcon icon={cilImage} className="me-1"/>Photos (Max 5)</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="photos"
                                            name="photos"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            invalid={!!errors.photos}
                                        />
                                        {errors.photos && (
                                            <div className="invalid-feedback d-block">{errors.photos}</div>
                                        )}
                                    </CCol>)}
                                </CRow>
                                <div className="mt-4 d-flex justify-content-end gap-2">
                                    <CButton color="secondary" onClick={handleCancel}>
                                        Cancel
                                    </CButton>
                                    <CButton color="dark" type="submit" disabled={isSubmitting || loading}>
                                        {isSubmitting || loading
                                            ? isEditMode && id
                                                ? 'Updating...'
                                                : 'Adding...'
                                            : isEditMode && id
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

export default AddProperty;