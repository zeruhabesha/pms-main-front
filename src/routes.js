import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const SuperAdmin = React.lazy(() => import('./views/superadmin/SuperAdmin'));
const Admin = React.lazy(() => import('./views/admin/Admin'));
const User = React.lazy(() => import('./views/users/User'));
const Agreement = React.lazy(() => import('./views/agreement/Agreement'));
const Tenant = React.lazy(() => import('./views/tenant/Tenant'));
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'));
const Property = React.lazy(() => import('./views/property/Property'));
const Report = React.lazy(() => import('./views/report/Report'));
const About = React.lazy(() => import('./front/pages/AboutPage'));
const HomePage = React.lazy(() => import('./front/pages/HomePage'));
const ContactPage = React.lazy(() => import('./front/pages/ContactPage'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

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
  { path: '/tenant', name: 'Tenant', element: () => <ProtectedRoute element={Tenant} /> },
  { path: '/maintenance', name: 'Maintenance', element: () => <ProtectedRoute element={Maintenance} /> },
  { path: '/property', name: 'Property', element: () => <ProtectedRoute element={Property} /> },
  { path: '/report', name: 'Report', element: () => <ProtectedRoute element={Report} /> },
  { path: '/widgets', name: 'Widgets', element: () => <ProtectedRoute element={Widgets} /> },
];

export default routes;
