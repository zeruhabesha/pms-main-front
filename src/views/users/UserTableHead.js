import React from 'react';
import { CTableHeaderCell, CTableRow } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';

const UserTableHead = ({ sortConfig, handleSort }) => {
    return (
        <CTableRow>
            <CTableHeaderCell onClick={() => handleSort('index')} style={{ cursor: 'pointer' }}>
                #
                {sortConfig.key === 'index' && (
                    <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
            </CTableHeaderCell>
            <CTableHeaderCell>Photo</CTableHeaderCell>
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
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
    );
};

export default UserTableHead;