import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const [alerts, setAlerts] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchAlerts = () => {
        axios.get('http://localhost:5000/api/users/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setAlerts(res.data))
        .catch(() => navigate('/login'));
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleClearAll = async () => {
        try {
            await axios.put('http://localhost:5000/api/users/notifications', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAlerts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Inbox Notifications</h1>
                {alerts.some(a => !a.isRead) && (
                    <button onClick={handleClearAll} style={{ backgroundColor: 'transparent', border: '1px solid #00E6FF', color: '#00E6FF', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        Mark as Read
                    </button>
                )}
            </div>

            <div>
                {alerts.length === 0 ? (
                    <div style={{ padding: '30px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
                        Your activities display is clear. No new notifications.
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert._id} style={{ 
                            background: '#0A0A0A', 
                            padding: '16px', 
                            borderRadius: '8px', 
                            border: '1px solid #1A1A1A', 
                            marginBottom: '10px',
                            borderLeft: alert.isRead ? '1px solid #1A1A1A' : '3px solid #00E6FF'
                        }}>
                            <p style={{ fontSize: '14px', color: '#FFF' }}>
                                <strong>{alert.senderName}</strong> {alert.message}
                            </p>
                            <span style={{ fontSize: '11px', color: '#555', display: 'block', marginTop: '6px' }}>
                                {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;