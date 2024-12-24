import React, { useState, useCallback, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalTitle,
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
} from '@coreui/react';
import PropTypes from 'prop-types';

const AddImage = ({ visible, onClose, propertyId, propertyTitle, confirmUpdatePhoto, setVisible }) => {
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('Please select a valid photo.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            setPhoto(null);
            return;
        }
        setError('');
        setPhoto(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photo) {
            setError('Please select a photo.');
            return;
        }

        try {
            if (confirmUpdatePhoto) {
                await confirmUpdatePhoto(photo);
            }
            setVisible(true); // Reopen PropertyDetails modal
            onClose(); // Close AddImage modal
        } catch (error) {
            setError(error.message || 'Failed to update the photo.');
        }
    };

    const handleClose = () => {
        setVisible(true); // Reopen PropertyDetails modal
        onClose(); // Close AddImage modal
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center">
            <CModalHeader>
                <CModalTitle>Add Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    {error && <div className="text-danger mb-2">{error}</div>}
                    <CFormLabel htmlFor="photo">Select Photo</CFormLabel>
                    <CFormInput type="file" id="photo" accept="image/*" onChange={handleFileChange} />
                    <div className="d-flex justify-content-end mt-3">
                        <CButton color="secondary" onClick={handleClose}>
                            Cancel
                        </CButton>
                        <CButton color="dark" type="submit" className="ms-2">
                            Add Photo
                        </CButton>
                    </div>
                </CForm>
            </CModalBody>
        </CModal>
    );
};


AddImage.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    propertyId: PropTypes.string,
    propertyTitle: PropTypes.string,
    confirmUpdatePhoto: PropTypes.func,
     photoId: PropTypes.string,
     setVisible: PropTypes.func,
};

export default AddImage;