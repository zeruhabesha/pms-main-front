import React from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton, // Added CButton import
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilFullscreen, cilLockLocked, cilOptions } from '@coreui/icons';

const UserActions = ({
  user,
  handleEdit,
  handleDelete,
  handleEditPhoto,
  handleUserDetailsClick,
  handlePermissionsClick,
  dropdownOpen,
  toggleDropdown,
  closeDropdown,
  dropdownRef // Add dropdownRef prop
}) => {


  return (
    <CDropdown
      variant="btn-group"
      isOpen={dropdownOpen === user._id}
      onToggle={() => toggleDropdown(user._id)}
      onMouseLeave={closeDropdown}
      innerRef={dropdownRef}
    >
      <CDropdownToggle color="light" caret={false} size="sm" title="Actions">
        <CIcon icon={cilOptions} />
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={() => handleEdit(user)} title="Edit">
          <CIcon icon={cilPencil} className="me-2" />
          Edit
        </CDropdownItem>
        <CDropdownItem onClick={() => handleDelete(user)} style={{ color: 'red' }} title="Delete">
          <CIcon icon={cilTrash} className="me-2" />
          Delete
        </CDropdownItem>
        <CDropdownItem onClick={() => handleUserDetailsClick(user)} title="Details">
          <CIcon icon={cilFullscreen} className="me-2" />
          Details
        </CDropdownItem>
        {user?.role?.toLowerCase() === 'user' && (
          <CDropdownItem onClick={() => handlePermissionsClick(user)} title="Permissions">
            <CIcon icon={cilLockLocked} className="me-2" />
            Permissions
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default UserActions;