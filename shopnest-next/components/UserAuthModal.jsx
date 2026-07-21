'use client';

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useStore } from '@/context/StoreContext';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebaseClient';

const emptyAddress = { doorNo: '', street: '', city: '', district: '', state: '', pincode: '' };

export default function UserAuthModal() {
  const { state, dispatch, showToast } = useStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState({ name: '', age: '' });
  const [address, setAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.userLoginOpen) return;
    const user = firebaseAuth?.currentUser;
    if (user) {
      setProfile((current) => ({ ...current, name: user.displayName || '' }));
      setStep(3);
    } else {
      setStep(1);
    }
  }, [state.userLoginOpen]);

  if (!state.userLoginOpen) return null;

  const resetForm = () => {
    setStep(1);
    setPhone('');
    setProfile({ name: '', age: '' });
    setAddress(emptyAddress);
  };

  const closeAuth = async () => {
    if (step === 3 && !state.userAuthenticated && firebaseAuth) await signOut(firebaseAuth);
    dispatch({ type: 'CLOSE_USER_LOGIN' });
    setTimeout(resetForm, 300);
  };

  const handleQuickDemoLogin = () => {
    const demoProfile = {
      id: 'demo-user-101', name: 'Ajith (Demo User)', email: 'demo@shopnest.com', phone: '9876543210', age: 24,
      address: '123 Main St, Anna Nagar, Chennai, Tamil Nadu - 600040',
      savedAddresses: [{ label: 'Home', doorNo: '123', street: 'Main St, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', isDefault: true }],
      wishlist: [],
    };
    localStorage.setItem('buyit_user_session', JSON.stringify(demoProfile));
    dispatch({ type: 'HYDRATE_USER', profile: demoProfile });
    showToast('Logged in as Demo User!');
    closeAuth();
  };

  const requireFirebase = () => {
    if (isFirebaseConfigured) return true;
    showToast('Firebase is not configured yet. Add the Firebase environment variables.');
    return false;
  };

  const loadExistingProfile = async (user) => {
    const response = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
    const result = response.ok ? await response.json() : null;
    if (result?.success && result.data?.phone && result.data?.address) {
      dispatch({ type: 'HYDRATE_USER', profile: result.data });
      showToast('Successfully logged in!');
      closeAuth();
      return true;
    }
    setProfile((current) => ({ ...current, name: user.displayName || '' }));
    setStep(3);
    return false;
  };

  const handleGoogleLogin = async () => {
    if (!requireFirebase()) return;
    setLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      await loadExistingProfile(result.user);
    } catch (error) {
      showToast(error.code === 'auth/popup-closed-by-user' ? 'Google sign-in was cancelled.' : 'Google sign-in failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const user = firebaseAuth?.currentUser;
    if (!user) return showToast('Authentication expired. Please sign in again.');
    if (!profile.name || !profile.age || !phone || !address.doorNo || !address.street || !address.city || !address.district || !address.state || !address.pincode) {
      return showToast('Please fill all profile details.');
    }
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: profile.name, phone, age: profile.age, address }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      dispatch({ type: 'HYDRATE_USER', profile: result.data });
      showToast('Profile saved successfully!');
      closeAuth();
    } catch (error) {
      showToast('Could not save your profile. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div id="user-auth-overlay" onClick={(event) => event.target.id === 'user-auth-overlay' && closeAuth()}>
      <div className="user-auth-modal" style={{ width: '420px' }}>
        <button type="button" className="user-auth-close" aria-label="Close login" onClick={closeAuth}>✕</button>
        <div className="ua-brand" style={{ fontStyle: 'italic' }}>BuyIt <span className="plus-color">Plus ✦</span></div>
        {step === 1 ? (
          <div className="ua-step">
            <h2>Welcome to BuyIt</h2><p className="ua-sub">Sign in to continue your shopping journey</p>
            <button type="button" onClick={handleQuickDemoLogin} disabled={loading} className="ua-btn" style={{ background: '#10b981', marginBottom: 12 }}>⚡ Quick Demo Login</button>
            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="ua-btn google-btn" style={{ background: '#fff', color: '#333', border: '1px solid #ccc', marginBottom: 8 }}>Sign in with Google</button>
          </div>
        ) : (
          <div className="ua-step"><h2>Complete Profile</h2><p className="ua-sub">Tell us a bit about yourself</p>
            <form onSubmit={handleSaveProfile} className="ua-profile-form">
              <div className="ua-field"><label>Full name</label><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div>
              <div className="ua-field"><label>Mobile number</label><input type="tel" maxLength="10" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))} /></div>
              <div className="ua-field"><label>Age</label><input type="number" value={profile.age} onChange={(event) => setProfile({ ...profile, age: event.target.value })} /></div>
              <div className="ua-field"><label>Delivery address</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{Object.entries(address).map(([field, value]) => <input key={field} placeholder={field.replace(/([A-Z])/g, ' $1')} value={value} onChange={(event) => setAddress({ ...address, [field]: event.target.value })} />)}</div></div>
              <button type="submit" className="ua-btn" disabled={loading}>Start Shopping →</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

