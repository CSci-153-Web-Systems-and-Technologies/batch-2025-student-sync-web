import React, { useState } from 'react'

export default function ForgotPasswordModal({ open, onClose, onSubmit, loading }) {
    const [email, setEmail] = useState('')

    if (!open) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit && onSubmit(email)
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <h3>Reset your password</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <p>Enter your account email and we'll send a password reset link.</p>
                    <input type="email" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    <div className="modal-actions">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="primary" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
