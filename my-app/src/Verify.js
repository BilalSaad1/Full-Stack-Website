import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Verify = () => {
    const navigate = useNavigate();
    const handleBackToHome = () => {
        navigate('/');
    };
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/api/authorize/verify/${token}`)
            .then(response => {
                if (response.ok) {
                    return response.text(); 
                }else
                throw new Error('Verification failed');
            })
            .then(data => {
                setMessage('Email successfully verified');
                
            })
            .catch(error => {
                setMessage(error.message);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Verify Email</h2>
                <input 
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Verification Code"
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={handleBackToHome}>Back to Home</button>
        </div>
    );
};

export default Verify;