import React, { useState } from 'react';
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
import { cilFile, cilCloudDownload, cilClipboard, cilPencil, cilTrash, cilFullscreen } from '@coreui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const PropertyTable = ({
  properties,
  totalProperties,
  onEdit,
  onDelete,
  onView,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  const csvData = properties.map((property, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    title: property.title || 'N/A',
    price: property.price || 'N/A',
    address: property.address || 'N/A',
    type: property.propertyType || 'N/A',
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Property Data', 14, 10);

    const tableData = properties.map((property, index) => [
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
          {sortedProperties.map((property, index) => (
            <CTableRow key={property._id || index}>
              <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
              <CTableDataCell>{property?.title || 'N/A'}</CTableDataCell>
              <CTableDataCell>${property?.price || 'N/A'}</CTableDataCell>
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
                <CButton
                  color="light"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(property)}
                  title="Edit Property"
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="light"
                  size="sm"
                  style={{ color: 'red' }}
                  onClick={() => onDelete(property)}
                  title="Delete Property"
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="mt-3">
        <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
          &laquo;
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &lsaquo;
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          &rsaquo;
        </CPaginationItem>
        <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
          &raquo;
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default PropertyTable;
