import React from 'react';
import { CButton, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFile, cilClipboard, cilCloudDownload, cilPencil, cilTrash, cilOptions } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ClearanceTableActions = ({
    csvData,
    clipboardData,
    exportToPDF,
    searchTerm,
    setSearchTerm,
     handleEditClick, // new
    handleDeleteClick,//new
    selectedClearance //new
}) => {
    return (
        <div className="d-flex mb-3 justify-content-between gap-2">
            <div className="d-flex gap-2">
                 <div className="d-flex gap-2">
                     <CSVLink
                        data={csvData}
                         headers={[
                                { label: '#', key: 'index' },
                                { label: 'Tenant Name', key: 'tenantName' },
                                { label: 'Reason', key: 'reason' },
                                 { label: 'Inspection Date', key: 'inspectionDate' },
                                 { label: 'Status', key: 'status' },
                            ]}
                        filename="clearance_data.csv"
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
             <div className="d-flex gap-2 align-items-center">
                 <CFormInput
                     type="text"
                    placeholder="Search by tenant name or reason"
                   value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                    {selectedClearance && (
                   <CDropdown
                         variant="btn-group"
                   >
                        <CDropdownToggle color="light" size="sm" title="Actions">
                             <CIcon icon={cilOptions} />
                        </CDropdownToggle>
                       <CDropdownMenu>
                            <CDropdownItem onClick={() => handleEditClick(selectedClearance)} title="Edit">
                                 <CIcon icon={cilPencil} className="me-2" />
                                 Edit
                             </CDropdownItem>
                             <CDropdownItem onClick={() => handleDeleteClick(selectedClearance)} title="Delete" style={{ color: 'red' }}>
                                 <CIcon icon={cilTrash} className="me-2" />
                                    Delete
                                </CDropdownItem>
                         </CDropdownMenu>
                   </CDropdown>
                   )}
            </div>
        </div>
    );
};

export default ClearanceTableActions;