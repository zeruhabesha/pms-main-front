// frontend/src/components/Auth/ForgotPassword.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CForm,
    CFormInput,
    CButton,
    CCard,
    CAlert,
    CContainer,
    CCardBody,
    CFormLabel
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../api/actions/userActions';
import backgroundImage from '../../assets/images/hero-bg-abstract.jpg';
import logo from '../../assets/images/logo-dark.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, forgotPasswordSuccess, forgotPasswordError } = useSelector((state) => state.auth);

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }

        try {
            const result = await dispatch(forgotPassword({ email })).unwrap();
            if (result.success) {
                toast.success('Password reset link sent to your email!', {
                    position: "top-right",
                    autoClose: 3000
                });
                // Optionally navigate to a confirmation page or clear the form
                setEmail('');
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while requesting password reset';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000
            });
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
                            fontSize: '2rem', // Reduced font size for Forgot Password
                        }}
                    >
                        Forgot Password?
                    </motion.h1>
                    <CCardBody style={{ padding: '2rem' }}>
                        <CForm onSubmit={handleForgotPasswordSubmit}>
                            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>
                                Enter your email address and we will send you a link to reset your password.
                            </p>
                            <div style={{ marginBottom: '1.5rem' }}>
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
                                    <CAlert color="danger">{errors.email}</CAlert>
                                )}
                            </div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <CButton
                                    type="submit"
                                    color="dark"
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </CButton>
                            </motion.div>
                        </CForm>

                        {errors.general && (
                            <CAlert color="danger">{errors.general}</CAlert>
                        )}
                    </CCardBody>
                </CCard>
            </CContainer>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ForgotPassword;