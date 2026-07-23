'use client';

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { useStore } from '@/context/StoreContext';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebaseClient';
import { firebaseAuthHeaders } from '@/lib/firebase-auth-headers';

const emptyAddress = { doorNo: '', street: '', city: '', district: '', state: '', pincode: '' };

export default function UserAuthModal() {
  const { state, dispatch, showToast } = useStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState({ name: '', age: '' });
  const [address, setAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setStep(1);
    setPhone('');
    setProfile({ name: '', age: '' });
    setAddress(emptyAddress);
  };

  const closeAuth = async () => {
    if (!state.userAuthenticated && firebaseAuth) await signOut(firebaseAuth);
    dispatch({ type: 'CLOSE_USER_LOGIN' });
    setTimeout(resetForm, 300);
  };

  const requireFirebase = () => {
    if (isFirebaseConfigured) return true;
    showToast('Firebase is not configured yet. Add the Firebase environment variables.');
    return false;
  };

  const loadExistingProfile = async (user) => {
    try {
      const response = await fetch('/api/user', { headers: await firebaseAuthHeaders() });
      const result = response.ok ? await response.json() : null;
      if (result?.success && result.data?.phone && result.data?.address) {
        dispatch({ type: 'HYDRATE_USER', profile: result.data });
        showToast('Successfully logged in!');
        closeAuth();
        return true;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    setProfile((current) => ({ ...current, name: current.name || user.displayName || '' }));
    setStep(2);
    return false;
  };

  useEffect(() => {
    if (!state.userLoginOpen) return;

    const checkUser = async () => {
      if (firebaseAuth) {
        try {
          const result = await getRedirectResult(firebaseAuth);
          if (result?.user) {
            await loadExistingProfile(result.user);
            return;
          }
        } catch (err) {
          console.error('Firebase redirect sign-in error:', err);
        }
      }

      const user = firebaseAuth?.currentUser;
      if (user && (!state.userProfile?.phone || !state.userProfile?.address)) {
        setProfile((current) => (current.name ? current : { ...current, name: user.displayName || '' }));
        setStep(2);
      } else if (!user) {
        setStep(1);
      }
    };

    checkUser();
  }, [state.userLoginOpen, state.userProfile]);

  const handleGoogleLogin = async () => {
    if (!requireFirebase()) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(firebaseAuth, provider);
      if (result?.user) await loadExistingProfile(result.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      const errorCode = error?.code || '';
      const errorMessage = error?.message || '';
      if (errorCode === 'auth/popup-blocked') { try { await signInWithRedirect(firebaseAuth, new GoogleAuthProvider()); } catch { showToast('Google sign-in failed. Please allow popups or try again.'); } }
      else showToast(errorMessage ? `Google sign-in error: ${errorMessage}` : 'Google sign-in failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const user = firebaseAuth?.currentUser;
    const email = user?.email || profile.email || 'user@shopnest.com';

    if (!profile.name || !profile.age || !phone || !address.doorNo || !address.street || !address.city || !address.district || !address.state || !address.pincode) {
      return showToast('Please fill all profile details.');
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return showToast('Please enter a valid 10-digit mobile number.');
    }

    setLoading(true);

    const formattedAddressStr = `${address.doorNo}, ${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`;
    const fallbackProfile = {
      id: user?.uid || `user-${Date.now()}`,
      name: profile.name,
      email,
      phone: cleanPhone,
      age: Number(profile.age),
      address: formattedAddressStr,
      savedAddresses: [{ label: 'Home', doorNo: address.doorNo, street: address.street, city: address.city, district: address.district, state: address.state, pincode: address.pincode, isDefault: true }],
      wishlist: [],
    };

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await firebaseAuthHeaders()) },
        body: JSON.stringify({ email, name: profile.name, phone: cleanPhone, age: profile.age, address }),
      });

      const result = response.ok ? await response.json() : null;

      if (result?.success && result.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('buyit_user_session', JSON.stringify(result.data));
        }
        dispatch({ type: 'HYDRATE_USER', profile: result.data });
        showToast('Profile saved successfully!');
      } else {
        console.warn('Backend MongoDB sync failed, saving locally:', result?.message);
        if (typeof window !== 'undefined') {
          localStorage.setItem('buyit_user_session', JSON.stringify(fallbackProfile));
        }
        dispatch({ type: 'HYDRATE_USER', profile: fallbackProfile });
        showToast('Profile saved successfully!');
      }
      closeAuth();
    } catch (error) {
      console.error('Error saving profile to backend:', error);
      if (typeof window !== 'undefined') {
        localStorage.setItem('buyit_user_session', JSON.stringify(fallbackProfile));
      }
      dispatch({ type: 'HYDRATE_USER', profile: fallbackProfile });
      showToast('Profile saved successfully!');
      closeAuth();
    } finally {
      setLoading(false);
    }
  };

  if (!state.userLoginOpen) return null;

  return (
    <div id="user-auth-overlay" onClick={(event) => event.target.id === 'user-auth-overlay' && closeAuth()}>
      <div className="user-auth-modal" style={{ width: '420px' }}>
        <button type="button" className="user-auth-close" aria-label="Close login" onClick={closeAuth}>✕</button>
        <div className="ua-brand" style={{ fontStyle: 'italic' }}>BuyIt <span className="plus-color">Plus ✦</span></div>
        {step === 1 ? (
          <div className="ua-step">
            <h2>Welcome to BuyIT</h2>
            <p className="ua-sub">Sign in to continue your shopping journey</p>
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
