import React from 'react';
import AddUser from './AddUser';

const UserModal = ({ visible, setVisible, editingUser, handleSave, handleAddUser }) => {
  return (
    <AddUser
      visible={visible}
      setVisible={setVisible}
      editingUser={editingUser}
      onSave={editingUser ? handleSave : handleAddUser}
    />
  );
};

export default UserModal;
