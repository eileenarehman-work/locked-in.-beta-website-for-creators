import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { User, Project, Review } from '../types';
import { storage } from '../mock/initialData';

// Generate safe, clean username handle from display name or email
function generateHandle(name?: string | null, email?: string | null): string {
  if (name) {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean) return clean.slice(0, 20);
  }
  if (email) {
    const prefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (prefix) return prefix.slice(0, 20);
  }
  return `maker_${Math.floor(1000 + Math.random() * 9000)}`;
}

// Convert Firebase user & profile into application User model
export function mapFirebaseUserToAppUser(fbUser: FirebaseUser, existingProfile?: Partial<User> | null): User {
  const generated = generateHandle(fbUser.displayName, fbUser.email);
  return {
    id: fbUser.uid,
    email: fbUser.email || `${fbUser.uid}@google.auth`,
    googleId: fbUser.uid,
    displayName: fbUser.displayName || existingProfile?.displayName || 'Creator',
    handle: existingProfile?.handle || generated,
    avatarUrl:
      fbUser.photoURL ||
      existingProfile?.avatarUrl ||
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="46" ry="45" fill="%23ffea78" stroke="%231e293b" stroke-width="6"/><circle cx="31" cy="38" r="4.5" fill="%232aa6cb"/><circle cx="69" cy="38" r="4.5" fill="%232aa6cb"/><ellipse cx="50" cy="61" rx="14" ry="10" fill="%23ebe3dc" stroke="%231e293b" stroke-width="5"/></svg>',
    bio: existingProfile?.bio || 'Maker & creator building with code, hardware, and design.',
    age: existingProfile?.age || 16,
    reputationScore: existingProfile?.reputationScore || 15,
    trustTier: 'VERIFIED_HUMAN',
    interestTags: existingProfile?.interestTags?.length
      ? existingProfile.interestTags
      : ['#robotics', '#creative-tech', '#makers'],
    isEmailVerified: fbUser.emailVerified ?? true,
    createdAt: existingProfile?.createdAt || new Date().toISOString(),
  };
}

// 1. Google Sign-In with Firebase Auth
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, 'users', fbUser.uid);
    let appUser: User;

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as User;
        appUser = mapFirebaseUserToAppUser(fbUser, data);
      } else {
        appUser = mapFirebaseUserToAppUser(fbUser);
        await setDoc(userRef, {
          ...appUser,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      appUser = mapFirebaseUserToAppUser(fbUser);
      // Try save to Firestore
      try {
        await setDoc(userRef, {
          ...appUser,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not save user profile to Firestore yet:', err);
      }
    }

    // Save to local storage for instant offline capability and fallback
    storage.setUser(appUser);
    storage.registerUser(appUser);

    return appUser;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

// 2. Sign Out
export async function signOutFromFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    storage.setUser(null);
  } catch (error) {
    console.error('Sign out failed:', error);
    storage.setUser(null);
  }
}

// 3. User Profile Sync to Firestore
export async function syncUserToFirestore(user: User): Promise<void> {
  if (!user || !user.id) return;
  const path = `users/${user.id}`;
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore sync user error:', error);
  }
}

// 4. Subscribe to Real-Time Users list (Various Accounts Support)
export function subscribeFirestoreUsers(callback: (users: User[]) => void): () => void {
  const path = 'users';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const users: User[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as User;
          if (data && data.id) {
            users.push(data);
          }
        });
        storage.saveAllUsers(users);
        callback(users);
      },
      (error) => {
        console.warn('Firestore users snapshot listener error:', error.message);
      }
    );
  } catch (e) {
    console.warn('Error subscribing to users:', e);
    return () => {};
  }
}

// 5. Projects Sync & Subscription
export function subscribeFirestoreProjects(callback: (projects: Project[]) => void): () => void {
  const path = 'projects';
  try {
    const colRef = collection(db, path);
    const q = query(colRef, limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const projs: Project[] = [];
        snapshot.forEach((docSnap) => {
          const p = docSnap.data() as Project;
          if (p && p.id) {
            projs.push(p);
          }
        });
        storage.saveProjects(projs);
        callback(projs);
      },
      (error) => {
        console.warn('Projects snapshot error:', error.message);
      }
    );
  } catch (e) {
    console.warn('Error subscribing to projects:', e);
    return () => {};
  }
}

export async function saveProjectToFirestore(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Save project to Firestore error:', error);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.warn('Delete project from Firestore error:', error);
  }
}

// 6. Reviews Sync & Subscription
export function subscribeFirestoreReviews(callback: (reviews: Review[]) => void): () => void {
  const path = 'reviews';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const revs: Review[] = [];
        snapshot.forEach((docSnap) => {
          const r = docSnap.data() as Review;
          if (r && r.id) {
            revs.push(r);
          }
        });
        storage.saveReviews(revs);
        callback(revs);
      },
      (error) => {
        console.warn('Reviews snapshot error:', error.message);
      }
    );
  } catch (e) {
    console.warn('Error subscribing to reviews:', e);
    return () => {};
  }
}

export async function saveReviewToFirestore(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    const revRef = doc(db, 'reviews', review.id);
    await setDoc(revRef, review);
  } catch (error) {
    console.warn('Save review to Firestore error:', error);
  }
}
