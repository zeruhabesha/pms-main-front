import React, { useState, useMemo } from 'react';
import {
  CTabs,
  CTabPane,
  CTabContent,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react';
import PermissionsModal from './PermissionsModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDetailsModal from './UserDetailsModal';
import UserTableView from './UserTableView';
import "../paggination.scss";

const UserTable = ({
  users,
  currentPage,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  handleEditPhoto,
  handlePageChange,
  itemsPerPage = 10,
    activeTab,
    setActiveTab
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
            return { key, direction };
        });
    };

  const handleUserDetailsClick = (user) => {
    setSelectedUser(user);
    setUserDetailsModalVisible(true);
  };

  const handleUserDetailsClose = () => {
    setSelectedUser(null);
    setUserDetailsModalVisible(false);
  };

  return (
    <div>
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
            Employee
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Maintainer
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Inspector
          </CNavLink>
        </CNavItem>
      </CNav>
      <br/>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeTab === 0}>
          <UserTableView
              users={users}
              currentPage={currentPage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleEditPhoto={handleEditPhoto}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              activeTab={activeTab}
              sortConfig={sortConfig}
              handleSort={handleSort}
              handleUserDetailsClick={handleUserDetailsClick}
          />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeTab === 1}>
            <UserTableView
                users={users}
                currentPage={currentPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleEditPhoto={handleEditPhoto}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                activeTab={activeTab}
                sortConfig={sortConfig}
                handleSort={handleSort}
              handleUserDetailsClick={handleUserDetailsClick}
            />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeTab === 2}>
            <UserTableView
                users={users}
                currentPage={currentPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleEditPhoto={handleEditPhoto}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                activeTab={activeTab}
                sortConfig={sortConfig}
                handleSort={handleSort}
              handleUserDetailsClick={handleUserDetailsClick}
            />
        </CTabPane>
      </CTabContent>

      <UserDetailsModal
        visible={userDetailsModalVisible}
        user={selectedUser}
        onClose={handleUserDetailsClose}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default UserTable;