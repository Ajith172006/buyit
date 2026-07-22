'use client';

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
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

    if (firebaseAuth) {
      getRedirectResult(firebaseAuth)
        .then(async (result) => {
          if (result?.user) {
            await loadExistingProfile(result.user);
          }
        })
        .catch((err) => {
          console.error('Firebase redirect sign-in error:', err);
        });
    }

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


  const requireFirebase = () => {
    if (isFirebaseConfigured) return true;
    showToast('Firebase is not configured yet. Add the Firebase environment variables.');
    return false;
  };

  const loadExistingProfile = async (user) => {
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
      const result = response.ok ? await response.json() : null;
      if (result?.success && result.data?.phone && result.data?.address) {
        dispatch({ type: 'HYDRATE_USER', profile: result.data });
        showToast('Successfully logged in!');
        closeAuth();
        return true;
      }
    } catch (error) {
      console.error('Error fetching user profile from MongoDB:', error);
    }
    setProfile((current) => ({ ...current, name: user.displayName || '' }));
    setStep(3);
    return false;
  };

  const handleGoogleLogin = async () => {
    if (!requireFirebase()) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(firebaseAuth, provider);
      if (result?.user) {
        await loadExistingProfile(result.user);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      const errorCode = error?.code || '';
      const errorMessage = error?.message || '';

      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        showToast('Google sign-in popup was closed.');
      } else if (errorCode === 'auth/unauthorized-domain') {
        showToast('Domain not authorized in Firebase Console (Auth > Settings > Authorized domains).');
      } else if (errorCode === 'auth/operation-not-allowed') {
        showToast('Google sign-in provider is disabled in Firebase Console.');
      } else if (errorCode === 'auth/popup-blocked') {
        showToast('Popup blocked by browser. Attempting redirect sign-in...');
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(firebaseAuth, provider);
        } catch (redirectErr) {
          console.error('Google redirect error:', redirectErr);
          showToast('Google sign-in failed. Please allow popups or try again.');
        }
      } else if (errorCode === 'auth/invalid-api-key' || errorCode === 'auth/api-key-not-valid') {
        showToast('Invalid Firebase API key in environment variables.');
      } else if (errorCode === 'auth/network-request-failed') {
        showToast('Network error during Google sign-in. Please check connection.');
      } else {
        showToast(errorMessage ? `Google sign-in error: ${errorMessage}` : 'Google sign-in failed. Please try again later.');
      }
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
        headers: { 'Content-Type': 'application/json' },
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

