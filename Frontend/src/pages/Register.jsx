import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField.jsx';
import { apiUrl } from '../lib/api.js';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(apiUrl('/api/auth/register'), { name, email, password, role });
            
            // CONTEXT FIX: Read the exact keys directly out of response data mapping
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                
                // Construct cleanly out of root response parameters
                const userPayload = {
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                    skills: res.data.skills || [],
                    bio: res.data.bio || '',
                    domain: res.data.domain || ''
                };
                
                localStorage.setItem('user', JSON.stringify(userPayload));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '520px' }}>
            <div className="form-container">
                <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700', textAlign: 'center', color: '#00e6ff' }}>Join AXON</h2>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>Create a profile and start building with the right collaborators.</p>
                {error && <div style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', padding: '10px', borderRadius: '8px', color: '#ff6b6b', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <InputField label="Full name" value={name} onChange={e => setName(e.target.value)} required placeholder="Rupesh Kumar" />
                    <InputField label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="yourname@university.edu" />
                    <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>Platform role</label>
                        <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Student">Student developer</option>
                            <option value="Mentor">Mentor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create account</button>
                </form>
                <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: '#00e6ff', textDecoration: 'none', fontWeight: '700' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;