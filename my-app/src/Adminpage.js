import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Adminpage = () => {
    const [lists, setLists] = useState([]);
    const [showLists, setShowLists] = useState(true);
    const [users, setUsers] = useState([]);
    const [policyContent, setPolicyContent] = useState('');
    const [policyType, setPolicyType] = useState('security');
    const [showPolicy, setShowPolicy] = useState(false);
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/policies/${policyType}`);
                setPolicyContent(response.data.content);
            } catch (error) {
                console.error('Error fetching policy', error);
            }
        };

        fetchPolicy();
    }, [policyType]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/policieslist');
                setPolicies(response.data);
            } catch (error) {
                console.error('Error fetching policies', error);
            }
        };

        fetchPolicies();
    }, []);

    useEffect(() => {
        const fetchAllLists = async () => {
            const response = await axios.get('http://localhost:3000/api/hero-lists');
            setLists(response.data);
        };
        fetchAllLists();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:3000/api/users');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const handlePolicySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/api/policies/${policyType}`, { content: policyContent });
        } catch (error) {
            console.error('Error updating policy', error);
            alert('Failed to update policy');
        }
    };

    const toggleFlag = async (listId, reviewId) => {
        await axios.patch(`http://localhost:3000/api/hero-lists/${listId}/reviews/${reviewId}`);
        const response = await axios.get('http://localhost:3000/api/hero-lists');
        setLists(response.data);
    };

    const toggleUserActivation = async (userId) => {
        const user = users.find(u => u._id === userId);
        const newStatus = !user.isdeactivated;
        await axios.patch(`http://localhost:3000/admin/${newStatus ? 'deactivate' : 'reactivate'}/${userId}`);
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
    };
    const toggleAdminStatus = async (userId) => {
        await axios.patch(`http://localhost:3000/admin/grantadmin/${userId}`);
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
    };

    const toggleVisibility = () => {
        setShowLists(!showLists);
    };
    const togglePolicyVisibility = () => {
        setShowPolicy(!showPolicy);
    };

return (
<div>
<h1>Admin Dashboard</h1>
<h2>Users</h2>
{users.map(user => (
<div key={user._id}>
    <p>{user.username} - Status: {user.isdeactivated ? 'Deactivated' : 'Active'} - Role: {user.isAdmin ? 'Admin' : 'User'}</p>
    <button onClick={() => toggleUserActivation(user._id)}>
        {user.isdeactivated ? 'Reactivate' : 'Deactivate'}
    </button>
    <button onClick={() => toggleAdminStatus(user._id)}>
        {user.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
    </button>
</div>
))}

<button onClick={toggleVisibility}>
    {showLists ? 'Hide Lists' : 'Show Lists'}
</button>
{showLists && lists.map(list => (
    <div key={list._id}>
    <h2>{list.name}</h2>
    {list.reviews.map(review => (
        <div key={review._id}>
            <p>{review.review}</p>
            <button onClick={() => toggleFlag(list._id, review._id)}>
                {review.flagged ? 'Unflag' : 'Flag'}
            </button>
        </div>
    ))}
    </div>
))}

<button onClick={togglePolicyVisibility}>
{showPolicy ? 'Hide Policy Management' : 'Show Policy Management'}
</button>
{showPolicy && (
    <div>
        <h2>Policy Management</h2>
        <select value={policyType} onChange={e => setPolicyType(e.target.value)}>
            <option value="security">Security & Privacy Policy</option>
            <option value="dmca">DMCA Notice & Takedown Policy</option>
            <option value="aup">Acceptable Use Policy</option>
        </select>
        <form onSubmit={handlePolicySubmit}>
            <textarea 
                value={policyContent} 
                onChange={e => setPolicyContent(e.target.value)}
                rows={10} 
                cols={50}
            />
            <button type="submit">Update Policy</button>
        </form>
        <div>
            <h3>Existing Policies</h3>
            {policies.map((policy, index) => (
                <div key={index}>
                    <h4>{policy.type}</h4>
                    <p>{policy.content}</p>
                </div>
            ))}
        </div>
    </div>
)}
</div>
);
};

export default Adminpage