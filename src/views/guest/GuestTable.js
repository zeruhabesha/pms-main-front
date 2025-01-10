// components/guests/GuestTable.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CPagination,
    CPaginationItem,
    CFormInput,
    CBadge,
} from '@coreui/react';
import "../paggination.scss";
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilArrowTop, cilArrowBottom, cilFile, cilClipboard, cilCloudDownload, cilPlus } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGuests, deleteGuest } from "../../api/actions/guestActions";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import '../Super.scss';

const GuestTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { guests, isLoading, isError, message } = useSelector(state => state.guest);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        dispatch(fetchAllGuests());
    }, [dispatch]);

    const guestsPerPage = 10;
    const totalPages = Math.ceil((guests?.length || 0) / guestsPerPage);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this guest?")) {
            dispatch(deleteGuest(id));
        }
    };
    const handleEdit = (id) => {
        navigate(`/edit-guest/${id}`);
    };
    const handleView = (id) => {
        navigate(`/view-guest/${id}`);
    };

    const filteredGuests = useMemo(() => {
        if (!searchTerm) return guests;
        return guests?.filter((guest) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                guest.name.toLowerCase().includes(searchLower) ||
                guest.email.toLowerCase().includes(searchLower) ||
                guest.phoneNumber.includes(searchLower)
            );
        });
    }, [guests, searchTerm]);

    const sortedGuests = useMemo(() => {
        if (!sortConfig.key) return filteredGuests;

        return [...(filteredGuests || [])].sort((a, b) => {
            const aKey = (a[sortConfig.key] && typeof a[sortConfig.key] === 'object') ? (a[sortConfig.key]?.name || '') : (a[sortConfig.key] || '');
            const bKey = (b[sortConfig.key] && typeof b[sortConfig.key] === 'object') ? (b[sortConfig.key]?.name || '') : (b[sortConfig.key] || '');


            if (aKey < bKey) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aKey > bKey) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredGuests, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
            return { key, direction };
        });
    };
    const currentGuests = useMemo(() => {
       if(!Array.isArray(sortedGuests)) return [];
        const startIndex = (currentPage - 1) * guestsPerPage;
        const endIndex = startIndex + guestsPerPage;
        return sortedGuests.slice(startIndex, endIndex);
    }, [currentPage, sortedGuests, guestsPerPage]);

    const csvData = currentGuests?.map((guest, index) => ({
        index: (currentPage - 1) * 10 + index + 1,
        name: guest?.name || 'N/A',
        email: guest?.email || 'N/A',
        phone: guest?.phoneNumber || 'N/A',
        arrivalDate: new Date(guest?.arrivalDate).toLocaleDateString() || 'N/A',
        departureDate: new Date(guest?.departureDate).toLocaleDateString() || 'N/A',
        status: guest?.status || 'N/A',
    }));

    const clipboardData = currentGuests
        .map(
            (guest, index) =>
                `${(currentPage - 1) * 10 + index + 1}. Name: ${guest?.name || 'N/A'}, Email: ${
                    guest?.email || 'N/A'
                }, Phone: ${guest?.phoneNumber || 'N/A'}, Arrival Date: ${new Date(guest?.arrivalDate).toLocaleDateString() || 'N/A'}, Departure Date: ${new Date(guest?.departureDate).toLocaleDateString() || 'N/A'} Status: ${guest?.status || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Guest Data', 14, 10);

        const tableData = currentGuests.map((guest, index) => [
            (currentPage - 1) * 10 + index + 1,
            guest?.name || 'N/A',
            guest?.email || 'N/A',
            guest?.phoneNumber || 'N/A',
            new Date(guest?.arrivalDate).toLocaleDateString() || 'N/A',
            new Date(guest?.departureDate).toLocaleDateString() || 'N/A',
            guest?.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Name', 'Email', 'Phone', 'Arrival Date', 'Departure Date','Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('guest_data.pdf');
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error: {message}</div>;
    }


    return (
        <div>
             <div className="d-flex justify-content-between mb-3 gap-2">
                 <div className="d-flex gap-2">
                    <CSVLink
                        data={csvData}
                        headers={[
                            { label: '#', key: 'index' },
                            { label: 'Name', key: 'name' },
                            { label: 'Email', key: 'email' },
                            { label: 'Phone', key: 'phone' },
                            { label: 'Arrival Date', key: 'arrivalDate' },
                            { label: 'Departure Date', key: 'departureDate' },
                            { label: 'Status', key: 'status' },
                        ]}
                        filename="guest_data.csv"
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
                 <Link to="/add-guest">
                 <div className="d-flex gap-2">
                            <button
                                className="learn-more"
                              >
                                <span className="circle" aria-hidden="true">
                                    <span className="icon arrow"></span>
                                </span>
                                <span className="button-text">Add Guest</span>
                            </button>
                        </div>
                 </Link>
             </div>
            <CFormInput
                type="text"
                placeholder="Search by name, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-100%"
            />


            <div className="table-responsive">
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell onClick={() => handleSort('index')} style={{ cursor: 'pointer' }}>
                                #
                                {sortConfig.key === 'index' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                Name
                                {sortConfig.key === 'name' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                                Email
                                {sortConfig.key === 'email' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('phoneNumber')} style={{ cursor: 'pointer' }}>
                                Phone
                                {sortConfig.key === 'phoneNumber' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('arrivalDate')} style={{ cursor: 'pointer' }}>
                                Arrival Date
                                {sortConfig.key === 'arrivalDate' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('departureDate')} style={{ cursor: 'pointer' }}>
                                Departure Date
                                {sortConfig.key === 'departureDate' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                Status
                                {sortConfig.key === 'status' && (
                                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                                )}
                            </CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {currentGuests?.map((guest, index) => (
                            <CTableRow key={guest._id}>
                                <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>
                                <CTableDataCell>{guest.name}</CTableDataCell>
                                <CTableDataCell>{guest.email}</CTableDataCell>
                                <CTableDataCell>{guest.phoneNumber}</CTableDataCell>
                                <CTableDataCell>{new Date(guest.arrivalDate).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{new Date(guest.departureDate).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>
                                    {guest.status === 'Checked In' ? (
                                        <CBadge color="success">Checked In</CBadge>
                                    ) : guest.status === 'Checked Out' ? (
                                        <CBadge color="secondary">Checked Out</CBadge>
                                    ) : (
                                        <CBadge color="warning">Pending</CBadge>
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="light" size="sm" className="me-2" onClick={() => handleView(guest._id)} title="View">
                                        <CIcon icon={cilPencil} />
                                    </CButton>
                                    <CButton color="light" size="sm" className="me-2" onClick={() => handleEdit(guest._id)} title="Edit">
                                        <CIcon icon={cilPencil} />
                                    </CButton>
                                    <CButton
                                        color="light"
                                        style={{ color: `red` }}
                                        size="sm"
                                        onClick={() => handleDelete(guest._id)}
                                        title="Delete"
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>
            <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
                <span>Total Guests: {filteredGuests?.length}</span>
                <CPagination className="d-inline-flex" >
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                        «
                    </CPaginationItem>
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                        ‹
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <CPaginationItem
                            style={{background:`black`}}
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                        ›
                    </CPaginationItem>
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                        »
                    </CPaginationItem>
                </CPagination>

            </div>
        </div>
    );
};

export default GuestTable;