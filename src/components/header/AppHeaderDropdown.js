// import React from 'react';
// import {
//   CAvatar,
//   CBadge,
//   CDropdown,
//   CDropdownDivider,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react';
// import {
//   cilBell,
//   cilCreditCard,
//   cilCommentSquare,
//   cilEnvelopeOpen,
//   cilFile,
//   cilLockLocked,
//   cilSettings,
//   cilTask,
//   cilUser,
// } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import avatar8 from './../../assets/images/avatars/8.jpg';

// const AppHeaderDropdown = () => {
//   const navigate = useNavigate(); // Hook to handle navigation

//   const handleLogout = () => {
//     // Remove token and user information from localStorage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     // Optionally, you can also clear all localStorage data if needed
//     // localStorage.clear();

//     // Redirect the user to the login page
//     navigate('/login');
//   };

//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
//         <CAvatar src={avatar8} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader> */}
//         {/* <CDropdownItem href="#">
//           <CIcon icon={cilBell} className="me-2" />
//           Updates
//           <CBadge color="info" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilEnvelopeOpen} className="me-2" />
//           Messages
//           <CBadge color="success" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilTask} className="me-2" />
//           Tasks
//           <CBadge color="danger" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilCommentSquare} className="me-2" />
//           Comments
//           <CBadge color="warning" className="ms-2">42</CBadge>
//         </CDropdownItem> */}
//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>
//         {/* <CDropdownItem href="#">
//           <CIcon icon={cilCreditCard} className="me-2" />
//           Payments
//           <CBadge color="secondary" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilFile} className="me-2" />
//           Projects
//           <CBadge color="primary" className="ms-2">42</CBadge>
//         </CDropdownItem> */}
//         <CDropdownDivider />
//         <CDropdownItem href="#">
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Lock Account
//         </CDropdownItem>
//         <CDropdownItem onClick={handleLogout}>
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Logout
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   );
// };

// export default AppHeaderDropdown;



import React, { useState, useEffect } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import avatar8 from './../../assets/images/avatars/8.jpg';
import { decryptData } from '../../api/utils/crypto'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenants');
    localStorage.removeItem('maintenances');
    localStorage.removeItem('maintenance');
    localStorage.removeItem('inspector');
    localStorage.removeItem('maintenances_data');
    navigate('/login');
  };

  const handleProfileNavigation = () => {
    navigate('/profile'); // Navigate to the profile page
  };
  const [id, setUserid] = useState(null)
  useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser)
        setUserid(decryptedUser?._id || null)
      }
    } catch (err) {
      setError('Failed to load user permissions')
      console.error('Permission loading error:', err)
    }
  }, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar 
        // src={avatar8} 
        src={`https://pms-backend-sncw.onrender.com/api/v1/users/${id}/photo`}
        size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleProfileNavigation}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
