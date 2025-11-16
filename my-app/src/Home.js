import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate('/register');
    };
    const navigateToLogin = () => {
        navigate('/login');
    };
const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/authorize/change-password', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, currentPassword, newPassword }),
    });

        const data = await response.json();

        if (response.ok) {
            alert('Password successfully changed.');
        } else {
            throw new Error(data.msg || 'Password change failed');
        }
    } catch (error) {
        alert(error.message);
    }
};

return (
<div>
<h1>Home page</h1>
<button onClick={navigateToRegister}>Go to Register</button>
<button onClick={navigateToLogin}>Log In</button>

<div>
<h2>Change Password</h2>
<form onSubmit={handleChangePassword}>
    <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
    />
    <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
        required
    />
    <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
    />
    <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
    />
    <button type="submit">Change Password</button>
    </form>
</div>
</div>
);
};

export default Home;