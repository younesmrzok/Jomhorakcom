
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سجل الطلبات',
  description: 'تابع حالة طلباتك الحالية والسابقة في جمهورك. تتبع تقدم زيادة المتابعين والتفاعلات في مكان واحد.',
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
