import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CPagination,
    CPaginationItem,
    CButton,
    CBadge,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CFormSelect,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CFormCheck, // Import CFormCheck here
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,

} from '@coreui/react';
import "../paggination.scss";
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CIcon } from '@coreui/icons-react';
import {
    cilFile,
    cilCloudDownload,
    cilPencil,
    cilTrash,
    cilFullscreen,
    cilArrowTop,
    cilArrowBottom,
    cilPeople,
    cilEnvelopeOpen,
    cilPhone,
    cilCheckCircle,
    cilBan,
    cilOptions,
    cilSearch,
    cilMoney,
    cilLocationPin,
} from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';
import PropTypes from 'prop-types';
import PropertyDeleteModal from './PropertyDeleteModal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './slider.scss'; // Import your custom CSS
import PropertyTableRow from './PropertyTableRow';
import { debounce } from 'lodash';


const PropertyTable = ({
    properties = [],
    totalProperties = 0,
    onEdit = () => {},
    onDelete = () => {},
    onView = () => {},
    onPhotoDelete = () => {},
    onPhotoUpdate = () => {},
    onDeleteMultiple = () => {},
    currentPage = 1,
    handlePageChange = () => {},
    totalPages = 1,
    itemsPerPage = 10,
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ visible: false, propertyToDelete: null });
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRefs = useRef({});
     const [selectedStatus, setSelectedStatus] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000000]); // Initial price range
    const [sliderMax, setSliderMax] = useState(1000000) // Initial max value of price
      const [selectedRows, setSelectedRows] = useState([]); // To track selected rows

    const [isDeleting, setIsDeleting] = useState(false);
    const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);

    const totalPagesComputed = useMemo(() => Math.ceil(totalProperties / itemsPerPage), [totalProperties, itemsPerPage]);


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
        if (properties && properties.length > 0) {
            // Find the maximum price in the properties array
            const maxPrice = properties.reduce((max, property) => {
                return Math.max(max, Number(property.price || 0));
            }, 0);

            // Update the sliderMax state with the calculated maximum price
            setSliderMax(maxPrice > 1000000 ? maxPrice : 1000000);

            setPriceRange([0, maxPrice > 1000000 ? maxPrice : 1000000]);
        } else {
            setSliderMax(1000000);
            setPriceRange([0, 1000000]);
        }
    }, [properties])



    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

     const toggleDropdown = (propertyId) => {
        setDropdownOpen(prevState => prevState === propertyId ? null : propertyId);
    };

    const closeDropdown = () => {
        setDropdownOpen(null);
    };


    const sortedProperties = useMemo(() => {
        if (!sortConfig.key) return properties;

        return [...properties].sort((a, b) => {
            const aKey = a[sortConfig.key] || '';
            const bKey = b[sortConfig.key] || '';

            if (aKey < bKey) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aKey > bKey) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [properties, sortConfig]);

    const filteredProperties = useMemo(() => {
        let filtered = sortedProperties;

        if (selectedStatus) {
            filtered = filtered.filter(property =>
                property.status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }
        filtered = filtered.filter(property => {
            const price = Number(property.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });


        return filtered;
    }, [sortedProperties, selectedStatus, priceRange]);

      const csvData = filteredProperties.map((property, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        title: property.title || 'N/A',
         price: property.price || 'N/A',
        address: property.address || 'N/A',
          type: property.propertyType || 'N/A'
    }));
    const formatCurrency = (amount, currency = 'ETB') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency,
        }).format(amount);
    };
    
      const generatePDFTableData = () => {
        return filteredProperties.map((property, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            property.title || 'N/A',
            formatCurrency(property.price),
            property.address || 'N/A',
            property.propertyType || 'N/A',
        ]);
    };

    const exportToPDF = () => {
        if (!filteredProperties.length) {
             console.warn('No properties to export to PDF');
            return;
        }
        const doc = new jsPDF();
        doc.text('Property Data', 14, 10);
        const tableData = generatePDFTableData();
        doc.autoTable({
            head: [['#', 'Title', 'Price', 'Address', 'Type']],
            body: tableData,
            startY: 20,
        });
        doc.save('property_data.pdf');
    };
    const getPaginationRange = (currentPage, totalPages) => {
        if (totalPages <= 10) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

         const delta = 2;
        const range = [];

         for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            range.push(i);
         }

        if (range[0] > 1) {
             if (range[0] > 2) range.unshift('...');
            range.unshift(1);
        }

        if (range[range.length - 1] < totalPages) {
            if (range[range.length - 1] < totalPages - 1) range.push('...');
            range.push(totalPages);
        }

        return range;
    };
     const statusOptions = useMemo(() => {
        const allStatuses = properties.map((property) => property.status?.toLowerCase() || 'open');
        const uniqueStatuses = Array.from(new Set(allStatuses)).sort(); // Sort the unique statuses
        return ['', ...uniqueStatuses];
    }, [properties]);

     const getStatusIcon = (status) => {
        const statusIconMap = {
             open: <CIcon icon={cilCheckCircle} className="text-success" title="Open" />,
            reserved: <CIcon icon={cilBan} className="text-danger" title="Reserved" />,
            closed: <CIcon icon={cilPeople} className="text-dark" title="Closed" />, // Updated icon
            'under maintenance': <CIcon icon={cilPhone} className="text-warning" title="Under Maintenance" />, // Updated icon
            leased: <CIcon icon={cilFile} className="text-info" title="Leased" />, // Updated icon
            sold: <CIcon icon={cilArrowBottom} className="text-primary" title="Sold" />, // Updated icon
        };
        return statusIconMap[status?.toLowerCase()] || null;
    };
     const openDeleteModal = (property) => {
        setDeleteModal({ visible: true, propertyToDelete: property });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ visible: false, propertyToDelete: null });
    };

    const handlePriceSliderChange = debounce((value) => {
        setPriceRange(value);
    }, 300); // Delay updates by 300ms

