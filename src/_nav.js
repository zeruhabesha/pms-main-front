import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilBuilding,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Account',
    to: '/account',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,  // Account icon
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
      {
        component: CNavItem,
        name: 'Users',
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
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/report',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav
