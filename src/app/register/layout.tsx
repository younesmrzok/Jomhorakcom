
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد',
  description: 'انضم إلى جمهورك، المنصة الأسرع والأفضل في الوطن العربي لزيادة المتابعين والتفاعل. سجل الآن وابدأ في تعزيز حضورك الرقمي.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
