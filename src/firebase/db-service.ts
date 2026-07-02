
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint
} from "firebase/firestore";
import { db } from "./config";

export interface PaginatedResult {
  docs: any[];
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
}

/**
 * Helper for Paginated Fetching (Read Operation - Safe for Client)
 */
export const getPaginatedDocs = async (
  collectionName: string, 
  pageSize: number = 10, 
  lastDoc: DocumentSnapshot | null = null,
  additionalQueries: QueryConstraint[] = [],
  orderCol: string | null = "createdAt"
): Promise<PaginatedResult> => {
  try {
    const constraints: QueryConstraint[] = [
      ...additionalQueries,
      limit(pageSize)
    ];

    if (orderCol) {
      constraints.push(orderBy(orderCol, "desc"));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    
    return {
      docs: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
      lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error(`Error fetching paginated ${collectionName}:`, error);
    // Fallback without ordering if it fails (likely index issue)
    if (orderCol) {
       return getPaginatedDocs(collectionName, pageSize, lastDoc, additionalQueries, null);
    }
    throw error;
  }
};

/**
 * Get User Data (Read Operation)
 */
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Update Profile Data (Non-financial - Safe for Client)
 */
export const updateUserData = async (uid: string, data: any) => {
  const { balance, isAdmin, ...safeData } = data;
  return updateDoc(doc(db, "users", uid), safeData);
};

/**
 * Get Exchange Rate (Read Operation)
 */
export const getExchangeRate = async () => {
  try {
    const rateDoc = await getDoc(doc(db, "settings", "exchangeRate"));
    if (rateDoc.exists()) {
      return parseFloat(rateDoc.data().rate) || 10;
    }
    return 10;
  } catch (error) {
    console.error("Error getting exchange rate:", error);
    return 10;
  }
};

/**
 * Create Shipping Request (Create Operation - User Request)
 */
export const createShippingRequest = async (uid: string, data: any) => {
  const docRef = await addDoc(collection(db, "shippings"), {
    ...data,
    userId: uid,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

/**
 * Create Support Ticket (Create Operation - User Request)
 */
export const createTicket = async (uid: string, data: any) => {
  return addDoc(collection(db, "tickets"), {
    ...data,
    userId: uid,
    createdAt: new Date().toISOString()
  });
};

/**
 * Real-time user orders stream (Safe for Client)
 */
export const getUserOrdersStream = (uid: string, callback: (data: any[] | null) => void) => {
  if (!uid) return null;
  
  try {
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", uid), 
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    return onSnapshot(q, (snap) => {
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    }, (error) => {
      console.error("Orders Stream Error:", error);
      const fallbackQuery = query(collection(db, "orders"), where("userId", "==", uid), limit(50));
      return onSnapshot(fallbackQuery, (fallbackSnap) => {
        const fallbackOrders = fallbackSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(fallbackOrders);
      });
    });
  } catch (e) {
    console.error("Stream setup error:", e);
    callback(null);
    return null;
  }
};

/**
 * Real-time user shippings stream (Safe for Client)
 */
export const getUserShippingsStream = (uid: string, callback: (data: any[] | null) => void) => {
  if (!uid) return null;
  
  try {
    const q = query(
      collection(db, "shippings"), 
      where("userId", "==", uid), 
      orderBy("createdAt", "desc"),
      limit(20)
    );
    
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(docs);
    }, (error) => {
      console.error("Shippings Stream Error:", error);
      const fallbackQuery = query(collection(db, "shippings"), where("userId", "==", uid), limit(20));
      return onSnapshot(fallbackQuery, (fallbackSnap) => {
        const fallbackDocs = fallbackSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(fallbackDocs);
      });
    });
  } catch (e) {
    console.error("Shippings Stream setup error:", e);
    callback(null);
    return null;
  }
};
