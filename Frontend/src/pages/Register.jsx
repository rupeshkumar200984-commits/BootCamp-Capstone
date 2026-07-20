import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField.jsx';

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
            const res = await axios.post('/api/auth/register', { name, email, password, role });
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
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