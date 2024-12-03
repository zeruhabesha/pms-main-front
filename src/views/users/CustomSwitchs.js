// CustomSwitch.js
import React from 'react';
import { CCol, CFormCheck } from '@coreui/react';

const CustomSwitch = ({ label, name, checked, onChange }) => {
  return (
    <CCol xs={12}>
      <label htmlFor={name}>{label}</label>
      <CFormCheck
        type="switch"
        id={name}
        name={name}
        checked={checked}  // Show the current state of the switch (checked or unchecked)
        onChange={onChange} // Handle toggling the switch
        label={label}  // Display label beside the switch
        color="dark"
      />
    </CCol>
  );
};

export default CustomSwitch;
