import React, { useState, useEffect, useMemo, useRef } from 'react';
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
} from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';
import PropTypes from 'prop-types';
import PropertyDeleteModal from './PropertyDeleteModal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './slider.scss'; // Import your custom CSS

const PropertyTable = ({
    properties = [],
    totalProperties = 0,
    onEdit = () => {},
    onDelete = () => {},
    onView = () => {},
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


    totalPages = Math.ceil(totalProperties / itemsPerPage);

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
        type: property.propertyType || 'N/A',
    }));

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        try {
            return new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: 'USD',
            }).format(amount);
        } catch (e) {
            console.error('Error formatting currency', e);
            return 'N/A';
        }
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

    const handlePriceSliderChange = (value) => {
       setPriceRange(value)
    };

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
      <div className="d-flex gap-1" style={{ width: '80%'}}> {/* Container for slider and price */}
                 <div style={{width: '95%'}} className="d-flex  mt-2 gap-1">
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
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
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
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                            Address
                            {sortConfig.key === 'address' && (
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
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property, index) => {
                            const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                            const isRowBlurred = dropdownOpen !== null && dropdownOpen !== property.id;
                            return (
                                <CTableRow key={property.id || index} className={isRowBlurred ? 'blurred-row' : ''}>
                                    <CTableDataCell className="text-center">{rowNumber}</CTableDataCell>
                                    <CTableDataCell>{property.title || 'N/A'}</CTableDataCell>
                                    <CTableDataCell>
                                        {property?.propertyType || 'N/A'}
                                    </CTableDataCell>
                                    <CTableDataCell>{formatCurrency(property.price)}</CTableDataCell>
                                    <CTableDataCell>{property.address || 'N/A'}</CTableDataCell>
                                    <CTableDataCell>
                                        {getStatusIcon(property.status)}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CDropdown
                                             variant="btn-group"
                                              isOpen={dropdownOpen === property.id}
                                               onToggle={() => toggleDropdown(property.id)}
                                                onMouseLeave={closeDropdown}
                                                 innerRef={ref => (dropdownRefs.current[property.id] = ref)}

                                        >
                                            <CDropdownToggle color="light" caret={false} size="sm" title="Actions">
                                                <CIcon icon={cilOptions} />
                                            </CDropdownToggle>
                                            <CDropdownMenu >
                                                {userPermissions?.editProperty && (
                                                  <CDropdownItem onClick={() => onEdit(property)} title="Edit Property">
                                                      <CIcon icon={cilPencil} className="me-2"/>
                                                       Edit
                                                   </CDropdownItem>
                                                )}
                                                {userPermissions?.deleteProperty && (
                                                    <CDropdownItem
                                                        onClick={() => openDeleteModal(property)}
                                                        style={{ color: 'red' }}
                                                        title="Delete Property"
                                                      >
                                                         <CIcon icon={cilTrash} className="me-2"/>
                                                         Delete
                                                      </CDropdownItem>
                                                )}
                                                <CDropdownItem onClick={() => onView(property)} title="View Property">
                                                  <CIcon icon={cilFullscreen}  className="me-2"/>
                                                     Details
                                                   </CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </CTableDataCell>
                                </CTableRow>
                            );
                        })
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="8" className="text-center">
                                No properties available.
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>

            </CTable>

            {totalPages > 1 && (
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

                        {getPaginationRange(currentPage, totalPages).map((page, index) =>
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
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Go to next page"
                        >
                            ›
                        </CPaginationItem>
                        <CPaginationItem
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(totalPages)}
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
    currentPage: PropTypes.number,
    handlePageChange: PropTypes.func,
    totalPages: PropTypes.number,
    itemsPerPage: PropTypes.number,
};

export default PropertyTable;