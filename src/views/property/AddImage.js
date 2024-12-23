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

const AddImage = ({ visible, onClose, propertyId, propertyTitle, confirmUpdatePhoto , photoId }) => {
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
       setPhoto(null)
    }, [visible])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
         if (!file) {
            setError("Please select a valid photo.");
            return;
          }
           if (!file.type.startsWith('image/')) {
               setError("Please select a valid image file.");
               setPhoto(null);
               return;
             }
           setError("");
          setPhoto(file);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photo) {
            setError('Please select a photo.');
            return;
        }

        try {
            if(confirmUpdatePhoto) {
             await confirmUpdatePhoto(photo);
            }
            onClose();
        } catch(error) {
             setError(error.message || 'Failed to update the photo.');
        }

    };


    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader>
                <CModalTitle>{photoId ? 'Update Photo' : 'Add Photo'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                     {error && <div className="text-danger mb-2">{error}</div>}
                    <div className="mb-3">
                        <CFormLabel htmlFor="photo">Select Photo</CFormLabel>
                        <CFormInput type="file" id="photo" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className='d-flex justify-content-end'>
                    <CButton color="secondary" onClick={onClose} className="me-2">
                        Cancel
                    </CButton>
                        <CButton color="primary" type="submit" disabled={!photo}>
                           {photoId ? 'Update Photo' : 'Add Photo' }
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
};

export default AddImage;