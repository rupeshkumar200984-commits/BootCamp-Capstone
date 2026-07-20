import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../lib/api.js';

const starterMentors = [
    {
        id: 'm1',
        name: 'Dr. Aisha Rao',
        role: 'AI & ML Mentor',
        domain: 'Applied AI Research',
        bio: 'Helps founders and students turn ideas into robust pipelines, model experiments, and deployment-ready proof of concepts.',
        skills: ['Python', 'ML Systems', 'LLM Apps'],
        availability: true,
        rating: '4.9',
        response: '< 2 hrs'
    },
    {
        id: 'm2',
        name: 'Prof. Daniel Kim',
        role: 'Product & UX Mentor',
        domain: 'Product Design Systems',
        bio: 'Great for UI polish, product thinking, onboarding flows, and turning complex ideas into intuitive experiences.',
        skills: ['UI/UX', 'Figma', 'Design Systems'],
        availability: true,
        rating: '4.8',
        response: 'Same day'
    },
    {
        id: 'm3',
        name: 'Mina Patel',
        role: 'Full-stack Mentor',
        domain: 'Modern Web Engineering',
        bio: 'Specializes in React, Node.js, architecture reviews, and scaling student projects into production-ready apps.',
        skills: ['React', 'Node.js', 'MongoDB'],
        availability: true,
        rating: '5.0',
        response: '1-3 hrs'
    },
    {
        id: 'm4',
        name: 'Rohan Verma',
        role: 'Startup Mentor',
        domain: 'Founder Strategy',
        bio: 'Guides young teams on market positioning, validation, pitch framing, and delivery discipline for demos.',
        skills: ['Strategy', 'Pitching', 'Delivery'],
        availability: true,
        rating: '4.7',
        response: 'Today'
    }
];

function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingMentor, setBookingMentor] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionType, setSessionType] = useState('Mentoring');
    const [notes, setNotes] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const savedBookings = JSON.parse(localStorage.getItem('axon-bookings') || '[]');
        setBookings(savedBookings);

        axios.get(apiUrl('/api/users?role=Mentor'))
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const mergedMentors = res.data.map((mentor, index) => ({
                        ...starterMentors[index % starterMentors.length],
                        ...mentor,
                        skills: mentor.skills?.length ? mentor.skills : starterMentors[index % starterMentors.length].skills,
                        bio: mentor.bio || starterMentors[index % starterMentors.length].bio,
                        domain: mentor.domain || starterMentors[index % starterMentors.length].domain
                    }));
                    setMentors(mergedMentors);
                } else {
                    setMentors(starterMentors);
                }
                setLoading(false);
            })
            .catch(() => {
                setMentors(starterMentors);
                setLoading(false);
            });
    }, []);

    const handleBookSession = (e) => {
        e.preventDefault();
        if (!bookingMentor) return;

        const newBooking = {
            id: Date.now().toString(),
            mentorName: bookingMentor.name,
            topic: sessionTopic,
            date: sessionDate,
            type: sessionType,
            notes,
            createdAt: new Date().toISOString()
        };

        const nextBookings = [newBooking, ...bookings];
        setBookings(nextBookings);
        localStorage.setItem('axon-bookings', JSON.stringify(nextBookings));
        setStatusMessage(`Booked ${bookingMentor.name} for ${sessionTopic || 'a mentoring session'}.`);
        setBookingMentor(null);
        setSessionTopic('');
        setSessionDate('');
        setSessionType('Mentoring');
        setNotes('');
    };

    if (loading) return <div className="container"><p style={{ color: '#57577a' }}>Scanning mentor network...</p></div>;

    return (
        <div className="container">
            <div className="hero-section" style={{ textAlign: 'left', padding: '28px 28px 24px' }}>
                <span className="hero-badge">Mentor network • Live booking</span>
                <h1 className="hero-title" style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'left' }}>Book guidance from people who have done it.</h1>
                <p style={{ maxWidth: '720px', margin: 0, textAlign: 'left' }}>
                    Connect with expert mentors for design reviews, technical help, startup strategy, and high-impact project coaching.
                </p>
            </div>

            {statusMessage && <div className="success-pill">{statusMessage}</div>}

            <div className="grid-2" style={{ alignItems: 'start', marginTop: '24px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#00e6ff' }}>Featured mentors</h2>
                        <span className="tech-tag">4 mentors ready</span>
                    </div>

                    {mentors.length === 0 ? (
                        <div className="panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No mentors are available yet. Create a mentor account and they will appear here.
                        </div>
                    ) : mentors.map((mentor) => (
                        <div className="mentor-card" key={mentor._id || mentor.id}>
                            <div className="mentor-head">
                                <div className="avatar">{mentor.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <h3>{mentor.name}</h3>
                                    <p>{mentor.domain || mentor.role || 'Mentor'}</p>
                                </div>
                                <span className="availability-pill">{mentor.availability === false ? 'Busy' : 'Available'}</span>
                            </div>
                            <p className="mentor-bio">{mentor.bio || 'Available for design reviews, technical guidance, and accountability support.'}</p>
                            <div className="mentor-tags">
                                {mentor.skills?.map((skill, index) => <span className="tech-tag" key={index}>{skill}</span>)}
                            </div>
                            <div className="mentor-meta">
                                <span>⭐ {mentor.rating || '4.8'}</span>
                                <span>⚡ {mentor.response || '< 2 hrs'}</span>
                            </div>
                            <button className="btn-primary" onClick={() => setBookingMentor(mentor)}>Book a session</button>
                        </div>
                    ))}
                </div>

                <div className="panel">
                    <h3 style={{ fontSize: '18px', color: '#00e6ff', marginBottom: '12px' }}>Your upcoming sessions</h3>
                    {bookings.length === 0 ? (
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            No sessions booked yet. Pick a mentor and reserve your next review session.
                        </div>
                    ) : bookings.map((booking) => (
                        <div className="booking-list-item" key={booking.id}>
                            <p style={{ fontWeight: '700', color: 'white' }}>{booking.mentorName}</p>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{booking.topic}</p>
                            <p style={{ fontSize: '13px', color: '#00e6ff', marginTop: '4px' }}>{booking.date || 'Flexible timing'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {bookingMentor && (
                <div className="booking-modal">
                    <div className="form-container" style={{ width: '100%', maxWidth: '480px' }}>
                        <h3 style={{ color: '#00e6ff', marginBottom: '6px', fontSize: '20px' }}>Book a mentoring session</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>Booking with {bookingMentor.name}</p>

                        <form onSubmit={handleBookSession}>
                            <div className="form-group">
                                <label>Session focus</label>
                                <input type="text" className="form-control" placeholder="e.g. React architecture review" value={sessionTopic} onChange={(e) => setSessionTopic(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Preferred date & time</label>
                                <input type="datetime-local" className="form-control" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required style={{ colorScheme: 'dark' }} />
                            </div>
                            <div className="form-group">
                                <label>Session type</label>
                                <select className="form-control" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
                                    <option value="Mentoring">Mentoring</option>
                                    <option value="Code Review">Code Review</option>
                                    <option value="Career Guidance">Career Guidance</option>
                                    <option value="Product Feedback">Product Feedback</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea className="form-control" rows="3" placeholder="Tell them what you want help with" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm booking</button>
                                <button type="button" className="btn-primary" style={{ flex: 1, background: '#101026', boxShadow: 'none' }} onClick={() => setBookingMentor(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mentors;