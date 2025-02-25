import React, { useState, useEffect, useRef } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilFullscreen, cilLockLocked, cilOptions, cilSync } from '@coreui/icons';

const UserActions = ({
  user,
  handleEdit,
  handleDelete,
  handleEditPhoto,
  handleUserDetailsClick,
  handlePermissionsClick,
    handleManageStatusClick // Add this prop
}) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <CDropdown
            variant="btn-group"
            isOpen={dropdownOpen}
            onToggle={toggleDropdown}
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
                <CDropdownItem onClick={() => handleManageStatusClick(user)} title="Manage Status">
    <CIcon icon={cilSync} className="me-2" />
    Manage Status
</CDropdownItem>


            </CDropdownMenu>
        </CDropdown>
    );
};

export default UserActions;