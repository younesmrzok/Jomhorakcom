'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Zap,
  Instagram,
  Youtube,
  Facebook,
  Send,
  ShieldCheck,
  Coins,
  Headphones,
  Menu,
  UserPlus,
  LogIn,
  Star,
  PhoneCall,
  HelpCircle,
  Heart,
  Headset
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const featuredServices = [
  { id: 'ig', name: 'انستقرام', desc: 'خدمات الانستقرام', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'tt', name: 'تيك توك', desc: 'خدمات تيك توك', icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100' },
  { id: 'yt', name: 'يوتيوب', desc: 'خدمات يوتيوب', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'fb', name: 'فيسبوك', desc: 'خدمات فيسبوك', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'tg', name: 'تليجرام', desc: 'خدمات تليجرام', icon: Send, color: 'text-blue-400', bg: 'bg-blue-50' },
  { id: 'tw', name: 'تويتر (X)', desc: 'خدمات X', icon: XIcon, color: 'text-black', bg: 'bg-gray-100' },
];

const whyChooseUs = [
  {
    title: 'جودة مضمونة',
    desc: 'نضمن لك جودة الخدمات واستقرارها لفترات طويلة مع ضمان التعويض الفوري.',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    title: 'تنفيذ فائق السرعة',
    desc: 'يتم البدء في تنفيذ أغلب الطلبات فور الدفع مباشرة دون أي تأخير بشهادة عملائنا.',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    title: 'أسعار تنافسية',
    desc: 'نوفر لك أرخص وأفضل الأسعار في السوق المغربي والعربي بلا منازع وجودة عالية.',
    icon: Coins,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    title: 'دعم فني متواصل',
    desc: 'فريقنا متاح للرد على استفساراتك وحل مشاكلك الفنية على مدار الساعة طوال الأسبوع.',
    icon: Headphones,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  }
];

const faqs = [
  {
    q: "ما هي سرعة تنفيذ الطلبات؟",
    a: "نحن نفتخر بتقديم أسرع تنفيذ في السوق المغربي. تبدأ معظم الخدمات بشكل فوري وتكتمل في غضون دقائق معدودة من تأكيد الطلب."
  },
  {
    q: "هل الخدمات آمنة على حساباتي؟",
    a: "نعم، جميع خدماتنا تتبع سياسات منصات التواصل الاجتماعي، ونستخدم طرقاً آمنة تماماً لا تساعد أي ضرر أو خطر على حساباتك."
  },
  {
    q: "كيف يمكنني شحن رصيدي؟",
    a: "نوفر وسائل دفع متنوعة وسهلة تشمل التحويلات البنكية المحلية (CIH, Attijari)، والتعبئة (Inwi, Orange) لضمان تجربة شحن سريعة."
  },
  {
    q: "هل هناك ضمان ضد النقص؟",
    a: "بالتأكيد، نوفر ضمان تعويض النقص لمعظم خدماتنا لمدة تصل إلى 90 يوماً لضمان رضاكم التام وثبات النتائج."
  }
];

const headerLogoUrl = "/logo1.png";
const sidebarLogoUrl = "/logo2.png";

export default function LandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const sidebarLinks = [
    { label: 'إنشاء حساب جديد', href: '/register', icon: UserPlus },
    { label: 'تسجيل الدخول', href: '/login', icon: LogIn },
  ];

  const desktopNavLinks = [
    { label: 'الخدمات', href: '#services' },
    { label: 'لماذا نحن', href: '#features' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-body flex flex-col items-center select-none antialiased" dir="rtl">
      {/* Mobile : carte centrée 480px — PC/Tablette : pleine largeur */}
      <div className="w-full max-w-[480px] md:max-w-none min-h-screen bg-white md:bg-[#fcfcfc] shadow-xl md:shadow-none flex flex-col relative overflow-hidden ring-1 ring-slate-100 md:ring-0">
        
        {/* ===== HEADER : hamburger sur mobile, navigation horizontale sur PC/tablette ===== */}
        <header className="h-16 md:h-20 fixed top-0 w-full max-w-[480px] md:max-w-none bg-white z-50 border-b border-gray-100 shrink-0">
          <div className="h-full w-full px-4 md:px-8 md:max-w-7xl md:mx-auto flex items-center justify-between">
            {/* Menu hamburger — mobile uniquement */}
            <div className="flex items-center gap-2 md:hidden">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <button className="text-orange-500 h-[38px] w-[38px] flex items-center justify-center bg-white border border-orange-100 rounded-xl outline-none focus:outline-none ring-0 focus:ring-0 transition-transform cursor-pointer active:scale-95">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0 border-none rounded-l-[2.5rem] bg-white overflow-hidden outline-none ring-0 focus:ring-0 shadow-2xl" dir="rtl">
                  <SheetTitle className="sr-only">جمهورك - قائمة التنقل</SheetTitle>
                  <SheetDescription className="sr-only">روابط تسجيل الدخول وإنشاء الحساب</SheetDescription>
                  <div className="h-full flex flex-col font-body relative">
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
                      {sidebarLinks.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-none group outline-none focus:outline-none active:bg-transparent",
                              isActive 
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                                : "text-gray-500 hover:text-orange-500 active:bg-transparent"
                            )}
                          >
                            <Icon className={cn("h-5 w-5 transition-none", isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500")} />
                            <span className="text-sm font-black">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="p-6 border-t border-gray-50 text-center">
                      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">جمهورك &copy; 2026</p>
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

            {/* Navigation horizontale — PC/tablette uniquement */}
            <nav className="hidden md:flex items-center gap-8">
              {desktopNavLinks.map((item) => (
                <a key={item.href} href={item.href} className="text-[13px] font-black text-slate-600 hover:text-orange-500 transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Boutons desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="h-[42px] px-6 rounded-xl border border-slate-200 text-slate-700 font-black text-[12px] flex items-center gap-2 hover:bg-slate-50 transition-colors outline-none select-none">
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </Link>
              <Link href="/register" className="h-[42px] px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-[12px] flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-colors outline-none select-none">
                <UserPlus className="h-4 w-4" />
                إنشاء حساب
              </Link>
            </div>

            {/* Bouton mobile */}
            <div className="flex items-center gap-3 md:hidden">
              <Link href="/register" className="h-[38px] px-4 rounded-xl border border-orange-100 text-orange-500 font-black text-[11px] flex items-center gap-2 transition-transform outline-none focus:outline-none bg-transparent select-none active:scale-95">
                <UserPlus className="h-4 w-4" />
                سجل الآن
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 md:pt-20 pb-0 scroll-smooth scrollbar-hide">
          {/* ===== HERO : vertical sur mobile, 2 colonnes pleine largeur sur PC ===== */}
          <section className="md:bg-white md:border-b md:border-gray-100">
            <div className="w-full md:max-w-7xl md:mx-auto md:px-8 lg:py-16 xl:py-20 flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              
              {/* Colonne texte (droite en RTL) */}
              <div className="lg:col-start-1 lg:row-start-1 order-1 flex flex-col">
                <div className="flex justify-center lg:justify-start mt-6 lg:mt-0 px-4 lg:px-0">
                  <span className="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-100/60 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black leading-none">
                    الأسرع في تقديم خدمات السوشيال ميديا
                  </span>
                </div>

                <div className="text-center lg:text-right px-6 lg:px-0 mt-5 space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.35] lg:leading-[1.25] tracking-tight">
                    جميع خدمات <span className="text-orange-500">مواقع</span>
                    <br />
                    <span className="text-orange-500">التواصل الاجتماعي</span>
                    <br />
                    <span className="inline-block">في مكان واحد</span>
                  </h1>

                  <p className="text-[13px] lg:text-base text-slate-500/90 leading-relaxed font-black px-4 lg:px-0 max-w-sm lg:max-w-md mx-auto lg:mx-0">
                    خدمات موثوقة، أسعار تنافسية، وسرعة في التنفيذ لنجاحك الرقمي مع جمهورك
                  </p>
                </div>
              </div>

              {/* Colonne mockup téléphone (gauche en RTL) */}
              <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 order-2">
                <section className="relative h-[250px] md:h-[280px] lg:h-[440px] mt-1 lg:mt-0 flex items-center justify-center overflow-visible">
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <motion.div
                    style={{ perspective: 1200 }}
                    className="relative w-44 h-64 lg:w-60 lg:h-[350px] z-10"
                  >
                    <div
                      className="w-full h-full rounded-[2.5rem] bg-slate-900 p-2.5 shadow-2xl relative border-2 border-slate-800 flex flex-col overflow-hidden"
                      style={{
                        transform: 'rotateY(-20deg) rotateX(20deg) rotateZ(5deg)',
                      }}
                    >
                      <div className="flex-1 bg-gradient-to-b from-indigo-50/60 to-slate-50/90 rounded-[2rem] overflow-hidden p-3 flex flex-col space-y-2.5">
                        <div className="flex justify-between items-center text-[7px] font-tajawal font-extrabold text-indigo-400">
                          <span>9:41</span>
                          <span className="h-1 w-10 bg-slate-400/30 rounded-full shrink-0" />
                          <div className="flex gap-0.5">
                            <span>■</span>
                            <span>🔋</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-100 shadow-xs">
                          <div className="h-5 w-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <Instagram className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 text-right">
                            <div className="h-1 w-8 bg-slate-300 rounded-sm" />
                            <div className="h-0.5 w-12 bg-slate-200 rounded-sm mt-0.5" />
                          </div>
                        </div>

                        <div className="flex-1 bg-white rounded-xl border border-slate-100 p-2 flex flex-col shadow-xs">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[6px] text-slate-400 font-tajawal">Performance Data</span>
                            <span className="text-[6px] text-emerald-500 font-tajawal font-bold">+28.4%</span>
                          </div>
                          <svg className="flex-1 w-full text-indigo-400" viewBox="0 0 100 40">
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            <path d="M0,35 Q15,25 30,30 T60,15 T90,5 L100,20 L100,40 L0,40 Z" fill="url(#chartGradient)" />
                            <path d="M0,35 Q15,25 30,30 T60,15 T90,5" fill="none" stroke="rgb(99, 102, 241)" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="90" cy="5" r="1.5" fill="rgb(244, 63, 94)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="absolute left-[8%] top-[80px] lg:top-[120px] bg-rose-500 text-white px-3.5 py-1.5 rounded-2xl shadow-xl shadow-rose-500/15 flex items-center gap-1.5 text-xs font-black font-tajawal shrink-0 z-20 hover:scale-105 transition-all cursor-all-scroll"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
                    <span>10K</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute right-[8%] top-[120px] lg:top-[220px] bg-white border border-slate-50 p-2.5 rounded-2xl shadow-xl flex flex-col gap-1 z-20 w-28 shrink-0 select-none hover:scale-105 transition-all"
                  >
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-400">نمو المتابعين</span>
                    </div>
                    <div className="h-6 w-full flex items-end gap-1 px-1">
                      <div className="flex-1 bg-orange-500/20 rounded-sm h-[30%]" />
                      <div className="flex-1 bg-orange-500/40 rounded-sm h-[50%]" />
                      <div className="flex-1 bg-orange-500/70 rounded-sm h-[75%]" />
                      <div className="flex-1 bg-orange-500 rounded-sm h-[100%]" />
                    </div>
                  </motion.div>

                  <div className="absolute left-[15%] top-[10px] text-orange-200 text-xs select-none opacity-40">▲</div>
                  <div className="absolute right-[20%] top-[30px] text-orange-200 text-sm select-none opacity-40">⬡</div>
                  <div className="absolute right-[12%] bottom-[20px] text-slate-300 text-lg font-bold select-none opacity-30">〰</div>
                  <div className="absolute left-[16%] bottom-[40px] text-slate-300 text-sm font-bold select-none opacity-30">◻</div>
                </section>
              </div>

              {/* Boutons CTA + statistiques */}
              <div className="lg:col-start-1 lg:row-start-2 order-3 flex flex-col">
                <section className="px-5 lg:px-0 mt-4 lg:mt-2 flex flex-col lg:flex-row gap-3.5 pb-2">
                  <Link href="/register" className="w-full lg:w-auto">
                    <button
                      className="w-full lg:w-auto lg:px-10 flex items-center justify-center gap-2 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-black cursor-pointer transition-all shadow-lg shadow-orange-500/15 text-sm md:text-base border-none outline-none focus:outline-none"
                    >
                      <UserPlus className="h-5 w-5 text-white stroke-[3]" />
                      <span>إنشاء حساب جديد</span>
                    </button>
                  </Link>

                  <Link href="/login" className="w-full lg:w-auto">
                    <button
                      className="w-full lg:w-auto lg:px-10 flex items-center justify-center gap-2 h-14 bg-white hover:bg-slate-50 border border-slate-200 rounded-[2rem] text-slate-800 font-black cursor-pointer transition-all text-sm md:text-base outline-none focus:outline-none"
                    >
                      <LogIn className="h-5 w-5 stroke-[3]" />
                      <span>تسجيل الدخول</span>
                    </button>
                  </Link>
                </section>

                <section className="px-5 lg:px-0 mt-8 lg:mt-6 mb-8 lg:mb-0">
                  <div className="bg-white border border-slate-50 lg:border-slate-100 p-5 rounded-3xl shadow-xs grid grid-cols-3 gap-2 lg:max-w-md">
                    <div className="text-center flex flex-col items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-500 mb-1" />
                      <span className="text-base lg:text-xl font-black text-slate-900">99.9%</span>
                      <span className="text-[10px] font-black text-slate-400 mt-0.5">وقت تشغيل</span>
                    </div>
                    <div className="text-center flex flex-col items-center justify-center border-x border-slate-100">
                      <Users className="w-5 h-5 text-orange-500 mb-1" />
                      <span className="text-base lg:text-xl font-black text-slate-900">50K+</span>
                      <span className="text-[10px] font-black text-slate-400 mt-0.5">عميل سعيد</span>
                    </div>
                    <div className="text-center flex flex-col items-center justify-center">
                      <Headset className="w-5 h-5 text-orange-500 mb-1" />
                      <span className="text-base lg:text-xl font-black text-slate-900">24/7</span>
                      <span className="text-[10px] font-black text-slate-400 mt-0.5">دعم فني</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-200 w-full md:hidden" />

          {/* ===== SERVICES : 2 colonnes mobile, 3 tablette, 6 PC ===== */}
          <section id="services" className="px-5 md:px-8 space-y-6 md:space-y-10 py-10 md:py-16 scroll-mt-20">
            <div className="md:max-w-7xl md:mx-auto w-full space-y-6 md:space-y-10">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 mb-2">
                  <Star className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">خدماتنا المميزة</h2>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">الأفضل جودة والأسرع تنفيطة</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredServices.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <Link key={idx} href="/register" className="block w-full outline-none focus:outline-none transition-none active:bg-transparent">
                      <div className="relative w-full bg-white border border-gray-100 rounded-[2rem] p-5 md:p-6 flex flex-col items-center text-center gap-3 shadow-sm group overflow-hidden cursor-pointer active:bg-white hover:shadow-md hover:-translate-y-1 transition-all">
                        <div className={cn("absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10", service.bg)} />
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white", service.bg)}>
                          <Icon className={cn("h-7 w-7", service.color)} />
                        </div>
                        <div className="space-y-0.5 relative z-10">
                          <h3 className="text-sm font-black text-gray-900">{service.name}</h3>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{service.desc}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-200 w-full md:hidden" />

          {/* ===== POURQUOI NOUS : 1 colonne mobile, 2 tablette, 4 PC ===== */}
          <section id="features" className="px-5 md:px-8 space-y-6 md:space-y-10 py-10 md:py-16 md:bg-white md:border-y md:border-gray-100 scroll-mt-20">
            <div className="md:max-w-7xl md:mx-auto w-full space-y-6 md:space-y-10">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">لماذا تختارنا؟</h2>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">نحن الخيار الأول لآلاف المسوقين</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {whyChooseUs.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center lg:flex-col lg:items-center lg:text-center gap-4 lg:gap-4 p-5 lg:p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                      <div className={cn("w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0", item.bg)}>
                        <Icon className={cn("h-6 w-6 lg:h-8 lg:w-8", item.color)} />
                      </div>
                      <div className="space-y-0.5 lg:space-y-2 text-right lg:text-center">
                        <h3 className="text-sm lg:text-base font-black text-gray-900">{item.title}</h3>
                        <p className="text-[11px] lg:text-[12px] font-black text-gray-400 leading-relaxed uppercase tracking-tight">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-200 w-full md:hidden" />

          {/* ===== FAQ ===== */}
          <section id="faq" className="px-5 md:px-8 space-y-8 md:space-y-10 py-12 md:py-16 bg-gray-50/30 scroll-mt-20">
            <div className="md:max-w-3xl md:mx-auto w-full space-y-8 md:space-y-10">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 mb-2">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">الأسئلة الشائعة</h2>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">كل ما تحتاج لمعرفته</p>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-none bg-white rounded-[2rem] px-6 shadow-sm overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-5 text-right outline-none focus:outline-none">
                       <span className="text-[13px] md:text-[15px] font-black text-gray-800 profitability leading-tight">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-[12px] md:text-[13px] font-black text-gray-500 leading-relaxed pb-6 text-right">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ===== FOOTER : centré sur mobile, horizontal sur PC ===== */}
          <footer className="mt-8 md:mt-0 border-t border-slate-100 bg-white rounded-t-[3rem] md:rounded-none pt-8 md:pt-14 pb-10 px-6 md:px-8 font-tajawal">
            <div className="max-w-4xl lg:max-w-6xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-4">
                  <div className="flex items-center gap-2">
                    <Image src={headerLogoUrl} alt="جمهورك" width={38} height={38} className="object-contain" />
                    <span className="text-xl font-black text-slate-900">جمهورك</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold max-w-xs">
                    المنصة الأسرع والأرخص لخدمات التسويق الرقمي في الوطن العربي. جودة مضمونة ودعم فني على مدار الساعة.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 md:gap-16 max-w-xs mx-auto md:mx-0">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-900 flex items-center justify-center md:justify-start">
                      القانونية
                    </h4>
                    <ul className="space-y-2 text-[11px] font-black text-slate-400 text-center md:text-right">
                      <li><Link href="/register" className="hover:text-orange-500 transition-colors">سياسة الخصوصية</Link></li>
                      <li><Link href="/register" className="hover:text-orange-500 transition-colors">شروط الخدمة</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-900 flex items-center justify-center md:justify-start">
                      المساعدة
                    </h4>
                    <ul className="space-y-2 text-[11px] font-black text-slate-400 text-center md:text-right">
                      <li><Link href="/register" className="hover:text-orange-500 transition-colors">مركز الدعم</Link></li>
                      <li><Link href="/register" className="hover:text-orange-500 transition-colors">الأسئلة الشائعة</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row md:justify-between items-center gap-4 text-center">
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
  );
}
