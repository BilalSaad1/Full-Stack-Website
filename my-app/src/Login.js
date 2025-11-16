import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/authorize/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAdmin', data.isAdmin)
                if (data.isEmailVerified === true) {
                    if (data.isAdmin) {
                        navigate('/adminpage');
                    } else {
                        navigate('/mainpage'); 
                    }
                } else{
                    navigate('/unauth'); 
                }
            } else {
                throw new Error(data.msg || 'Login failed');
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Log In</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;