const handleCheckboxChange = useCallback((propertyId) => {
        setSelectedRows(prevSelected => {
            const isCurrentlySelected = prevSelected.includes(propertyId);
            if (isCurrentlySelected) {
                return prevSelected.filter(id => id !== propertyId);
            } else {
                return [...prevSelected, propertyId];
            }
        });
    }, []);


     // Fixed handleSelectAllRows to only select/deselect current page items
     const handleSelectAllRows = useCallback(() => {
        const allPropertyIds = filteredProperties.map(property => property._id);
        const allSelected = allPropertyIds.every(id => selectedRows.includes(id));
    
        setSelectedRows(prevSelected => allSelected ? [] : [...new Set([...prevSelected, ...allPropertyIds])]);
    }, [filteredProperties, selectedRows]);
    


const handleMultiDeleteConfirm = async () => {
    if (selectedRows.length === 0) return;

    setIsDeleting(true);
    try {
        await onDeleteMultiple(selectedRows);
        setSelectedRows([]);
        setShowMultiDeleteConfirm(false);
    } catch (error) {
        console.error('Error deleting properties:', error);
    } finally {
        setIsDeleting(false);
    }
};

     const handleMultiDelete = () => {
        if (selectedRows.length > 0) {
            setShowMultiDeleteConfirm(true);
         }
     };

  const isRowSelected = useCallback((propertyId) => {
    return selectedRows.includes(propertyId);
}, [selectedRows]);

// const [selectedProperty, setSelectedProperty] = useState(null);

