import React, { useState } from 'react';

const UserManagement = ({ currentUser, users, onUpdateUser, onDeleteUser, onAddUser }) => {
  const [editingUser, setEditingUser] = useState(null);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    onUpdateUser(updatedUser);
    setEditingUser(null);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt={user.name} 
                className="profile-avatar"
              />
              <div>
                <h3>{user.name}</h3>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </div>
            </div>
            {editingUser?.id === user.id ? (
              <UserEditForm 
                user={user} 
                onSave={handleUpdateUser} 
                onCancel={() => setEditingUser(null)}
              />
            ) : (
              <div className="user-actions">
                <button onClick={() => handleEditUser(user)}>Edit</button>
                {currentUser.role === 'admin' && (
                  <button onClick={() => onDeleteUser(user.id)}>Delete</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {currentUser.role === 'admin' && (
        <button className="add-user-btn" onClick={onAddUser}>
          Add New User
        </button>
      )}
    </div>
  );
};

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...user });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(formData);
    }}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default UserManagement;