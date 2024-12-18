import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './tailwind.css'; // Import Tailwind CSS here
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';

// Lazy-loaded components
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./front/pages/Login'));
const HomePage = React.lazy(() => import('./front/pages/HomePage'));
const AboutPage = React.lazy(() => import('./front/pages/AboutPage'));
const ContactPage = React.lazy(() => import('./front/pages/ContactPage'));
const ClientsPage = React.lazy(() => import('./front/pages/ClientsPage'));
const ServicePage = React.lazy(() => import('./front/pages/ServicePage'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const SuperAdmin = React.lazy(() => import('./views/superadmin/SuperAdmin'));
const Admin = React.lazy(() => import('./views/admin/Admin'));
const User = React.lazy(() => import('./views/users/User'));
const Agreement = React.lazy(() => import('./views/agreement/Agreement'));
const Tenant = React.lazy(() => import('./views/tenant/Tenant'));
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'));
const Property = React.lazy(() => import('./views/property/Property'));
const Report = React.lazy(() => import('./views/report/ComingSoon'));
const Profile = React.lazy(() => import('./views/Profile/ViewProfile'));
// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="dark" variant="grow" />
          </div>
        }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Protected Routes under DefaultLayout */}
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
            <Route path="/account/superadmin" element={<ProtectedRoute element={SuperAdmin} />} />
            <Route path="/account/admin" element={<ProtectedRoute element={Admin} />} />
            <Route path="/account/users" element={<ProtectedRoute element={User} />} />
            <Route path="/agreement" element={<ProtectedRoute element={Agreement} />} />
            <Route path="/tenant" element={<ProtectedRoute element={Tenant} />} />
            <Route path="/maintenance" element={<ProtectedRoute element={Maintenance} />} />
            <Route path="/property" element={<ProtectedRoute element={Property} />} />
            <Route path="/report" element={<ProtectedRoute element={Report} />} />
            <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          </Route>
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
