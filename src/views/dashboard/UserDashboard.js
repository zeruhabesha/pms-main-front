import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CListGroup,
    CListGroupItem,
    CNavLink,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,

} from '@coreui/react';
import styled from 'styled-components';
import MainChart from "./MainChart";
import CIcon from '@coreui/icons-react';
import { cilUser, cilBell, cilClock, cilTask, cilHome} from '@coreui/icons';
import { AnimatedCard, colors } from "./styledComponents";
import { decryptData } from '../../api/utils/crypto';

const UserDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserFromLocalStorage = () => {
            const encryptedUser = localStorage.getItem('user');
            if (encryptedUser) {
                try {
                    const decryptedUser = decryptData(encryptedUser);
                    setUser(decryptedUser);
                } catch (error) {
                    console.error("Error decrypting user data:", error);
                    // Handle decryption error appropriately
                }
            } else {
                console.warn("No user found in local storage");
                // Handle missing user data appropriately
            }
        };

        fetchUserFromLocalStorage();
    }, []);  // Run only once on mount


      const recentActivities = [
        {id: 1, action: 'Logged in', time: '2024-08-15 10:30 AM' },
        {id: 2, action: 'Viewed property details', time: '2024-08-15 10:45 AM' },
        { id: 3, action: 'Updated Profile Settings', time: '2024-08-14 08:15 AM' },
    ];
    const generalInfo = {
         placeholder1: 'This could be a list of things the users should see',
        placeholder2: 'It could also be stats about their usage' ,
         placeholder3: 'Maybe even some news or announcements',
    }
      const linkList = [
            {id: 1,  name: 'Home', link: '#dashboard', icon: cilHome},
            {id: 2, name: 'Tasks', link: '#dashboard', icon: cilTask},
              {id: 3, name: 'Notifications', link: '#dashboard', icon: cilBell},

      ]
    const blurredText = {
        filter: 'blur(0px)',
        userSelect: 'none', // Optional: Prevents text selection
    };
     const getIcon = (icon) => {
        return <CIcon icon={icon} className="me-2" />;
    };

    if (!user) {
        return <div>Loading user data...</div>; // Or handle the loading state differently
    }

    return (
         <>
              <CRow className="mb-4">
                 <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">
                            <CIcon icon={cilUser} className="me-2" /> User Profile</CCardHeader>
                        <CCardBody className="chart-body">
                              {/* Integrate Profile Here */}
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name:</strong>  <span >{user.name}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Email:</strong> <span >{user.email}</span>
                            </div>
                                   <div style={{ marginBottom: '10px' }}>
                                 <strong>Role:</strong>  <span >{user.role}</span>
                               </div>
                                 <div>
                                    <strong>Last Login:</strong><span >Last Login</span>
                               </div>

                        </CCardBody>
                    </AnimatedCard>
                 </CCol>

                 <CCol lg={4}>
                       <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">
                            <CIcon icon={cilClock} className="me-2" /> Recent Activity</CCardHeader>
                           <CCardBody className="chart-body">
                                <CTable striped>
                                    <CTableHead>
                                      <CTableRow>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                                      </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                      {recentActivities.map((activity) => (
                                           <CTableRow key={activity.id}>
                                            <CTableDataCell style={blurredText}>{activity.action}</CTableDataCell>
                                            <CTableDataCell style={blurredText}>{activity.time}</CTableDataCell>
                                           </CTableRow>
                                        ))}
                                      </CTableBody>
                                </CTable>
                            </CCardBody>
                     </AnimatedCard>
                 </CCol>
                  <CCol lg={4}>
                       <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">
                            <CIcon icon={cilBell} className="me-2" /> Links & General Information</CCardHeader>
                          <CCardBody className="chart-body">
                              <CListGroup>
                                {linkList.map(item =>(
                                    <CListGroupItem key={item.id} style={{border: 'none', padding: '5px 0px'}} >
                                      <CNavLink href={item.link}> {getIcon(item.icon)} {item.name}</CNavLink>
                                    </CListGroupItem>
                                ))}
                              </CListGroup>

                              <div style={{marginTop: '10px'}}>
                                   <p style={blurredText}>{generalInfo.placeholder1}</p>
                                   <p style={blurredText}>{generalInfo.placeholder2}</p>
                                     <p style={blurredText}>{generalInfo.placeholder3}</p>
                              </div>
                            </CCardBody>
                     </AnimatedCard>
                </CCol>
             </CRow>
               <CRow>
                    <CCol>
                        <AnimatedCard className="chart-card">
                            <CCardHeader className="chart-header">General Activity</CCardHeader>
                            <CCardBody className="chart-body">
                                <MainChart />
                            </CCardBody>
                        </AnimatedCard>
                    </CCol>
               </CRow>
         </>
    );
};

export default UserDashboard;