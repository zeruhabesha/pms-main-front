import React, { useState, useEffect, useMemo } from 'react';
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
} from '@coreui/react';
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
} from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';
import PropTypes from 'prop-types';
import PropertyDeleteModal from './PropertyDeleteModal';

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

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
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

    const csvData = sortedProperties.map((property, index) => ({
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
        return sortedProperties.map((property, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            property.title || 'N/A',
            formatCurrency(property.price),
            property.address || 'N/A',
            property.propertyType || 'N/A',
        ]);
    };

    const exportToPDF = () => {
        if (!sortedProperties.length) {
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

    return (
        <div>
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
                    {sortedProperties.length > 0 ? (
                        sortedProperties.map((property, index) => {
                            const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                            return (
                                <CTableRow key={property.id || index}>
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
                                        <div className="d-flex align-items-center">
                                            {userPermissions?.editProperty && (
                                                <CButton
                                                    color="light"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => onEdit(property)}
                                                    title="Edit Property"
                                                    aria-label="Edit Property"
                                                >
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                            )}
                                            {userPermissions?.deleteProperty && (
                                                <CButton
                                                    color="light"
                                                    size="sm"
                                                    className="me-2"
                                                    style={{ color: 'red' }}
                                                    onClick={() => openDeleteModal(property)}
                                                    title="Delete Property"
                                                    aria-label="Delete Property"
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            )}
                                            <CButton
                                                color="light"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => onView(property)}
                                                title="View Property"
                                                aria-label="View Property"
                                            >
                                                <CIcon icon={cilFullscreen} />
                                            </CButton>
                                        </div>
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
                <div className="d-flex justify-content-between align-items-center mt-3">
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