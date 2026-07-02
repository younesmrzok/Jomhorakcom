
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دليل الخدمات',
  description: 'استكشف جميع خدمات جمهورك لزيادة المتابعين، اللايكات، والمشاهدات على انستقرام، تيك توك، فيسبوك وغيرها بأسعار تنافسية.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
