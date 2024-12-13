import React from 'react';
import { CTableRow, CTableDataCell, CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilFullscreen } from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';

const PropertyTableRow = ({ index, property, onEdit, onDelete, onView }) => {
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

  return (
    <CTableRow>
      <CTableDataCell>{index}</CTableDataCell>
      <CTableDataCell>{property?.title || 'N/A'}</CTableDataCell>
      <CTableDataCell>${property?.price || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.address || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.propertyType || 'N/A'}</CTableDataCell>
      <CTableDataCell>
      {userPermissions?.viewProperty && (
<CButton
  color="light"
  size="sm"
  className="me-2"
  onClick={() => onView(property)} // Ensure this calls the parent onView handler
  title="View Property"
>
  <CIcon icon={cilFullscreen} />
</CButton>
      )}
{userPermissions?.editProperty && (
       <CButton
              color="light"
              size="sm"
              className="me-2"
              onClick={() => onEdit(property)}
              title="Edit Property"
            >  
          <CIcon icon={cilPencil} />
        </CButton> )}
        {userPermissions?.deleteProperty && (
        <CButton
          color="light"
          size="sm"
          style={{ color: 'red' }}
          onClick={() => onDelete(property)}
          title="Delete Property"
        >
          <CIcon icon={cilTrash} />
        </CButton>
        )}
      </CTableDataCell>
    </CTableRow>
  );
};

export default PropertyTableRow;
