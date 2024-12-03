import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import PropertyTableRow from './PropertyTableRow';

const PropertyTable = ({
  properties,
  onEdit,
  onDelete,
  onView,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
}) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationItems = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const end = Math.min(start + maxPagesToShow - 1, totalPages);

    if (start > 1) {
      range.push(
        <CPaginationItem key="start-ellipsis" disabled>
          ...
        </CPaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
      range.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    if (end < totalPages) {
      range.push(
        <CPaginationItem key="end-ellipsis" disabled>
          ...
        </CPaginationItem>
      );
    }

    return range;
  };

  return (
    <>
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Title</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Address</CTableHeaderCell>
            <CTableHeaderCell>Property Type</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {properties.map((property, index) => (
            <PropertyTableRow
              key={property._id || index}
              index={index + 1 + (currentPage - 1) * itemsPerPage}
              property={property}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="mt-3">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          &laquo;
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lsaquo;
        </CPaginationItem>

        {getPaginationItems()}

        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &rsaquo;
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          &raquo;
        </CPaginationItem>
      </CPagination>
    </>
  );
};

export default PropertyTable;
