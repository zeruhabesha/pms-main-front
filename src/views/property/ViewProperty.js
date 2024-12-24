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
import AddProperty from './AddProperty';
import {
    deleteProperty,
    filterProperties,
    updatePhoto,
    deletePhoto,
} from '../../api/actions/PropertyAction';
import {
    setSelectedProperty,
    clearSelectedProperty,
    resetState
} from '../../api/slice/PropertySlice';
import PropertyDetails from './PropertyDetails';
import AddImage from './AddImage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ViewProperty = () => {
    const [viewingProperty, setViewingProperty] = useState(null);
    const [deletePhotoModal, setDeletePhotoModal] = useState({ visible: false, photoId: null });
    const [updatePhotoModal, setUpdatePhotoModal] = useState({ visible: false, photoId: null });
    // Remove the modal state
    const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState(null); //To set selected

    const dispatch = useDispatch();
    const navigate = useNavigate();  // Initialize useNavigate
    const {
        properties,
        loading,
        error,
        currentPage,
        totalPages,
        pagination,
    } = useSelector((state) => state.property);

    const itemsPerPage = 5;


    useEffect(() => {
        dispatch(filterProperties({ page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage, itemsPerPage]);


    const handleSearch = (e) => {
        dispatch(filterProperties({ page: 1, limit: itemsPerPage, search: e.target.value }));
    };


    const handleEditProperty = (property) => {
        dispatch(setSelectedProperty(property));
        navigate(`/property/edit/${property.id}`)
    };


    const handleViewProperty = (property) => {
        console.log("View Property Clicked:", property); // Log to check property
        setViewingProperty(property); // Verify this updates state
    };
    


    const handleDeleteProperty = async (id) => {
        try {
            await dispatch(deleteProperty(id)).unwrap();
            toast.success('Property deleted successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to delete the property.');
        }
    };

    const handleCloseViewModal = () => {
        console.log("Closing modal");
        setViewingProperty(null);
    };
    
    const handleOpenDeletePhotoModal = (photo) => {
        setDeletePhotoModal({ visible: true, photoId: photo.id }); // Access photo.id here
    };


    const handleConfirmDeletePhoto = async () => {
        if (!viewingProperty || !deletePhotoModal.photoId) {
            toast.error("Property ID or Photo ID is missing. Unable to delete photo.");
            return;
        }

        try {
            const response = await dispatch(
                deletePhoto({ propertyId: viewingProperty.id, photoId: deletePhotoModal.photoId })
            ).unwrap();

            if (response.success) {
                toast.success('Photo deleted successfully.');
                setViewingProperty((prevProperty) => ({
                    ...prevProperty,
                    photos: prevProperty.photos.filter((p) => p.id !== deletePhotoModal.photoId),
                }));
            }
            setDeletePhotoModal({ visible: false, photoId: null });
        } catch (err) {
            toast.error(err.message || 'Failed to delete the photo.');
        }
    };


    const handleCancelDeletePhoto = () => {
        setDeletePhotoModal({ visible: false, photoId: null });
    };
    const handleOpenUpdatePhotoModal = (photo) => {
        setUpdatePhotoModal({ visible: true, photoId: photo.id });
    };
    const handleConfirmUpdatePhoto = async (newPhotoFile) => {
        try {
            const response = await dispatch(updatePhoto(viewingProperty.id, { photo: newPhotoFile })).unwrap();
            if (response.success) {
                toast.success("Photo updated successfully");
                setViewingProperty((prevProperty) => ({
                    ...prevProperty,
                    photos: prevProperty.photos.map((p) =>
                        p.id === updatePhotoModal.photoId ? { ...p, photoUrl: response.data.photoUrl } : p
                    ),
                }));

            }

            setUpdatePhotoModal({ visible: false, photoId: null })
        } catch (error) {
            toast.error(error.message || 'Failed to update the photo.');
        }
    };

    const handleCancelUpdatePhoto = () => {
        setUpdatePhotoModal({ visible: false, photoId: null })
    }


    const csvData = properties.map((property, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        title: property.title || 'N/A',
        propertyType: property.propertyType || 'N/A',
        address: property.address || 'N/A',
        rentAmount: property.rentAmount || 'N/A',
        status: property.status || 'N/A',
    }));

    const clipboardData = properties
        .map(
            (property, index) =>
                `${(currentPage - 1) * itemsPerPage + index + 1}. ${property.title || 'N/A'} - ${
                property.propertyType || 'N/A'
                } - ${property.address || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Properties List', 14, 10);

        const tableData = properties.map((property, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            property.title || 'N/A',
            property.propertyType || 'N/A',
            property.address || 'N/A',
            `$${property.rentAmount || 'N/A'}`,
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
    }

    const handlePhotoDelete = (photo) => {   // receive the entire photo object
        if (!photo || !photo.id) {
            toast.error("Photo ID is missing. Unable to delete photo.");
            return;
        }

        setDeletePhotoModal({ visible: true, photoId: photo.id });
    };

    const handlePhotoUpdate = (photo) => {  //receive the entire photo object
        if (!photo || !photo.id) {
            toast.error("Photo ID is missing. Unable to update photo.");
            return;
        }
        setUpdatePhotoModal({ visible: true, photoId: photo.id });
    };

    // Function to handle the "Add Property" button click
    const handleAddPropertyClick = () => {
        navigate('/property/add');
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Properties</strong>
                        <div className="d-flex gap-2">
                            <button
                                className="learn-more"
                                onClick={handleAddPropertyClick}
                            >
                                <span className="circle" aria-hidden="true">
                                    <span className="icon arrow"></span>
                                </span>
                                <span className="button-text">Add Property</span>
                            </button>
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
                                        { label: 'Rent Amount', key: 'rentAmount' },
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
                                handlePageChange={(page) => dispatch(filterProperties({ page, limit: pagination.limit }))}
                                totalPages={pagination.totalPages}
                                itemsPerPage={pagination.limit}
                            />
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            {/* Add console log here to check if the PropertyDetail render */}
            {console.log("PropertyDetails render", viewingProperty)}
            {viewingProperty && (
                <PropertyDetails
                    visible={!!viewingProperty}
                    setVisible={(isVisible) => {
                        if (!isVisible) setViewingProperty(null);
                    }}
                    viewingProperty={viewingProperty}
                    handlePhotoDelete={handlePhotoDelete}
                    handlePhotoUpdate={handlePhotoUpdate}
                />
            )}

            <CModal visible={deletePhotoModal.visible} onClose={handleCancelDeletePhoto} alignment="center">
                <CModalHeader>
                    <CModalTitle>Confirm Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete this photo?
                    <div className='mt-2 d-flex justify-content-end'>
                        <CButton color="secondary" onClick={handleCancelDeletePhoto} className="me-2">
                            Cancel
                        </CButton>
                        <CButton color="danger" onClick={handleConfirmDeletePhoto}>
                            Delete
                        </CButton>
                    </div>
                </CModalBody>
            </CModal>
            <AddImage
                visible={updatePhotoModal.visible}
                onClose={handleCancelUpdatePhoto}
                propertyId={viewingProperty?.id}
                propertyTitle={viewingProperty?.title}
                propertyType={viewingProperty?.propertyType}
                photoId={updatePhotoModal.photoId}
                confirmUpdatePhoto={handleConfirmUpdatePhoto}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </CRow>
    );
};

export default ViewProperty;