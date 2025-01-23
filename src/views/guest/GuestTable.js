import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import "../paggination.scss";
import { CIcon } from '@coreui/icons-react';
import {
    cilPencil,
    cilTrash,
    cilArrowTop,
    cilArrowBottom,
    cilFile,
    cilClipboard,
    cilCloudDownload,
    cilFullscreen,
    cilOptions,
    cilInfo,
    cilCalendar,
    cilDescription,
    cilPeople
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { decryptData } from '../../api/utils/crypto';
import GuestTableActions from "./GuestTableActions";
import { formatDate } from "../../api/utils/dateFormatter";
import {  setSelectedGuest, clearError } from '../../api/slice/guestSlice';
import { fetchGuests, deleteGuest  } from '../../api/actions/guestActions';
import debounce from 'lodash/debounce';

const GuestTable = ({
     searchTerm,
    setSearchTerm,
     itemsPerPage = 10,
}) => {

    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
     const [selectedGuest, setSelectedGuestData] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
    const dropdownRefs = useRef({});
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const { guests, loading, error, totalPages, currentPage, totalGuests } = useSelector((state) => ({
         guests: state.guest.guests || [],
        loading: state.guest.loading,
        error: state.guest.error,
         totalPages: state.guest.totalPages || 1,
          currentPage: state.guest.currentPage || 1,
          totalGuests: state.guest.totalGuests || 0,
    }));
    const handleClickOutside = useCallback((event) => {
        if (dropdownOpen) {
            const ref = dropdownRefs.current[dropdownOpen];
            if(ref && !ref.contains(event.target)){
                setDropdownOpen(null)
            }

        }
    }, [dropdownOpen]);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);


  useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGuests({ page: currentPage, limit: itemsPerPage, search: searchTerm })).unwrap();
            } catch (error) {
              // Handle error
              console.error('Error fetching guests', error)
            }
        };

        fetchData();
    }, [dispatch, currentPage, searchTerm, itemsPerPage]); //Depend only on necessary parameters


   useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }
    }, []);

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
            return { key, direction };
        });
    };

    const sortedGuests = useMemo(() => {
        if (!sortConfig.key) return guests;

        return [...guests].sort((a, b) => {
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
    }, [guests, sortConfig]);

  

    const csvData = guests.map((guest, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        name: guest?.name || 'N/A',
        email: guest?.email || 'N/A',
        phone: guest?.phoneNumber || 'N/A',
        arrivalDate: formatDate(guest?.arrivalDate) || 'N/A',
        departureDate: formatDate(guest?.departureDate) || 'N/A',
        status: guest?.status || 'N/A',
    }));

    const clipboardData = guests
        .map(
            (guest, index) =>
                `${(currentPage - 1) * itemsPerPage + index + 1}. Name: ${guest?.name || 'N/A'}, Email: ${
                    guest?.email || 'N/A'
                }, Phone: ${guest?.phoneNumber || 'N/A'}, Arrival Date: ${formatDate(guest?.arrivalDate) || 'N/A'}, Departure Date: ${formatDate(guest?.departureDate) || 'N/A'}, Status: ${guest?.status || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Guest Data', 14, 10);

        const tableData = guests.map((guest, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            guest?.name || 'N/A',
            guest?.email || 'N/A',
            guest?.phoneNumber || 'N/A',
            formatDate(guest?.arrivalDate) || 'N/A',
            formatDate(guest?.departureDate) || 'N/A',
            guest?.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Name', 'Email', 'Phone', 'Arrival Date', 'Departure Date','Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('guest_data.pdf');
    };

    const debouncedSearch = useCallback(
        debounce((term) => {
            dispatch(fetchGuests({ page: 1, limit: itemsPerPage, search: term }));
        }, 500),
        [dispatch, itemsPerPage]
    );

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term); // Use debounced function here
    };


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
             dispatch(fetchGuests({ page, limit: itemsPerPage, search: searchTerm }));
        }
    };

    const handleEdit = (id) => {
       navigate(`/edit-guest/${id}`);
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this guest?")) {
            dispatch(deleteGuest(id));
           toast.success('Guest deleted successfully');
        }
    };
    const toggleDropdown = (guestId) => {
        setDropdownOpen(prevState => prevState === guestId ? null : guestId);
    };

    const closeDropdown = () => {
        setDropdownOpen(null);
    };
   const handleModalOpen = (guest) => {
      setSelectedGuestData(guest);
       setModalVisible(true);
   };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedGuestData(null);
    };
    const baseURL = "http://localhost:4000/api/v1/";

    const getStatusStyle = (status) => {
        switch (status) {
            case 'expired':
                return { fontWeight: 'bold', color: 'red' };
            case 'pending':
                 return { fontWeight: 'bold', color: 'orange' };
            case 'active':
                return { fontWeight: 'bold', color: 'green' };
             case 'cancelled':
                    return { fontWeight: 'bold', color: 'gray' };
            default:
                return {};
        }
    };
    return (
        <div>
            <div className="d-flex mb-3 gap-2">
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
                 <CFormInput
                    type="text"
                    placeholder="Search by name or email or phone"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                         <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            Name
                            {sortConfig.key === 'name' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                            Email
                            {sortConfig.key === 'email' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                         <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('phoneNumber')} style={{ cursor: 'pointer' }}>
                            Phone
                            {sortConfig.key === 'phoneNumber' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                           <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('arrivalDate')} style={{ cursor: 'pointer' }}>
                            Arrival Date
                            {sortConfig.key === 'arrivalDate' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('departureDate')} style={{ cursor: 'pointer' }}>
                            Departure Date
                            {sortConfig.key === 'departureDate' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                            Status
                            {sortConfig.key === 'status' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                         </CTableHeaderCell>
                         <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {guests?.map((guest, index) => (
                        <CTableRow key={guest?._id || index}>
                           <CTableDataCell className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                           </CTableDataCell>
                             <CTableDataCell>
                                {guest?.name || 'N/A'}
                             </CTableDataCell>
                            <CTableDataCell>
                                {guest?.email || 'N/A'}
                            </CTableDataCell>
                             <CTableDataCell>
                                {guest?.phoneNumber || 'N/A'}
                            </CTableDataCell>
                           <CTableDataCell>
                                {formatDate(guest?.arrivalDate) || 'N/A'}
                            </CTableDataCell>
                              <CTableDataCell>
                                {formatDate(guest?.departureDate) || 'N/A'}
                            </CTableDataCell>
                           <CTableDataCell>
                                {guest.status === 'pending' ? (
                                        <CBadge color="warning">Pending</CBadge>
                                    ) : guest.status === 'active' ? (
                                        <CBadge color="success">Active</CBadge>
                                    ) : guest.status === 'expired' ? (
                                        <CBadge color="danger">Expired</CBadge>
                                    ) : (
                                      <CBadge color="secondary">Cancelled</CBadge>
                                    )}
                            </CTableDataCell>
                             <CTableDataCell>
                                <CDropdown
                                        variant="btn-group"
                                        isOpen={dropdownOpen === guest?._id}
                                        onToggle={() => toggleDropdown(guest?._id)}
                                         onMouseLeave={closeDropdown}
                                        innerRef={ref => (dropdownRefs.current[guest?._id] = ref)}
                                    >
                                        <CDropdownToggle color="light" size="sm" title="Actions">
                                            <CIcon icon={cilOptions} />
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                             {userPermissions?.editGuest && (
                                                <CDropdownItem  onClick={() => handleEdit(guest?._id)} title="Edit">
                                                    <CIcon icon={cilPencil} className="me-2"/>
                                                    Edit
                                                </CDropdownItem>
                                            )}
                                             {userPermissions?.deleteGuest && (
                                                <CDropdownItem  onClick={() => handleDelete(guest?._id)} title="Delete"  style={{ color: 'red' }}>
                                                    <CIcon icon={cilTrash} className="me-2"/>
                                                    Delete
                                                </CDropdownItem>
                                            )}
                                            <CDropdownItem onClick={() => handleModalOpen(guest)} title="View Details">
                                                 <CIcon icon={cilFullscreen} className="me-2"/>
                                                View Details
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                </CDropdown>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
             <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
                <span>Total Guests: {totalGuests}</span>
                <CPagination className="mt-3">
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                        «
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ‹
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <CPaginationItem
                            key={page}
                            active={page === currentPage}
                            className=""
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </CPaginationItem>

                    ))}
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        ›
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        »
                    </CPaginationItem>
                </CPagination>
            </div>
               {/* Guest Details Modal */}
                <CModal
                 size="lg"
                visible={modalVisible}
                onClose={handleModalClose}
            >
                <CModalHeader onClose={handleModalClose}>
                    <CModalTitle>Guest Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedGuest && (
                        <div>
                            <p><strong><CIcon icon={cilPeople} className="me-1" />Name:</strong> {selectedGuest?.name || 'N/A'}</p>
                             <p><strong><CIcon icon={cilDescription} className="me-1" />Reason:</strong> {selectedGuest?.reason || 'N/A'}</p>
                             <p><strong><CIcon icon={cilDescription} className="me-1" />Notes:</strong> {selectedGuest?.notes || 'N/A'}</p>
                            <p><strong><CIcon icon={cilCalendar} className="me-1" />Arrival Date:</strong> {formatDate(selectedGuest?.arrivalDate)}</p>
                            <p><strong><CIcon icon={cilCalendar} className="me-1" />Departure Date:</strong> {formatDate(selectedGuest?.departureDate)}</p>
                            <p><strong><CIcon icon={cilInfo} className="me-1" />Email:</strong> {selectedGuest?.email || 'N/A'}</p>
                           <p><strong><CIcon icon={cilInfo} className="me-1" />Phone:</strong> {selectedGuest?.phoneNumber || 'N/A'}</p>
                           <p>
                                <strong>
                                 <CIcon icon={cilDescription} className="me-1" />QR Code:
                                </strong>
                                 {selectedGuest?.qrCode ? (
                                       <img
                                             src={`http://localhost:4000/api/v1/${selectedGuest?.qrCode}`}
                                             alt="QR Code"
                                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                                       />

                                     ) : "N/A"}
                                </p>
                              <p><strong><CIcon icon={cilDescription} className="me-1" />Access Code:</strong> {selectedGuest?.accessCode || 'N/A'}</p>
                             <p>
                                <strong style={getStatusStyle(selectedGuest?.status)}>
                                     <CIcon icon={cilInfo} className="me-1" />Status:
                                  </strong>
                                    <span style={getStatusStyle(selectedGuest?.status)}>
                                        {selectedGuest?.status || 'N/A'}
                                   </span>
                                </p>


                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleModalClose}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default GuestTable;