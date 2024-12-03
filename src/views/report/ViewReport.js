import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink } from '@coreui/react';
import { fetchReports } from '../../api/actions/ReportAction';
import ManageProperties from './ManageProperties';
import ManageTenants from './ManageTenants';
import ManageLeaseAgreements from './ManageLeaseAgreements';

const ViewReport = () => {
  const dispatch = useDispatch();
  const {
    maintenanceData = [],
    leaseData = [],
    tenantData = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.report || {});
  const [activeTab, setActiveTab] = useState(0);

  const [startDate, setStartDate] = useState('2024-01-12');
  const [endDate, setEndDate] = useState('2024-12-12');

  useEffect(() => {
    dispatch(fetchReports(startDate, endDate));
  }, [dispatch, startDate, endDate]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Report</strong>
          </CCardHeader>
          <CCardBody>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                  Manage Properties
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                  Manage Tenants
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
                  Manage Lease Agreements
                </CNavLink>
              </CNavItem>
            </CNav>

            {activeTab === 0 && !loading && maintenanceData && (
              <ManageProperties properties={maintenanceData} />
            )}
            {activeTab === 1 && !loading && tenantData && (
              <ManageTenants tenants={tenantData} />
            )}
            {activeTab === 2 && !loading && leaseData && (
              <ManageLeaseAgreements
                leaseAgreements={leaseData}
                maintenanceRequests={maintenanceData}
              />
            )}
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewReport;
