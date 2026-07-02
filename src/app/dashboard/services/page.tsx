
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Send, 
  ArrowRight,
  Ghost
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Custom TikTok Icon
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

// Custom X (Twitter) Icon
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Custom Threads Icon
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5c-1.5 1.5-3.5 1.5-4.5 1.5s-3-1-4-2.5c-1-1.5-1-3.5 0-5 1-1.5 3-2.5 4-2.5s3 0 4.5 1.5c1 1 1 3 0 4.5-1 1.5-2.5 2-2.5 2s-1-.5-1-1.5 1.5-2 2-3c.5-1 .5-2 0-2.5-.5-.5-1.5-.5-2 0s-.5 1.5 0 2.5c.5 1 1.5 1 1.5 1z" />
  </svg>
);

const platforms = [
  { id: 'instagram', name: 'انستقرام', sub: 'خدمات انستقرام', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'tiktok', name: 'تيك توك', sub: 'خدمات تيك توك', icon: TikTokIcon, color: 'text-black', bg: 'bg-gray-100' },
  { id: 'facebook', name: 'فيسبوك', sub: 'خدمات فيسبوك', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'youtube', name: 'يوتيوب', sub: 'خدمات يوتيوب', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'snapchat', name: 'سناب شات', sub: 'خدمات سناب شات', icon: Ghost, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'threads', name: 'ثريدز', sub: 'خدمات ثريدز', icon: ThreadsIcon, color: 'text-black', bg: 'bg-gray-100' },
  { id: 'twitter', name: 'تويتر (X)', sub: 'خدمات X', icon: XIcon, color: 'text-black', bg: 'bg-gray-100' },
  { id: 'telegram', name: 'تليجرام', sub: 'خدمات تليجرام', icon: Send, color: 'text-blue-400', bg: 'bg-blue-50' },
];

export default function ServicesPage() {
  return (
    <div className="space-y-4 pb-24 text-right" dir="rtl">
      <div className="flex items-center gap-2">
         <Link href="/dashboard">
            <button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center bg-transparent border-none outline-none focus:outline-none active:bg-transparent hover:bg-transparent transition-none">
              <ArrowRight className="h-5 w-5" />
            </button>
         </Link>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <h1 className="text-xl font-black text-gray-900">الخدمات</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">جميع منصات التواصل الاجتماعي بين يديك:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {platforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <Link key={idx} href={`/dashboard/platform/${platform.id}`} className="w-full outline-none focus:outline-none active:bg-transparent transition-none">
                <Card className="border-none shadow-sm transition-none group overflow-hidden bg-white rounded-[2rem] active:bg-transparent">
                  <CardContent className="p-6 flex flex-col items-center text-center relative min-h-[140px] justify-center active:bg-transparent transition-none">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner transition-none", platform.bg)}>
                      <Icon className={cn("h-7 w-7 transition-none", platform.color)} />
                    </div>
                    
                    <h3 className="text-sm font-black text-gray-900 transition-none">{platform.name}</h3>
                    <p className="text-[10px] font-black text-orange-500 mt-1 uppercase tracking-tight transition-none">{platform.sub}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
