import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingMentor, setBookingMentor] = useState(null);
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionDate, setSessionDate] = useState('');

    useEffect(() => {
        // Fetch all users whose role is set to Mentor
        axios.get('http://localhost:5000/api/users?role=Mentor')
            .then(res => {
                setMentors(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading mentors list:", err);
                setLoading(false);
            });
    }, []);

    const handleBookSession = (e) => {
        e.preventDefault();
        alert(`⚡ Request Submitted! A calendar invite for "${sessionTopic}" has been dispatched to ${bookingMentor.name}.`);
        setBookingMentor(null);
        setSessionTopic('');
        setSessionDate('');
    };

    if (loading) return <div className="container"><p style={{ color: '#57577a' }}>Scanning faculty database...</p></div>;

    return (
        <div className="container">
            <div className="hero-section">
                <h1 className="hero-title" style={{ fontSize: '38px' }}>Connect with Expert Mentors</h1>
                <p style={{ color: '#a1a1c2', maxWidth: '600px', margin: '0 auto' }}>
                    Schedule 1-on-1 advice sprints with university faculty and domain leads to accelerate your project milestones.
                </p>
            </div>

            {/* Booking Interactive Modal Overlay */}
            {bookingMentor && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="form-container" style={{ width: '100%', maxWidth: '450px' }}>
                        <h3 style={{ color: '#00e6ff', marginBottom: '6px', fontSize: '20px' }}>Request Mentorship Session</h3>
                        <p style={{ color: '#a1a1c2', fontSize: '13px', marginBottom: '20px' }}>Host: {bookingMentor.name}</p>
                        
                        <form onSubmit={handleBookSession}>
                            <div className="form-group">
                                <label>Session Focus / Problem Statement</label>
                                <input type="text" className="form-control" placeholder="e.g. 3D UI architecture review or DB optimization" value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Target Date & Time</label>
                                <input type="datetime-local" className="form-control" value={sessionDate} onChange={e => setSessionDate(e.target.value)} required style={{ colorScheme: 'dark' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm Booking</button>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#101026', border: '1px solid #1f1f42' }} onClick={() => setBookingMentor(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mentors Grid System Display */}
            {mentors.length === 0 ? (
                <div style={{ background: '#0a0a14', border: '1px solid #1f1f42', padding: '40px', borderRadius: '14px', textAlign: 'center' }}>
                    <p style={{ color: '#57577a', marginBottom: '10px' }}>No active verified mentors registered in the database yet.</p>
                    <p style={{ color: '#a1a1c2', fontSize: '13px' }}>Tip: Create an account using the "Faculty / Mentor" role option to see them appear here!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {mentors.map(mentor => (
                        <div className="project-card" key={mentor._id} style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #7000ff, #00e6ff)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                                        {mentor.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF' }}>{mentor.name}</h3>
                                        <p style={{ fontSize: '12px', color: '#00e6ff' }}>{mentor.domain || 'Faculty Advisor'}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: '#a1a1c2', lineHeight: '1.5', minHeight: '45px', marginBottom: '16px' }}>
                                    {mentor.bio || 'Available for technical scope mapping, wireframe validation, and system code engineering review.'}
                                </p>
                                <div style={{ marginBottom: '20px' }}>
                                    {mentor.skills && mentor.skills.map((skill, sIdx) => (
                                        <span className="tech-tag" key={sIdx} style={{ fontSize: '11px', padding: '3px 8px' }}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: 'auto' }} onClick={() => setBookingMentor(mentor)}>
                                🗓️ Book Review Session
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Mentors;