import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px' }}>
            <div className="form-container">
                <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700', textAlign: 'center', color: '#00e6ff' }}>Welcome back</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>Sign in to resume your collaboration workflow.</p>
                {error && <p style={{ color: '#ff3b30', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="yourname@university.edu" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign in</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    New here? <Link to="/register" style={{ color: '#00e6ff', textDecoration: 'none', fontWeight: '700' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;