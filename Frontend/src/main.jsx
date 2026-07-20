import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')
axios.defaults.baseURL = apiBase

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)