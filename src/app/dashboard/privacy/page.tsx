"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <h1 className="text-xl font-black text-gray-900">سياسة الخصوصية</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 space-y-8 text-right">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">التزام جمهورك بالخصوصية</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                في جمهورك، نولي أهمية قصوى لخصوصية مستخدمينا. نحن نستخدم المعلومات التي نجمعها فقط لتنفيذ طلباتك وتحسين تجربتك على منصة Jomhorak.com.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">المعلومات التي نجمعها</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                نجمع معلومات الحساب مثل البريد الإلكتروني وروابط المنصات التي ترغب في دعمها. جمهورك لا يطلب أبداً كلمات مرور حساباتك الشخصية على وسائل التواصل الاجتماعي.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">أمن البيانات</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                يتم تشفير جميع البيانات والمعاملات المالية باستخدام بروتوكولات SSL المتقدمة لضمان بقاء معلوماتك آمنة وبعيدة عن أي تدخل خارجي في Jomhorak.com.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <EyeOff className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">عدم مشاركة البيانات</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                نحن في جمهورك نتعهد بعدم بيع أو مشاركة أو تأجير بياناتك الشخصية لأي طرف ثالث. معلوماتك تُستخدم حصرياً داخل منصة Jomhorak.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
