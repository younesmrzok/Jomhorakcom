import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Copy, 
  Coins, 
  TrendingUp, 
  Gift, 
  ExternalLink 
} from 'lucide-react';

export default function AffiliatePage() {
  const referralStats = [
    { label: 'Total Referrals', value: '48', icon: Users, color: 'text-primary' },
    { label: 'Unpaid Earnings', value: '$124.50', icon: Coins, color: 'text-accent' },
    { label: 'Total Earnings', value: '$1,240.00', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold">Affiliate Program</h1>
        <p className="text-muted-foreground">Share the love and earn 10% commission on every fund added by your referrals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {referralStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-background ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-white/10 uppercase tracking-widest font-bold">Earnings</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-headline font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Your Referral Link
            </CardTitle>
            <CardDescription>Copy this link and share it with your audience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                readOnly 
                value="https://trendpulse.com/ref/alex88" 
                className="bg-white/5 border-white/10 rounded-xl h-12 font-mono text-sm" 
              />
              <Button size="icon" className="h-12 w-12 bg-primary glow-indigo">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Payouts are processed every 1st and 15th of the month. Minimum withdrawal: $50.00
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Referral Transactions</CardTitle>
            <CardDescription>Detailed log of commissions earned.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Commission: user_4920</p>
                      <p className="text-xs text-muted-foreground">Added $200.00 funds</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent">+$20.00</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
