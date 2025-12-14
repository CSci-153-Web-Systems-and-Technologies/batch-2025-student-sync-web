import React, { useState } from 'react'

export default function ForgotPasswordModal({ open, onClose, onSubmit, loading }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [status, setStatus] = useState('idle') // idle | sending | success | error

    if (!open) return null

    const isValidEmail = (value) => {
        return /^\S+@\S+\.\S+$/.test(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!email || !isValidEmail(email)) {
            setError('Please enter a valid email address.')
            return
        }

        try {
            setStatus('sending')
            // Allow parent handler to perform the send and optionally return { error }
            const result = onSubmit ? await onSubmit(email) : null

            // Handle common shapes: { error } or thrown exceptions
            if (result && result.error) {
                setError(result.error.message || String(result.error))
                setStatus('error')
            } else {
                setStatus('success')
            }
        } catch (e) {
            setError(e?.message || String(e))
            setStatus('error')
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <h3>Reset your password</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {status === 'success' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <p style={{ margin: 0 }}>If that email exists, a password reset link has been sent. Check your inbox.</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button type="button" className="primary" onClick={() => { setEmail(''); setStatus('idle'); onClose && onClose() }}>Close</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <p style={{ margin: 0 }}>Enter your account email and we'll send a password reset link.</p>

                            <input
                                type="email"
                                placeholder="you@domain.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={status === 'sending' || loading}
                                aria-label="Email address"
                            />

                            {error && <div style={{ color: '#b00020', fontSize: 13 }}>{error}</div>}

                            <div className="modal-actions">
                                <button type="button" className="secondary" onClick={onClose} disabled={status === 'sending' || loading}>Cancel</button>
                                <button type="submit" className="primary" disabled={status === 'sending' || loading}>
                                    {status === 'sending' || loading ? 'Sending...' : 'Send reset link'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
