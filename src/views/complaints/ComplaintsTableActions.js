import React from 'react';
import {
    CButton,
    CFormInput,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ComplaintsTableActions = ({
    csvData,
    clipboardData,
    exportToPDF,
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <div className="d-flex justify-content-between mb-3">
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
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default ComplaintsTableActions;