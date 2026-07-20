import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeApplyId, setActiveApplyId] = useState(null);
    const [joinMessage, setJoinMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const fetchProjects = () => {
        axios.get(`http://localhost:5000/api/projects?skill=${searchTerm}`)
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        const delayDebounceFn = setTimeout(() => {
            fetchProjects();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleApplySubmit = async (e, projectId) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token || !currentUser) {
            alert('Please login or create an account to send joining requests!');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/projects/${projectId}/apply`, 
                { studentName: currentUser.name, studentEmail: currentUser.email, message: joinMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Your request has been delivered to the workspace creator!');
            setJoinMessage('');
            setActiveApplyId(null);
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert('Failed to transmit application request.');
        }
    };

    return (
        <div className="container">
            <div className="hero-section">
                <h1 className="hero-title">Connect. Collaborate. Build.</h1>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="🔍 Search skills (e.g. React, UI/UX, Java)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}
                />
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600', color: '#00e6ff' }}>Active Project Proposals</h2>
            
            <div>
                {projects.length === 0 ? (
                    <p style={{ color: '#57577a' }}>No project listings match those target filters.</p>
                ) : (
                    projects.map(project => {
                        const existingRequest = project.requests?.find(
                            req => req.studentEmail === currentUser?.email
                        );

                        return (
                            <div className="project-card" key={project._id}>
                                <h3 className="card-title">{project.title}</h3>
                                
                                {/* Dynamic Project Milestone Status Badge */}
                                <div style={{ margin: '8px 0 16px' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        fontWeight: '700', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.05em',
                                        padding: '4px 8px', 
                                        borderRadius: '4px',
                                        border: '1px solid #7000ff',
                                        background: 'rgba(112, 0, 255, 0.15)',
                                        color: '#bf94ff'
                                    }}>
                                        ⚙️ Status: {project.stage || 'Ideation'}
                                    </span>
                                </div>

                                <p className="card-desc">{project.description}</p>
                                <div style={{ marginBottom: '16px' }}>
                                    {project.techStack && project.techStack.map((tech, index) => (
                                        <span className="tech-tag" key={index}>{tech}</span>
                                    ))}
                                </div>
                                
                                {existingRequest ? (
                                    <div style={{ 
                                        display: 'inline-block', 
                                        padding: '8px 16px', 
                                        borderRadius: '6px', 
                                        background: '#0a0a14',
                                        border: `1px solid ${
                                            existingRequest.status === 'Accepted' ? '#34c759' : 
                                            existingRequest.status === 'Rejected' ? '#ff3b30' : '#FFD60A'
                                        }`,
                                        fontSize: '13px',
                                        marginTop: '10px'
                                    }}>
                                        Application Status: <strong style={{ 
                                            color: existingRequest.status === 'Accepted' ? '#34c759' : 
                                                   existingRequest.status === 'Rejected' ? '#ff3b30' : '#FFD60A'
                                        }}>{existingRequest.status}</strong>
                                    </div>
                                ) : activeApplyId === project._id ? (
                                    <form onSubmit={(e) => handleApplySubmit(e, project._id)} style={{ background: '#040408', padding: '16px', borderRadius: '8px', border: '1px solid #1f1f42', marginTop: '15px' }}>
                                        <div className="form-group">
                                            <label>Briefly pitch your skills/interest:</label>
                                            <input type="text" className="form-control" value={joinMessage} onChange={e => setJoinMessage(e.target.value)} placeholder="e.g. I am a UI/UX Designer, I can help prototype the app layout." required />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Send Request</button>
                                            <button type="button" className="btn-primary" style={{ backgroundColor: '#101026', color: '#FFF', padding: '6px 16px', fontSize: '13px', border: '1px solid #1f1f42' }} onClick={() => setActiveApplyId(null)}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button 
                                        className="btn-primary" 
                                        style={{ padding: '8px 16px', fontSize: '13px', marginTop: '10px' }} 
                                        onClick={() => setActiveApplyId(project._id)}
                                        disabled={currentUser && project.user === currentUser.id}
                                    >
                                        {currentUser && project.user === currentUser.id ? 'Your Project Proposal' : '⚡ Apply to Collaborate'}
                                    </button>
                                )}

                                <div className="card-footer">
                                    <span>Proposed by: {project.author}</span>
                                    <span>Contact: {project.contactEmail}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Home;