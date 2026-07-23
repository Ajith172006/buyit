'use client';

import { useState } from 'react';
import { useRouter } from 'next/app'; // handles both App Router or window navigation
import Link from 'next/link';

const AUTH_KEY = 'buyit_admin_auth';

export default function AdminLoginForm({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    // Read password from environment variable or fallback to 'admin123' / 'admin@buyit'
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    setTimeout(() => {
      if (password === validPassword || password === 'admin@buyit') {
        localStorage.setItem(AUTH_KEY, '1');
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/admin';
        }
      } else {
        setShake(true);
        setError('Incorrect admin password. Please try again.');
        setPassword('');
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a 70%)',
      padding: '20px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(30, 27, 75, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
        textAlign: 'center',
        color: '#fff',
        transition: 'transform 0.2s ease',
        transform: shake ? 'translateX(-8px)' : 'none',
        animation: shake ? 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both' : 'none'
      }}>

        {/* Lock Icon Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          margin: '0 auto 20px auto',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
        }}>
          🔐
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px',
          color: '#ffffff'
        }}>
          Admin Access
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: '0 0 28px 0',
          lineHeight: 1.5
        }}>
          Enter your admin password to access the store management dashboard.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="admin-password-input" style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#cbd5e1',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Admin Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password..."
                autoFocus
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: error ? '1.5px solid #ef4444' : '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  fontSize: '15px',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: loading
                ? '#475569'
                : 'linear-gradient(135deg, #6366f1, #4338ca)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: !password || loading ? 'not-allowed' : 'pointer',
              boxShadow: !password || loading ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Verifying Password…' : 'Access Admin Dashboard →'}
          </button>
        </form>

        <div style={{ marginTop: '24px' }}>
          <Link href="/" style={{
            color: '#818cf8',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ← Return to Store Front
          </Link>
        </div>

      </div>

      <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
