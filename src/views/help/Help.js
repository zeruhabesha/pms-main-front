import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';

import SuperAdminHelp from './SuperAdminHelp'; // Import the components
import AdminHelp from './AdminHelp';
import TenantHelp from './TenantHelp';
import UserHelp from './UserHelp';
import MaintainerHelp from './MaintainerHelp';
import InspectorHelp from './InspectorHelp';
import General from './General';

const Help = () => {
  const [activeKey, setActiveKey] = useState('superadmin');

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Help & Documentation</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              This page provides helpful information and documentation on how to use this application.
              Select a tab below based on your user role to find relevant guidance.
            </p>

            <CTabs activeKey={activeKey} onchange={(key) => setActiveKey(key)}>
              <CNav variant="tabs" role="tablist">
              
              <CNavItem>
                  <CNavLink
                    active={activeKey === 'general'}
                    onClick={() => setActiveKey('general')}
                  >
                    General
                  </CNavLink>
                </CNavItem>
               
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'superadmin'}
                    onClick={() => setActiveKey('superadmin')}
                  >
                    Super Admin
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'admin'}
                    onClick={() => setActiveKey('admin')}
                  >
                    Admin
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'tenant'}
                    onClick={() => setActiveKey('tenant')}
                  >
                    Tenant
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'user'}
                    onClick={() => setActiveKey('user')}
                  >
                    User
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'maintainer'}
                    onClick={() => setActiveKey('maintainer')}
                  >
                    Maintainer
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'inspector'}
                    onClick={() => setActiveKey('inspector')}
                  >
                    Inspector
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
              <CTabPane visible={activeKey === 'general'}>
                  <General />
                </CTabPane>

                <CTabPane visible={activeKey === 'superadmin'}>
                  <SuperAdminHelp />
                </CTabPane>

                <CTabPane visible={activeKey === 'admin'}>
                  <AdminHelp />
                </CTabPane>

                <CTabPane visible={activeKey === 'tenant'}>
                  <TenantHelp />
                </CTabPane>

                <CTabPane visible={activeKey === 'user'}>
                  <UserHelp />
                </CTabPane>

                <CTabPane visible={activeKey === 'maintainer'}>
                  <MaintainerHelp />
                </CTabPane>

                <CTabPane visible={activeKey === 'inspector'}>
                  <InspectorHelp />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Help;