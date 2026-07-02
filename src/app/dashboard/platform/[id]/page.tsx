
"use client";

import { use, useMemo, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Heart, Play, Instagram, ArrowRight, Facebook, Youtube, Send, ShoppingCart, Ghost, MessageSquare, Loader2, Users, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import { smmServicesByPlatform } from '@/lib/smm-provider';
import { useToast } from '@/hooks/use-toast';
import { getCachedServices, setCachedServices } from '@/lib/services-store';

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

const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5c-1.5 1.5-3.5 1.5-4.5 1.5s-3-1-4-2.5c-1-1.5-1-3.5 0-5 1-1.5 3-2.5 4-2.5s3 0 4.5 1.5c1 1 1 3 0 4.5-1 1.5-2.5 2-2.5 2s-1-.5-1-1.5 1.5-2 2-3c.5-1 .5-2 0-2.5-.5-.5-1.5-.5-2 0s-.5 1.5 0 2.5c.5 1 1.5 1 1.5 1z" />
  </svg>
);

interface SmmService {
  service: string;
  name: string;
  rate: string;
  min: string;
  max: string;
  category: string;
}

const ServiceCard = ({ service, platformId }: { service: SmmService, platformId: string }) => {
  const Icon = useMemo(() => {
    switch(platformId) {
      case 'instagram': return Instagram;
      case 'tiktok': return TikTokIcon;
      case 'snapchat': return Ghost;
      case 'threads': return ThreadsIcon;
      case 'facebook': return Facebook;
      case 'youtube': return Youtube;
      case 'telegram': return Send;
      case 'twitter': return XIcon;
      default: return Instagram;
    }
  }, [platformId]);

  const iconColor = useMemo(() => {
    switch(platformId) {
      case 'instagram': return 'text-pink-500';
      case 'tiktok': return 'text-black';
      case 'snapchat': return 'text-yellow-600';
      case 'threads': return 'text-black';
      case 'facebook': return 'text-blue-600';
      case 'youtube': return 'text-red-600';
      case 'telegram': return 'text-blue-400';
      case 'twitter': return 'text-black';
      default: return 'text-orange-500';
    }
  }, [platformId]);

  const markedUpRate = (parseFloat(service.rate) * 1.4).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border-none shadow-sm bg-white col-span-1 group transition-all hover:shadow-lg border border-gray-50 flex flex-col">
      <div className="relative flex flex-col items-center justify-center p-4 overflow-hidden bg-[#FFF5EE] shrink-0">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center relative z-10">
          <Icon className={cn("h-7 w-7", iconColor)} />
        </div>
      </div>

      <div className="p-4 text-center space-y-2 flex-1 overflow-hidden">
        <div className="h-10 flex items-center justify-center overflow-hidden">
          <h3 className="text-[11px] font-black text-gray-800 leading-[1.2] px-1 line-clamp-2 max-h-[2.4em]">
            {service.name}
          </h3>
        </div>
      </div>

      <div className="bg-gray-50/50 p-4 flex flex-col gap-3 border-t border-gray-50 mt-auto">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">الكمية</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-gray-900">1,000</span>
              <Users className="h-3 w-3 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">السعر</span>
            <span className="text-sm font-black text-green-600">${markedUpRate}</span>
          </div>
        </div>
        <Link href={`/dashboard/new-order?serviceId=${service.service}`} className="w-full">
          <Button className="w-full h-11 rounded-2xl orange-gradient text-white font-black text-[10px] gap-2 border-none shadow-md shadow-orange-500/10 active:scale-[0.98] transition-all">
            <ShoppingCart className="h-3.5 w-3.5" />
            اطلب الآن
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function PlatformPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const platformId = resolvedParams.id;
  const { toast } = useToast();
  
  const cached = getCachedServices(platformId);
  const [platformServices, setPlatformServices] = useState<SmmService[]>(cached || []);
  const [loading, setLoading] = useState(platformServices.length === 0);
  const [activeTab, setActiveTab] = useState('followers');
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({
    followers: 10,
    likes: 10,
    views: 10,
    comments: 10
  });

  const tabConfigs: Record<string, { pos: string[], neg: string[] }> = {
    followers: {
      pos: ['follow', 'sub', 'متابعين', 'مشتركين', 'member', 'أعضاء', 'subscriber'],
      neg: ['view', 'like', 'heart', 'لايك', 'إعجاب', 'مشاهدات', 'تعليق', 'comment', 'reply']
    },
    likes: {
      pos: ['like', 'heart', 'إعجاب', 'لايك', 'تفاعل', 'reaction'],
      neg: ['follow', 'sub', 'متابعين', 'مشتركين', 'member', 'أعضاء', 'مشاهدات', 'view', 'watch']
    },
    views: {
      pos: ['view', 'play', 'مشاهدات', 'مشاهدة', 'watch'],
      neg: ['follow', 'sub', 'متابعين', 'مشتركين', 'member', 'أعضاء', 'لايك', 'like', 'heart']
    },
    comments: {
      pos: ['comment', 'تعليق', 'تعليقات', 'reply'],
      neg: ['follow', 'sub', 'متابعين', 'مشتركين', 'member', 'أعضاء', 'لايك', 'like', 'heart', 'view']
    }
  };

  useEffect(() => {
    async function fetchServices() {
      if (platformServices.length === 0) setLoading(true);
      
      try {
        const data = await smmServicesByPlatform(platformId);
        if (data && 'error' in data) {
           toast({ variant: "destructive", title: "خطأ", description: (data as any).error });
        } else if (Array.isArray(data)) {
          setCachedServices(platformId, data);
          setPlatformServices(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [platformId, toast]);

  const activeServices = useMemo(() => {
    if (platformServices.length === 0) return [];
    const config = tabConfigs[activeTab];
    return platformServices.filter((s) => {
      const combined = (s.category + " " + s.name).toLowerCase();
      const hasPos = config.pos.some(k => combined.includes(k));
      const hasNeg = config.neg.some(k => combined.includes(k));
      return hasPos && !hasNeg;
    }).sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));
  }, [platformServices, activeTab]);

  const platformNames: Record<string, string> = {
    instagram: 'انستقرام', tiktok: 'تيك توك', snapchat: 'سناب شات', threads: 'ثريدز', facebook: 'فيسبوك', youtube: 'يوتيوب', telegram: 'تليجرام', twitter: 'X (تويتر)'
  };

  return (
    <div className="space-y-4 pb-24 text-right" dir="rtl">
      <div className="flex items-center gap-2">
         <Link href="/dashboard/services"><button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center bg-transparent border-none outline-none transition-none active:scale-95"><ArrowRight className="h-5 w-5" /></button></Link>
         <div className="flex items-center gap-2"><div className="w-4 h-1 bg-orange-500 rounded-full" /><h1 className="text-xl font-black text-gray-900">خدمات {platformNames[platformId] || platformId}</h1></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} activationMode="manual" className="w-full" dir="rtl">
        <div className="w-full overflow-x-auto scrollbar-hide px-1 flex items-center justify-start gap-2 py-2">
          <TabsList className="bg-transparent h-auto p-0 flex items-center gap-2 border-none">
            <TabsTrigger value="followers" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 bg-white text-gray-500 border-gray-100 flex-row-reverse shadow-none hover:bg-orange-50/50 hover:text-orange-500 data-[state=active]:hover:bg-orange-500 data-[state=active]:hover:text-white"><span>{platformId === 'telegram' ? 'أعضاء' : 'متابعين'}</span><User className="h-4 w-4" /></TabsTrigger>
            {platformId !== 'telegram' && (
              <><TabsTrigger value="likes" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 bg-white text-gray-500 border-gray-100 flex-row-reverse shadow-none hover:bg-orange-50/50 hover:text-orange-500 data-[state=active]:hover:bg-orange-500 data-[state=active]:hover:text-white"><span>لايكات</span><Heart className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="views" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 bg-white text-gray-500 border-gray-100 flex-row-reverse shadow-none hover:bg-orange-50/50 hover:text-orange-500 data-[state=active]:hover:bg-orange-500 data-[state=active]:hover:text-white"><span>مشاهدات</span><Play className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="comments" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 bg-white text-gray-500 border-gray-100 flex-row-reverse shadow-none hover:bg-orange-50/50 hover:text-orange-500 data-[state=active]:hover:bg-orange-500 data-[state=active]:hover:text-white"><span>تعليقات</span><MessageSquare className="h-4 w-4" /></TabsTrigger></>)}
          </TabsList>
        </div>

        {loading ? (<div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>) : (
          <div className="space-y-6 mt-6 outline-none">
            {activeServices.length > 0 ? (
              <><div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  {activeServices.slice(0, visibleCounts[activeTab]).map((service) => (<ServiceCard key={service.service} service={service} platformId={platformId} />))}
                </div>
                {activeServices.length > visibleCounts[activeTab] && (
                  <div className="pt-4 flex justify-center"><button onClick={() => setVisibleCounts(v => ({...v, [activeTab]: v[activeTab] + 10}))} className="w-full max-w-[280px] mx-auto py-5 bg-white rounded-[2rem] border border-orange-100 text-orange-500 font-black text-xs flex items-center justify-center gap-2 transition-all outline-none active:scale-[0.98]"><ChevronDown className="h-4 w-4" /><span>عرض المزيد من الخدمات</span></button></div>
                )}</>
            ) : (<div className="py-20 text-center text-gray-400 font-black text-xs">لا توجد خدمات حالياً في هذا القسم</div>)}
          </div>
        )}
      </Tabs>
    </div>
  );
}
