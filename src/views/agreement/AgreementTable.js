import React, { useState, useMemo } from "react";
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
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import {
  cilPencil,
  cilTrash,
  cilPlus,
  cilMinus,
  cilCloudDownload,
  cilClipboard,
  cilFile,
  cilArrowTop,
  cilArrowBottom,
  cilCloudDownload as cilDocumentDownload,
} from "@coreui/icons";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const toggleRow = (agreementId) => {
    if (!agreementId) return;
    setExpandedRows((prev) => ({
      ...prev,
      [agreementId]: !prev[agreementId],
    }));
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending";
      return { key, direction };
    });
  };

  const sortedAgreements = useMemo(() => {
    if (!sortConfig.key) return agreements;

    return [...agreements].sort((a, b) => {
      const aKey = a[sortConfig.key] || "";
      const bKey = b[sortConfig.key] || "";

      if (aKey < bKey) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aKey > bKey) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [agreements, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDownloadDocument = (fileName) => {
    const apiUrl = `http://localhost:4000/api/v1/lease/download/${fileName}`;
    window.open(apiUrl, "_blank");
  };

  const csvData = agreements.map((agreement, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    tenant: agreement.tenant?.name || "N/A",
    property: agreement.property?.name || "N/A",
    leaseStart: agreement.leaseStart || "N/A",
    leaseEnd: agreement.leaseEnd || "N/A",
    rentAmount: agreement.rentAmount || "N/A",
  }));

  const clipboardData = agreements
    .map(
      (agreement, index) =>
        `${(currentPage - 1) * itemsPerPage + index + 1}. ${
          agreement.tenant?.name || "N/A"
        } - ${agreement.property?.name || "N/A"} - ${formatDate(agreement.leaseStart)} - ${formatDate(
          agreement.leaseEnd
        )}`
    )
    .join("\n");

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Agreement Data", 14, 10);

    const tableData = agreements.map((agreement, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      agreement.tenant?.name || "N/A",
      agreement.property?.name || "N/A",
      agreement.leaseStart || "N/A",
      agreement.leaseEnd || "N/A",
      `$${agreement.rentAmount || "N/A"}`,
    ]);

    doc.autoTable({
      head: [["#", "Tenant", "Property", "Lease Start", "Lease End", "Rent Amount"]],
      body: tableData,
      startY: 20,
    });

    doc.save("agreement_data.pdf");
  };

  return (
    <div>
      <div className="d-flex mb-3 gap-2">
        <div className="d-flex gap-2">
          <CSVLink
            data={csvData}
            headers={[
              { label: "#", key: "index" },
              { label: "Tenant", key: "tenant" },
              { label: "Property", key: "property" },
              { label: "Lease Start", key: "leaseStart" },
              { label: "Lease End", key: "leaseEnd" },
              { label: "Rent Amount", key: "rentAmount" },
            ]}
            filename="agreement_data.csv"
            className="btn btn-dark"
          >
            <CIcon icon={cilFile} title="Export CSV" />
          </CSVLink>
          <CopyToClipboard text={clipboardData}>
            <CButton color="dark" title="Copy to Clipboard">
              <CIcon icon={cilClipboard} />
            </CButton>
          </CopyToClipboard>
          <CButton color="dark" onClick={exportToPDF} title="Export PDF">
            <CIcon icon={cilCloudDownload} />
          </CButton>
        </div>
      </div>

      <CTable responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Tenant</CTableHeaderCell>
            <CTableHeaderCell>Property</CTableHeaderCell>
            <CTableHeaderCell>Lease Start</CTableHeaderCell>
            <CTableHeaderCell>Lease End</CTableHeaderCell>
            <CTableHeaderCell>Rent Amount</CTableHeaderCell>
            <CTableHeaderCell>Documents</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {sortedAgreements.map((agreement, index) => (
            <React.Fragment key={agreement._id}>
              <CTableRow>
                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{agreement.tenant?.name || "N/A"}</CTableDataCell>
                <CTableDataCell>{agreement.property?.name || "N/A"}</CTableDataCell>
                <CTableDataCell>{formatDate(agreement.leaseStart)}</CTableDataCell>
                <CTableDataCell>{formatDate(agreement.leaseEnd)}</CTableDataCell>
                <CTableDataCell>${agreement.rentAmount || "N/A"}</CTableDataCell>
                <CTableDataCell>
                  {agreement.documents?.length > 0 ? (
                    agreement.documents.map((doc, i) => (
                      <CButton
                        key={i}
                        color="light"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDownloadDocument(doc)}
                        title={`Download ${doc}`}
                      >
                        <CIcon icon={cilDocumentDownload} /> {doc}
                      </CButton>
                    ))
                  ) : (
                    "No Documents"
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="dark"
                    size="sm"
                    onClick={() => onEdit(agreement)}
                    className="me-2"
                    title="Edit"
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => onDelete(agreement._id)}
                    className="me-2"
                    title="Delete"
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                  <CButton
                    color="light"
                    size="sm"
                    onClick={() => toggleRow(agreement._id)}
                    title={expandedRows[agreement._id] ? "Collapse" : "Expand"}
                  >
                    <CIcon icon={expandedRows[agreement._id] ? cilMinus : cilPlus} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
              {expandedRows[agreement._id] && (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="bg-light p-3">
                    <div>
                      <strong>Security Deposit:</strong> ${agreement.securityDeposit || "N/A"}
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
                      {agreement.additionalOccupants?.join(", ") || "None"}
                    </div>
                    <div>
                      <strong>Utilities and Services:</strong>{" "}
                      {agreement.utilitiesAndServices || "N/A"}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>

      {totalPages > 1 && (
        <CPagination className="mt-3">
          <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
            &laquo;
          </CPaginationItem>
          <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
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
          <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            &rsaquo;
          </CPaginationItem>
          <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
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
        name: PropTypes.string,
      }),
      property: PropTypes.shape({
        name: PropTypes.string,
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
