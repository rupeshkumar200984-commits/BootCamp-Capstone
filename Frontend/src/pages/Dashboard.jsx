import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [myProjects, setMyProjects] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'profile'
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchMyWorkspaceData = () => {
        axios.get('http://localhost:5000/api/projects/user', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMyProjects(res.data))
        .catch(err => {
            console.error(err);
            navigate('/login');
        });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!token || !storedUser) {
            navigate('/login');
            return;
        }
        setUserProfile(JSON.parse(storedUser));
        fetchMyWorkspaceData();
    }, [navigate, token]);

    // Handle Application Status Changes (Accept / Reject)
    const handleStatusUpdate = async (projectId, requestId, currentDecision) => {
        try {
            await axios.put(`http://localhost:5000/api/projects/${projectId}/requests/${requestId}`, 
                { status: currentDecision },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Applicant successfully marked as ${currentDecision}!`);
            fetchMyWorkspaceData(); // Refresh metrics instantly
        } catch (err) {
            console.error(err);
            alert('Failed to update applicant milestone status.');
        }
    };

    if (!userProfile) return <div className="container"><p style={{ color: '#57577a' }}>Loading secure workspace...</p></div>;

    return (
        <div className="container">
            {/* Header Area */}
            <div style={{ marginBottom: '40px', borderBottom: '1px solid #1f1f42', paddingBottom: '20px' }}>
                <h1 className="hero-title" style={{ textAlign: 'left', fontSize: '36px', marginBottom: '8px' }}>
                    Welcome back, <span style={{ textFillColor: 'initial', WebkitTextFillColor: 'initial', color: '#00e6ff' }}>{userProfile.name}</span>
                </h1>
                <p style={{ color: '#a1a1c2' }}>Manage your active project listings, incoming applications, and workspace configurations.</p>
            </div>

            {/* Sub-Navigation Switch Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button 
                    className="btn-primary" 
                    style={{ 
                        background: activeTab === 'projects' ? 'linear-gradient(180deg, #7000ff 0%, #5200c2 100%)' : '#101026',
                        color: '#FFF',
                        border: activeTab === 'projects' ? 'none' : '1px solid #1f1f42',
                        boxShadow: activeTab === 'projects' ? 'initial' : 'none',
                        padding: '10px 20px'
                    }}
                    onClick={() => setActiveTab('projects')}
                >
                    📁 My Handled Projects ({myProjects.length})
                </button>
                <button 
                    className="btn-primary" 
                    style={{ 
                        background: activeTab === 'profile' ? 'linear-gradient(180deg, #7000ff 0%, #5200c2 100%)' : '#101026',
                        color: '#FFF',
                        border: activeTab === 'profile' ? 'none' : '1px solid #1f1f42',
                        boxShadow: activeTab === 'profile' ? 'initial' : 'none',
                        padding: '10px 20px'
                    }}
                    onClick={() => setActiveTab('profile')}
                >
                    👤 Developer Profile Summary
                </button>
            </div>

            {/* TAB 1: PROJECTS & TRACKING */}
            {activeTab === 'projects' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#00e6ff' }}>Your Published Proposals</h2>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/create')}>
                            ➕ Pitch New Project
                        </button>
                    </div>

                    {myProjects.length === 0 ? (
                        <div style={{ background: '#0a0a14', border: '1px solid #1f1f42', padding: '40px', borderRadius: '14px', textAlign: 'center' }}>
                            <p style={{ color: '#57577a', marginBottom: '15px' }}>You haven't proposed any projects yet.</p>
                            <button className="btn-primary" onClick={() => navigate('/create')}>Create Your First Listing</button>
                        </div>
                    ) : (
                        myProjects.map(project => (
                            <div className="project-card" key={project._id} style={{ borderLeft: '4px solid #7000ff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 className="card-title">{project.title}</h3>
                                        <span style={{ 
                                            fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px',
                                            border: '1px solid #7000ff', background: 'rgba(112, 0, 255, 0.1)', color: '#bf94ff'
                                        }}>
                                            Milestone: {project.stage || 'Ideation'}
                                        </span>
                                    </div>
                                </div>
                                <p className="card-desc" style={{ marginTop: '12px' }}>{project.description}</p>
                                
                                {/* Incoming Student Collaboration Requests Section */}
                                <div style={{ marginTop: '20px', background: '#040408', padding: '16px', borderRadius: '8px', border: '1px solid #1f1f42' }}>
                                    <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#00e6ff', fontWeight: '600' }}>
                                        📥 Incoming Collaboration Applicants ({project.requests?.length || 0})
                                    </h4>
                                    
                                    {(!project.requests || project.requests.length === 0) ? (
                                        <p style={{ color: '#57577a', fontSize: '13px' }}>No applications received yet for this listing.</p>
                                    ) : (
                                        project.requests.map((req, rIdx) => (
                                            <div key={rIdx} style={{ padding: '12px 0', borderBottom: rIdx !== project.requests.length - 1 ? '1px solid #1f1f42' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#FFF' }}>{req.studentName} ({req.studentEmail})</p>
                                                    <p style={{ fontSize: '13px', color: '#a1a1c2', italic: 'true', marginTop: '4px' }}>"{req.message}"</p>
                                                    <p style={{ fontSize: '12px', marginTop: '6px' }}>
                                                        Status: <span style={{ 
                                                            fontWeight: '700', 
                                                            color: req.status === 'Accepted' ? '#34c759' : req.status === 'Rejected' ? '#ff3b30' : '#FFD60A'
                                                        }}>{req.status}</span>
                                                    </p>
                                                </div>

                                                {/* Action Buttons to Accept or Reject Applications */}
                                                {req.status === 'Pending' && (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button 
                                                            className="btn-primary" 
                                                            style={{ background: '#34c759', color: '#000', padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
                                                            onClick={() => handleStatusUpdate(project._id, req._id, 'Accepted')}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className="btn-primary" 
                                                            style={{ background: '#ff3b30', color: '#FFF', padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
                                                            onClick={() => handleStatusUpdate(project._id, req._id, 'Rejected')}
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB 2: PROFILE LAYOUT CARD */}
            {activeTab === 'profile' && (
                <div className="form-container" style={{ background: 'linear-gradient(135deg, #0a0a16 0%, #06060c 100%)' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#00e6ff' }}>Account Matrix Profile</h2>
                    <div style={{ display: 'grid', gap: '16px', fontSize: '14px' }}>
                        <p style={{ borderBottom: '1px solid #1f1f42', paddingBottom: '10px' }}>
                            <strong style={{ color: '#57577a', marginRight: '10px' }}>FULL NAME:</strong> {userProfile.name}
                        </p>
                        <p style={{ borderBottom: '1px solid #1f1f42', paddingBottom: '10px' }}>
                            <strong style={{ color: '#57577a', marginRight: '10px' }}>EMAIL ADDR:</strong> {userProfile.email}
                        </p>
                        <p style={{ borderBottom: '1px solid #1f1f42', paddingBottom: '10px' }}>
                            <strong style={{ color: '#57577a', marginRight: '10px' }}>SYSTEM ROLE:</strong> 
                            <span style={{ color: '#bf94ff', fontWeight: '700', marginLeft: '5px' }}>{userProfile.role || 'Student'}</span>
                        </p>
                        <p style={{ borderBottom: '1px solid #1f1f42', paddingBottom: '10px' }}>
                            <strong style={{ color: '#57577a', marginRight: '10px' }}>BIO LOGS:</strong> {userProfile.bio || 'No dynamic bio configurations updated yet.'}
                        </p>
                        <div>
                            <strong style={{ color: '#57577a', display: 'block', marginBottom: '8px' }}>CORE SKILL CLUSTER:</strong>
                            {userProfile.skills && userProfile.skills.length > 0 ? (
                                userProfile.skills.map((s, idx) => (
                                    <span key={idx} className="tech-tag">{s}</span>
                                ))
                            ) : (
                                <span style={{ color: '#57577a', fontSize: '13px' }}>No explicit stack tags registered. Click configurations settings page to add some.</span>
                            )}
                        </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: '30px', width: '100%' }} onClick={() => navigate('/settings')}>
                        ⚙️ Modify Settings Configurations
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;