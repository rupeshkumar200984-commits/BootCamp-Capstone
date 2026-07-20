import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../lib/api.js';

function Settings() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('Student');
    const [domain, setDomain] = useState('');
    const [bio, setBio] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!token || !storedUser) {
            navigate('/login');
            return;
        }
        
        const user = JSON.parse(storedUser);
        setName(user.name || '');
        setRole(user.role || 'Student');
        setDomain(user.domain || '');
        setBio(user.bio || '');
        if (user.skills) {
            setSkillsString(user.skills.join(', '));
        }
    }, [navigate, token]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        // Transform comma-separated string into a clean data array
        const skillsArray = skillsString.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        try {
            const res = await axios.put(apiUrl('/api/users/profile'), {
                name,
                role,
                domain,
                bio,
                skills: skillsArray
            }, {
                headers: { Authorization: `Bearer ${token}` } });

            if (res.data) {
                // Keep frontend cache session sync state updated
                localStorage.setItem('user', JSON.stringify(res.data));
                setMessage('⚡ Account Profile matrix updated successfully!');
                
                // If they registered as a mentor, redirect them after a brief delay
                if (role === 'Mentor') {
                    setTimeout(() => navigate('/mentors'), 1500);
                }
            }
        } catch (err) {
            console.error(err);
            setMessage('⚠️ Failed to apply changes to profile system models.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="form-container" style={{ borderLeft: role === 'Mentor' ? '4px solid #00e6ff' : '4px solid #7000ff' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#00e6ff', marginBottom: '6px' }}>
                    Workspace Parameters
                </h2>
                <p style={{ color: '#57577a', fontSize: '14px', marginBottom: '24px' }}>
                    Configure your developer access layer keys or scale your profile to a verified Mentor card.
                </p>

                {message && (
                    <div style={{ 
                        background: message.startsWith('⚠️') ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)', 
                        border: message.startsWith('⚠️') ? '1px solid #ff3b30' : '1px solid #34c759', 
                        padding: '12px', borderRadius: '8px', 
                        color: message.startsWith('⚠️') ? '#ff3b30' : '#34c759', 
                        fontSize: '13px', marginBottom: '20px', textAlign: 'center' 
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Account Role Classification</label>
                        <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{ background: '#0a0a14' }}>
                            <option value="Student">Student Developer</option>
                            <option value="Mentor">Faculty / Research Mentor</option>
                        </select>
                    </div>

                    {/* Dynamic Form Condition Fields: Triggers ONLY if Mentor classification is selected */}
                    {role === 'Mentor' && (
                        <div style={{ background: 'rgba(0, 230, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid #1f1f42', marginBottom: '20px' }}>
                            <h4 style={{ color: '#00e6ff', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>🔬 Mentorship Parameters</h4>
                            
                            <div className="form-group">
                                <label>Academic Domain / Department Title</label>
                                <input type="text" className="form-control" placeholder="e.g. Professor, UI/UX Engineering Research Lead" value={domain} onChange={e => setDomain(e.target.value)} required={role === 'Mentor'} />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tech Stack Cluster Tags (Comma Separated)</label>
                        <input type="text" className="form-control" placeholder="React, Node.js, UI/UX Design, Java" value={skillsString} onChange={e => setSkillsString(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Workspace Professional Bio Description</label>
                        <textarea className="form-control" rows="3" placeholder="Describe your technical core focus areas or research timelines..." value={bio} onChange={e => setBio(e.target.value)} style={{ background: '#040408', resize: 'none', color: '#FFF' }}></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={isSaving}>
                        {isSaving ? 'Compiling Parameters...' : 'Save & Sync Configurations'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;