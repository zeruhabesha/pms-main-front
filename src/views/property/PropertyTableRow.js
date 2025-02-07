import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CTableRow,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import {
  cilPencil,
  cilTrash,
  cilFullscreen,
  cilOptions,
  cilLocationPin,
  cilCheckCircle,
  cilBan,
  cilPeople,
  cilPhone,
  cilFile,
  cilArrowBottom,
} from "@coreui/icons";
import { decryptData } from "../../api/utils/crypto";

const PropertyTableRow = ({
  index,
  property,
  onEdit,
  onDelete,
  onView,
  dropdownOpen,
  toggleDropdown,
  closeDropdown,
  dropdownRefs,
  isSelected,
  onSelect,
}) => {
  const [userPermissions, setUserPermissions] = useState(null);

  const propertyId = property._id || property.id;

  useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem("user");
      const decryptedUser = encryptedUser ? decryptData(encryptedUser) : null;
      setUserPermissions(decryptedUser?.permissions || []);
    } catch (error) {
      console.error("Error decrypting user data:", error);
    }
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } catch (e) {
      console.error("Error formatting currency", e);
      return "N/A";
    }
  };

  const getStatusIcon = (status) => {
    const statusIconMap = {
      open: (
        <CIcon icon={cilCheckCircle} className="text-success" title="Open" />
      ),
      reserved: (
        <CIcon icon={cilBan} className="text-danger" title="Reserved" />
      ),
      closed: <CIcon icon={cilPeople} className="text-dark" title="Closed" />,
      "under maintenance": (
        <CIcon
          icon={cilPhone}
          className="text-warning"
          title="Under Maintenance"
        />
      ),
      leased: <CIcon icon={cilFile} className="text-info" title="Leased" />,
      sold: (
        <CIcon icon={cilArrowBottom} className="text-primary" title="Sold" />
      ),
    };
    return statusIconMap[status?.toLowerCase()] || null;
  };

  const handleEditClick = () => {
    onEdit(propertyId);
  };

  const handleViewClick = () => {
    onView(propertyId);
  };

  const handleDeleteClick = () => {
    onDelete(propertyId);
  };

  // new
  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing

    onSelect(propertyId); //NEW toggle state (since ckech have its own onchange) - main reason keep ckechbox inside not put in cell click event.
  };

  return (
    <CTableRow className={isSelected ? "table-active" : ""}>
      <CTableDataCell className="text-center">
        <CFormCheck
          id={`checkbox-${propertyId}`}
          checked={isSelected} //Set isChecked toggle - update
          onChange={handleCheckboxChange} //Use our onChange on property set as it is more control over our value updates.
        />
      </CTableDataCell>
      <CTableDataCell className="text-center">{index}</CTableDataCell>
      <CTableDataCell>
        <div>{property.title || "N/A"}</div>
        <div className="small text-body-secondary text-nowrap">
          <CIcon icon={cilLocationPin} size="sm" className="me-1" />
          <span>{property.address || "N/A"}</span>
        </div>
      </CTableDataCell>
      <CTableDataCell>{property?.propertyType || "N/A"}</CTableDataCell>
      <CTableDataCell>{formatCurrency(property.price)}</CTableDataCell>
      <CTableDataCell>{getStatusIcon(property.status)}</CTableDataCell>
      <CTableDataCell>
        <CDropdown
          variant="btn-group"
          visible={dropdownOpen === propertyId}
          onToggle={() => toggleDropdown(propertyId)}
          onMouseLeave={closeDropdown}
          innerRef={(ref) => (dropdownRefs.current[propertyId] = ref)}
        >
          <CDropdownToggle
            color="light"
            caret={false}
            size="sm"
            title="Actions"
          >
            <CIcon icon={cilOptions} />
          </CDropdownToggle>
          <CDropdownMenu>
            {userPermissions?.editProperty && (
              <CDropdownItem onClick={handleEditClick} title="Edit Property">
                <CIcon icon={cilPencil} className="me-2" />
                Edit
              </CDropdownItem>
            )}
            {userPermissions?.deleteProperty && (
              <CDropdownItem
                onClick={handleDeleteClick}
                style={{ color: "red" }}
                title="Delete Property"
              >
                <CIcon icon={cilTrash} className="me-2" />
                Delete
              </CDropdownItem>
            )}
            <CDropdownItem onClick={handleViewClick} title="View Property">
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
  property: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    address: PropTypes.string,
    propertyType: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.any,
  toggleDropdown: PropTypes.func.isRequired,
  closeDropdown: PropTypes.func.isRequired,
  dropdownRefs: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired, //ADDED toggle status value!
  onSelect: PropTypes.func.isRequired, //ADD toggle callback to parent update this.
};

export default PropertyTableRow;
