require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,https://*.vercel.app').split(',').map(origin => origin.trim()).filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const pattern = new RegExp(`^${allowedOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')}$`);
                return pattern.test(origin);
            }
            return allowedOrigin === origin;
        })) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Root route so visiting your Render URL directly shows a clear status
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Axon API server is running smoothly!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'axon-api' });
});

app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
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
server.listen(PORT, '0.0.0.0', () => console.log(`Server actively deployed on port ${PORT}`));