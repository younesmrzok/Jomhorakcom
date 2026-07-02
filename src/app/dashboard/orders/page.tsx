
"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  Instagram, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ListFilter, 
  Loader2, 
  Youtube, 
  Facebook, 
  Send, 
  AlertCircle,
  XCircle,
  Ghost,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase/hooks';
import { db } from '@/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { syncUserOrdersStatus } from '@/firebase/finance-service';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
);

const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5c-1.5 1.5-3.5 1.5-4.5 1.5s-3-1-4-2.5c-1-1.5-1-3.5 0-5 1-1.5 3-2.5 4-2.5s3 0 4.5 1.5c1 1 1 3 0 4.5-1 1.5-2.5 2-2.5 2s-1-.5-1-1.5 1.5-2 2-3c.5-1 .5-2 0-2.5-.5-.5-1.5-.5-2 0s-.5 1.5 0 2.5c.5 1 1.5 1 1.5 1z" /></svg>
);

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending_processing' | 'processing' | 'completed' | 'canceled'>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !mounted) return;

    syncUserOrdersStatus(user.uid);

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const allDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(allDocs);
      setLoading(false);
    }, (error) => {
      console.error("Orders Stream Error:", error);
      const fallbackQ = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      onSnapshot(fallbackQ, (fSnap) => {
        const fDocs = fSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setOrders(fDocs);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [user, mounted]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const status = order.status;
      if (activeTab === 'all') return true;
      
      if (activeTab === 'pending_processing') {
        return status === 'قيد المعالجة' || status === 'قيد المراجعة' || status === 'Pending' || status === 'Processing';
      }
      if (activeTab === 'processing') {
        return status === 'قيد التنفيذ' || status === 'In progress' || status === 'In Progress';
      }
      if (activeTab === 'completed') {
        return status === 'مكتمل' || status === 'Completed' || status === 'Partial';
      }
      if (activeTab === 'canceled') {
        return status === 'ملغي' || status === 'Canceled' || status === 'Cancelled' || status === 'Refunded';
      }
      return true;
    });
  }, [orders, activeTab]);

  const getPlatformIcon = (platform: string) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('instagram') || p.includes('ig') || p.includes('insta') || p.includes('انستقرام') || p.includes('انستا')) 
      return { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' };
    if (p.includes('tiktok') || p.includes('تيك') || p.includes('تيكتوك')) 
      return { icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100' };
    if (p.includes('facebook') || p.includes('فيسبوك') || p.includes('فيس')) 
      return { icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-50' };
    if (p.includes('youtube') || p.includes('يوتيوب') || p.includes('يوتوب')) 
      return { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' };
    if (p.includes('twitter') || p.includes(' x ') || p.includes('تويتر')) 
      return { icon: XIcon, color: 'text-gray-900', bg: 'bg-gray-100' };
    if (p.includes('telegram') || p.includes('تليجرام') || p.includes('تلغرام')) 
      return { icon: Send, color: 'text-blue-500', bg: 'bg-blue-50' };
    if (p.includes('snapchat') || p.includes('snap') || p.includes('سناب')) 
      return { icon: Ghost, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (p.includes('threads') || p.includes('ثريدز')) 
      return { icon: ThreadsIcon, color: 'text-black', bg: 'bg-gray-100' };
    
    return { icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50' };
  };

  const getTabButtonStyle = (tab: typeof activeTab) => {
    return cn(
      "rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none focus:outline-none ring-0 active:bg-orange-500",
      activeTab === tab 
        ? "bg-orange-500 text-white border-orange-500 shadow-md" 
        : "bg-white text-gray-500 border-gray-100 hover:text-orange-500 hover:bg-orange-50/50"
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4 pb-28 text-right lg:max-w-6xl lg:mx-auto lg:px-4" dir="rtl">
      <div className="flex items-center gap-2 px-1 lg:px-0">
         <Link href="/dashboard"><button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center transition-none outline-none border-none bg-transparent active:bg-transparent"><ArrowRight className="h-5 w-5" /></button></Link>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <h1 className="text-xl font-black text-gray-900 lg:text-2xl">طلباتي</h1>
         </div>
      </div>

      <div className="w-full px-1 lg:px-0">
        <div className="w-full overflow-x-auto scrollbar-hide flex items-center justify-start gap-2 py-2">
          <button onClick={() => setActiveTab('all')} className={getTabButtonStyle('all')}><ListFilter className="h-4 w-4" /> الكل</button>
          <button onClick={() => setActiveTab('pending_processing')} className={getTabButtonStyle('pending_processing')}><AlertCircle className="h-4 w-4" /> قيد المعالجة</button>
          <button onClick={() => setActiveTab('processing')} className={getTabButtonStyle('processing')}><Clock className="h-4 w-4" /> قيد التنفيذ</button>
          <button onClick={() => setActiveTab('completed')} className={getTabButtonStyle('completed')}><CheckCircle2 className="h-4 w-4" /> المكتملة</button>
          <button onClick={() => setActiveTab('canceled')} className={getTabButtonStyle('canceled')}><XCircle className="h-4 w-4" /> ملغي</button>
        </div>

        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-orange-500" /></div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order, idx) => {
                const platformInfo = getPlatformIcon(order.platform || order.title);
                const Icon = platformInfo.icon;
                
                let displayStatus = order.status;
                if (displayStatus === 'قيد المراجعة' || displayStatus === 'Pending' || displayStatus === 'Processing') displayStatus = 'قيد المعالجة';
                if (displayStatus === 'In progress' || displayStatus === 'In Progress') displayStatus = 'قيد التنفيذ';
                if (displayStatus === 'Completed' || displayStatus === 'Partial') displayStatus = 'مكتمل';
                if (displayStatus === 'Canceled' || displayStatus === 'Cancelled' || displayStatus === 'Refunded') displayStatus = 'ملغي';

                return (
                  <div key={order.id || idx} className="bg-white p-5 lg:p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", platformInfo.bg)}><Icon className={cn("h-5 w-5", platformInfo.color)} /></div>
                        <div className="flex flex-col text-right"><span className="text-[12px] font-black text-gray-900 leading-none">ID: #{order.apiOrderId || '...'}</span><span className="text-[9px] font-bold text-gray-300 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-MA') : 'جاري...'}</span></div>
                      </div>
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", 
                        displayStatus === 'مكتمل' ? "bg-green-50 text-green-600" : 
                        displayStatus === 'قيد التنفيذ' ? "bg-blue-50 text-blue-600" : 
                        displayStatus === 'قيد المعالجة' ? "bg-slate-50 text-slate-600" :
                        displayStatus === 'ملغي' ? "bg-red-50 text-red-600" :
                        "bg-orange-50 text-orange-600"
                      )}>
                        {displayStatus}
                      </div>
                    </div>
                    <h4 className="text-[12px] font-black text-gray-800 leading-tight pr-1 line-clamp-1">{order.title}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex gap-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">الكمية</span>
                          <span className="text-sm font-black text-gray-700">{order.quantity?.toLocaleString() || '...'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">المبلغ</span>
                          <span className="text-sm font-black text-green-600">${order.price?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                      <a href={order.link?.startsWith('http') ? order.link : `https://${order.link}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-orange-500 font-black text-[10px] px-3 py-2 hover:bg-orange-50 rounded-xl transition-all">انتقال للرابط <ArrowUpRight className="h-3 w-3" /></a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3">
              <Clock className="h-10 w-10 text-gray-200 mx-auto" />
              <p className="text-sm font-black text-gray-400">لا توجد طلبات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
