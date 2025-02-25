import React from 'react';
import {
    CButton,
    CFormInput,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ClearanceTableActions = ({
    csvData,
    clipboardData,
    exportToPDF,
    searchTerm,
    setSearchTerm,
}) => {
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="d-flex mb-3 justify-content-between align-items-center">
            <div className="d-flex gap-2">
                <CSVLink
                    data={csvData}
                    headers={[
                        { label: '#', key: 'index' },
                        { label: 'Tenant Name', key: 'tenantName' },
                        { label: 'Notes', key: 'notes' },
                        { label: 'Move Out Date', key: 'moveOutDate' },
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
            <CFormInput
                type="text"
                placeholder="Search by tenant name or reason"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default ClearanceTableActions;