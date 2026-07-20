require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'axon-api' });
});

app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST']
    }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('setup_session', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User connected to live socket workspace: ${userId}`);
    });

    socket.on('send_instant_message', (data) => {
        const { recipientId, senderId, text } = data;
        const recipientSocketId = onlineUsers.get(recipientId);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive_instant_message', {
                sender: senderId,
                text,
                createdAt: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
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