
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, LogIn, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'signup' | 'login';
  onAuthSuccess: (name: string) => void;
}

export default function AuthModals({ isOpen, onClose, initialTab, onAuthSuccess }: AuthModalsProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] rounded-[2.5rem] border-none p-0 overflow-hidden bg-white shadow-2xl outline-none focus:outline-none" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <div className="p-8 space-y-6" dir="rtl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-[2rem] orange-gradient flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-gray-900">
                {activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </DialogTitle>
            </DialogHeader>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {activeTab === 'login' ? 'أهلاً بك مجدداً في متجر المتابعين' : 'انضم لأكبر منصة SMM في الوطن العربي'}
            </p>
          </div>

          <div className="space-y-4">
            {activeTab === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-gray-400 uppercase mr-1 tracking-widest">الاسم الكامل</Label>
                  <div className="relative">
                    <Input 
                      placeholder="ياسين المغربي" 
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-xs pr-10 focus-visible:ring-orange-500 transition-none" 
                    />
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-gray-400 uppercase mr-1 tracking-widest">رقم الواتساب</Label>
                  <div className="relative">
                    <Input 
                      type="tel"
                      placeholder="+212 600 000 000" 
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-xs pr-10 focus-visible:ring-orange-500 transition-none" 
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase mr-1 tracking-widest">البريد الإلكتروني</Label>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-xs pr-10 focus-visible:ring-orange-500 transition-none" 
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-start">
                <Label className="text-[10px] font-black text-gray-400 uppercase mr-1 tracking-widest">كلمة المرور</Label>
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-xs pr-10 focus-visible:ring-orange-500 transition-none" 
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              </div>
            </div>
          </div>

          <Button 
            onClick={() => onAuthSuccess('User')}
            className="w-full h-14 rounded-2xl orange-gradient text-white font-black text-sm shadow-lg shadow-orange-500/20 transition-none outline-none focus:outline-none active:opacity-100 active:bg-orange-500 border-none select-none"
          >
            {activeTab === 'login' ? <LogIn className="h-4 w-4 ml-2" /> : <UserPlus className="h-4 w-4 ml-2" />}
            {activeTab === 'login' ? 'دخول' : 'إنشاء الحساب'}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-none outline-none focus:outline-none active:bg-transparent bg-transparent border-none cursor-pointer"
            >
              {activeTab === 'login' ? (
                <>ليس لديك حساب؟ <span className="text-orange-500 font-black">إنشاء حساب جديد</span></>
              ) : (
                <>لديك حساب بالفعل؟ <span className="text-orange-500 font-black">تسجيل الدخول</span></>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
