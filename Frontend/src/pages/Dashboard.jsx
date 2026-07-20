import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../lib/api.js';

function Dashboard() {
    const [myProjects, setMyProjects] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchMyWorkspaceData = () => {
        axios.get(apiUrl('/api/projects/user'), { headers: { Authorization: `Bearer ${token}` } })
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

    const handleStatusUpdate = async (projectId, requestId, currentDecision) => {
        try {
            await axios.put(apiUrl(`/api/projects/${projectId}/requests/${requestId}`), { status: currentDecision }, { headers: { Authorization: `Bearer ${token}` } });
            alert(`Applicant marked as ${currentDecision}.`);
            fetchMyWorkspaceData();
        } catch (err) {
            console.error(err);
            alert('Failed to update applicant status.');
        }
    };

    if (!userProfile) return <div className="container"><p style={{ color: '#57577a' }}>Loading secure workspace...</p></div>;

    return (
        <div className="container">
            <div className="hero-section" style={{ textAlign: 'left', padding: '28px 24px', marginBottom: '24px' }}>
                <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'left' }}>Welcome back, {userProfile.name}</h1>
                <p style={{ margin: 0 }}>Manage your projects, monitor collaboration requests, and keep your profile polished for mentors and teammates.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ background: activeTab === 'projects' ? 'linear-gradient(135deg, #7000ff 0%, #5200c2 100%)' : '#101026', boxShadow: activeTab === 'projects' ? '0 10px 25px rgba(112,0,255,0.22)' : 'none' }} onClick={() => setActiveTab('projects')}>My projects ({myProjects.length})</button>
                <button className="btn-primary" style={{ background: activeTab === 'profile' ? 'linear-gradient(135deg, #7000ff 0%, #5200c2 100%)' : '#101026', boxShadow: activeTab === 'profile' ? '0 10px 25px rgba(112,0,255,0.22)' : 'none' }} onClick={() => setActiveTab('profile')}>Profile summary</button>
            </div>

            {activeTab === 'projects' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#00e6ff' }}>Your published proposals</h2>
                        <button className="btn-primary" onClick={() => navigate('/create')}>Pitch a new idea</button>
                    </div>

                    {myProjects.length === 0 ? (
                        <div className="panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>You have not published any projects yet.</p>
                            <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => navigate('/create')}>Create your first listing</button>
                        </div>
                    ) : myProjects.map(project => (
                        <div className="project-card" key={project._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                                <div>
                                    <h3 className="card-title">{project.title}</h3>
                                    <span className="tech-tag" style={{ margin: '6px 0 0 0' }}>Milestone: {project.stage || 'Ideation'}</span>
                                </div>
                            </div>
                            <p className="card-desc" style={{ marginTop: '12px' }}>{project.description}</p>
                            <div className="panel" style={{ marginTop: '18px' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#00e6ff' }}>Collaboration requests ({project.requests?.length || 0})</h4>
                                {(!project.requests || project.requests.length === 0) ? (
                                    <p style={{ color: 'var(--text-secondary)' }}>No applications yet.</p>
                                ) : project.requests.map((req, rIdx) => (
                                    <div key={rIdx} style={{ padding: '12px 0', borderBottom: rIdx !== project.requests.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                        <div>
                                            <p style={{ fontWeight: '700' }}>{req.studentName} • {req.studentEmail}</p>
                                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>&ldquo;{req.message}&rdquo;</p>
                                            <p style={{ color: req.status === 'Accepted' ? '#34c759' : req.status === 'Rejected' ? '#ff3b30' : '#ffd166', marginTop: '4px' }}>Status: {req.status}</p>
                                        </div>
                                        {req.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-primary" style={{ background: '#34c759', color: '#04120a', boxShadow: 'none' }} onClick={() => handleStatusUpdate(project._id, req._id, 'Accepted')}>Accept</button>
                                                <button className="btn-primary" style={{ background: '#ff3b30', boxShadow: 'none' }} onClick={() => handleStatusUpdate(project._id, req._id, 'Rejected')}>Reject</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="form-container">
                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '18px', color: '#00e6ff' }}>Account overview</h2>
                    <div style={{ display: 'grid', gap: '12px', color: 'var(--text-secondary)' }}>
                        <p><strong style={{ color: 'white' }}>Name:</strong> {userProfile.name}</p>
                        <p><strong style={{ color: 'white' }}>Email:</strong> {userProfile.email}</p>
                        <p><strong style={{ color: 'white' }}>Role:</strong> {userProfile.role || 'Student'}</p>
                        <p><strong style={{ color: 'white' }}>Bio:</strong> {userProfile.bio || 'Add a bio in settings to introduce yourself.'}</p>
                        <div>
                            <strong style={{ color: 'white' }}>Skills:</strong>
                            {userProfile.skills?.length ? userProfile.skills.map((skill, idx) => <span className="tech-tag" key={idx}>{skill}</span>) : <span style={{ marginLeft: '8px' }}>No skills listed yet.</span>}
                        </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={() => navigate('/settings')}>Update profile</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;