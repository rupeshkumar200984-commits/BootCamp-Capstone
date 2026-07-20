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
            // Updated to point directly to the correct /api/auth/register link
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                alert('Account generated successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Registration error details:", err);
            // Pull the exact error reason from your backend if available
            setError(err.response?.data?.message || 'Registration failed. Please check backend network loops.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '40px' }}>
            <div className="form-container">
                <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700', textAlign: 'center', color: '#00e6ff' }}>
                    Join AXON
                </h2>
                <p style={{ color: '#57577a', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
                    Create your developer profile workspace
                </p>

                {error && (
                    <div style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid #ff3b30', padding: '12px', borderRadius: '8px', color: '#ff3b30', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} required placeholder="Rupesh Kumar" />
                    <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="yourname@university.edu" />
                    <InputField label="Secure Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>Platform Role</label>
                        <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{ background: '#0a0a14' }}>
                            <option value="Student">Student Developer</option>
                            <option value="Mentor">Faculty / Mentor</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#a1a1c2' }}>
                    Already have an account? <Link to="/login" style={{ color: '#00e6ff', textDecoration: 'none', fontWeight: '600' }}>Login Here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;