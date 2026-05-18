import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Tip, Asset, Niche, GuideStep, OperationType } from '../types';

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dataService = {
  // Tips
  async getTips(): Promise<Tip[]> {
    const path = 'tips';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tip));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  },

  subscribeTips(callback: (tips: Tip[]) => void) {
    const path = 'tips';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tip)));
    }, (e) => handleFirestoreError(e, 'list', path));
  },

  // Assets
  async getAssets(): Promise<Asset[]> {
    const path = 'assets';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  },

  subscribeAssets(callback: (assets: Asset[]) => void) {
    const path = 'assets';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset)));
    }, (e) => handleFirestoreError(e, 'list', path));
  },

  // Niches
  async getNiches(): Promise<Niche[]> {
    const path = 'niches';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Niche));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  },

  // Guide
  async getGuide(): Promise<GuideStep[]> {
    const path = 'guide';
    try {
      const q = query(collection(db, path), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GuideStep));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  },

  // Admin writes (for initial seeding or if user email matches)
  async addNiche(niche: Omit<Niche, 'id'>) {
    const path = 'niches';
    try {
      return await addDoc(collection(db, path), niche);
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async addTip(tip: Omit<Tip, 'id' | 'createdAt'>) {
    const path = 'tips';
    try {
      return await addDoc(collection(db, path), {
        ...tip,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async addAsset(asset: Omit<Asset, 'id' | 'createdAt'>) {
    const path = 'assets';
    try {
      return await addDoc(collection(db, path), {
        ...asset,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async addGuideStep(step: Omit<GuideStep, 'id'>) {
    const path = 'guide';
    try {
      return await addDoc(collection(db, path), step);
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async updateTip(id: string, data: Partial<Tip>) {
    const path = `tips/${id}`;
    try {
      await updateDoc(doc(db, 'tips', id), data);
    } catch (e) {
      handleFirestoreError(e, 'update', path);
    }
  },

  async deleteTip(id: string) {
    const path = `tips/${id}`;
    try {
      await deleteDoc(doc(db, 'tips', id));
    } catch (e) {
      handleFirestoreError(e, 'delete', path);
    }
  },

  async updateNiche(id: string, data: Partial<Niche>) {
    const path = `niches/${id}`;
    try {
      await updateDoc(doc(db, 'niches', id), data);
    } catch (e) {
      handleFirestoreError(e, 'update', path);
    }
  },

  async deleteNiche(id: string) {
    const path = `niches/${id}`;
    try {
      await deleteDoc(doc(db, 'niches', id));
    } catch (e) {
      handleFirestoreError(e, 'delete', path);
    }
  },

  async updateAsset(id: string, data: Partial<Asset>) {
    const path = `assets/${id}`;
    try {
      await updateDoc(doc(db, 'assets', id), data);
    } catch (e) {
      handleFirestoreError(e, 'update', path);
    }
  },

  async deleteAsset(id: string) {
    const path = `assets/${id}`;
    try {
      await deleteDoc(doc(db, 'assets', id));
    } catch (e) {
      handleFirestoreError(e, 'delete', path);
    }
  }
};
