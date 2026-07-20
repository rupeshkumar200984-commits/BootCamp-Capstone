import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../lib/api.js';

function Home() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeApplyId, setActiveApplyId] = useState(null);
    const [joinMessage, setJoinMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const fetchProjects = () => {
        axios.get(apiUrl(`/api/projects?skill=${searchTerm}`))
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
        }, 250);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleApplySubmit = async (e, projectId) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token || !currentUser) {
            alert('Please login or create an account to send joining requests.');
            return;
        }

        try {
            await axios.post(apiUrl(`/api/projects/${projectId}/apply`),
                { studentName: currentUser.name, studentEmail: currentUser.email, message: joinMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Your request has been delivered to the project owner.');
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
                <div className="hero-badge">Student collaboration • mentor-led growth</div>
                <h1 className="hero-title">Build with students, mentors, and founders.</h1>
                <p>Discover real ideas, join ambitious teams, and turn side projects into momentum with live collaboration tools.</p>
                <div className="hero-stats">
                    <div><strong>120+</strong><span>active ideas</span></div>
                    <div><strong>1:1</strong><span>mentor sessions</span></div>
                    <div><strong>24/7</strong><span>team momentum</span></div>
                </div>
                <input
                    type="text"
                    className="form-control hero-search"
                    placeholder="Search skills like React, AI, UI/UX, Node.js..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="feature-grid">
                <div className="feature-card">
                    <h3>Find collaborators faster</h3>
                    <p>Browse live project proposals, match with teammates, and move from idea to build in one place.</p>
                </div>
                <div className="feature-card">
                    <h3>Book mentor sessions</h3>
                    <p>Reserve design reviews, code tutoring, and startup guidance without the usual back-and-forth.</p>
                </div>
                <div className="feature-card">
                    <h3>Launch with confidence</h3>
                    <p>Share your work, track requests, and present your next milestone with a polished portfolio feel.</p>
                </div>
            </div>

            <div className="grid-2" style={{ alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '700', color: '#00e6ff' }}>Open project proposals</h2>
                    {projects.length === 0 ? (
                        <div className="panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No projects match that search yet. Try another skill or create one.</div>
                    ) : projects.map(project => {
                        const existingRequest = project.requests?.find(req => req.studentEmail === currentUser?.email);
                        return (
                            <div className="project-card" key={project._id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                    <h3 className="card-title">{project.title}</h3>
                                    <span className="tech-tag" style={{ margin: 0 }}>Stage: {project.stage || 'Ideation'}</span>
                                </div>
                                <p className="card-desc">{project.description}</p>
                                <div style={{ marginBottom: '14px' }}>
                                    {project.techStack?.map((tech, index) => <span className="tech-tag" key={index}>{tech}</span>)}
                                </div>
                                {existingRequest ? (
                                    <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
                                        Application status: <strong>{existingRequest.status}</strong>
                                    </div>
                                ) : activeApplyId === project._id ? (
                                    <form onSubmit={(e) => handleApplySubmit(e, project._id)} className="panel" style={{ marginTop: '12px' }}>
                                        <div className="form-group">
                                            <label>Pitch yourself</label>
                                            <input type="text" className="form-control" value={joinMessage} onChange={e => setJoinMessage(e.target.value)} placeholder="Tell them what you can contribute" required />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" className="btn-primary">Send request</button>
                                            <button type="button" className="btn-primary" style={{ background: '#101026', boxShadow: 'none' }} onClick={() => setActiveApplyId(null)}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button className="btn-primary" onClick={() => setActiveApplyId(project._id)} disabled={currentUser && project.user === currentUser.id}>
                                        {currentUser && project.user === currentUser.id ? 'Your project' : 'Apply to collaborate'}
                                    </button>
                                )}
                                <div className="card-footer">
                                    <span>By {project.author}</span>
                                    <span>{project.contactEmail}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="panel">
                    <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#00e6ff' }}>Why teams use AXON</h3>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px' }}>
                        <li>Launch student-led hackathons and portfolio projects faster.</li>
                        <li>Match with mentors who can review architecture and design.</li>
                        <li>Track applications, discuss ideas, and keep momentum in one place.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;