'use client';

import { useEffect, useState } from 'react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

const AUTH_KEY = 'buyit_admin_auth';

export default function AdminLoginPage() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved === '1') {
      window.location.href = '/admin';
    } else {
      setAuthed(false);
    }
  }, []);

  if (authed === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f172a',
        color: '#818cf8'
      }}>
        Loading…
      </div>
    );
  }

  return <AdminLoginForm onSuccess={() => { window.location.href = '/admin'; }} />;
}
