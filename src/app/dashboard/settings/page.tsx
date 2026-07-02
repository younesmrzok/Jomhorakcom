
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  ArrowRight,
  Save,
  LogOut,
  Mail,
  Fingerprint,
  KeyRound,
  ShieldAlert,
  Loader2,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/firebase/hooks';
import { logoutUser, changeUserPassword } from '@/firebase/auth-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateUserData as updateDB } from '@/firebase/db-service';
import { clearPaginatedCache } from '@/lib/pagination-store';
import { clearServicesCache } from '@/lib/services-store';

export default function SettingsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [email, setEmail] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setGender(userData.gender || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDB(user.uid, {
        name,
        gender
      });
      toast({
        variant: "success",
        title: "تم الحفظ بنجاح",
        description: "تم تحديث معلومات ملفك الشخصي بنجاح.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحديث",
        description: "حدث خطأ أثناء محاولة حفظ البيانات.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع حقول كلمة المرور." });
      return;
    }
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل." });
      return;
    }

    setPassLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast({ variant: "success", title: "تم التغيير بنجاح", description: "تم تحديث كلمة المرور بنجاح." });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast({ variant: "destructive", title: "فشل التغيير", description: error.message || "حدث خطأ غير متوقع." });
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      clearPaginatedCache();
      clearServicesCache();
      await logoutUser();
      router.push('/login');
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تسجيل الخروج." });
    }
  };

  const getAvatarUrl = () => {
    const currentGender = gender || userData?.gender;
    if (!currentGender) return null;

    if (currentGender === 'female') {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=female_jomhorak_v3&skinColor=fbe0d0&topType=longHair,bob,curly,curvy,hijab,turban&accessoriesType=none&clotheType=overall,blazerAndShirt&eyeType=default&mouthType=smile`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=male_jomhorak_v3&skinColor=fbe0d0&topType=shortHair,shaved,frizzle,dreads,sideburns&accessoriesType=none&clotheType=graphicShirt,shirtVNeck,blazerAndShirt&eyeType=default&mouthType=default`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="space-y-6 pb-24 text-right" dir="rtl">
      <div className="flex items-center gap-2">
         <Link href="/dashboard">
            <button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center bg-transparent border-none outline-none transition-none">
              <ArrowRight className="h-5 w-5" />
            </button>
         </Link>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <h1 className="text-xl font-black text-gray-900">الإعدادات الشخصية</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-orange-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden transition-none">
              <Avatar className="w-full h-full rounded-none">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userData?.name} key={gender} />
                ) : null}
                <AvatarFallback className="bg-orange-50 text-orange-200">
                  <User className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">{userData?.name || 'مستخدم'}</span>
            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black border border-emerald-100">
              <span>حساب نشط</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3 px-1">
            <div className="p-2 bg-orange-50 rounded-xl">
               <User className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-base font-black text-gray-900 uppercase">المعلومات الأساسية</h2>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 space-y-6">
               <div className="space-y-3">
                 <div className="flex items-center gap-2 mr-1">
                   <Fingerprint className="h-4 w-4 text-gray-400" />
                   <Label className="text-sm font-black text-gray-900 uppercase">الاسم الكامل</Label>
                 </div>
                 <input 
                   value={name} 
                   onChange={(e) => setName(e.target.value)}
                   className="h-14 w-full rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm px-6 focus:border-orange-500 shadow-none outline-none text-gray-600 font-tajawal" 
                 />
               </div>

               <div className="space-y-3">
                 <div className="flex items-center gap-2 mr-1">
                   <Users className="h-4 w-4 text-gray-400" />
                   <Label className="text-sm font-black text-gray-900 uppercase">الجنس</Label>
                 </div>
                 <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                    <SelectTrigger className="h-14 w-full rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm px-6 focus:ring-orange-500 shadow-none text-gray-600">
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 font-bold">
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-3">
                 <div className="flex items-center gap-2 mr-1">
                   <Mail className="h-4 w-4 text-gray-400" />
                   <Label className="text-sm font-black text-gray-900 uppercase">البريد الإلكتروني</Label>
                 </div>
                 <input 
                   type="email"
                   value={email} 
                   disabled
                   className="h-14 w-full rounded-2xl bg-gray-50/10 border border-gray-100 font-bold text-sm px-6 opacity-60 text-gray-400 outline-none font-tajawal" 
                 />
               </div>

               <Button 
                onClick={handleUpdate} 
                disabled={loading}
                className="w-full h-14 rounded-2xl orange-gradient text-white font-black shadow-lg shadow-orange-500/20 gap-3 border-none outline-none mt-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                حفظ البيانات الأساسية
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3 px-1">
            <div className="p-2 bg-orange-50 rounded-xl">
               <ShieldAlert className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-base font-black text-gray-900 uppercase">أمان الحساب</h2>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 space-y-6">
               <div className="space-y-3">
                 <div className="flex items-center gap-2 mr-1">
                   <Lock className="h-4 w-4 text-gray-400" />
                   <Label className="text-sm font-black text-gray-900 uppercase">كلمة المرور الحالية</Label>
                 </div>
                 <div className="relative">
                   <input 
                     type={showCurrentPassword ? "text" : "password"}
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     placeholder="••••••••"
                     className="h-14 w-full rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm pl-12 pr-6 focus:border-orange-500 shadow-none outline-none text-gray-600 font-tajawal" 
                   />
                   <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none transition-none"
                   >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </button>
                 </div>
               </div>

               <div className="space-y-3">
                 <div className="flex items-center gap-2 mr-1">
                   <KeyRound className="h-4 w-4 text-gray-400" />
                   <Label className="text-sm font-black text-gray-900 uppercase">كلمة المرور الجديدة</Label>
                 </div>
                 <div className="relative">
                   <input 
                     type={showNewPassword ? "text" : "password"}
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="••••••••"
                     className="h-14 w-full rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm pl-12 pr-6 focus:border-orange-500 shadow-none outline-none text-gray-600 font-tajawal" 
                   />
                   <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none transition-none"
                   >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </button>
                 </div>
               </div>

               <Button 
                onClick={handlePasswordChange}
                disabled={passLoading}
                className="w-full h-14 rounded-2xl orange-gradient text-white font-black shadow-lg shadow-orange-500/20 gap-3 border-none outline-none mt-2"
              >
                {passLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                تحديث كلمة المرور
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 pt-4 pb-12">
          <button 
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl bg-red-50 text-red-500 text-sm font-black flex items-center justify-center gap-3 transition-all active:scale-95 border border-red-100/50 font-tajawal"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج من الحساب
          </button>
        </div>
      </div>
    </div>
  );
}
