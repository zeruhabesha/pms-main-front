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

const PropertyTable = ({
  properties = [],
  totalProperties = 0,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  totalPages = 1,
  itemsPerPage = 5,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
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
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end of range
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Adjust start and end to always show 5 numbers if possible
    if (currentPage - delta > 2 && totalPages > 5) {
      rangeWithDots.push(1, '...');
    } else {
      for (let i = 1; i < start; i++) {
        rangeWithDots.push(i);
      }
    }

    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      for (let i = end + 1; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    }

    return rangeWithDots;
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
              <CTableRow key={property._id || index}>
                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{property?.title || 'N/A'}</CTableDataCell>
                <CTableDataCell>{property?.price ? `$${property.price}` : 'N/A'}</CTableDataCell>
                <CTableDataCell>{property?.address || 'N/A'}</CTableDataCell>
                <CTableDataCell>{property?.propertyType || 'N/A'}</CTableDataCell>
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
                      onClick={() => onEdit({ ...property, _id: property._id || property.id })}
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
                      onClick={() => onDelete({ ...property, _id: property._id || property.id })}
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
        <CPagination className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <CPaginationItem
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}
          >
            &laquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lsaquo;
          </CPaginationItem>
          
          {getPaginationRange(currentPage, totalPages).map((page, index) => (
            page === '...' ? (
              <CPaginationItem key={`dots-${index}`} disabled>
                ...
              </CPaginationItem>
            ) : (
              <CPaginationItem
                key={`page-${page}`}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </CPaginationItem>
            )
          ))}

          <CPaginationItem
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &rsaquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &raquo;
          </CPaginationItem>
        </CPagination>
      )}
    </div>
  );
};

export default PropertyTable;