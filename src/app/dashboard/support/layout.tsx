
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مركز الدعم والمساعدة',
  description: 'هل تحتاج إلى مساعدة؟ تواصل مع فريق دعم جمهورك الفني لحل أي استفسارات أو مشاكل فنية تتعلق بطلباتك أو حسابك.',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
