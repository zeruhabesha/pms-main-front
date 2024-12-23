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
    CProgress
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import {
    cilTrash,
    cilCloudDownload as cilDocumentDownload,
    cilFullscreen,
    cilPeople,
    cilFlagAlt,
    cilPencil,
    cilCreditCard,
    cilMoney,
    cilBank,
    cilDescription, // Changed from cilNote to cilDescription
} from "@coreui/icons";

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { downloadAgreementFile } from "../../api/actions/AgreementActions";
import AgreementDetailsModal from "./AgreementDetailsModal";
import { useNavigate } from "react-router-dom";

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
     const navigate = useNavigate();
    const [selectedAgreement, setSelectedAgreement] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleDownloadDocument = (fileName) => {
        if (!fileName) {
            console.error("No file name provided for download.");
            return;
        }
        dispatch(downloadAgreementFile(fileName));
    };

    const handleViewDetails = (agreement) => {
        setSelectedAgreement(agreement);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedAgreement(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            console.warn('Invalid Date', dateString);
            return 'N/A';
        }
    };

    const generateUsage = (rentAmount) => {
        const value = rentAmount ? Math.min(Math.max(parseInt(rentAmount), 0), 100) : 0;
        let color = 'success';
        if (value < 25) {
            color = 'danger';
        } else if (value < 50) {
            color = 'warning';
        } else if (value < 75) {
            color = 'info';
        }
        return {
            value,
            period: 'rent amount',
            color,
        };
    };

    const getPaymentMethodIcon = (paymentMethod) => {
        switch (paymentMethod) {
            case 'cash':
                return cilMoney;
            case 'cheque':
                return cilDescription;
            case 'bank transfer':
                return cilBank;
            default:
                return cilCreditCard;
        }
    };
    const handleEditClick = (agreement) => {
        onEdit(agreement);
    };

    return (
        <div>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Tenant</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Property</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Lease</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            Payment
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {agreements.map((agreement, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        const usage = generateUsage(agreement.rentAmount);
                        const paymentIcon = getPaymentMethodIcon(agreement.paymentTerms?.paymentMethod);
                        return (
                            <CTableRow key={agreement._id}>
                                <CTableDataCell className="text-center">{rowNumber}</CTableDataCell>
                                <CTableDataCell>
                                    <div>{agreement.tenant?.tenantName || "N/A"}</div>
                                    {/*  <div className="small text-body-secondary text-nowrap">
                                         <span>ID:{agreement.tenant?._id}</span>
                                  </div> */}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{agreement.property?.title || "N/A"}</div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>Address:{agreement.property?.address}</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>Start:{formatDate(agreement.leaseStart)}</span>
                                    </div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>End:{formatDate(agreement.leaseEnd)}</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="d-flex justify-content-between text-nowrap">
                                      <div className="fw-semibold">
                                        {agreement.rentAmount ? `$${agreement.rentAmount}` : "N/A"}
                                      </div>
                                      <div className="ms-3">
                                          <small className="text-body-secondary">{usage.period}</small>
                                       </div>
                                  </div>
                                    <CProgress thin color={usage.color} value={usage.value} />
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CIcon
                                        size="xl"
                                        icon={paymentIcon}
                                        title={agreement.paymentTerms?.paymentMethod}
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                         <CButton
                                            color="light"
                                            size="sm"
                                           onClick={() => handleEditClick(agreement)}
                                            className="me-2"
                                            title="Edit Agreement"
                                        >
                                              <CIcon icon={cilPencil} />
                                         </CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            style={{ color: "red" }}
                                            onClick={() => onDelete(agreement._id)}
                                            className="me-2"
                                            title="Delete Agreement"
                                        >
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewDetails(agreement)}
                                            title="View Details"
                                        >
                                            <CIcon icon={cilFullscreen} />
                                        </CButton>
                                          {agreement.documents?.length > 0 &&
                                        <>
                                            {agreement.documents.map((doc, i) => (
                                                <CButton
                                                    key={i}
                                                    color="light"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleDownloadDocument(doc)}
                                                    title={`Download ${doc}`}
                                                >
                                                    <CIcon icon={cilDocumentDownload} />
                                                </CButton>
                                            ))}
                                        </> }
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Total Agreements: {agreements.length}</span>
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

            <AgreementDetailsModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                agreement={selectedAgreement}
            />
        </div>
    );
};

AgreementTable.propTypes = {
    agreements: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            tenant: PropTypes.shape({
                tenantName: PropTypes.string,
                _id: PropTypes.string,
            }),
            property: PropTypes.shape({
                title: PropTypes.string,
                address: PropTypes.string,
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