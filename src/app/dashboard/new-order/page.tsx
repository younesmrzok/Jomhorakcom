"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Link as LucideLink,
  Users,
  ArrowRight,
  Zap,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  CheckCircle2,
  Ghost,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase/hooks';
import { placeOrder } from '@/firebase/finance-service';
import { useToast } from '@/hooks/use-toast';
import { smmServices } from '@/lib/smm-provider';
import { getCachedServices } from '@/lib/services-store';

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

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
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

const getPlatformMeta = (platformString: string) => {
  const p = platformString?.toLowerCase() || '';
  if (p.includes('tiktok') || p.includes('تيك') || p.includes('تيكتوك')) 
    return { icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100', name: 'TikTok' };
  if (p.includes('youtube') || p.includes('يوتيوب') || p.includes('يوتوب')) 
    return { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', name: 'YouTube' };
  if (p.includes('twitter') || p.includes(' x ') || p.includes('تويتر') || p.includes('ت اكس')) 
    return { icon: XIcon, color: 'text-gray-900', bg: 'bg-gray-100', name: 'Twitter / X' };
  if (p.includes('snapchat') || p.includes('snap') || p.includes('سناب')) 
    return { icon: Ghost, color: 'text-yellow-600', bg: 'bg-yellow-50', name: 'Snapchat' };
  if (p.includes('threads') || p.includes('ثريدز')) 
    return { icon: ThreadsIcon, color: 'text-black', bg: 'bg-gray-100', name: 'Threads' };
  if (p.includes('facebook') || p.includes('فيسبوك') || p.includes('فيس')) 
    return { icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-50', name: 'Facebook' };
  if (p.includes('telegram') || p.includes('تليجرام') || p.includes('تلغرام')) 
    return { icon: TelegramIcon, color: 'text-blue-500', bg: 'bg-blue-50', name: 'Telegram' };
  if (p.includes('instagram') || p.includes('ig') || p.includes('insta') || p.includes('انستقرام')) {
    return { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', name: 'Instagram' };
  }
  return { icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50', name: 'خدمات متنوعة' };
};

function OrderInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const { toast } = useToast();
  
  const queryServiceId = searchParams.get('serviceId');
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [link, setLink] = useState('');

  useEffect(() => {
    async function loadService() {
      if (!queryServiceId) {
        setDataLoading(false);
        return;
      }

      let foundServiceInCache = null;
      const cachedAll = getCachedServices('all');
      if (cachedAll) {
        foundServiceInCache = cachedAll.find((s: any) => s.service.toString() === queryServiceId.toString());
      }

      if (foundServiceInCache) {
        setService({
          id: foundServiceInCache.service,
          apiId: parseInt(foundServiceInCache.service),
          title: foundServiceInCache.name,
          pricePer1000: parseFloat(foundServiceInCache.rate) * 1.4,
          platform: (foundServiceInCache.category + " " + foundServiceInCache.name).toLowerCase(),
          min: parseInt(foundServiceInCache.min) || 1,
          max: parseInt(foundServiceInCache.max) || 1000000
        });
        setDataLoading(false);
        return;
      }

      try {
        const services = await smmServices();
        if (Array.isArray(services)) {
          const found = services.find((s: any) => s.service.toString() === queryServiceId.toString());
          if (found) {
            setService({
              id: found.service,
              apiId: parseInt(found.service),
              title: found.name,
              pricePer1000: parseFloat(found.rate) * 1.4,
              platform: (found.category + " " + found.name).toLowerCase(),
              min: parseInt(found.min) || 1,
              max: parseInt(found.max) || 1000000
            });
          }
        }
      } catch (e) {
        console.error("Error loading service details:", e);
      } finally {
        setDataLoading(false);
      }
    }
    loadService();
  }, [queryServiceId]);

  const totalPrice = useMemo(() => {
    if (!service || !quantity) return 0;
    const q = parseInt(quantity);
    if (isNaN(q)) return 0;
    return (q / 1000) * service.pricePer1000;
  }, [quantity, service]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!service) return;
    const val = e.target.value;
    if (val === '') { setQuantity(''); return; }
    const num = parseInt(val);
    if (isNaN(num)) return;
    if (num > service.max) { setQuantity(service.max.toString()); } else { setQuantity(val); }
  };

  const handleConfirmOrder = async () => {
    if (!user || !service) return;
    const q = parseInt(quantity);

    if (!link || link.length < 5) {
      toast({ variant: "destructive", title: "رابط غير صحيح", description: "يرجى إدخال الرابط بشكل صحيح" });
      return;
    }

    if (!quantity || isNaN(q) || q < service.min) {
      toast({ variant: "destructive", title: "كمية غير كافية", description: `الحد الأدنى لهذه الخدمة هو ${service.min}` });
      return;
    }

    if ((userData?.balance || 0) < totalPrice) {
      toast({ variant: "destructive", title: "رصيد غير كافٍ", description: "يرجى شحن رصيدك لإتمام هذا الطلب" });
      return;
    }

    setLoading(true);
    try {
      await placeOrder(user.uid, {
        serviceId: service.id.toString(),
        apiId: service.apiId,
        title: service.title,
        platform: service.platform,
        link: link,
        quantity: q,
        price: totalPrice
      });

      toast({ variant: "success", title: "تم الطلب بنجاح", description: "طلبك قيد المعالجة حالياً" });
      router.push('/dashboard/orders');
    } catch (error: any) {
      let message = error.message || "حدث خطأ غير متوقع";
      if (message.includes("link_duplicate")) {
        message = "لا يمكن إرسال الطلب لأن هناك طلباً آخر لنفس الرابط قيد المعالجة أو التنفيذ حالياً.";
      }
      toast({ variant: "destructive", title: "فشل إتمام الطلب", description: message });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-40 text-center space-y-6 px-6">
        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100">
          <AlertCircle className="h-10 w-10 text-gray-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-gray-900">لم يتم العثور على الخدمة</h2>
          <p className="text-xs font-bold text-gray-400">يبدو أن هذه الخدمة غير متوفرة حالياً.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/services')} className="rounded-2xl font-black bg-orange-500 text-white h-12 px-8 shadow-lg shadow-orange-500/20">العودة للخدمات</Button>
      </div>
    );
  }

  const platformMeta = getPlatformMeta(service.platform);
  const PlatformIcon = platformMeta.icon;

  return (
    <div className="space-y-6 pb-20 text-right max-w-2xl mx-auto" dir="rtl">
      <div className="flex items-center gap-2">
         <button onClick={() => router.back()} className="text-gray-400 p-2 bg-transparent border-none outline-none transition-none active:scale-95"><ArrowRight className="h-5 w-5" /></button>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <h1 className="text-xl font-black text-gray-900">إكمال الطلب</h1>
         </div>
      </div>

      <div className="px-1 space-y-8">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm">
           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", platformMeta.bg)}>
              <PlatformIcon className={cn("h-7 w-7", platformMeta.color)} />
           </div>
           <div className="flex flex-col text-right flex-1 overflow-hidden">
              <h2 className="text-[13px] font-black text-gray-900 leading-tight line-clamp-2">
                {service.title}
              </h2>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'بدء فوري', sub: 'Instant', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50/50', border: 'border-orange-100' },
            { label: 'ضمان تعويض', sub: 'Warranty', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50/50', border: 'border-green-100' },
            { label: 'جودة حقيقية', sub: 'Premium', icon: Star, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
          ].map((feat, i) => (
            <div key={i} className={cn("bg-white py-3.5 px-2 rounded-[1.8rem] border shadow-sm flex flex-col items-center text-center gap-2 transition-all hover:shadow-md", feat.border)}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", feat.bg)}>
                <feat.icon className={cn("h-6 w-6", feat.color)} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-gray-900 leading-none">{feat.label}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <LucideLink className="h-4 w-4 text-orange-500" />
            <Label className="text-sm font-black text-gray-900 uppercase">رابط الحساب أو المنشور</Label>
          </div>
          <Input 
            placeholder="أدخل رابط الحساب أو المنشور هنا" 
            value={link} 
            onChange={(e) => setLink(e.target.value)} 
            className="h-14 rounded-2xl bg-white border-gray-100 shadow-sm text-right pr-6 focus-visible:ring-orange-500 text-sm font-bold transition-all" 
          />
        </div>

        <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-[1.8rem] space-y-2">
          <div className="flex items-center gap-2 text-orange-600">
            <Info className="h-4 w-4" />
            <span className="text-[11px] font-black uppercase">تنويه مهم</span>
          </div>
          <ul className="space-y-1.5">
            {[
              "أدخل رابط الحساب أو المنشور بشكل صحيح.",
              "لا ترسل أكثر من طلب لنفس الرابط حتى يكتمل الطلب الأول.",
              "تجنب إرسال كميات صغيرة جداً لتفادي التأخر."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-orange-300 mt-1.5 shrink-0" />
                <p className="text-[11px] font-bold text-orange-800/80 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Users className="h-4 w-4 text-orange-500" />
            <Label className="text-sm font-black text-gray-900 uppercase">الكمية المطلوبة</Label>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm space-y-4">
              <Input 
                type="number" 
                value={quantity} 
                onChange={handleQuantityChange} 
                className="h-16 rounded-xl bg-gray-50 border-none text-center font-black text-3xl text-orange-500 focus-visible:ring-orange-500 shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-sm placeholder:font-bold placeholder:text-gray-300"
                placeholder="مثال: 1000"
              />
              <div className="flex justify-between px-2">
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-black text-gray-300 uppercase">الحد الأدنى</span>
                  <span className="text-[10px] font-black text-gray-500">{service.min.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gray-300 uppercase">الحد الأقصى</span>
                  <span className="text-[10px] font-black text-gray-500">{service.max.toLocaleString()}</span>
                </div>
              </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="h-4 w-4 text-orange-500" />
              <Label className="text-sm font-black text-gray-900 uppercase">ملخص الطلب</Label>
           </div>
           
           <Card className="rounded-[2.5rem] border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", platformMeta.bg)}>
                         <PlatformIcon className={cn("h-6 w-6", platformMeta.color)} />
                      </div>
                      <div className="flex flex-col text-right min-w-0">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">المنصة</span>
                         <span className="text-sm font-black text-gray-900 truncate">{platformMeta.name}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end text-right shrink-0">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">رقم الخدمة</span>
                      <span className="text-xs font-black text-gray-900">#{service.id}</span>
                   </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 text-right space-y-1">
                   <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">الخدمة المختارة</span>
                   <p className="text-[11px] font-bold text-gray-700 leading-relaxed break-words overflow-hidden">
                     {service.title}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white border border-gray-100 p-4 rounded-[1.8rem] shadow-sm flex flex-col items-center gap-1 min-w-0 overflow-hidden">
                      <span className="text-[9px] font-black text-gray-400 uppercase">الكمية</span>
                      <span className="text-lg font-black text-gray-900 break-all text-center">
                        {parseInt(quantity || '0').toLocaleString()}
                      </span>
                   </div>
                   <div className="orange-gradient p-4 rounded-[1.8rem] shadow-lg shadow-orange-500/20 flex flex-col items-center gap-1 min-w-0 overflow-hidden text-white">
                      <span className="text-[9px] font-black opacity-80 uppercase">السعر النهائي</span>
                      <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
                         <span className="text-xl font-black break-all">${totalPrice.toFixed(2)}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 opacity-60">
                   <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">معالجة فورية ومشفرة</span>
                </div>
              </div>
           </Card>
        </div>

        <Button 
          onClick={handleConfirmOrder} 
          disabled={loading} 
          className="w-full max-w-md mx-auto h-16 rounded-[1.8rem] orange-gradient text-white text-lg font-black shadow-xl shadow-orange-500/30 gap-3 border-none outline-none active:scale-95 transition-all flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          تأكيد وإرسال الطلب
        </Button>
      </div>
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-orange-500" /></div>}>
      <OrderInterface />
    </Suspense>
  );
}
