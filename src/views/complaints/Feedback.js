import React from 'react';
import {
  CFormInput,
  CButton,
} from '@coreui/react';

const Feedback = ({
  feedbackText,
  handleFeedbackChange,
  complaintId,
  handleFeedbackSubmit,
}) => {
  return (
    <div className="mt-2 d-flex align-items-center">
      <CFormInput
        type="text"
        placeholder="Enter feedback"
        value={feedbackText || ''}
        onChange={(e) => handleFeedbackChange(e, complaintId)}
        className="me-2"
      />
      <CButton color="dark" size="sm" onClick={() => handleFeedbackSubmit(complaintId)} title="Submit Feedback">Submit Feedback</CButton>
    </div>
  );
};

export default Feedback;
