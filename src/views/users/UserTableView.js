import React, { useMemo, useState } from 'react';
import {
    CTable,
    CTableBody,
    CFormInput,
    CButton
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {    cilFile, cilClipboard, cilCloudDownload, cilUser, cilSettings, cilSearch
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UserTableRow from './UserTableRow';
import UserTableHead from "./UserTableHead";
import UserTablePagination from "./UserTablePagination";
import PermissionsModal from "./PermissionsModal";
import { useDispatch } from "react-redux";
import { updateUserPermissions } from "../../api/actions/userActions";


const UserTableView = ({
    users,
    currentPage,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete,
    handleEditPhoto,
    handlePageChange,
    itemsPerPage,
    activeTab,
    sortConfig,
    handleSort,
    handleUserDetailsClick,
}) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
    const dispatch = useDispatch();

    const handlePermissionsClick = (user) => {
        setSelectedUser(user);
        setPermissionsModalVisible(true);
    };


    const handlePermissionsModalClose = () => {
         setPermissionsModalVisible(false);
         setSelectedUser(null);
      };

   const handleSavePermissions = async (userId, newPermissions) => {
     try {
         await dispatch(updateUserPermissions({ userId, permissions: newPermissions })).unwrap();
           handlePermissionsModalClose();
         //toast.success('Permissions updated successfully!');
     } catch (error) {
         //const detailedError = error.response?.data?.message || error.message || "Failed to update Permissions";
         //toast.error(detailedError);
     }
 };


    const filteredUsers = useMemo(() => {
        if(!users) return []
       return [...users];
    }, [users]);

    const sortedUsers = useMemo(() => {
      if (!sortConfig.key) return filteredUsers;

      return [...filteredUsers].sort((a, b) => {
        const aKey = a[sortConfig.key] || '';
        const bKey = b[sortConfig.key] || '';

        if (aKey < bKey) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aKey > bKey) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }, [filteredUsers, sortConfig]);

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'user':
                return <CIcon icon={cilUser} className="text-primary" title="User" />;
            case 'maintainer':
                return <CIcon icon={cilSettings} className="text-warning" title="Maintainer" />;
            case 'inspector':
                return <CIcon icon={cilSearch} className="text-success" title="Inspector" />;
            default:
                return null;
        }
    };


    const csvData = filteredUsers.map((user, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        name: user?.name || 'N/A',
        email: user?.email || 'N/A',
        role: user?.role || 'N/A',
        status: user?.status || 'N/A',
    }));

    const clipboardData = filteredUsers
        .map(
            (user, index) =>
                `${(currentPage - 1) * itemsPerPage + index + 1}. ${user?.name || 'N/A'} - ${user?.email || 'N/A'} - ${
                    user?.role || 'N/A'
                } - ${user?.status || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('User Data', 14, 10);

        const tableData = filteredUsers.map((user, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            user?.name || 'N/A',
            user?.email || 'N/A',
            user?.role || 'N/A',
            user?.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Name', 'Email', 'Role', 'Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('user_data.pdf');
    };
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);


  return (
    <div>
      <div className="d-flex mb-3 gap-2">
        <div className="d-flex gap-2">
          <CSVLink
            data={csvData}
            headers={[
              { label: '#', key: 'index' },
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Role', key: 'role' },
              { label: 'Status', key: 'status' },
            ]}
            filename="user_data.csv"
            className="btn btn-dark"
          >
            <CIcon icon={cilFile} title="Export CSV" />
          </CSVLink>
          <CopyToClipboard text={clipboardData}>
            <CButton color="dark" title="Copy to Clipboard">
              <CIcon icon={cilClipboard} />
            </CButton>
          </CopyToClipboard>
          <CButton color="dark" onClick={exportToPDF} title="Export PDF">
            <CIcon icon={cilCloudDownload} />
          </CButton>
        </div>
        <CFormInput
          type="text"
          placeholder="Search by name, email, role, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-100%"
        />
      </div>
      <div className="table-responsive">
        <CTable>
          <UserTableHead
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
          <CTableBody>
            {sortedUsers.map((user, index) => (
              <UserTableRow
                  key={user._id || `row-${index}`}
                  user={user}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  getRoleIcon={getRoleIcon}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleEditPhoto={handleEditPhoto}
                  handleUserDetailsClick={handleUserDetailsClick}
                handlePermissionsClick={handlePermissionsClick}
              />
            ))}
          </CTableBody>
        </CTable>
      </div>
        <UserTablePagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          filteredUsers={filteredUsers}
          handlePageChange={handlePageChange}
            totalPages={totalPages}
        />
        <PermissionsModal
            visible={permissionsModalVisible}
            user={selectedUser}
            onClose={handlePermissionsModalClose}
             handleSavePermissions={handleSavePermissions}
        />
    </div>
  );
};

export default UserTableView;