// const handleViewProperty = useCallback((property) => {
//     console.log('Viewing property:', property);
//     setSelectedProperty(property); // Ensure this state update doesn’t cause unnecessary re-renders
// }, []);

    return (
        <div>
             <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-1" style={{ width: '80%' }}>
                    <div style={{ width: '95%' }} className="d-flex  mt-2 gap-1">
                        <Slider
                            range
                            min={0}
                            max={sliderMax}
                            value={priceRange}
                            onChange={handlePriceSliderChange}
                            step={100}
                             marks={{
                                [priceRange[0]]: {
                                    label: <div className="rc-slider-mark-text-with-value"> {formatCurrency(priceRange[0])}</div>
                                },
                                [priceRange[1]]: {
                                    label: <div className="rc-slider-mark-text-with-value">{formatCurrency(priceRange[1])}</div>
                                }
                             }}
                            handle={(props) => {
                                const { value, dragging, index, ...restProps } = props
                                return (
                                    <div {...restProps} >
                                    </div>
                                );
                            }}
                        />
                    </div>

                </div>

                <CFormSelect
                    style={{ width: '20%', minWidth: '200px' }} // Ensure a minimum width
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                     options={statusOptions.map(status => ({ label: status || "All Statuses", value: status }))}
                />
            </div>
             {selectedRows.length > 0 && (
                  <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                      <span className="fw-bold">{selectedRows.length}</span> properties selected
                  </div>
                  <div className="d-flex gap-2">
                      <CButton
                          color="secondary"
                          variant="outline"
                          onClick={() => setSelectedRows([])}
                      >
                          Clear Selection
                      </CButton>
                      <CButton
                          color="danger"
                         onClick={handleMultiDelete}
                          disabled={isDeleting}
                      >
                          {isDeleting ? 'Deleting...' : `Delete Selected (${selectedRows.length})`}
                      </CButton>
                  </div>
              </div>
            )}


             {/* Delete Confirmation Modal */}
            <CModal
                visible={showMultiDeleteConfirm}
                onClose={() => setShowMultiDeleteConfirm(false)}
                alignment="center"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Confirm Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete {selectedRows.length} selected properties?
                    This action cannot be undone.
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        onClick={() => setShowMultiDeleteConfirm(false)}
                    >
                        Cancel
                    </CButton>
                    <CButton
                        color="danger"
                        onClick={handleMultiDeleteConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </CButton>
                </CModalFooter>
            </CModal>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                         <CTableHeaderCell className="bg-body-tertiary text-center">
                         <CFormCheck
    onChange={handleSelectAllRows}
    checked={selectedRows.length > 0 && selectedRows.length === totalProperties}
    indeterminate={selectedRows.length > 0 && selectedRows.length < totalProperties}
/>

                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                             <CIcon icon={cilPeople} />
                         </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                            Title
                            {sortConfig.key === 'title' && (
                                <CIcon
                                    icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom}
                                />
                            )}
                        </CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary">
                            Property Type
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                            Price
                            {sortConfig.key === 'price' && (
                                <CIcon
                                    icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom}
                                />
                            )}
                        </CTableHeaderCell>
                         <CTableHeaderCell className="bg-body-tertiary">
                            Status
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {filteredProperties.map((property, index) => (
                        <PropertyTableRow
                            key={property._id}
                            index={(currentPage - 1) * itemsPerPage + index + 1}
                             property={property}
                            onEdit={onEdit}
                            onDelete={openDeleteModal}
                            onView={onView} // Pass the property directly to the callback
                            onPhotoDelete={onPhotoDelete}
                            onPhotoUpdate={onPhotoUpdate}
                            dropdownOpen={dropdownOpen}
                            toggleDropdown={toggleDropdown}
                            closeDropdown={closeDropdown}
                             dropdownRefs={dropdownRefs}
                            isRowSelected={isRowSelected}
                            handleCheckboxChange={handleCheckboxChange}
                        />


                    ))}
                </CTableBody>
            </CTable>

             {totalPagesComputed > 1 && (
               <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
                <span>Total Properties: {totalProperties}</span>
                 <CPagination className="d-inline-flex">
                     <CPaginationItem
                         disabled={currentPage <= 1}
                        onClick={() => handlePageChange(1)}
                        aria-label="Go to first page"
                     >
                       «
                    </CPaginationItem>
                     <CPaginationItem
                        disabled={currentPage <= 1}
                         onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Go to previous page"
                   >
                       ‹
                    </CPaginationItem>

                    {getPaginationRange(currentPage, totalPagesComputed).map((page, index) =>
                        page === '...' ? (
                            <CPaginationItem key={`dots-${index}`} disabled>
                                 ...
                           </CPaginationItem>
                            ) : (
                                <CPaginationItem
                                    key={`page-${page}`}
                                    active={page === currentPage}
                                    onClick={() => handlePageChange(page)}
                                    aria-label={`Go to page ${page}`}
                               >
                                 {page}
                              </CPaginationItem>
                          )
                    )}

                     <CPaginationItem
                        disabled={currentPage >= totalPagesComputed}
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Go to next page"
                     >
                       ›
                     </CPaginationItem>
                       <CPaginationItem
                        disabled={currentPage >= totalPagesComputed}
                       onClick={() => handlePageChange(totalPagesComputed)}
                        aria-label="Go to last page"
                       >
                           »
                      </CPaginationItem>
                   </CPagination>
                </div>
            )}
            <PropertyDeleteModal
                visible={deleteModal.visible}
                onClose={closeDeleteModal}
                confirmDelete={onDelete}
                propertyToDelete={deleteModal.propertyToDelete}
            />
        </div>
    );
};

PropertyTable.propTypes = {
    properties: PropTypes.array,
    totalProperties: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func,
    onPhotoDelete: PropTypes.func,
    onPhotoUpdate: PropTypes.func,
    onDeleteMultiple: PropTypes.func,
    currentPage: PropTypes.number,
    handlePageChange: PropTypes.func,
    totalPages: PropTypes.number,
    itemsPerPage: PropTypes.number,
};

export default PropertyTable;