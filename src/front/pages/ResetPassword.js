import React, { useState } from 'react';
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
import { resetPassword } from '../../api/actions/authActions';
import { decryptData } from '../../api/utils/crypto'; // Import decryptData
import backgroundImage from '../../assets/images/hero-bg-abstract.jpg';
import logo from '../../assets/images/logo-dark.png';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { clearError } from '../../api/slice/authSlice';


const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [resetCode, setResetCode] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth) || {};
  const { loading, error } = auth;

  // Decrypt the user data from localStorage
  const encryptedUser = localStorage.getItem('user');
  const user = encryptedUser ? decryptData(encryptedUser) : null;

  const validate = () => {
    const errors = {};
    if (!newPassword) errors.newPassword = 'Password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (!resetCode) errors.resetCode = 'Reset code is required';
    if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
  }
  try {
      const result = await dispatch(resetPassword({ userId: user._id, newPassword, resetCode })).unwrap();
      toast.success('Password reset successful!', { autoClose: 2000, position: 'top-right' });
      dispatch(clearError());
      navigate('/login', { replace: true });
  } catch (err) {
      const errorMessage = err?.response?.data?.message || 'An error occurred during password reset';
      setErrors({ general: errorMessage });
      toast.error(errorMessage, { autoClose: 3000, position: 'top-right' });
  }
};

if (!user) {
  return (
      <CContainer className="text-center">
          <h2>No user information found. Please log in again.</h2>
          <CButton color="primary" onClick={() => navigate('/login')}>
              Back to Login
          </CButton>
      </CContainer>
  );
}

return (
  <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
       {/* Background with blur effect */}
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

    {/* Foreground content */}
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
            {/* Logo */}
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
                fontSize: '2rem',
            }}
              >
                Reset Password
          </motion.h1>
            <CCardBody style={{ padding: '2rem' }}>
                <CForm onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                         <CFormLabel htmlFor="resetCode">Reset Code</CFormLabel>
                         <CFormInput
                            type="text"
                            id="resetCode"
                            placeholder="Enter your reset code"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            invalid={!!errors.resetCode}
                         />
                         {errors.resetCode && (
                              <CAlert
                                color="danger"
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    textAlign: 'center',
                              }}
                              >
                               {errors.resetCode}
                              </CAlert>
                          )}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <CFormLabel htmlFor="newPassword">New Password</CFormLabel>
                         <CFormInput
                             type="password"
                             id="newPassword"
                             placeholder="Enter your new password"
                             value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            invalid={!!errors.newPassword}
                        />
                        {errors.newPassword && (
                          <CAlert
                            color="danger"
                            style={{
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              textAlign: 'center',
                            }}
                          >
                            {errors.newPassword}
                          </CAlert>
                        )}
                     </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
                        <CFormInput
                          type="password"
                          id="confirmPassword"
                          placeholder="Confirm your new password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           invalid={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <CAlert
                              color="danger"
                              style={{
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                textAlign: 'center',
                              }}
                            >
                                {errors.confirmPassword}
                            </CAlert>
                        )}
                    </div>
                     {errors.general && (
                      <CAlert
                        color="danger"
                        style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                           textAlign: 'center',
                         }}
                      >
                        {errors.general}
                      </CAlert>
                     )}

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
                            {loading ? 'Reseting...' : 'Reset Password'}
                         </CButton>
                    </motion.div>
                </CForm>
                     <p className="mt-4 text-center">
                        <a
                            href="/"
                          style={{
                            color: 'black',
                            textDecoration: 'none',
                          }}
                           >
                             Home
                            <FaLongArrowAltRight style={{ marginLeft: 5 }} />
                        </a>

                       <a
                             href="/#/login"
                          style={{
                                color: 'black',
                                textDecoration: 'none',
                             }}
                           >
                             Login
                            <FaLongArrowAltRight style={{ marginLeft: 5 }} />
                        </a>
                 </p>
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

export default ResetPassword;