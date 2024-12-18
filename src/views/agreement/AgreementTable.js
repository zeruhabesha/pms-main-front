import React from "react";
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
    cilCloudDownload as cilDocumentDownload,
} from "@coreui/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandedRow, selectExpandedRows } from "../../api/slice/AgreementSlice";
import { downloadAgreementFile } from "../../api/actions/AgreementActions";

const AgreementTable = ({
    agreements,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    handlePageChange,
    itemsPerPage,
}) => {
    const dispatch = useDispatch();
    const expandedRows = useSelector(selectExpandedRows);

    const handleDownloadDocument = (fileName) => {
        if (!fileName) {
            console.error("No file name provided for download.");
            return;
        }
        dispatch(downloadAgreementFile(fileName));
    };

    const handleToggleRow = (agreementId) => {
        dispatch(toggleExpandedRow(agreementId));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
             console.warn('Invalid Date', dateString)
             return 'N/A'
        }
    };

    return (
        <div>
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
                    {agreements.map((agreement, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        return (
                            <React.Fragment key={agreement._id}>
                                <CTableRow>
                                    <CTableDataCell>{rowNumber}</CTableDataCell>
                                    <CTableDataCell>{agreement.tenant?.tenantName || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{agreement.property?.title || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{formatDate(agreement.leaseStart)}</CTableDataCell>
                                    <CTableDataCell>{formatDate(agreement.leaseEnd)}</CTableDataCell>
                                    <CTableDataCell>
                                        {agreement.rentAmount ? `$${agreement.rentAmount}` : "N/A"}
                                    </CTableDataCell>
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
                                            color="light"
                                            size="sm"
                                            onClick={() => onEdit(agreement)}
                                            className="me-2"
                                            title="Edit"
                                        >
                                            <CIcon icon={cilPencil} />
                                        </CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            style={{ color: "red" }}
                                            onClick={() => onDelete(agreement._id)}
                                            className="me-2"
                                            title="Delete"
                                        >
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            onClick={() => handleToggleRow(agreement._id)}
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
                                                <strong>Payment Terms:</strong> {agreement.paymentTerms?.dueDate || "N/A"} - {agreement.paymentTerms?.paymentMethod || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Rules and Conditions:</strong> {agreement.rulesAndConditions || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Additional Occupants:</strong> {agreement.additionalOccupants?.join(", ") || "None"}
                                            </div>
                                            <div>
                                                <strong>Utilities and Services:</strong> {agreement.utilitiesAndServices || "N/A"}
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </CTableBody>
            </CTable>

            {totalPages > 1 && (
                <CPagination className="mt-3">
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        title="First Page"
                    >
                        «
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        title="Previous Page"
                    >
                        ‹
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <CPaginationItem
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                            title={`Go to page ${index + 1}`}
                        >
                            {index + 1}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        title="Next Page"
                    >
                        ›
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        title="Last Page"
                    >
                        »
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