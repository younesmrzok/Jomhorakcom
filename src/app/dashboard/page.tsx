
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Clock, 
  Plus,
  Instagram,
  Youtube,
  Facebook,
  Send,
  TrendingDown,
  TrendingUp,
  Globe,
  Grid
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase/hooks';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function DashboardOverview() {
  const { loading: authLoading, userData } = useAuth();

  const formatBalance = (val: number) => {
    return Math.abs(Number(val || 0)).toFixed(2);
  };

  const balances = [
    { label: 'أنفقت معنا', value: formatBalance(userData?.totalSpent || 0), icon: TrendingDown, textColor: 'text-orange-500', bg: 'bg-gray-50/80' },
    { label: 'جاري استخدامه', value: formatBalance(userData?.inProcessing || 0), icon: Clock, textColor: 'text-orange-500', bg: 'bg-gray-50/80' },
    { label: 'رصيدك الآن', value: formatBalance(userData?.balance || 0), icon: Wallet, textColor: 'text-orange-500', bg: 'bg-gray-50/80' },
  ];

  const platforms = [
    { id: 'instagram', name: 'انستقرام', sub: 'خدمات انستقرام', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'tiktok', name: 'تيك توك', sub: 'خدمات تيك توك', icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'facebook', name: 'فيسبوك', sub: 'خدمات فيسبوك', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'youtube', name: 'يوتيوب', sub: 'خدمات يوتيوب', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'twitter', name: 'تويتر (X)', sub: 'خدمات X', icon: XIcon, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'telegram', name: 'تليجرام', sub: 'خدمات تليجرام', icon: Send, color: 'text-blue-400', bg: 'bg-blue-50' },
  ];

  const viewAllButtonStyle = "text-[13px] font-black text-orange-500 px-8 py-3 rounded-2xl border border-orange-100 bg-white active:scale-95 transition-all outline-none uppercase tracking-wide inline-flex items-center justify-center shadow-sm";

  return (
    <div className="flex flex-col gap-8 pb-10" dir="rtl">
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden bg-white rounded-[2.5rem]">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-2 text-center mb-10 select-none">
            {balances.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className={cn("w-10 h-10 rounded-2xl mx-auto flex items-center justify-center mb-1 shadow-sm", item.bg)}>
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
                    <p className={cn("text-base font-black leading-none", item.textColor)}>
                      ${authLoading ? '0.00' : item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/dashboard/add-funds" className="w-full block">
            <Button className="w-full h-14 rounded-2xl orange-gradient text-white text-lg font-black shadow-xl shadow-orange-500/30 mb-4 gap-3 transition-all active:scale-95 border-none flex items-center justify-center">
              <Plus className="h-6 w-6 stroke-[3]" />
              شحن الرصيد الآن
            </Button>
          </Link>

          <div className="flex justify-center mt-2">
            <div className="inline-flex items-center justify-center gap-1.5 text-[9px] font-black text-gray-400 bg-gray-50 px-6 py-2 rounded-full select-none border border-gray-100/50">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>أرخص الأسعار في المغرب لعام 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-px bg-gray-200 w-full" />

      <div className="space-y-8">
        <div className="flex flex-col items-center text-center select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            <h2 className="text-xl font-black text-gray-900 tracking-tight">الخدمات الأكثر طلباً</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-1">
          {platforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <Link key={idx} href={`/dashboard/platform/${platform.id}`} className="w-full outline-none">
                <Card className="border-none shadow-sm group overflow-hidden bg-white rounded-[2.2rem] hover:shadow-md active:scale-[0.98] transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center relative min-h-[140px] justify-center">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner", platform.bg)}>
                      <Icon className={cn("h-7 w-7", platform.color)} />
                    </div>
                    <h3 className="text-sm font-black text-gray-900">{platform.name}</h3>
                    <p className="text-[10px] font-black text-orange-500 mt-1 uppercase tracking-tight">{platform.sub}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/dashboard/services" className={viewAllButtonStyle}>
            عرض جميع الخدمات
          </Link>
        </div>
      </div>
    </div>
  );
}
