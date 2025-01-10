import React, { useState } from 'react';
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
  CCollapse,
    CFormSelect,
} from '@coreui/react';
import "../paggination.scss";
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilPlus, cilMinus, cilArrowTop, cilArrowBottom, cilUser } from '@coreui/icons';
import { CSVLink } from 'react-csv'; // For CSV Export
import { CopyToClipboard } from 'react-copy-to-clipboard'; // For Clipboard Copy
import jsPDF from 'jspdf'; // For PDF Export
import 'jspdf-autotable'; // For table styling in jsPDF
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ComplaintsTable = ({
  complaints = [],
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handleDelete,
  handleEdit,
  handlePageChange,
    handleAssign,
    handleFeedback,

}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const { users } = useSelector(state => state.user);
    const [feedbackText, setFeedbackText] = useState({});
    const [assignee, setAssignee] = useState({});


  const toggleRow = (id) => {
      if (!id) return;
    setExpandedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

    const handleAssigneeChange = (e, complaintId) => {
    setAssignee((prevAssignee) => ({
      ...prevAssignee,
      [complaintId]: e.target.value,
    }));
  };
    const handleAssignClick = (complaintId) => {
        const userId = assignee[complaintId];
        if (userId) {
           handleAssign(complaintId, userId)
        } else {
             toast.error('Please select an assignee');
        }
    };
  const handleFeedbackChange = (e, complaintId) => {
    setFeedbackText((prevFeedbackText) => ({
      ...prevFeedbackText,
      [complaintId]: e.target.value,
    }));
  };

    const handleFeedbackSubmit = (complaintId) => {
      handleFeedback(complaintId, feedbackText[complaintId] || '');
    };

   const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString();
        } catch (error) {
            return 'N/A';
        }
    };


  const sortedComplaints = React.useMemo(() => {
    if (!sortConfig.key) return complaints;

      return [...complaints].sort((a, b) => {
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
  }, [complaints, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  };
  
    const csvData = complaints.map((complaint, index) => ({
        index: (currentPage - 1) * 10 + index + 1,
        tenant: complaint?.tenant?.name || 'N/A',
        property: complaint?.property?.title || 'N/A',
        complaintType: complaint?.complaintType || 'N/A',
        status: complaint?.status || 'N/A',
    }));

    const clipboardData = complaints
        .map(
            (complaint, index) =>
                `${(currentPage - 1) * 10 + index + 1}. Tenant: ${complaint?.tenant?.name || 'N/A'}, Property: ${
                complaint?.property?.title || 'N/A'
            }, Type: ${complaint?.complaintType || 'N/A'}, Status: ${complaint?.status || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Complaint Data', 14, 10);

        const tableData = complaints.map((complaint, index) => [
            (currentPage - 1) * 10 + index + 1,
            complaint?.tenant?.name || 'N/A',
            complaint?.property?.title || 'N/A',
            complaint?.complaintType || 'N/A',
            complaint?.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Tenant', 'Property', 'Type', 'Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('complaint_data.pdf');
    };

  return (
      <div>
          <div className="d-flex mb-3 gap-2">
              <div className="d-flex gap-2">
                  <CSVLink
                      data={csvData}
                      headers={[
                          { label: '#', key: 'index' },
                          { label: 'Tenant', key: 'tenant' },
                          { label: 'Property', key: 'property' },
                          { label: 'Type', key: 'complaintType' },
                          { label: 'Status', key: 'status' },
                      ]}
                      filename="complaint_data.csv"
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
          placeholder="Search by tenant, property or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: '100%'}}
        />
      </div>
  
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
              <CTableHeaderCell onClick={() => handleSort('tenant')} style={{ cursor: 'pointer' }}>
                Tenant
                  {sortConfig.key === 'tenant' && (
                      <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                  )}
                </CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('property')} style={{ cursor: 'pointer' }}>
                Property
                  {sortConfig.key === 'property' && (
                      <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                  )}
                </CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('complaintType')} style={{ cursor: 'pointer' }}>
                Type
                {sortConfig.key === 'complaintType' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status
                {sortConfig.key === 'status' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
                <CTableHeaderCell>Assigned To</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>

            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sortedComplaints.map((complaint, index) => (
              <React.Fragment key={complaint._id || `row-${index}`}>
                <CTableRow>
                  <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>
                    <CTableDataCell>{complaint?.tenant?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{complaint?.property?.title || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{complaint?.complaintType || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                      {complaint?.status === 'Pending' ? (
                          <span className="text-warning">Pending</span>
                      ) : complaint?.status === 'In Progress' ? (
                          <span className="text-primary">In Progress</span>
                      ) : complaint?.status === 'Resolved' ? (
                          <span className="text-success">Resolved</span>
                      ) : (
                           <span className="text-danger">Closed</span>
                      )}
                  </CTableDataCell>
                  <CTableDataCell>
                        {complaint.assignedTo?.name || 'Unassigned'}
                   </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="light" size="sm" className="me-2" onClick={() => handleEdit(complaint)} title="Edit">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="light"
                      style={{ color: `red` }}
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(complaint)}
                      title="Delete"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                      <CButton color="light" size="sm" onClick={() => toggleRow(complaint._id)} title="Expand">
                           <CIcon icon={expandedRows[complaint._id] ? cilMinus : cilPlus} />
                        </CButton>
                  </CTableDataCell>
                </CTableRow>
                 <CTableRow>
                    <CTableDataCell colSpan="8" className="p-0 border-0">
                        <CCollapse visible={expandedRows[complaint?._id]}>
                            <div className="p-3">
                                <strong>Description:</strong> {complaint?.description || 'N/A'}
                                <br />
                                <strong>Submitted Date:</strong> {formatDate(complaint?.submittedDate)}
                                <br />
                                <strong>Resolved Date:</strong> {formatDate(complaint?.resolvedDate)}
                                <br />
                                <strong>Priority:</strong> {complaint?.priority || 'N/A'}
                                <br/>
                                  <strong>Notes:</strong> {complaint?.notes || 'N/A'}
                                <br/>
                                <strong>Feedback:</strong> {complaint?.feedback || 'N/A'}
                                <br/>
                                <div className="d-flex align-items-center">
                                    <CFormSelect
                                        name="assignedTo"
                                        value={assignee[complaint._id] || ''}
                                         onChange={(e) => handleAssigneeChange(e, complaint._id)}
                                        className="me-2"
                                       style={{width: '200px'}}
                                     >
                                           <option value="" disabled>
                                                 Select Assignee
                                             </option>
                                        {users.map((user) => (
                                             <option key={user._id} value={user._id}>
                                                {user.name}
                                             </option>
                                            ))}
                                    </CFormSelect>
                                  <CButton color="primary" size="sm" onClick={() => handleAssignClick(complaint._id)} title="Assign Complaint">
                                            <CIcon icon={cilUser} /> Assign
                                        </CButton>
                                </div>
                                <div className="mt-2 d-flex align-items-center">
                                      <CFormInput
                                        type="text"
                                        placeholder="Enter feedback"
                                        value={feedbackText[complaint._id] || ''}
                                         onChange={(e) => handleFeedbackChange(e, complaint._id)}
                                        className="me-2"
                                     />
                                    <CButton color="primary" size="sm" onClick={() => handleFeedbackSubmit(complaint._id)} title="Submit Feedback">Submit Feedback</CButton>
                                </div>
                            </div>
                        </CCollapse>
                    </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </div>
        <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
            <span>Total Complaints: {complaints.length}</span>
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

export default ComplaintsTable;
