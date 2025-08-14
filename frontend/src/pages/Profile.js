import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'

const Profile = () => {
    const [user, setUser] = useState({
        username : 'Username',
        email: 'user@example.com'
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: user.username,
        email: user.email
    });

    const navigate = useNavigate();

    const handleProfileEdit = (e) => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setUser({
            ...user, 
            username: editForm.username,
            email: editForm.email
        });
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditForm ({
            username: user.username,
            email: user.email
        });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditForm(prev => ({
            ...prev,
            [name] : value
        }));
    };

    const handleViewResults = () => {
        navigate('/results');
    };

    const handleViewPassages = () => {
        navigate('/documents');
    };

    return (
        <div className = 'profileContainer'> 
            <div className = "profileCard"> 
                <div className = "profileHeader">
                    <h1 className = 'profileTitle'>Profile</h1>
                    {!isEditing && (
                        <button className = "editButton"
                        onClick = {handleProfileEdit}>
                        Edit Profile
                        </button>
                    )}
                    </div>

                    <div className = "profileContent">
                        {/* Username Section*/}
                        <div className = "usernameSection">
                            <label className = "fieldLabel">Username</label>
                            {isEditing? (
                                <input 
                                    type = "text"
                                    name = "username" 
                                    value = {editForm.username}
                                    onChange ={handleInputChange}
                                    className = "editInput"
                                    placeholder = "Enter username"
                                />
                            ):(
                                <div className = "usernameDisplay">{user.username}</div>
                            )}
                        </div>

                        {/* Email Section*/}
                        <div className = "emailSection">
                            <label className = "fieldLabel">Email</label>
                            {isEditing? (
                                <input 
                                    type = "email"
                                    name = "email" 
                                    value = {editForm.email}
                                    onChange ={handleInputChange}
                                    className = "editInput"
                                    placeholder = "Enter email"
                                />
                            ):(
                                <div className = "emailDisplay">{user.email}</div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className = "navigationButtons">
                            <button className = "navButton resultsButton" onClick={handleViewResults}>
                                View My Results
                            </button>
                            <button className = "navButton passagesButton" onClick={handleViewPassages}>
                                My Uploaded Passages
                            </button>
                        </div>

                        {/* Buttons*/}
                        {isEditing && (
                            <div className = "actionButtons">
                                <button className = "saveButton"
                                onClick = {handleSave}>
                                    Save Changes
                                </button>
                                <button className = "cancelButton"
                                onClick = {handleCancel}>
                                    Cancel
                                </button>
                                </div>
                        )}
                        </div>
                    </div>
                </div>
    );
};

export default Profile;