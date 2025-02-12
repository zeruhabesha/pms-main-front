// src/views/agreement/AgreementTable.js
import React, { useState, useEffect, useRef, useCallback } from "react";
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
    CProgress,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from "@coreui/react";
import "../paggination.scss";
import { CIcon } from "@coreui/icons-react";
import {
    cilTrash,
    cilCloudDownload as cilDocumentDownload,
    cilFullscreen,
    cilPeople,
    cilPencil,
    cilCreditCard,
    cilMoney,
    cilBank,
    cilDescription,
    cilOptions,
    cilLocationPin,
    cilCalendar,
    cilCheckCircle,
    cilWarning,
    cilXCircle
} from "@coreui/icons";
import { decryptData } from '../../api/utils/crypto';

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { downloadAgreementFile } from "../../api/actions/AgreementActions";
import AgreementDetailsModal from "./AgreementDetailsModal";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const AgreementTable = ({
    agreements,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    handlePageChange,
    itemsPerPage,
    onDownloadComplete, // Add onDownloadComplete prop
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedAgreement, setSelectedAgreement] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRefs = useRef({});

    const handleDownloadDocument = useCallback(
        (fileName) => {
            if (!fileName) {
                console.error("No file name provided for download.");
                return;
            }

            const download = async () => {
                try {
                    await dispatch(downloadAgreementFile(fileName));
                    if (onDownloadComplete) {
                        onDownloadComplete(); // Call the callback function
                    }
                } catch (error) {
                    console.error("Error downloading file:", error);
                }
            };

            download();
        },
        [dispatch, onDownloadComplete]
    );

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

    const calculateDaysUntilEnd = (endDate) => {
        if (!endDate) return null;
        try {
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const diffInTime = end - now;
            const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
            return diffInDays;
        } catch (e) {
            return null
        }
    };

    const getAgreementStatusDetails = (endDate) => {
        const days = calculateDaysUntilEnd(endDate);
        if (days === null) {
            return {
                text: days,
                color: "text-secondary",
                icon: null
            };
        } else if (days > 30) {
            return {
                text: days,
                color: 'text-success',
                icon: cilCheckCircle
            };
        } else if (days <= 30 && days >= 0) {
            return {
                text: days,
                color: 'text-warning',
                icon: cilWarning
            };
        } else {
            return {
                text: days,
                color: 'text-danger',
                icon: cilXCircle
            };
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
    const [userPermissions, setUserPermissions] = useState(null);
    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }
    }, []);

    const [agreementToDelete, setAgreementToDelete] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleDeleteClick = (agreement) => {
        setAgreementToDelete(agreement);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (agreementToDelete) {
            onDelete(agreementToDelete._id);
            setDeleteModalVisible(false);
            setAgreementToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalVisible(false);
        setAgreementToDelete(null);
    };

    const toggleDropdown = (agreementId) => {
        setDropdownOpen(prevState => prevState === agreementId ? null : agreementId);
    };

    const closeDropdown = () => {
        setDropdownOpen(null);
    };
    const handleClickOutside = (event) => {
        if (dropdownOpen) {
            if (dropdownRefs.current[dropdownOpen] && !dropdownRefs.current[dropdownOpen].contains(event.target)) {
                closeDropdown();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);



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
                        <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {agreements.map((agreement, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        const usage = generateUsage(agreement.rentAmount);
                        const paymentIcon = getPaymentMethodIcon(agreement.paymentTerms?.paymentMethod);
                        const statusDetails = getAgreementStatusDetails(agreement.leaseEnd);
                        return (
                            <CTableRow key={agreement._id}>
                                <CTableDataCell className="text-center">{rowNumber}</CTableDataCell>
                                <CTableDataCell>
                                    <div>{agreement.tenant?.tenantName || "N/A"}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{agreement.property?.title || "N/A"}</div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>
                                            <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                                            {agreement.property?.address}</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>
                                            <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                            SD: {formatDate(agreement.leaseStart)}</span>
                                    </div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <span>
                                            <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                            ED:   {formatDate(agreement.leaseEnd)}</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex justify-content-between text-nowrap">
                                        <div className="fw-semibold">
                                            {agreement.rentAmount ? `${agreement.rentAmount} Birr` : "N/A"}
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
                                    <div className={` ${statusDetails.color}`}>
                                        {statusDetails.text}
                                        {statusDetails.icon && (
                                            <CIcon icon={statusDetails.icon} className="ms-1" />
                                        )}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CDropdown
                                        variant="btn-group"
                                        isOpen={dropdownOpen === agreement?.id}
                                        onToggle={() => toggleDropdown(agreement?.id)}
                                        onMouseLeave={closeDropdown}
                                        innerRef={ref => (dropdownRefs.current[agreement?.id] = ref)}
                                    >
                                        <CDropdownToggle color="light" caret={false} size="sm" title="Actions">
                                            <CIcon icon={cilOptions} />
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                            {userPermissions?.editAgreement && (
                                                <CDropdownItem
                                                    onClick={() => handleEditClick(agreement)}
                                                    title="Edit"
                                                >
                                                    <CIcon icon={cilPencil} className="me-2" />
                                                    Edit
                                                </CDropdownItem>
                                            )}
                                            {userPermissions?.deleteAgreement && (
                                                <CDropdownItem
                                                    onClick={() => handleDeleteClick(agreement)}
                                                    title="Delete"
                                                    style={{ color: 'red' }}
                                                >
                                                    <CIcon icon={cilTrash} className="me-2" />
                                                    Delete
                                                </CDropdownItem>
                                            )}
                                            <CDropdownItem
                                                onClick={() => handleViewDetails(agreement)}
                                                title="View Details"
                                            >
                                                <CIcon icon={cilFullscreen} className="me-2" />
                                                Details
                                            </CDropdownItem>

                                            {agreement.documents?.length > 0 &&
                                                agreement.documents.map((doc, index) => (
                                                    <CDropdownItem
                                                        key={doc}
                                                        onClick={() => handleDownloadDocument(doc)}
                                                        title={`Download ${doc}`}
                                                    >
                                                        <CIcon icon={cilDocumentDownload} className="me-2" />
                                                        Download {doc.split('.').slice(-1)[0].toUpperCase()}
                                                    </CDropdownItem>
                                                ))
                                            }
                                        </CDropdownMenu>
                                    </CDropdown>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>

            <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
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

            <DeleteConfirmationModal
                visible={deleteModalVisible}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemName={agreementToDelete?.property?.title || "this agreement"}
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
    onDownloadComplete: PropTypes.func, // Add the new prop
};

export default AgreementTable;