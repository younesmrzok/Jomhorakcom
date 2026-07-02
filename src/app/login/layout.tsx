
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'قم بتسجيل الدخول إلى حسابك في جمهورك للوصول إلى أرخص خدمات السوشيال ميديا وإدارة حملاتك الترويجية.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
