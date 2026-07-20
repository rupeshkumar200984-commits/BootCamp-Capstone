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
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const tags = techStack.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        axios.post('/api/projects',
            { title, description, techStack: tags, author, contactEmail, stage },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            setSuccess('Your project has been published successfully.');
            setTimeout(() => navigate('/dashboard'), 900);
        })
        .catch(err => {
            setError(err.response?.data?.message || 'Failed to publish project listing.');
        });
    };

    return (
        <div className="container" style={{ maxWidth: '700px' }}>
            <div className="form-container">
                <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700', textAlign: 'center', color: '#00e6ff' }}>Launch a new project</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>Share your idea with mentors and collaborators in one step.</p>
                {error && <p style={{ color: '#ff3b30', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: '#8fffba', marginBottom: '16px', textAlign: 'center' }}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <InputField label="Project title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. AI study planner" />
                    <InputField label="Description & scope" isTextArea={true} rows={4} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe your goal, audience, and what kind of help you need" />
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Current status milestone</label>
                        <select className="form-control" value={stage} onChange={e => setStage(e.target.value)}>
                            <option value="Ideation">Ideation</option>
                            <option value="Prototyping">Prototyping</option>
                            <option value="Development">Development</option>
                            <option value="Testing">Testing</option>
                        </select>
                    </div>
                    <InputField label="Required tech stack / skills" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="e.g. React, Node.js, UI/UX" />
                    <InputField label="Your name" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="Your full name" />
                    <InputField label="Contact email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required placeholder="yourname@university.edu" />
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Publish to feed</button>
                </form>
            </div>
        </div>
    );
}

export default CreateProject;