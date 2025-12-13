import React from 'react'

export default function OAuthButton({ provider = 'google', onClick, children, className }) {
    const icons = {
        google: (
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M17.64 9.2c0-.63-.06-1.23-.18-1.81H9v3.42h4.84c-.21 1.14-.86 2.1-1.83 2.75v2.28h2.96c1.73-1.6 2.73-3.95 2.73-6.64z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.96-2.28c-.82.56-1.87.9-3  .9-2.31 0-4.27-1.56-4.97-3.66H1.98v2.3C3.47 15.9 6.05 18 9 18z" fill="#34A853" />
                <path d="M4.03 10.78c-.18-.53-.28-1.1-.28-1.68s.1-1.15.28-1.68V5.12H1.98A8.98 8.98 0 0 0 0 9.1c0 1.47.35 2.85.98 4.07l3.05-2.39z" fill="#FBBC05" />
                <path d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.56-2.56C13.46.9 11.42 0 9 0 6.05 0 3.47 2.1 1.98 5.12l3.05 2.3C4.73 5.14 6.69 3.58 9 3.58z" fill="#EA4335" />
            </svg>
        )
    }

    return (
        <button className={`oauth-btn ${className || ''}`} onClick={onClick} type="button">
            <span className="oauth-icon">{icons[provider]}</span>
            <span className="oauth-label">{children}</span>
        </button>
    )
}
