import React, { useMemo } from "react";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CFormCheck,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilPeople, cilArrowTop, cilArrowBottom } from "@coreui/icons";
import PropertyTableRow from "./PropertyTableRow";

const PropertyTableData = React.memo(
  ({
    properties,
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    dropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRefs,
    selectedPropertyIds,
    handlePropertySelect,
    handleSelectAll,
    onEdit,
    onDelete,
    onView,
  }) => {
    // are All is Selected check!
    const allSelected = React.useMemo(() => {
      return (
        properties.length > 0 &&
        properties.every((property) =>
          selectedPropertyIds.includes(property._id || property.id)
        )
      );
    }, [properties, selectedPropertyIds]);

    //Is part selected.
    const someSelected = useMemo(() => {
      return (
        properties.length > 0 &&
        properties.some((property) =>
          selectedPropertyIds.includes(property._id || property.id)
        ) &&
        !allSelected
      );
    }, [properties, selectedPropertyIds]);

    return (
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="bg-body-tertiary text-center">
              <CFormCheck
                id="selectAll"
                onChange={handleSelectAll}
                checked={allSelected}
                indeterminate={someSelected}
              />
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell
              className="bg-body-tertiary"
              onClick={() => handleSort("title")}
              style={{ cursor: "pointer" }}
            >
              Title
              {sortConfig.key === "title" && (
                <CIcon
                  icon={
                    sortConfig.direction === "ascending"
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
              )}
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">
              Property Type
            </CTableHeaderCell>
            <CTableHeaderCell
              className="bg-body-tertiary"
              onClick={() => handleSort("price")}
              style={{ cursor: "pointer" }}
            >
              Price
              {sortConfig.key === "price" && (
                <CIcon
                  icon={
                    sortConfig.direction === "ascending"
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
              )}
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">
              Status
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {properties &&
            Array.isArray(properties) &&
            properties.map((property, index) => {
              const key = property.id || property._id || `index-${index}`;
              return (
                <PropertyTableRow
                  key={key}
                  index={(currentPage - 1) * itemsPerPage + index + 1}
                  property={property}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  dropdownOpen={dropdownOpen}
                  toggleDropdown={toggleDropdown}
                  closeDropdown={closeDropdown}
                  dropdownRefs={dropdownRefs}
                  isSelected={selectedPropertyIds.includes(
                    property._id || property.id
                  )} //NEW ADD check and give to property is Selected! for ckech change is ckeck!!
                  onSelect={handlePropertySelect} //ADD proper on selelct to property as main toggle update with call back check as main function logic
                />
              );
            })}
        </CTableBody>
      </CTable>
    );
  }
);

export default PropertyTableData;
