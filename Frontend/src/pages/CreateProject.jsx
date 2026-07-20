import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField.jsx';

function CreateProject() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [author, setAuthor] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [stage, setStage] = useState('Ideation');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const tags = techStack.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        
        axios.post('http://localhost:5000/api/projects', 
            { title, description, techStack: tags, author, contactEmail, stage },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => navigate('/dashboard'))
        .catch(err => {
            setError(err.response?.data?.message || 'Failed to publish project listing.');
        });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '700', textAlign: 'center', color: '#00e6ff' }}>Propose a Project</h2>
                {error && <p style={{ color: '#ff3b30', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <InputField label="Project Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Relational Campus Ecosystem Network" />
                    <InputField label="Description & Scope" isTextArea={true} rows={4} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe the objectives..." />
                    
                    {/* Milestone Stage Picker dropdown options */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Current Status Milestone</label>
                        <select className="form-control" value={stage} onChange={e => setStage(e.target.value)} style={{ background: '#0a0a14' }}>
                            <option value="Ideation">Ideation Stage</option>
                            <option value="Prototyping">Prototyping Wireframes</option>
                            <option value="Development">Active Code Development</option>
                            <option value="Testing">QA & Testing Cycle</option>
                        </select>
                    </div>

                    <InputField label="Required Tech Stack / Skills (comma separated)" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="e.g. React, Node.js, UI/UX Design" />
                    <InputField label="Your Name" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="Your full name" />
                    <InputField label="University Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required placeholder="yourname@university.edu" />
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Publish to Feed</button>
                </form>
            </div>
        </div>
    );
}

export default CreateProject;