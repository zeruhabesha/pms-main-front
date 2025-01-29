import {
  cilPencil,
  cilTrash,
  cilFullscreen,
  cilOptions,
      cilLocationPin,
      cilCheckCircle ,
      cilBan,
      cilPeople,
      cilPhone,
      cilFile,
      cilArrowBottom     
} from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';
import PropTypes from 'prop-types'; // Import PropTypes
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
import { CIcon } from '@coreui/icons-react';

const PropertyTableRow = ({
  index,
  property,
  onEdit,
  onDelete,
  onView,
  onPhotoDelete,
  onPhotoUpdate,
  dropdownOpen,
  toggleDropdown,
  closeDropdown,
  dropdownRefs,
  isRowSelected,
  handleCheckboxChange
}) => {
   const [userPermissions, setUserPermissions] = useState(null);


   useEffect(() => {
    try {
        const encryptedUser = localStorage.getItem('user');
        const decryptedUser = encryptedUser ? decryptData(encryptedUser) : null;
        setUserPermissions(decryptedUser?.permissions || []);
    } catch (error) {
        console.error('Error decrypting user data:', error);
    }
}, []);




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

  return (
         <CTableRow
              key={property._id}
              className={`${dropdownOpen !== null && dropdownOpen !== property._id ? 'blurred-row' : ''} ${isRowSelected(property._id) ? 'table-active' : ''}`}
          >
              <CTableDataCell className="text-center">
                   <CFormCheck
                      onChange={() => handleCheckboxChange(property._id)}
                      checked={isRowSelected(property._id)}
                  />
              </CTableDataCell>
              <CTableDataCell className="text-center">{index}</CTableDataCell>
               <CTableDataCell>
                  <div>{property.title || 'N/A'}</div>
                  <div className="small text-body-secondary text-nowrap">
                      <span>
                      <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                      {property.address || 'N/A'}</span>
                  </div>
              </CTableDataCell>
              <CTableDataCell>
                  {property?.propertyType || 'N/A'}
              </CTableDataCell>
              <CTableDataCell>{formatCurrency(property.price)}</CTableDataCell>
              <CTableDataCell>
                  {getStatusIcon(property.status)}
              </CTableDataCell>
              <CTableDataCell>
                  <CDropdown
                      variant="btn-group"
                      isOpen={dropdownOpen === property._id}
                      onToggle={() => toggleDropdown(property._id)}
                      onMouseLeave={closeDropdown}
                      innerRef={ref => (dropdownRefs.current[property._id] = ref)}
                  >
                      <CDropdownToggle color="light" caret={false} size="sm" title="Actions">
                          <CIcon icon={cilOptions} />
                      </CDropdownToggle>
                      <CDropdownMenu >
                          {userPermissions?.editProperty && (
                              <CDropdownItem onClick={() => onEdit(property)} title="Edit Property">
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                              </CDropdownItem>
                          )}
                           {userPermissions?.deleteProperty && (
                              <CDropdownItem
                                  onClick={() => onDelete(property)}
                                  style={{ color: 'red' }}
                                  title="Delete Property"
                              >
                                  <CIcon icon={cilTrash} className="me-2" />
                                  Delete
                              </CDropdownItem>
                          )}
<CDropdownItem 
                                  onClick={() => onView(property)}>
 {/* onClick={onView} title="View Property"> */}
  <CIcon icon={cilFullscreen} className="me-2" />
  Details
</CDropdownItem>

                      </CDropdownMenu>
                  </CDropdown>
              </CTableDataCell>
          </CTableRow>
  );
};

PropertyTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  property: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onPhotoDelete: PropTypes.func.isRequired,
  onPhotoUpdate: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.any,
  toggleDropdown: PropTypes.func.isRequired,
  closeDropdown: PropTypes.func.isRequired,
  dropdownRefs: PropTypes.object.isRequired,
  isRowSelected: PropTypes.func.isRequired,
   handleCheckboxChange: PropTypes.func.isRequired
};


export default PropertyTableRow;