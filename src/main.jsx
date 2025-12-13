import React from 'react'
import { createRoot } from 'react-dom/client'
// Use the Supabase-enabled App by default
import App from './App.supabase'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
