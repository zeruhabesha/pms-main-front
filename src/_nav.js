import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilPuzzle,
  cilNotes,
  cilSpeedometer,
  cilSettings,
  cilChartPie,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { decryptData } from './api/utils/crypto'

const userRole = decryptData(localStorage.getItem('user'))?.role || ''

const _nav = [
  ...(userRole === 'SuperAdmin' ? [
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
  ] : []),

  ...(userRole === 'Admin' ? [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Account',
      to: '/account',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
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
  ] : []),

  ...(userRole === 'User' ? [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
  ] : []),
]

export default _nav