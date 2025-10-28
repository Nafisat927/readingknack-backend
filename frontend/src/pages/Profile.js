import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.me();
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
      } else {
        setError('Failed to fetch user profile');
        setUser(null); // Clear user state
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile. Please try again.');
      setUser(null); 
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profileContainer">
        <div className="profileCard">
          <div className="profileContent">
            <div className="loadingMessage">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profileContainer">
        <div className="profileCard">
          <div className="profileContent">
            <div className="errorMessage">{error}</div>
            <button className="retryButton" onClick={fetchUserProfile}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profileContainer">
        <div className="profileCard">
          <div className="profileContent">
            <div className="errorMessage">No user data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <div className="profileHeader">
          <h1 className="profileTitle">Profile</h1>
        </div>

        <div className="profileContent">
          {/* First Name Section */}
          <div className="fieldSection">
            <label className="fieldLabel">First Name</label>
            <div className="fieldDisplay">{user.first_name || 'Not provided'}</div>
          </div>

          {/* Last Name Section */}
          <div className="fieldSection">
            <label className="fieldLabel">Last Name</label>
            <div className="fieldDisplay">{user.last_name || 'Not provided'}</div>
          </div>

          {/* Username Section */}
          <div className="fieldSection">
            <label className="fieldLabel">Username</label>
            <div className="fieldDisplay">{user.username}</div>
          </div>

          {/* Email Section */}
          <div className="fieldSection">
            <label className="fieldLabel">Email</label>
            <div className="fieldDisplay">{user.email || 'Not provided'}</div>
          </div>

          {/* Member Since Section */}
          <div className="fieldSection">
            <label className="fieldLabel">Member Since</label>
            <div className="fieldDisplay">
              {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



