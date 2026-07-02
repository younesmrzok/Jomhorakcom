"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
            <h1 className="text-xl font-black text-gray-900">شروط الخدمة</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 space-y-8 text-right">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">الموافقة على الشروط</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                باستخدامك لمنصة جمهورك (Jomhorak.com)، فأنت توافق تلقائياً على كافة الشروط والأحكام المذكورة هنا. نحن نحتفظ بالحق في تعديل هذه الشروط في أي وقت.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">سياسة التنفيذ</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                يتم البدء في تنفيذ الطلبات فور استلام الدفع في جمهورك. الوقت المقدر للتنفيذ يختلف من خدمة لأخرى ولا يمثل ضماناً ثابتاً، بل هو تقدير مبني على متوسط سرعة النظام.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">المسؤولية</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                جمهورك غير مسؤول عن أي حظر أو حذف قد يحدث لحسابك من قبل منصات التواصل الاجتماعي. نحن نقدم خدمات ترويجية فقط ولا نتحكم في سياسات المنصات الخارجية.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-black text-gray-900">سياسة الاسترجاع</h2>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                لا يمكن استرجاع المبالغ المشحونة إلى حسابك ككاش، ولكن يتم استخدامها حصرياً داخل متجر جمهورك. في حال فشل تنفيذ الطلب، يتم إعادة المبلغ إلى رصيدك تلقائياً.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
