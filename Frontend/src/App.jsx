import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CreateProject from './pages/CreateProject.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Mentors from './pages/Mentors.jsx';
import Chat from './pages/Chat.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateProject />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/chat/:userId" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;