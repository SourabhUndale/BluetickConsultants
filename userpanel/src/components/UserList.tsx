import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  age: number;
  marital_status: string;
  is_employed: boolean;
  is_founder: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/a6a0fb6b-a84a-4934-b3f2-5c92cc77c44e');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle adding a new user
  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
    setIsAdding(false);
  };

  // Handle editing an existing user
  const handleEditUser = (editedUser: User) => {
    if (selectedUserIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[selectedUserIndex] = editedUser; // Update using index
      setUsers(updatedUsers);
      setIsEditing(false);
      setSelectedUserIndex(null);
    }
  };

  // Handle deleting a user using index
  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, idx) => idx !== index);
    setUsers(updatedUsers);
  };

  return (
    <div className="container my-4 user-list-container">
    <h1 className="text-center mb-4">User Management</h1>
    <button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>Add New User</button>

    <div className="row">
      {users.map((user, index) => (
        <div key={user.id} className="col-md-4 mb-4"> {/* Responsive column */}
          <div className="card user-card h-100">
            <div className="card-body">
              <h5 className="card-title">{user.first_name} {user.last_name}</h5>
              <p className="card-text"><strong>Username:</strong> {user.username}</p>
              <p className="card-text"><strong>Age:</strong> {user.age}</p>
              <p className="card-text"><strong>Marital Status:</strong> {user.marital_status}</p>
              <p className="card-text"><strong>Employed:</strong> {user.is_employed ? 'Yes' : 'No'}</p>
              <p className="card-text"><strong>Founder:</strong> {user.is_founder ? 'Yes' : 'No'}</p>
            </div>
            <div className="card-footer text-center">
              <button type="button" className="btn btn-primary me-2" onClick={() => { setSelectedUserIndex(index); setIsEditing(true); }}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDeleteUser(index)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* User Form for Adding */}
    {isAdding && (
      <UserForm onSave={handleAddUser} onClose={() => setIsAdding(false)} />
    )}

    {/* User Form for Editing */}
    {isEditing && selectedUserIndex !== null && (
      <UserForm
        user={users[selectedUserIndex]}
        onSave={handleEditUser}
        onClose={() => setIsEditing(false)}
      />
    )}
  </div>
  );
};

export default UserList;
