import React, { useState, useEffect } from 'react';
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
} from '@coreui/react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CIcon } from '@coreui/icons-react';
import {
    cilFile,
    cilCloudDownload,
    cilClipboard,
    cilPencil,
    cilTrash,
    cilFullscreen,
} from '@coreui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { decryptData } from '../../api/utils/crypto';
import PropTypes from 'prop-types';

const PropertyTable = ({
    properties = [],
    totalProperties = 0,
    onEdit = () => {},
    onDelete = () => {},
    onView = () => {},
    currentPage = 1,
    handlePageChange = () => {},
    totalPages = 1,
    itemsPerPage = 5,
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
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

    const sortedProperties = React.useMemo(() => {
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

    const exportToPDF = () => {
        if (!sortedProperties.length) {
            console.warn('No properties to export to PDF');
            return;
        }
        const doc = new jsPDF();
        doc.text('Property Data', 14, 10);

        const tableData = sortedProperties.map((property, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            property.title || 'N/A',
            property.price || 'N/A',
            property.address || 'N/A',
            property.propertyType || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Title', 'Price', 'Address', 'Type']],
            body: tableData,
            startY: 20,
        });

        doc.save('property_data.pdf');
    };

    const getPaginationRange = (currentPage, totalPages) => {
      if (totalPages <= 5) {
          // Display all pages if totalPages is small
          return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
  
      const range = [];
      const delta = 2; // Number of pages to show on each side
  
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
  
      console.log('Pagination range:', range); // Debug output
      return range;
  };
  
  
  
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <strong>Total Properties:</strong> {totalProperties}
                </div>
                <div className="d-flex gap-2">
                    <CSVLink
                        data={csvData}
                        headers={[
                            { label: '#', key: 'index' },
                            { label: 'Title', key: 'title' },
                            { label: 'Price', key: 'price' },
                            { label: 'Address', key: 'address' },
                            { label: 'Type', key: 'type' },
                        ]}
                        filename="property_data.csv"
                        className="btn btn-dark"
                    >
                        <CIcon icon={cilFile} title="Export CSV" />
                    </CSVLink>
                    <CopyToClipboard text={JSON.stringify(csvData)}>
                        <button className="btn btn-dark" title="Copy to Clipboard">
                            <CIcon icon={cilClipboard} />
                        </button>
                    </CopyToClipboard>
                    <button className="btn btn-dark" onClick={exportToPDF} title="Export PDF">
                        <CIcon icon={cilCloudDownload} />
                    </button>
                </div>
            </div>

            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                            Title
                        </CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                            Price
                        </CTableHeaderCell>
                        <CTableHeaderCell onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                            Address
                        </CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {sortedProperties.length ? (
                        sortedProperties.map((property, index) => (
                            <CTableRow key={property.id || index}>
                                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                                <CTableDataCell>{property.title || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{property.price ? `$${property.price}` : 'N/A'}</CTableDataCell>
                                <CTableDataCell>{property.address || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{property.propertyType || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="light"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => onView(property)}
                                        title="View Property"
                                    >
                                        <CIcon icon={cilFullscreen} />
                                    </CButton>
                                    {userPermissions?.editProperty && (
                                        <CButton
                                            color="light"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => onEdit(property.id)}
                                            title="Edit Property"
                                        >
                                            <CIcon icon={cilPencil} />
                                        </CButton>
                                    )}
                                    {userPermissions?.deleteProperty && (
                                        <CButton
                                            color="light"
                                            size="sm"
                                            style={{ color: 'red' }}
                                            onClick={() => onDelete(property.id)}
                                            title="Delete Property"
                                        >
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                    )}
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="6" className="text-center">
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
    >
        «
    </CPaginationItem>
    <CPaginationItem
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
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
            >
                {page}
            </CPaginationItem>
        )
    )}

    <CPaginationItem
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
    >
        ›
    </CPaginationItem>
    <CPaginationItem
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(totalPages)}
    >
        »
    </CPaginationItem>
</CPagination>
                </div>
            )}
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
}
export default PropertyTable;