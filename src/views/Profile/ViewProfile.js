import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../api/actions/userActions';
import UserService from '../../api/services/user.service';
import { decryptData, encryptData } from '../../api/utils/crypto';
import './Profile.scss'; // Import SCSS file

const Profile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    photoUrl: '',
  });
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const encryptedUserData = localStorage.getItem('user');
        if (!encryptedUserData) {
          throw new Error('No user data found');
        }
        const userData = decryptData(encryptedUserData);
        const parsedUserData = typeof userData === 'string' ? JSON.parse(userData) : userData;

        let userId = parsedUserData._id || parsedUserData.id || parsedUserData.userId;
        if (!userId) throw new Error('User ID not found');

        const response = await UserService.fetchUsers(1, 1, userId);
        const userProfile = response?.users?.[0] || parsedUserData;

        setProfile(userProfile);
        setIsOwner(userId === userProfile._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const photoUrl = await UserService.uploadUserPhoto(profile._id, file);
      setProfile(prev => ({ ...prev, photoUrl }));
    } catch (err) {
      alert('Failed to upload photo');
    }
  };

  const handleUpdate = async () => {
    if (!isOwner) {
      alert("You can only edit your own profile!");
      return;
    }

    try {
      const updatedProfile = await dispatch(
        updateUser({ id: profile._id, userData: profile })
      ).unwrap();

      const currentUserData = decryptData(localStorage.getItem('user')) || {};
      const updatedUser = { ...currentUserData, ...updatedProfile };
      localStorage.setItem('user', encryptData(JSON.stringify(updatedUser)));

      setProfile(updatedProfile);
      alert('Profile updated successfully');
    } catch {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            disabled={!isOwner}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            disabled={!isOwner}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={profile.phoneNumber || ''}
            onChange={handleChange}
            disabled={!isOwner}
          />
        </div>

        <div className="form-group">
          <label>Profile Photo:</label>
          <div className="photo-container">
            <img
              src={profile.photoUrl || '/default-avatar.png'}
              alt="Profile"
              className="profile-photo"
            />
            {isOwner && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
            )}
          </div>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={handleUpdate}
            className="update-button"
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
