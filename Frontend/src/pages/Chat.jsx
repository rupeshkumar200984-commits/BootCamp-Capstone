import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

function Chat() {
    const { userId } = useParams(); // ID of the person you are chatting with
    const [messages, setMessages] = useState([]);
    const [typedText, setTypedText] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const socketRef = useRef();
    const token = localStorage.getItem('token');

    // 1. Fetch initial historical database records
    const fetchChatLogs = () => {
        axios.get(`http://localhost:5000/api/users/messages/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setCurrentUserId(parsed.id || parsed._id);
        }

        fetchChatLogs();

        // 2. Initialize WebSocket Connection
        socketRef.current = io('http://localhost:5000');

        // Register session with backend mapping
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            socketRef.current.emit('setup_session', parsed.id || parsed._id);
        }

        // 3. Listen for live incoming messages from socket pipeline
        socketRef.current.on('receive_instant_message', (newMessage) => {
            // Only append if the message is coming from the user currently open in this window
            if (newMessage.sender === userId) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        // Clean up connection when user leaves the chat page
        return () => {
            socketRef.current.disconnect();
        };
    }, [userId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!typedText.trim()) return;

        try {
            // Save to database permanently via standard HTTP Post
            const res = await axios.post('http://localhost:5000/api/users/messages', 
                { recipientId: userId, text: typedText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Broadcast instantly via WebSocket pipeline
            socketRef.current.emit('send_instant_message', {
                recipientId: userId,
                senderId: currentUserId,
                text: typedText
            });

            // Update local state UI instantly for the sender
            setMessages((prevMessages) => [...prevMessages, { sender: currentUserId, text: typedText, createdAt: new Date() }]);
            setTypedText('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div style={{ background: '#0A0A0A', border: '1px solid #1A1A1A', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px', color: '#00E6FF' }}>
                    ⚡ Real-time WebSocket Channel
                </h3>
                <div style={{ height: '350px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                    {messages.map((m, i) => {
                        const isSenderMe = m.sender !== userId;
                        return (
                            <div key={i} style={{ textAlign: isSenderMe ? 'right' : 'left', marginBottom: '12px' }}>
                                <span style={{ 
                                    display: 'inline-block', 
                                    padding: '10px 14px', 
                                    borderRadius: '12px', 
                                    background: isSenderMe ? '#00E6FF' : '#1A1A1A', 
                                    color: isSenderMe ? '#000' : '#FFF',
                                    fontSize: '14px'
                                }}>
                                    {m.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-control" value={typedText} onChange={e => setTypedText(e.target.value)} placeholder="Type an instant message..." required />
                    <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;