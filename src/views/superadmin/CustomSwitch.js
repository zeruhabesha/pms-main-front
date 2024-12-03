import React from 'react';
import './CustomSwitch.scss';

const CustomSwitch = ({ checked, onChange, label, size = 'medium', color = '#0d6efd' }) => {
  return (
    <label className={`custom-switch custom-switch-${size}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round" style={{ backgroundColor: checked ? color : '#ccc' }}></span>
      {label && <span className="custom-switch-label">{label}</span>}
    </label>
  );
};

export default CustomSwitch;