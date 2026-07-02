import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string, additionalData: { name: string; gender: 'male' | 'female' }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: additionalData.name,
    gender: additionalData.gender,
    balance: 0,
    totalSpent: 0,
    inProcessing: 0,
    isAdmin: false,
    createdAt: new Date().toISOString()
  });
  
  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("المستخدم غير مسجل");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: any) {
    console.error("Change Password Error:", error.code);
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error("كلمة المرور الحالية غير صحيحة");
    }
    if (error.code === 'auth/weak-password') {
      throw new Error("كلمة المرور الجديدة ضعيفة جداً");
    }
    throw new Error("حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة لاحقاً.");
  }
};
