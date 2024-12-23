import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const SuperAdmin = React.lazy(() => import('./views/superadmin/SuperAdmin'));
const Admin = React.lazy(() => import('./views/admin/Admin'));
const User = React.lazy(() => import('./views/users/User'));
const Agreement = React.lazy(() => import('./views/agreement/Agreement'));
const AddTenant = React.lazy(() => import('./views/tenant/AddTenant'));
const Tenant = React.lazy(() => import('./views/tenant/Tenant'));
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'));
const TenantRequestForm = React.lazy(() => import('./views/maintenance/TenantRequestForm'));
const MaintenanceAssign = React.lazy(() => import('./views/maintenance/MaintenanceAssignPage'));
const Property = React.lazy(() => import('./views/property/Property'));
// const ViewProperty = React.lazy(() => import('./views/property/ViewProperty'));
const AddProperty = React.lazy(() => import('./views/property/AddProperty'));
const Report = React.lazy(() => import('./views/report/ComingSoon'));
const About = React.lazy(() => import('./front/pages/AboutPage'));
const HomePage = React.lazy(() => import('./front/pages/HomePage'));
const ContactPage = React.lazy(() => import('./front/pages/ContactPage'));
const AddAgreement = React.lazy(() => import('./views/agreement/AddAgreement'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Profile = React.lazy(() => import('./views/Profile/ViewProfile'));

const routes = [
  // Public routes (no authentication required)
  { path: '/', name: 'Home', element: HomePage },
  { path: '/about', name: 'About', element: About },
  { path: '/contact', name: 'Contact', element: ContactPage },

  // Protected routes (requires authentication)
  { path: '/dashboard', name: 'Dashboard', element: () => <ProtectedRoute element={Dashboard} /> },
  { path: '/account/superadmin', name: 'Super Admin', element: () => <ProtectedRoute element={SuperAdmin} /> },
  { path: '/account/admin', name: 'Admin', element: () => <ProtectedRoute element={Admin} /> },
  { path: '/account/users', name: 'Users', element: () => <ProtectedRoute element={User} /> },
  { path: '/agreement', name: 'Agreement', element: () => <ProtectedRoute element={Agreement} /> },
  { path: '/agreement/add', name: 'Agreement', element: () => <ProtectedRoute element={AddAgreement} /> },
  { path: '/agreement/edit/:id', name: 'Agreement', element: () => <ProtectedRoute element={AddAgreement} /> },
  { path: '/tenant', name: 'Tenant', element: () => <ProtectedRoute element={Tenant} /> },
  { path: '/tenant/add', name: 'Tenant', element: () => <ProtectedRoute element={AddTenant} /> },
  { path: '/tenant/edit/:id', name: 'Tenant', element: () => <ProtectedRoute element={AddTenant} /> },
  { path: '/maintenance', name: 'Maintenance', element: () => <ProtectedRoute element={Maintenance} /> },
  { path: '/maintenance/add', name: 'Maintenance', element: () => <ProtectedRoute element={TenantRequestForm} /> },
  { path: '/maintenance/edit/:id', name: 'Maintenance', element: () => <ProtectedRoute element={TenantRequestForm} /> },
  { path: '/maintenance/assign/:id', name: 'Maintenance', element: () => <ProtectedRoute element={MaintenanceAssign} /> },
  { path: '/property', name: 'Property', element: () => <ProtectedRoute element={Property} /> },
  { path: '/property/edit/:id', name: 'Property', element: () => <ProtectedRoute element={AddProperty} /> },
  { path: '/property/add', name: 'Property', element: () => <ProtectedRoute element={AddProperty} /> },
  { path: '/report', name: 'Report', element: () => <ProtectedRoute element={Report} /> },
  { path: '/widgets', name: 'Widgets', element: () => <ProtectedRoute element={Widgets} /> },
  { path: '/profile', name: 'Profile', element: () => <ProtectedRoute element={Profile} /> },
];

export default routes;
