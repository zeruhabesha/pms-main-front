import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CAlert,
  CContainer,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, checkStatus } from '../../api/actions/authActions';
import backgroundImage from '../../assets/images/hero-bg-abstract.jpg';
import logo from '../../assets/images/logo-dark.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth) || {};
  const { loading, error, showPasswordInput, userStatus } = auth;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    try {
      await dispatch(checkStatus(email)).unwrap();
    } catch (err) {
      const errorMessage = err?.message || 'Failed to check status';
      toast.error(errorMessage, { autoClose: 3000, position: 'top-right' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!password) validationErrors.password = 'Password is required';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      if (userStatus === 'pending') {
        const loginAction = await dispatch(login({ email, password }));
        if (loginAction.payload) {
          navigate('/resetpassword', { replace: true });
        }
      } else if (userStatus === 'active') {
        await dispatch(login({ email, password })).unwrap();
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('Your account is inactive. Please contact your admin.', {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred during login';
      toast.error(errorMessage, { autoClose: 3000, position: 'top-right' });
      setErrors({ general: errorMessage });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)',
          zIndex: -1,
        }}
      />
      <CContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          position: 'relative',
          padding: '2rem',
          zIndex: 1,
        }}
      >
        <CCard
          style={{
            width: '100%',
            maxWidth: '500px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                maxWidth: '150px',
                height: 'auto',
                display: 'inline',
                margin: '0 auto',
              }}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '1rem',
              fontSize: '3rem',
            }}
          >
            Login
          </motion.h1>
          <CCardBody style={{ padding: '2rem' }}>
            {!showPasswordInput && (
              <CForm onSubmit={handleEmailSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={!!errors.email}
                  />
                  {errors.email && (
                    <CAlert
                      color="danger"
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {errors.email}
                    </CAlert>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CButton
                    type="submit"
                    color="dark"
                    style={{
                      width: '100%',
                      marginTop: '1.5rem',
                      marginBottom: '1rem',
                      backgroundColor: 'dark',
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Checking...' : 'Check Status'}
                  </CButton>
                </motion.div>
              </CForm>
            )}
            {showPasswordInput && (
              <CForm onSubmit={handlePasswordSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <CFormLabel htmlFor="password">Password</CFormLabel>
                  <CFormInput
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={!!errors.password}
                  />
                  {errors.password && (
                    <CAlert
                      color="danger"
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {errors.password}
                    </CAlert>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CButton
                    type="submit"
                    color="dark"
                    style={{
                      width: '100%',
                      marginTop: '1.5rem',
                      marginBottom: '1rem',
                      backgroundColor: 'dark',
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </CButton>
                </motion.div>
              </CForm>
            )}
            {error && !showPasswordInput && (
              <CAlert
                color="danger"
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                {error}
              </CAlert>
            )}
            {userStatus && userStatus !== 'pending' && userStatus !== 'active' && !showPasswordInput && (
              <CAlert
                color="danger"
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                Your account is inactive. Please contact your admin.
              </CAlert>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
