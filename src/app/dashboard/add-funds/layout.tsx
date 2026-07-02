
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شحن الرصيد',
  description: 'اشحن رصيد حسابك في جمهورك بسهولة عبر التحويل البنكي أو بطاقات التعبئة للمتابعة في طلب خدمات السوشيال ميديا.',
};

export default function AddFundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
