import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";
import PropertyDeleteModal from "./PropertyDeleteModal";
import PropertyTableFilters from "./PropertyTableFilters";
import PropertyTableToolbar from "./PropertyTableToolbar";
import PropertyTableData from "./PropertyTableData";
import PropertyTablePagination from "./PropertyTablePagination";
import { decryptData } from "../../api/utils/crypto";
import PropTypes from "prop-types";

const PropertyTable = React.memo(
  ({
    properties = [],
    totalProperties = 0,
    onEdit = () => {},
    onDelete = () => {},
    onView = () => {},
    onPhotoDelete = () => {},
    onPhotoUpdate = () => {},
    onDeleteMultiple = () => {},
    currentPage = 1,
    handlePageChange = () => {},
    totalPages = 1,
    itemsPerPage = 10,
    // selectedRows = [], // No need for this prop anymore, managed internally
    setSelectedRows: setExtSelectedRows = () => {}, // rename setselectedrow for update purpose for main parent (since dont really neeed for handle but can handle to update top from within this component)
  }) => {
    const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "ascending",
    });
    const [userPermissions, setUserPermissions] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
      visible: false,
      propertyToDelete: null,
    });
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRefs = useRef({});
    const [selectedStatus, setSelectedStatus] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000000]); // Initial price range
    const [sliderMax, setSliderMax] = useState(1000000); // Initial max value of price
    const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const totalPagesComputed = useMemo(
      () => Math.ceil(totalProperties / itemsPerPage),
      [totalProperties, itemsPerPage]
    );
    console.log("SelectedProperty: ", selectedPropertyIds);
    useEffect(() => {
      const encryptedUser = localStorage.getItem("user");
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser);
        if (decryptedUser && decryptedUser.permissions) {
          setUserPermissions(decryptedUser.permissions);
        }
      }
    }, []);

    useEffect(() => {
      if (properties && properties.length > 0) {
        const maxPrice = properties.reduce((max, property) => {
          return Math.max(max, Number(property.price || 0));
        }, 0);

        setSliderMax(maxPrice > 1000000 ? maxPrice : 1000000);
        setPriceRange([0, maxPrice > 1000000 ? maxPrice : 1000000]);
      } else {
        setSliderMax(1000000);
        setPriceRange([0, 1000000]);
      }
    }, [properties]);

    const handleSort = (key) => {
      setSortConfig((prevConfig) => ({
        key,
        direction:
          prevConfig.key === key && prevConfig.direction === "ascending"
            ? "descending"
            : "ascending",
      }));
    };

    const toggleDropdown = (propertyId) => {
      setDropdownOpen((prevState) =>
        prevState === propertyId ? null : propertyId
      );
    };

    const closeDropdown = () => {
      setDropdownOpen(null);
    };

    const sortedProperties = useMemo(() => {
      if (!sortConfig.key) return properties;

      return [...properties].sort((a, b) => {
        const aKey = a[sortConfig.key] || "";
        const bKey = b[sortConfig.key] || "";

        if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }, [properties, sortConfig]);

    const filteredProperties = useMemo(() => {
      let filtered = sortedProperties;

      if (selectedStatus) {
        filtered = filtered.filter(
          (property) => property.status === selectedStatus
        );
      }

      filtered = filtered.filter((property) => {
        const price = Number(property.price);
        return price >= priceRange[0] && price <= priceRange[1];
      });

      return filtered;
    }, [sortedProperties, selectedStatus, priceRange]);

    // Handle single checkbox change
    const handlePropertySelect = (propertyId) => {
      setSelectedPropertyIds((prevSelected) => {
        if (prevSelected.includes(propertyId)) {
          const newList = prevSelected.filter((id) => id !== propertyId);
          //Update
          setExtSelectedRows(newList); // update to top for data!
          return newList;
        } else {
          const newList = [...prevSelected, propertyId];
          setExtSelectedRows(newList); // update to top for data!
          return newList;
        }
      });
    };

    const handleSelectAll = () => {
      if (selectedPropertyIds.length === filteredProperties.length) {
        // Deselect all if all are selected
        setSelectedPropertyIds([]);
        setExtSelectedRows([]);
      } else {
        // Select all filtered properties
        const allIds = filteredProperties.map(
          (property) => property._id || property.id
        );
        setSelectedPropertyIds(allIds);
        setExtSelectedRows(allIds);
      }
    };

    const handleMultiDeleteConfirm = async () => {
      if (selectedPropertyIds.length === 0) return;

      try {
        setIsDeleting(true);
        await onDeleteMultiple(selectedPropertyIds);
        setSelectedPropertyIds([]);
        setExtSelectedRows([]);
      } catch (error) {
        console.error("Error deleting properties:", error);
      } finally {
        setIsDeleting(false);
        setShowMultiDeleteConfirm(false);
      }
    };

    const handleMultiDelete = () => {
      if (selectedPropertyIds.length > 0) {
        setShowMultiDeleteConfirm(true);
      }
    };

    const openDeleteModal = (property) => {
      setDeleteModal({ visible: true, propertyToDelete: property });
    };

    const closeDeleteModal = () => {
      setDeleteModal({ visible: false, propertyToDelete: null });
    };

    return (
      <div>
        <PropertyTableFilters
          properties={properties}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sliderMax={sliderMax}
          setSliderMax={setSliderMax}
        />

        <PropertyTableToolbar
          selectedRows={selectedPropertyIds}
          setSelectedRows={setSelectedPropertyIds}
          handleMultiDelete={handleMultiDelete}
        />

        <CModal
          visible={showMultiDeleteConfirm}
          onClose={() => setShowMultiDeleteConfirm(false)}
          alignment="center"
        >
          <CModalHeader closeButton>
            <CModalTitle>Confirm Delete</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to delete {selectedPropertyIds.length}{" "}
            selected properties? This action cannot be undone.
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setShowMultiDeleteConfirm(false)}
            >
              Cancel
            </CButton>
            <CButton
              color="danger"
              onClick={handleMultiDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </CButton>
          </CModalFooter>
        </CModal>

        <PropertyTableData
          properties={filteredProperties}
          sortConfig={sortConfig}
          handleSort={handleSort}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          dropdownOpen={dropdownOpen}
          toggleDropdown={toggleDropdown}
          closeDropdown={closeDropdown}
          dropdownRefs={dropdownRefs}
          selectedPropertyIds={selectedPropertyIds}
          handlePropertySelect={handlePropertySelect}
          handleSelectAll={handleSelectAll}
          onEdit={onEdit} // Pass these props
          onDelete={onDelete} // Pass these props
          onView={onView} // Pass these props
        />

        <PropertyTablePagination
          totalPagesComputed={totalPagesComputed}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalProperties={totalProperties}
        />

        <PropertyDeleteModal
          visible={deleteModal.visible}
          onClose={closeDeleteModal}
          confirmDelete={onDelete}
          propertyToDelete={deleteModal.propertyToDelete}
        />
      </div>
    );
  }
);

PropertyTable.propTypes = {
  properties: PropTypes.array,
  totalProperties: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onPhotoDelete: PropTypes.func,
  onPhotoUpdate: PropTypes.func,
  onDeleteMultiple: PropTypes.func,
  currentPage: PropTypes.number,
  handlePageChange: PropTypes.func,
  totalPages: PropTypes.number,
  itemsPerPage: PropTypes.number,
  setSelectedRows: PropTypes.func,
};

export default PropertyTable;
