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
} from '@coreui/react';
import PropertyTable from './PropertyTable';
import AddProperty from './AddProperty';
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
    addProperty,
    updateProperty,
    deleteProperty,
    filterProperties,
} from '../../api/actions/PropertyAction';
import {
    setSelectedProperty,
    clearSelectedProperty,
    resetState,
} from '../../api/slice/PropertySlice';
import PropertyDetails from './PropertyDetails'
const ViewProperty = () => {
    const [isModalVisible, setModalVisible] = useState(false);
      const [viewingProperty, setViewingProperty] = useState(null);
    const dispatch = useDispatch();
    const {
        properties,
        loading,
        error,
        currentPage,
        totalPages,
        selectedProperty,
        pagination,
    } = useSelector((state) => state.property);

    const itemsPerPage = 5;


      useEffect(() => {
          dispatch(filterProperties({ page: currentPage, limit: itemsPerPage }));
      }, [dispatch, currentPage, itemsPerPage]);


    const handleSearch = (e) => {
        dispatch(filterProperties({ page: 1, limit: itemsPerPage, search: e.target.value }));
    };


    const handleEdit = (property) => {
        dispatch(setSelectedProperty(property));
        setModalVisible(true);
    };

      const handleView = (property) => {
       setViewingProperty(property);
        };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteProperty(id)).unwrap();
            toast.success('Property deleted successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to delete the property.');
        }
    };

    const handleSave = async (formData) => {
      if (!formData.title || !formData.propertyType) {
          toast.error("Title and Property Type are required fields.");
          return;
       }
        try {
            if (selectedProperty) {
              await dispatch(
                  updateProperty({ id: selectedProperty.id, propertyData: formData })
              ).unwrap();
              toast.success('Property updated successfully.');
            } else {
                await dispatch(addProperty(formData)).unwrap();
                toast.success('Property added successfully.');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to save the property.');
        }
    };


    const closeModal = () => {
        dispatch(clearSelectedProperty());
        setModalVisible(false);
    };

      const closeViewModal = () => {
    setViewingProperty(null);
  };

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
        // const handlePageChange = (page) => {
        //     dispatch(filterProperties({ page, limit: itemsPerPage }));
        // };
        const handlePageChange = (newPage) => {
          dispatch(filterProperties({ ...filters, page: newPage, limit: itemsPerPage }));
      };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Properties</strong>
                        <button
                            className="learn-more"
                            onClick={() => {
                                dispatch(clearSelectedProperty());
                                setModalVisible(true);
                            }}
                        >
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Add Property</span>
                        </button>
                    </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                            <CFormInput
                                type="text"
                                placeholder="Search by title or address"
                                onChange={handleSearch}
                                className="w-100"
                            />
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
                        </div>
                        {loading ? (
                            <CSpinner color="dark" />
                        ) : (
                          <PropertyTable
    properties={properties}
    totalProperties={pagination.totalItems}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onView={handleView}
    currentPage={pagination.currentPage}
    handlePageChange={(page) => dispatch(filterProperties({ page, limit: pagination.limit }))}
    totalPages={pagination.totalPages}
    itemsPerPage={pagination.limit}
/>

                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            <AddProperty
                visible={isModalVisible}
                setVisible={closeModal}
                editingProperty={selectedProperty}
                handleSave={handleSave}
            />
              {viewingProperty && (
        <PropertyDetails
          visible={!!viewingProperty}
          setVisible={closeViewModal}
          viewingProperty={viewingProperty}
        />
      )}
            <ToastContainer position="top-right" autoClose={3000} />
        </CRow>
    );
};

export default ViewProperty;