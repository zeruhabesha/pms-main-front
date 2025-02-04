import React from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import ComplaintAssign from './views/complaints/ComplaintAssign'

// Lazy-loaded components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SuperAdmin = React.lazy(() => import('./views/superadmin/SuperAdmin'))
const Admin = React.lazy(() => import('./views/admin/Admin'))
const User = React.lazy(() => import('./views/users/User'))
const Agreement = React.lazy(() => import('./views/agreement/Agreement'))
const AddTenant = React.lazy(() => import('./views/tenant/AddTenant'))
const Tenant = React.lazy(() => import('./views/tenant/Tenant'))
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'))
const TenantRequestForm = React.lazy(() => import('./views/maintenance/TenantRequestForm'))
const MaintenanceAssign = React.lazy(() => import('./views/maintenance/MaintenanceAssignPage'))
const Property = React.lazy(() => import('./views/property/Property'))
// const ViewProperty = React.lazy(() => import('./views/property/ViewProperty'));
const AddProperty = React.lazy(() => import('./views/property/AddProperty'))
const PropertyDetails = React.lazy(() => import('./views/property/PropertyDetails'))
const Report = React.lazy(() => import('./views/report/ComingSoon'))
const About = React.lazy(() => import('./front/pages/AboutPage'))
const HomePage = React.lazy(() => import('./front/pages/HomePage'))
const ContactPage = React.lazy(() => import('./front/pages/ContactPage'))
const AddAgreement = React.lazy(() => import('./views/agreement/AddAgreement'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Profile = React.lazy(() => import('./views/Profile/ViewProfile'))
const Complaints = React.lazy(() => import('./views/complaints/Complaints'))
const Guest = React.lazy(() => import('./views/guest/ViewGuest'))
const AddGuest = React.lazy(() => import('./views/guest/AddGuest'))
const ViewClearance = React.lazy(() => import('./views/Clearance/ViewClearance'))
const AddClearance = React.lazy(() => import('./views/Clearance/AddClearance'))

const routes = [
  // Public routes (no authentication required)
  { path: '/', name: 'Home', element: HomePage },
  { path: '/about', name: 'About', element: About },
  { path: '/contact', name: 'Contact', element: ContactPage },

  // Protected routes (requires authentication)
  { path: '/dashboard', name: 'Dashboard', element: () => <ProtectedRoute element={Dashboard} /> },
  {
    path: '/account/superadmin',
    name: 'Super Admin List',
    element: () => <ProtectedRoute element={SuperAdmin} />,
  },
  { path: '/account/admin', name: 'Admin List', element: () => <ProtectedRoute element={Admin} /> },
  { path: '/account/users', name: 'Users List', element: () => <ProtectedRoute element={User} /> },
  {
    path: '/agreement',
    name: 'Agreement List',
    element: () => <ProtectedRoute element={Agreement} />,
  },
  {
    path: '/agreement/add',
    name: 'Agreement Add',
    element: () => <ProtectedRoute element={AddAgreement} />,
  },
  {
    path: '/agreement/edit/:id',
    name: 'Agreement Edit',
    element: () => <ProtectedRoute element={AddAgreement} />,
  },
  { path: '/tenant', name: 'Tenant List', element: () => <ProtectedRoute element={Tenant} /> },
  {
    path: '/tenant/add',
    name: 'Tenant Add',
    element: () => <ProtectedRoute element={AddTenant} />,
  },
  {
    path: '/tenant/edit/:id',
    name: 'Tenant Edit',
    element: () => <ProtectedRoute element={AddTenant} />,
  },
  {
    path: '/maintenance',
    name: 'Maintenance List',
    element: () => <ProtectedRoute element={Maintenance} />,
  },
  {
    path: '/maintenance/add',
    name: 'Maintenance Add',
    element: () => <ProtectedRoute element={TenantRequestForm} />,
  },
  {
    path: '/maintenance/edit/:id',
    name: 'Maintenance Edit',
    element: () => <ProtectedRoute element={TenantRequestForm} />,
  },
  {
    path: '/maintenance/assign/:id',
    name: 'Maintenance Assign',
    element: () => <ProtectedRoute element={MaintenanceAssign} />,
  },
  {
    path: '/property',
    name: 'Property List',
    element: () => <ProtectedRoute element={Property} />,
  },
  {
    path: '/property/edit/:id',
    name: 'Property Edit',
    element: () => <ProtectedRoute element={AddProperty} />,
  },
  {
    path: '/property/add',
    name: 'Property Add',
    element: () => <ProtectedRoute element={AddProperty} />,
  },
  {
    path: '/property/:id',
    name: 'Property Details',
    element: () => <ProtectedRoute element={PropertyDetails} />,
  },
  { path: '/report', name: 'Report', element: () => <ProtectedRoute element={Report} /> },
  { path: '/widgets', name: 'Widgets', element: () => <ProtectedRoute element={Widgets} /> },
  { path: '/profile', name: 'Profile', element: () => <ProtectedRoute element={Profile} /> },
  {
    path: '/complaint',
    name: 'Complaints',
    element: () => <ProtectedRoute element={Complaints} />,
  },
  {
    path: '/complaint/assign/:id',
    name: 'Complaints Add',
    element: () => <ProtectedRoute element={ComplaintAssign} />,
  },
  { path: '/guest', name: 'Guest', element: () => <ProtectedRoute element={Guest} /> },
  { path: '/guest/add', name: 'Add Guest', element: () => <ProtectedRoute element={AddGuest} /> },
  {
    path: '/guest/edit/:id',
    name: 'View Guest',
    element: () => <ProtectedRoute element={AddGuest} />,
  },
  {
    path: '/clearance/edit/:id',
    name: 'Edit Clearance',
    element: () => <ProtectedRoute element={AddClearance} />,
  },
  {
    path: '/clearance/add',
    name: 'Add Clearance',
    element: () => <ProtectedRoute element={AddClearance} />,
  },
  {
    path: '/clearance',
    name: 'View Clearance',
    element: () => <ProtectedRoute element={ViewClearance} />,
  },
]

export default routes