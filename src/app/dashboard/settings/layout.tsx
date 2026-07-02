
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إعدادات الحساب',
  description: 'إدارة معلوماتك الشخصية، تحديث رقم الواتساب، وتخصيص تجربة حسابك في منصة جمهورك.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
