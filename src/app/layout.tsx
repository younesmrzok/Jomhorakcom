import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: 'جمهورك | أرخص وأفضل منصة SMM لزيادة المتابعين والتفاعل',
    template: '%s | جمهورك'
  },
  description: 'جمهورك هي المنصة الرائدة لزيادة المتابعين والتفاعل على انستقرام، تيك توك، فيسبوك، ويوتيوب. نقدم جودة عالية، تنفيذ فوري، وأقل الأسعار في السوق العربي.',
  keywords: ['جمهورك', 'jomhorak', 'زيادة متابعين', 'SMM Panel', 'ارخص SMM Panel', 'تسويق رقمي', 'انستقرام', 'تيك توك', 'فيسبوك', 'يوتيوب'],
  metadataBase: new URL('https://jomhorak.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'جمهورك | المنصة الأولى لخدمات السوشيال ميديا',
    description: 'عزز حضورك الرقمي مع جمهورك. خدمات احترافية لزيادة التفاعل والمتابعين بجودة مضمونة.',
    url: 'https://jomhorak.com',
    siteName: 'جمهورك',
    locale: 'ar_MA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'جمهورك - المنصة الأولى لخدمات السوشيال ميديا',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جمهورك | أرخص وأفضل منصة SMM',
    description: 'زيادة متابعين وتفاعل بأسعار تنافسية وتنفيذ فوري.',
    images: ['/og-image.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-title" content="جمهورك" />
      </head>
      <body className="antialiased bg-[#F8F9FA] text-foreground" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
