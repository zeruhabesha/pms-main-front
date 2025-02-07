import React from "react";
import { CButton } from "@coreui/react";

const PropertyTableToolbar = ({
  selectedRows,
  setSelectedRows,
  handleMultiDelete,
}) => {
  return (
    <>
      {selectedRows.length > 0 && (
        <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">{selectedRows.length}</span> properties
            selected
          </div>
          <div className="d-flex gap-2">
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => setSelectedRows([])}
            >
              Clear Selection
            </CButton>
            <CButton
              color="danger"
              onClick={handleMultiDelete}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </CButton>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyTableToolbar;
