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
            <div className="nav-links">
                <Link className="nav-link" to="/">Explore</Link>
                {token ? (
                    <>
                        <Link className="nav-link" to="/mentors">Mentors</Link>
                        <Link className="nav-link" to="/dashboard">Workspace</Link>
                        <Link className="nav-link" to="/notifications">Alerts 🔔</Link>
                        <Link className="nav-link" to="/settings">Settings</Link>
                        <button className="nav-action" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">Log In</Link>
                        <Link to="/register" className="btn-primary nav-button">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;