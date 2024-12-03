import React, { useState } from "react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CPagination,
  CPaginationItem,
  CCollapse,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilPencil, cilTrash, cilPlus, cilMinus } from "@coreui/icons";
import PropTypes from "prop-types";

const AgreementTable = ({
  agreements,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  handlePageChange,
  itemsPerPage,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (agreementId) => {
    if (!agreementId) return;
    setExpandedRows((prev) => ({
      ...prev,
      [agreementId]: !prev[agreementId],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const downloadFile = (fileName) => {
    const downloadUrl = `http://localhost:4000/api/v1/lease/download/${fileName}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="table-responsive">
      <CTable hover bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Tenant</CTableHeaderCell>
            <CTableHeaderCell>Property</CTableHeaderCell>
            <CTableHeaderCell>Lease Start</CTableHeaderCell>
            <CTableHeaderCell>Lease End</CTableHeaderCell>
            <CTableHeaderCell>Rent Amount</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {agreements
            .filter((agreement) => agreement && agreement._id) // Ensure valid entries
            .map((agreement, index) => (
              <React.Fragment key={agreement._id}>
                <CTableRow>
                  <CTableDataCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    {agreement.tenant?.tenantName || "N/A"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {agreement.property?.title || "N/A"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatDate(agreement.leaseStart)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatDate(agreement.leaseEnd)}
                  </CTableDataCell>
                  <CTableDataCell>
                    ${agreement.rentAmount || "N/A"}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => onEdit(agreement)}
                        aria-label="Edit Agreement"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => onDelete(agreement._id)}
                        aria-label="Delete Agreement"
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => toggleRow(agreement._id)}
                        aria-label={
                          expandedRows[agreement._id]
                            ? "Collapse Agreement Details"
                            : "Expand Agreement Details"
                        }
                      >
                        <CIcon
                          icon={
                            expandedRows[agreement._id] ? cilMinus : cilPlus
                          }
                        />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan="7" className="p-0">
                    <CCollapse visible={expandedRows[agreement._id]}>
                      <div className="p-3 bg-light collapsible-content">
                        <div>
                          <strong>Security Deposit:</strong>{" "}
                          ${agreement.securityDeposit || "N/A"}
                        </div>
                        <div>
                          <strong>Payment Terms:</strong>{" "}
                          {agreement.paymentTerms?.dueDate || "N/A"} -{" "}
                          {agreement.paymentTerms?.paymentMethod || "N/A"}
                        </div>
                        <div>
                          <strong>Rules and Conditions:</strong>{" "}
                          {agreement.rulesAndConditions || "N/A"}
                        </div>
                        <div>
                          <strong>Additional Occupants:</strong>{" "}
                          {agreement.additionalOccupants?.join(", ") || "N/A"}
                        </div>
                        <div>
                          <strong>Utilities and Services:</strong>{" "}
                          {agreement.utilitiesAndServices || "N/A"}
                        </div>
                        <div>
                          <strong>Documents:</strong>{" "}
                          {agreement.documents?.length > 0 ? (
                            <ul className="list-unstyled">
                              {agreement.documents.map((doc, idx) => (
                                <li key={idx}>
                                  <button
                                    className="btn btn-link"
                                    onClick={() => downloadFile(doc)}
                                  >
                                    {doc}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </div>
                    </CCollapse>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      {totalPages > 1 && (
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
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
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
      )}
    </div>
  );
};

AgreementTable.propTypes = {
  agreements: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tenant: PropTypes.shape({
        tenantName: PropTypes.string,
      }),
      property: PropTypes.shape({
        title: PropTypes.string,
      }),
      leaseStart: PropTypes.string,
      leaseEnd: PropTypes.string,
      rentAmount: PropTypes.number,
      securityDeposit: PropTypes.number,
      paymentTerms: PropTypes.shape({
        dueDate: PropTypes.string,
        paymentMethod: PropTypes.string,
      }),
      rulesAndConditions: PropTypes.string,
      additionalOccupants: PropTypes.arrayOf(PropTypes.string),
      utilitiesAndServices: PropTypes.string,
      documents: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default AgreementTable;
