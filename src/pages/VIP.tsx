import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useGetVipLevels, useDepositForVip, getGetVipLevelsQueryKey, getGetWalletQueryKey } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Crown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const VIP_COLORS = [
  { bg: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600', btn: 'bg-gray-600 hover:bg-gray-700', icon: 'text-gray-400' },
  { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', btn: 'bg-blue-600 hover:bg-blue-700', icon: 'text-blue-500' },
  { bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', btn: 'bg-yellow-500 hover:bg-yellow-600', icon: 'text-yellow-500' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', btn: 'bg-purple-600 hover:bg-purple-700', icon: 'text-purple-500' },
];

export default function VIP() {
  const { user } = useAuth();
  const { data: levels, isLoading } = useGetVipLevels();
  const depositMutation = useDepositForVip();
  const { toast } = useToast();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('credit_card');

  const handleUpgrade = (level: any) => {
    setAmount(level.requiredDeposit ? String(level.requiredDeposit) : '10');
    setMethod('credit_card');
    setDialogOpen(true);
  };

  const handleDeposit = () => {
    if (!amount) return;
    depositMutation.mutate({ data: { amount: Number(amount), method } }, {
      onSuccess: () => {
        toast({ title: t('upgrade'), description: 'Your VIP upgrade will be processed shortly.' });
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetVipLevelsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
      },
      onError: (err: any) => toast({ title: t('error'), description: err.message, variant: 'destructive' })
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-96 rounded-xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('vipTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('vipSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(levels as any[])?.map((level) => {
          const idx = level.level;
          const colors = VIP_COLORS[idx] || VIP_COLORS[0];
          const isCurrent = user?.vipLevel === idx;
          const isLower = (user?.vipLevel || 0) > idx;
          return (
            <div key={idx} className={`relative border-2 rounded-2xl p-5 flex flex-col transition-shadow hover:shadow-md bg-white dark:bg-gray-800 ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-500' : 'border-gray-100 dark:border-gray-700'}`}>
              {isCurrent && (
                <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 bg-blue-600 text-white border-0 text-xs px-3">
                  {t('currentLevel')}
                </Badge>
              )}
              <div className="text-center mb-4 mt-2">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-2 ${colors.bg}`}>
                  <Crown className={`w-8 h-8 ${colors.icon}`} />
                </div>
                <h3 className="font-bold text-xl dark:text-gray-100">{level.name}</h3>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {level.requiredDeposit === 0 ? 'Free' : `$${level.requiredDeposit}`}
                </p>
                {level.requiredDeposit > 0 && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{t('requiredDeposit')}</p>}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 mt-4">
                  <p className="text-green-700 dark:text-green-400 font-bold text-lg">{level.earningsMultiplier}x {t('multiplier')}</p>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {level.benefits.map((b: string) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{b}
                  </li>
                ))}
              </ul>
              <Button onClick={() => !isCurrent && !isLower && handleUpgrade(level)}
                disabled={isCurrent || isLower}
                className={`w-full text-white ${isCurrent || isLower ? 'bg-gray-200 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400' : colors.btn}`}>
                {isCurrent ? t('currentLevel') : isLower ? '✓' : t('upgrade')}
              </Button>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader><DialogTitle>{t('deposit')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('amount')}</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>{t('paymentMethod')}</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="crypto">{t('crypto')}</SelectItem>
                  <SelectItem value="bank_transfer">{t('bankTransfer')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleDeposit} disabled={depositMutation.isPending || !amount} className="bg-green-600 hover:bg-green-700 text-white">
              {depositMutation.isPending ? t('processing') : t('submitRequest')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
