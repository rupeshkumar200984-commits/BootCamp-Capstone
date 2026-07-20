import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">AXON<span>.</span></Link>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/">Explore</Link>
                {token ? (
                    <>
                        <Link to="/mentors">Mentors</Link>
                        <Link to="/dashboard">Workspace</Link>
                        <Link to="/notifications">Alerts 🔔</Link>
                        <Link to="/settings">Settings</Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #FF3B30', color: '#FF3B30', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;