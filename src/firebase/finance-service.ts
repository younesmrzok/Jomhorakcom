/**
 * @fileOverview Finance Service for Jomhorak.com
 * Handles financial operations. Administrative operations run on the client 
 * to preserve Admin Auth context for Security Rules. 
 * SMM API calls are handled via a separate server action for security.
 */

import { 
  doc, 
  getDoc, 
  collection, 
  runTransaction, 
  increment, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDocs,
  query,
  where,
  limit,
  writeBatch
} from "firebase/firestore";
import { db } from "./config";
import { smmOrder, smmOrdersStatus } from "@/lib/smm-provider";

/**
 * Places an order. 
 */
export async function placeOrder(uid: string, orderData: { 
  serviceId: string, 
  apiId: number, 
  title: string, 
  platform: string, 
  link: string, 
  quantity: number, 
  price: number 
}) {
  try {
    const userRef = doc(db, "users", uid);
    
    return await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("المستخدم غير موجود");
      
      const userData = userSnap.data();
      if (userData.balance < orderData.price) {
        throw new Error("رصيدك غير كافٍ لإتمام هذا الطلب");
      }

      const providerResponse = await smmOrder({
        service: orderData.apiId,
        link: orderData.link,
        quantity: orderData.quantity
      });

      if (providerResponse.error) {
        throw new Error(providerResponse.error);
      }

      if (!providerResponse.order) {
        throw new Error("فشل الحصول على رقم الطلب من المزود");
      }

      // Deduct balance and increment processing stats in DB
      transaction.update(userRef, {
        balance: increment(-orderData.price),
        inProcessing: increment(orderData.price)
      });

      const orderRef = doc(collection(db, "orders"));
      transaction.set(orderRef, {
        userId: uid,
        userName: userData.name || userData.email,
        serviceId: orderData.serviceId,
        apiOrderId: providerResponse.order.toString(),
        title: orderData.title,
        platform: orderData.platform,
        link: orderData.link,
        quantity: orderData.quantity,
        price: orderData.price,
        status: 'قيد المعالجة',
        createdAt: new Date().toISOString()
      });

      return { success: true };
    });
  } catch (error: any) {
    console.error("Order Placement Error:", error);
    throw new Error(error.message || "حدث خطأ غير متوقع");
  }
}

/**
 * Syncs user's active orders with the provider using strict mapping.
 * Also updates user's summary stats (totalSpent, inProcessing) based on status changes.
 */
export async function syncUserOrdersStatus(uid: string) {
  if (!uid) return;
  
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("userId", "==", uid),
      limit(100) 
    );
    
    const snapshot = await getDocs(q);
    const activeOrders = snapshot.docs.filter(doc => {
      const s = doc.data().status;
      return s !== 'مكتمل' && s !== 'ملغي';
    });

    if (activeOrders.length === 0) return;

    const apiOrderIds = activeOrders.map(d => d.data().apiOrderId).filter(id => !!id).join(',');
    if (!apiOrderIds) return;

    const statuses = await smmOrdersStatus(apiOrderIds);
    if (!statuses || statuses.error) return;

    const userRef = doc(db, "users", uid);
    const batch = writeBatch(db);
    let hasChanges = false;
    
    let statsAdjust_inProcessing = 0;
    let statsAdjust_totalSpent = 0;

    /**
     * Strict Mapping Table for Jomhorak.com
     */
    const statusMap: Record<string, string> = {
      'pending': 'قيد المعالجة',
      'waiting': 'قيد المعالجة',
      'processing': 'قيد المعالجة',
      'in progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'partial': 'مكتمل',
      'canceled': 'ملغي',
      'refunded': 'ملغي'
    };

    activeOrders.forEach(orderDoc => {
      const orderData = orderDoc.data();
      const apiId = orderData.apiOrderId;
      const currentLocalStatus = orderData.status;
      const orderPrice = Number(orderData.price) || 0;
      const apiData = statuses[apiId];
      
      if (apiData && apiData.status) {
        const apiStatusKey = apiData.status.toLowerCase().trim().replace(/_/g, ' ');
        const mappedStatus = statusMap[apiStatusKey];

        if (mappedStatus && mappedStatus !== currentLocalStatus) {
          batch.update(orderDoc.ref, { status: mappedStatus });
          hasChanges = true;

          // Logic to update user stats
          // If status moved to finalized states (completed/partial or canceled/refunded)
          if (mappedStatus === 'مكتمل') {
            statsAdjust_inProcessing -= orderPrice;
            statsAdjust_totalSpent += orderPrice;
          } else if (mappedStatus === 'ملغي') {
            statsAdjust_inProcessing -= orderPrice;
          }
        }
      }
    });

    if (hasChanges) {
      // Apply stats adjustments to user doc
      batch.update(userRef, {
        inProcessing: increment(statsAdjust_inProcessing),
        totalSpent: increment(statsAdjust_totalSpent)
      });
      await batch.commit();
    }
  } catch (error) {
    console.error("Sync Orders Error:", error);
  }
}

/**
 * Admin action to approve shipping and add balance.
 */
export async function approveShippingRequest(shippingId: string, userId: string, amountMad: number) {
  if (!shippingId || !userId || !amountMad) throw new Error("بيانات غير مكتملة");
  
  const rateDoc = await getDoc(doc(db, "settings", "exchangeRate"));
  const rate = rateDoc.exists() ? parseFloat(rateDoc.data().rate) || 10 : 10;
  const amountUsd = parseFloat(amountMad.toString()) / rate;
  
  await updateDoc(doc(db, "shippings", shippingId), { status: 'completed' });
  await updateDoc(doc(db, "users", userId), { balance: increment(amountUsd) });
  
  return { success: true };
}

/**
 * Admin action to reject shipping
 */
export async function rejectShippingRequest(shippingId: string) {
  if (!shippingId) throw new Error("بيانات غير مكتملة");
  await updateDoc(doc(db, "shippings", shippingId), { status: 'rejected' });
  return { success: true };
}

/**
 * Admin action to update user balance directly
 */
export async function adminUpdateUserBalance(userId: string, newBalance: number) {
  return updateDoc(doc(db, "users", userId), { balance: newBalance });
}

/**
 * Admin action to update exchange rate
 */
export async function updateExchangeRate(rate: number) {
  return setDoc(doc(db, "settings", "exchangeRate"), { 
    rate: rate, 
    updatedAt: new Date().toISOString() 
  }, { merge: true });
}

/**
 * Admin action to delete user account
 */
export async function adminDeleteUser(uid: string) {
  return deleteDoc(doc(db, "users", uid));
}

/**
 * Admin action to delete any document
 */
export async function adminDeleteDocument(coll: string, id: string) {
  return deleteDoc(doc(db, coll, id));
}
