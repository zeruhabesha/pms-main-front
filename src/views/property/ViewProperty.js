import React, { useState, useEffect } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CFormInput,
    CButton,
    CSpinner,
    CAlert,
    CModal,
    CModalHeader,
    CModalBody,
    CModalTitle,
} from '@coreui/react';
import PropertyTable from './PropertyTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Super.scss';
import { CSVLink } from 'react-csv';
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPropertyImage,
    batchDelete,
    deletePhoto,
    filterProperties,
    getProperty,
    updatePhoto,
    deleteProperty
} from '../../api/actions/PropertyAction';
import { decryptData } from '../../api/utils/crypto';

import {
    setSelectedProperty,
    clearSelectedProperty,
    resetState
} from '../../api/slice/PropertySlice';

import AddImage from './AddImage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ImportModal from './ImportModal'; // Import the new modal

const ViewProperty = () => {
    // Define state for photo modals
    const [photoModal, setPhotoModal] = useState({
        deleteVisible: false,
        updateVisible: false,
        photoId: null,
        propertyId: null,
    });

    const [importModalVisible, setImportModalVisible] = useState(false); // Import modal state
    const dispatch = useDispatch();
    const navigate = useNavigate();  // Initialize useNavigate

    const {
        properties,
        loading,
        error,
        pagination
    } = useSelector((state) => state.property);


    const itemsPerPage = 10; // Items per page

   const [userPermissions, setUserPermissions] = useState(null);
    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }
    }, []);

     useEffect(() => {
        dispatch(filterProperties({ page: pagination.currentPage, limit: itemsPerPage }));
    }, [dispatch, pagination.currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        dispatch(filterProperties({ page: 1, limit: itemsPerPage, search: e.target.value }));
    };

    const handleEditProperty = (property) => {
         const propertyId =  property._id
        dispatch(setSelectedProperty(property));
        navigate(`/property/edit/${propertyId}`)
    };

   const handleViewProperty = (property) => {
        const propertyId =  property._id;
         navigate(`/property/${propertyId}`); // Navigate to details page with ID

    };


  const handleDeleteMultipleProperties = async (ids) => {
        try {
            await dispatch(batchDelete(ids)).unwrap();
            toast.success('Properties deleted successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to delete the properties.');
        }
    };

    const handleDeleteProperty = async (id) => {
         try {
              await dispatch(deleteProperty(id)).unwrap();
            toast.success('Property deleted successfully.');
         } catch (err) {
             toast.error(err.message || 'Failed to delete the property.');
         }
    };

     // Functions to manage photo modal visibility
    const openDeletePhotoModal = (photo, propertyId) => {
         setPhotoModal({
             deleteVisible: true,
            updateVisible: false,
            photoId: photo.id,
             propertyId,
        });
    };


    const closePhotoModal = () => {
        setPhotoModal({
            deleteVisible: false,
            updateVisible: false,
             photoId: null,
            propertyId: null,
         });
    };

      const openUpdatePhotoModal = (photo, propertyId) => {
        setPhotoModal({
            deleteVisible: false,
            updateVisible: true,
            photoId: photo.id,
           propertyId,
        });
     };


      // Handle photo delete logic
   const handleConfirmDeletePhoto = async () => {
    try {
        await dispatch(deletePhoto({ propertyId: photoModal.propertyId, photoId: photoModal.photoId })).unwrap();
        toast.success('Photo deleted successfully.');
         const response = await dispatch(getProperty(photoModal.propertyId)).unwrap();
         dispatch(setSelectedProperty(response));
    } catch (err) {
        toast.error(err.message || 'Failed to delete the photo.');
    } finally {
         closePhotoModal();
     }
  };


      // Handle photo update logic
    const handleConfirmUpdatePhoto = async (newPhotoFile) => {
        try {
            await dispatch(
                updatePhoto({
                    id: photoModal.propertyId,
                    photo: newPhotoFile,
                    photoId: photoModal.photoId,
                 })
            ).unwrap();
              toast.success('Photo updated successfully.');
              const response = await dispatch(getProperty(photoModal.propertyId)).unwrap();
            dispatch(setSelectedProperty(response))
             closePhotoModal();
         } catch (error) {
            toast.error(error.message || 'Failed to update the photo.');
        }
    };

    const csvData = properties.map((property, index) => ({
        index: (pagination.currentPage - 1) * itemsPerPage + index + 1,
        title: property.title || 'N/A',
        propertyType: property.propertyType || 'N/A',
        address: property.address || 'N/A',
        rentPrice: property.rentPrice || 'N/A',
        status: property.status || 'N/A',
    }));

    const clipboardData = properties
        .map(
            (property, index) =>
                `${(pagination.currentPage - 1) * itemsPerPage + index + 1}. ${property.title || 'N/A'} - ${
                property.propertyType || 'N/A'
                } - ${property.address || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Properties List', 14, 10);

        const tableData = properties.map((property, index) => [
            (pagination.currentPage - 1) * itemsPerPage + index + 1,
            property.title || 'N/A',
            property.propertyType || 'N/A',
            property.address || 'N/A',
            `$${property.rentPrice || 'N/A'}`,
            property.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Title', 'Property Type', 'Address', 'Rent Amount', 'Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('properties.pdf');
    };

    const handlePageChange = (newPage) => {
         dispatch(filterProperties({ page: newPage, limit: itemsPerPage }));
    };

    const handleResetView = () => {
        dispatch(resetState())
    };

     const handlePhotoDelete = (photo, propertyId) => {
         if (!photo || !photo.id) {
            toast.error("Photo ID is missing. Unable to delete photo.");
            return;
         }
        openDeletePhotoModal(photo, propertyId)
    };

    const handlePhotoUpdate = (photo, propertyId) => {
        if (!photo || !photo.id) {
            toast.error("Photo ID is missing. Unable to update photo.");
            return;
        }
       openUpdatePhotoModal(photo, propertyId)
    };

    // Function to handle the "Add Property" button click
    const handleAddPropertyClick = () => {
        navigate('/property/add');
    };


     const handleOpenImportModal = () => {
        setImportModalVisible(true);
    };

    const handleCloseImportModal = () => {
      setImportModalVisible(false);
    };



    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong><CButton color="dark" onClick={handleOpenImportModal} title="Import Data">
                                 Import Data
                            </CButton></strong>
                        <div className="d-flex gap-2">
                            {userPermissions?.addProperty && (
                                  <button
                                    className="learn-more"
                                    onClick={handleAddPropertyClick}
                                >
                                    <span className="circle" aria-hidden="true">
                                        <span className="icon arrow"></span>
                                    </span>
                                    <span className="button-text">Add Property</span>
                                </button>
                            )}
                           
                           {/* <CButton color="dark" onClick={handleResetView} title="Reset View">
                                  Reset
                                </CButton> */}
                         </div>
                     </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">

                            <div className="d-flex gap-2">
                                <CSVLink
                                    data={csvData}
                                    headers={[
                                        { label: '#', key: 'index' },
                                        { label: 'Title', key: 'title' },
                                        { label: 'Property Type', key: 'propertyType' },
                                        { label: 'Address', key: 'address' },
                                        { label: 'Rent Amount', key: 'rentPrice' },
                                        { label: 'Status', key: 'status' },
                                    ]}
                                    filename="property_data.csv"
                                    className="btn btn-dark"
                                >
                                    <CIcon icon={cilFile} title="Export CSV" />
                                </CSVLink>
                                <CopyToClipboard text={clipboardData}>
                                    <CButton color="dark" title="Copy to Clipboard">
                                        <CIcon icon={cilClipboard} />
                                    </CButton>
                                </CopyToClipboard>
                                <CButton color="dark" onClick={exportToPDF} title="Export PDF">
                                    <CIcon icon={cilCloudDownload} />
                                </CButton>
                            </div>
                            <CFormInput
                                type="text"
                                placeholder="Search by title or address"
                                onChange={handleSearch}
                                className="w-100"
                            />
                        </div>
                        {loading ? (
                            <CSpinner color="dark" />
                        ) : (
                            <PropertyTable
                                properties={properties}
                                totalProperties={pagination.totalItems}
                                onEdit={handleEditProperty}
                                onDelete={handleDeleteProperty}
                                onView={handleViewProperty}
                                currentPage={pagination.currentPage}
                                handlePageChange={handlePageChange}
                                totalPages={pagination.totalPages}
                                itemsPerPage={pagination.limit}
                                onPhotoDelete={handlePhotoDelete}
                                onPhotoUpdate={handlePhotoUpdate}
                                onDeleteMultiple={handleDeleteMultipleProperties}
                            />
                        )}
                    </CCardBody>
                </CCard>
            </CCol>


            {/* Modal for deleting photos */}
            <CModal visible={photoModal.deleteVisible} onClose={closePhotoModal} alignment="center">
                <CModalHeader>
                    <CModalTitle>Confirm Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete this photo?
                    <div className='mt-2 d-flex justify-content-end'>
                         <CButton color="secondary" onClick={closePhotoModal} className="me-2">
                            Cancel
                        </CButton>
                        <CButton color="danger" onClick={handleConfirmDeletePhoto}>
                            Delete
                        </CButton>
                    </div>
                </CModalBody>
            </CModal>
            {/* Modal for updating photos */}
            <AddImage
                visible={photoModal.updateVisible}
                onClose={closePhotoModal}
                propertyId={photoModal.propertyId}
                photoId={photoModal.photoId}
                 confirmUpdatePhoto={handleConfirmUpdatePhoto}
            />
            <ImportModal
                 visible={importModalVisible}
                 onClose={handleCloseImportModal}
                />

            <ToastContainer position="top-right" autoClose={3000} />
        </CRow>
    );
};

export default ViewProperty;