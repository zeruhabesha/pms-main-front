import React, { useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import maintenanceScreenshot from './images/maintenance_screenshot.png'; // Your image
// import maintenanceScreenshot from './images/complaints_screenshot.png'; // New image
// import maintenanceScreenshot from './images/profile_screenshot.png'; // New image
import './css/InspectorHelp.css';

const InspectorHelp = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [maintenanceLoaded, setMaintenanceLoaded] = useState(false);
  const [complaintsLoaded, setComplaintsLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Fade in the entire component
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Animate Maintenance section
    const timeoutId = setTimeout(() => {
      setMaintenanceLoaded(true);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Animate Complaints section
    const timeoutId = setTimeout(() => {
      setComplaintsLoaded(true);
    }, 700); // Slightly later animation
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Animate Profile section
    const timeoutId = setTimeout(() => {
      setProfileLoaded(true);
    }, 900); // Even later animation
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`inspector-help ${isLoaded ? 'loaded' : ''}`}>
      <h5>Inspector Guide</h5>
      <p>
        As an Inspector, your primary responsibility is to ensure properties are well-maintained,
        tenants' concerns are addressed, and overall standards are upheld. Here's a guide:
      </p>

      <h6>Key Responsibilities:</h6>
      <ul>
        <li>Regularly inspect properties.</li>
        <li>Verify maintenance tasks.</li>
        <li>Investigate and resolve tenant complaints.</li>
      </ul>

      <h6>Using the System:</h6>
      <ol>
        <li className={`step ${maintenanceLoaded ? 'loaded' : ''}`}>
          <strong>Maintenance:</strong>
          <LazyLoad height={200} offset={100} placeholder={<div className="placeholder">Loading...</div>}>
            <img src={maintenanceScreenshot} alt="Maintenance Screen" height="50%" width="100%" />
          </LazyLoad>
          <p>View, update, and verify maintenance requests.</p>
          <p>
            Navigate to the Maintenance section to see open requests. Click on a request to view
            details and update the status as needed.
          </p>
        </li>

        <li className={`step ${complaintsLoaded ? 'loaded' : ''}`}>
          <strong>Complaints:</strong>
          <LazyLoad height={200} offset={100} placeholder={<div className="placeholder">Loading...</div>}>
            <img src={maintenanceScreenshot} alt="Complaints Screen" height="50%" width="100%" />
          </LazyLoad>
          <p>Handle tenant complaints effectively.</p>
          <p>
            The Complaints section lists all active complaints. Review the details of each complaint
            and take appropriate action to resolve the issue. Mark the complaint as "Resolved" once
            completed.
          </p>
        </li>

        <li className={`step ${profileLoaded ? 'loaded' : ''}`}>
          <strong>Profile:</strong>
          <LazyLoad height={100} offset={50} placeholder={<div className="placeholder">Loading...</div>}>
            <img src={maintenanceScreenshot} alt="Profile Screen" height="50%" width="100%" />
          </LazyLoad>
          <p>Update your profile information.</p>
          <p>
            Access your Profile to update contact information, change your password, and manage
            other account settings. Keeping your profile updated ensures you receive important
            notifications.
          </p>
        </li>
      </ol>

      <h6>Tips for Success:</h6>
      <ul>
        <li>Be thorough during inspections.</li>
        <li>Communicate clearly and promptly.</li>
        <li>Document all actions taken.</li>
      </ul>
    </div>
  );
};

export default InspectorHelp;