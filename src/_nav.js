import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilBuilding,
  cilPuzzle,
  cilNotes,
  cilSpeedometer,
  cilSettings,
  cilChartPie,
  cilUser,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from '@coreui/react';
import { decryptData } from './api/utils/crypto';

const _nav = (unreadCounts = {}) => {
  try {
    const encryptedUser = localStorage.getItem("user");

    if (!encryptedUser) {
      console.warn("No user data found in localStorage.");
      return [];
    }
    
    const user = decryptData(encryptedUser);
    if (!user || !user.role) {
      console.warn("Invalid user data or role not found.");
      return [];
    }

    const userRole = user.role;

    const getBadge = (key) =>
      unreadCounts[key] > 0
        ? { color: "warning", text: unreadCounts[key] }
        : null;

    const navItems = [ // Store navigation items in a variable to ensure an array is returned
      ...(userRole === 'SuperAdmin'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavGroup,
              name: 'Account',
              to: '/account',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'Super Admin',
                  to: '/account/superadmin',
                },
                {
                  component: CNavItem,
                  name: 'Admin',
                  to: '/account/admin',
                },
              ],
            },
          ]
        : []),

      ...(userRole === 'Admin'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavGroup,
              name: 'Account',
              to: '/account',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'Employee',
                  to: '/account/users',
                },
              ],
            },
            {
              component: CNavItem,
              name: 'Properties',
              to: '/property',
              icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Tenants',
              to: '/tenant',
              icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Agreements',
              to: '/agreement',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
              badge: getBadge("maintenance"),

            },
            {
              component: CNavItem,
              name: 'Complaints',
              to: '/complaint',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Guest',
              to: '/guest',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              badge: {
                color: 'warning',
                text: '1',
              },
            },
            {
              component: CNavItem,
              name: 'Clearance',
              to: '/clearance',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Report',
              to: '/report',
              icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
            },
          ]
        : []),

      ...(userRole === 'Tenant'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
              badge: getBadge("maintenance"),

            },
            {
              component: CNavItem,
              name: 'Complaints',
              to: '/complaint',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Guest',
              to: '/guest',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              badge: {
                color: 'warning',
                text: '1',
              },
            },
            {
              component: CNavItem,
              name: 'Clearance',
              to: '/clearance',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
            },
          ]
        : []),

      ...(userRole === 'User'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavItem,
              name: 'Properties',
              to: '/property',
              icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Tenants',
              to: '/tenant',
              icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Agreements',
              to: '/agreement',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
              badge: getBadge("maintenance"),

            },
            {
              component: CNavItem,
              name: 'Complaints',
              to: '/complaint',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Guest',
              to: '/guest',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              badge: {
                color: 'warning',
                text: '1',
              },
            },
          ]
        : []),

      ...(userRole === 'Maintainer'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
            },
          ]
        : []),

      ...(userRole === 'Inspector'
        ? [
            {
              component: CNavItem,
              name: 'Dashboard',
              to: '/dashboard',
              icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              badge: getBadge("dashboard"),

            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
              badge: getBadge("maintenance"),

            },
            {
              component: CNavItem,
              name: 'Complaints',
              to: '/complaint',
              icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Guest',
              to: '/guest',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
            },
          ]
        : []),
    ];

    return navItems; // Always return an array

  } catch (error) {
    console.error('Error generating navigation:', error);
    return []; // Return a default navigation or an empty array in case of an error
  }
};

export default _nav;