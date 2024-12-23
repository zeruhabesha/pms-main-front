import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CAlert,
} from '@coreui/react';
import PropTypes from 'prop-types';

const EmailInterface = ({ visible, setVisible, onSend, recipients, subject: initialSubject, body: initialBody }) => {
  const [to, setTo] = useState(recipients || '');
  const [subject, setSubject] = useState(initialSubject || '');
  const [body, setBody] = useState(initialBody || '');
  const [error, setError] = useState(null);

  const handleSend = async () => {
      if(!to || !subject || !body) {
          setError('Please fill all the fields.')
           return
      }
    try {
         await onSend({to, subject, body});
      setVisible(false);
      setTo('')
        setSubject('')
      setBody('')
      setError(null)
    } catch (err) {
      setError('Failed to send the email.');
      console.error('Send email error', err);
    }
  };

  const handleClose = () => {
    setVisible(false);
        setTo('')
        setSubject('')
        setBody('')
        setError(null)
  };

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Compose Email</CModalTitle>
      </CModalHeader>
      <CModalBody>
          {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}
        <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="to">To</CFormLabel>
              <CFormInput
                type="text"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter recipient(s) email address"
              />
            </div>
          <div className="mb-3">
            <CFormLabel htmlFor="subject">Subject</CFormLabel>
            <CFormInput
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="body">Body</CFormLabel>
            <CFormTextarea
              id="body"
              rows="8"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter email body"
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSend}>
          Send
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

EmailInterface.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
   recipients: PropTypes.string,
   subject: PropTypes.string,
    body: PropTypes.string
};

export default EmailInterface;