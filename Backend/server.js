const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db'); // Adjust path to your DB config file if needed

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend integration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection Hook
connectDB();

// --- API ROUTES ---
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// FIX: Added the missing authentication route mapping so the frontend registration requests go through!
app.use('/api/auth', require('./routes/authRoutes')); 

// --- SOCKET.IO SETUP ---
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Store active socket connections map
const onlineUsers = new Map();

io.on('connection', (socket) => {
    // When a user logs in, they register their MongoDB User ID with their socket session
    socket.on('setup_session', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User connected to live socket workspace: ${userId}`);
    });

    // Handle instant incoming text transmission
    socket.on('send_instant_message', (data) => {
        const { recipientId, senderId, text } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        
        // If the recipient is currently online, emit the event to them instantly
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive_instant_message', {
                sender: senderId,
                text,
                createdAt: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log('User disconnected from socket network.');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server actively deployed on port ${PORT}`));