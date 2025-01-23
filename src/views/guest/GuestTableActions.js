import React from 'react';
import { CButton, CFormInput } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const GuestTableActions = ({
    csvData,
    clipboardData,
    exportToPDF,
     searchTerm,
    setSearchTerm,
}) => {
    return (
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
    );
};

export default GuestTableActions;