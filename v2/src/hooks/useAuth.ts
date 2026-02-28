import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  age: string;
  gender: string;
  phone: string;
  photoURL: string;
  interests: number[];           // sorted interest IDs from UserInterests screen
  createdAt: string;
};

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

// All interest IDs in their default priority order (user can reorder in Interests screen)
const DEFAULT_INTERESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = profileSnap.exists()
          ? (profileSnap.data() as UserProfile)
          : null;
        setState({ user: firebaseUser, profile, loading: false });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before logging in.');
    }
    return cred.user;
  };

  const register = async (
    email: string,
    password: string,
    profile: Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'photoURL' | 'interests'>,
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      photoURL: '',
      interests: DEFAULT_INTERESTS,
      createdAt: new Date().toISOString(),
      ...profile,
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    await signOut(auth); // force re-login after email verification
    return cred.user;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const refreshProfile = async () => {
    const u = auth.currentUser;
    if (!u) return;
    const snap = await getDoc(doc(db, 'users', u.uid));
    if (snap.exists()) {
      setState((prev) => ({ ...prev, profile: snap.data() as UserProfile }));
    }
  };

  return { ...state, login, register, logout, resetPassword, refreshProfile };
}
