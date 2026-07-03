"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Lock, UserPlus, User, Menu, LogIn, Heart, Loader2, Users, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from '@/firebase/auth-service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { verifyRecaptcha } from '@/app/actions/verify-recaptcha';
import { getRecaptchaToken } from '@/lib/recaptcha-client';

export default function RegisterPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('show-captcha');
    return () => {
      document.body.classList.remove('show-captcha');
    };
  }, []);

  const headerLogoUrl = "/logo1.png";
  const sidebarLogoUrl = "/logo2.png";

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = async () => {
    if (!name || !gender || !email || !password) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع الحقول بما في ذلك اختيار الجنس." });
      return;
    }

    if (!validateEmail(email)) {
      toast({ variant: "destructive", title: "خطأ في البريد", description: "يرجى إدخال بريد إلكتروني صحيح." });
      return;
    }

    setLoading(true);
    try {
      const token = await getRecaptchaToken('register');

      const verification = await verifyRecaptcha(token);
      if (!verification.success) {
        toast({ variant: "destructive", title: "خطأ في الحماية", description: verification.error });
        setLoading(false);
        return;
      }

      await registerUser(email, password, { name, gender: gender as 'male' | 'female' });
      toast({ variant: "success", title: "تم التسجيل بنجاح", description: "تم إنشاء حسابك، مرحباً بك في عائلة جمهورك." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Register Error:", error);
      let message = "حدث خطأ ما أثناء التسجيل.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "هذا البريد الإلكتروني مستخدم بالفعل.";
      } else if (error.code === 'auth/invalid-email') {
        message = "يرجى إدخال بريد إلكتروني صحيح.";
      } else if (error.code === 'auth/weak-password') {
        message = "كلمة المرور ضعيفة جداً. يجب أن تكون 6 أحرف على الأقل.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالإنترنت. تأكد من جودة اتصالك.";
      } else if (error.message?.includes('reCAPTCHA') || error.message?.includes('RECAPTCHA')) {
        message = "فشل تحميل الحماية reCAPTCHA. تحقق من إعدادات المفاتيح والدومين.";
      }
      
      toast({ variant: "destructive", title: "فشل التسجيل", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex select-none antialiased" dir="rtl">
      {/* ===== Panneau de marque — PC uniquement (moitié droite de l'écran) ===== */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[45%] orange-gradient sticky top-0 h-screen flex-col items-center justify-center p-12 relative overflow-hidden shrink-0">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-80 h-80 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl p-3 mb-8">
            <Image src={sidebarLogoUrl} alt="جمهورك" width={70} height={70} className="object-contain" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 font-tajawal">انضم إلى جمهورك</h2>
          <p className="text-sm font-black text-white/80 leading-relaxed font-tajawal mb-12">
            انضم لأكبر منصة SMM في الوطن العربي. أسعار تنافسية، تنفيذ فوري، ودعم على مدار الساعة.
          </p>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white">99.9%</span>
              <span className="text-[10px] font-black text-white/70 font-tajawal">وقت تشغيل</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white">50K+</span>
              <span className="text-[10px] font-black text-white/70 font-tajawal">عميل سعيد</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white">24/7</span>
              <span className="text-[10px] font-black text-white/70 font-tajawal">دعم فني</span>
            </div>
          </div>
        </div>
        
        <p className="absolute bottom-8 text-[10px] text-white/50 font-bold uppercase tracking-widest font-tajawal">&copy; 2026 JOMHORAK.COM</p>
      </aside>

      {/* ===== Colonne formulaire ===== */}
      <div className="flex-1 flex flex-col items-center min-w-0">
      <div className="w-full max-w-[480px] md:max-w-xl lg:max-w-none min-h-screen bg-white shadow-xl lg:shadow-none flex flex-col relative ring-1 lg:ring-0 ring-slate-100">
        
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between sticky top-0 w-full bg-white z-50 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <button className="text-orange-500 h-[38px] w-[38px] flex items-center justify-center bg-white border border-orange-100 rounded-xl outline-none focus:outline-none cursor-pointer active:scale-95 transition-transform">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 border-none rounded-l-[2.5rem] bg-white overflow-hidden shadow-2xl" dir="rtl">
                <SheetTitle className="sr-only">جمهورك - قائمة التنقل</SheetTitle>
                <SheetDescription className="sr-only">قائمة الروابط</SheetDescription>
                <div className="h-full flex flex-col font-tajawal relative">
                  <div className="p-8 orange-gradient relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute top-[-20%] left-[-10%] w-40 h-40 rounded-full bg-white blur-3xl"></div>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl p-1.5">
                        <Image src={sidebarLogoUrl} alt="جمهورك" width={40} height={40} className="object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-white leading-tight">جمهورك</span>
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest leading-none">Jomhorak.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-8 space-y-1">
                    <Link href="/register" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-sm font-black">إنشاء حساب جديد</span>
                    </Link>
                    <Link href="/login" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-600 transition-none group outline-none">
                      <LogIn className="h-5 w-5" />
                      <span className="text-sm font-black">تسجيل الدخول</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 outline-none focus:outline-none active:bg-transparent transition-none">
               <Image src={headerLogoUrl} alt="جمهورك" width={38} height={38} className="object-contain" />
               <span className="text-[22px] font-bold text-orange-500">جمهورك</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="h-[38px] px-4 rounded-xl border border-orange-100 text-orange-500 font-black text-[11px] flex items-center gap-2 transition-transform outline-none focus:outline-none bg-transparent select-none cursor-pointer active:scale-95">
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </Link>
          </div>
        </header>

        <main className="flex-1 pt-12 lg:pt-16 flex flex-col">
          <div className="px-6 flex flex-col flex-1 w-full max-w-md lg:max-w-lg mx-auto">
            <div className="flex flex-col items-center text-center gap-3 mb-10">
              <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-lg border border-gray-100 p-2">
                <Image src={headerLogoUrl} alt="جمهورك" width={60} height={60} className="object-contain" />
              </div>
              <div className="space-y-1 mt-2">
                <h1 className="text-3xl font-black text-gray-900 font-tajawal">إنشاء حساب جديد</h1>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest font-tajawal">انضم لأكبر منصة SMM في الوطن العربي</p>
              </div>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 mr-1 justify-start">
                      <User className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-900 font-tajawal uppercase">الاسم الكامل</Label>
                    </div>
                    <Input 
                      placeholder="ياسين المغربي" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-6 focus-visible:ring-orange-500 font-tajawal shadow-none text-gray-600 text-right" 
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 mr-1 justify-start">
                      <Users className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-900 font-tajawal uppercase">الجنس</Label>
                    </div>
                    <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                      <SelectTrigger className="h-14 w-full rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-6 focus:ring-orange-500 shadow-none text-gray-600">
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-gray-100 font-bold">
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 mr-1 justify-start">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-900 font-tajawal uppercase">البريد الإلكتروني</Label>
                    </div>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-6 focus-visible:ring-orange-500 font-tajawal shadow-none text-gray-600 text-right" 
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 mr-1 justify-start">
                      <Lock className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-900 font-tajawal uppercase">كلمة المرور</Label>
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm pl-12 pr-6 focus-visible:ring-orange-500 font-tajawal shadow-none text-gray-600 text-right" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none transition-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full h-14 rounded-2xl orange-gradient text-white font-black text-lg shadow-lg shadow-orange-500/30 border-none select-none font-tajawal gap-3"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UserPlus className="h-6 w-6" />}
                  <span>{loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}</span>
                </Button>

                <div className="text-center pt-2">
                  <Link href="/login" className="text-[11px] font-black text-gray-600 uppercase tracking-widest font-tajawal inline-block">
                    لديك حساب بالفعل؟ <span className="text-orange-500 font-black">تسجيل الدخول</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* فوتر الجوال والتابلت — تصميم عمودي وسط الشاشة */}
          <footer className="lg:hidden mt-12 border-t border-slate-100 bg-white rounded-t-[3rem] pt-8 pb-10 px-6 font-tajawal">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-2">
                  <Image src={headerLogoUrl} alt="جمهورك" width={38} height={38} className="object-contain" />
                  <span className="text-xl font-black text-slate-900">جمهورك</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-bold max-w-xs mx-auto">
                  المنصة الأسرع والأرخص لخدمات التسويق الرقمي في الوطن العربي. جودة مضمونة ودعم فني على مدار الساعة.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 max-w-xs mx-auto">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 flex items-center justify-center">
                    القانونية
                  </h4>
                  <ul className="space-y-2 text-[11px] font-black text-slate-400 text-center">
                    <li><Link href="/dashboard/privacy" className="hover:text-orange-500 transition-colors">سياسة الخصوصية</Link></li>
                    <li><Link href="/dashboard/terms" className="hover:text-orange-500 transition-colors">شروط الخدمة</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 flex items-center justify-center">
                    المساعدة
                  </h4>
                  <ul className="space-y-2 text-[11px] font-black text-slate-400 text-center">
                    <li><Link href="/dashboard/support" className="hover:text-orange-500 transition-colors">مركز الدعم</Link></li>
                    <li><Link href="/dashboard/support" className="hover:text-orange-500 transition-colors">الأسئلة الشائعة</Link></li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                  <span>صنع بكل</span>
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>للمستخدم العربي</span>
                </div>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                  &copy; 2026 جميع الحقوق محفوظة لجمهورك (JOMHORAK.COM)
                </p>
              </div>
            </div>
          </footer>

          {/* فوتر الحاسوب — تصميم أفقي: الشعار والوصف في جهة، وخانات الدعم في الجهة الأخرى */}
          <footer className="hidden lg:block mt-12 border-t border-slate-100 bg-white rounded-t-[3rem] pt-10 pb-10 px-10 font-tajawal">
            <div className="max-w-[1600px] mx-auto space-y-8">
              <div className="flex items-start justify-between gap-16">
                <div className="flex items-start gap-3 max-w-sm">
                  <Image src={headerLogoUrl} alt="جمهورك" width={44} height={44} className="object-contain shrink-0" />
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-black text-slate-900">جمهورك</span>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">
                      المنصة الأسرع والأرخص لخدمات التسويق الرقمي في الوطن العربي. جودة مضمونة ودعم فني على مدار الساعة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-16">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900">القانونية</h4>
                    <ul className="space-y-2 text-[11px] font-black text-slate-400">
                      <li><Link href="/dashboard/privacy" className="hover:text-orange-500 transition-colors">سياسة الخصوصية</Link></li>
                      <li><Link href="/dashboard/terms" className="hover:text-orange-500 transition-colors">شروط الخدمة</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900">المساعدة</h4>
                    <ul className="space-y-2 text-[11px] font-black text-slate-400">
                      <li><Link href="/dashboard/support" className="hover:text-orange-500 transition-colors">مركز الدعم</Link></li>
                      <li><Link href="/dashboard/support" className="hover:text-orange-500 transition-colors">الأسئلة الشائعة</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                  <span>صنع بكل</span>
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>للمستخدم العربي</span>
                </div>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                  &copy; 2026 جميع الحقوق محفوظة لجمهورك (JOMHORAK.COM)
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
      </div>
    </div>
  );
}
