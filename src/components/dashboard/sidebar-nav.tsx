
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ListMusic, 
  History, 
  Wallet, 
  LifeBuoy
} from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Order', href: '/dashboard/new-order', icon: ShoppingCart },
    { label: 'Services', href: '/dashboard/services', icon: ListMusic },
    { label: 'My Orders', href: '/dashboard/orders', icon: History },
    { label: 'Add Funds', href: '/dashboard/add-funds', icon: Wallet },
    { label: 'Support', href: '/dashboard/support', icon: LifeBuoy },
  ];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg glow-indigo" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "" : "group-hover:text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
