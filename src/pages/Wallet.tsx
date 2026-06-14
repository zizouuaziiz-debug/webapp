import { useState } from 'react';
import { useGetWallet, useGetTransactions, useRequestWithdrawal, getGetWalletQueryKey, getGetTransactionsQueryKey } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Wallet as WalletIcon, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function Wallet() {
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { data: transactions, isLoading: txLoading } = useGetTransactions();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const { toast } = useToast();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const withdrawMutation = useRequestWithdrawal();

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    withdrawMutation.mutate({ data: { amount: Number(amount), method } }, {
      onSuccess: () => {
        toast({ title: t('withdrawalRequested'), description: t('withdrawalProcessing') });
        setWithdrawOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
      },
      onError: (error: any) => {
        toast({ title: t('withdrawalFailed'), description: error.message || t('error'), variant: "destructive" });
      }
    });
  };

  if (walletLoading || !wallet) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}</div>
        <Skeleton className="h-96" />
      </DashboardLayout>
    );
  }

  const statusClass = (s: string) =>
    s === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' :
    s === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' :
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';

  const statusLabel = (s: string) =>
    s === 'completed' ? t('completed') : s === 'pending' ? t('pendingStatus') : t('rejected');

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('walletTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('walletSubtitle')}</p>
        </div>
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 h-11 px-6">
              <DollarSign className="w-5 h-5" /> {t('withdrawFunds')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
            <form onSubmit={handleWithdraw}>
              <DialogHeader>
                <DialogTitle>{t('requestWithdrawal')}</DialogTitle>
                <DialogDescription>{t('withdrawalDesc')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t('amount')}</Label>
                  <Input id="amount" type="number" min="5" step="0.01" max={wallet.balance} value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  <p className="text-xs text-gray-500">{t('available')}: ${wallet.balance.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">{t('paymentMethod')}</Label>
                  <Select value={method} onValueChange={setMethod} required>
                    <SelectTrigger><SelectValue placeholder={t('selectMethod')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">{t('paypal')}</SelectItem>
                      <SelectItem value="bank_transfer">{t('bankTransfer')}</SelectItem>
                      <SelectItem value="crypto">{t('crypto')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={withdrawMutation.isPending} className="bg-green-600 text-white w-full">
                  {withdrawMutation.isPending ? t('processing') : t('submitRequest')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-blue-800 dark:bg-blue-950 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-700 dark:bg-blue-900 flex items-center justify-center">
                <WalletIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-200">{t('availableBalance')}</p>
                <h3 className="text-2xl font-bold">${wallet.balance.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        {[
          { label: t('pending'), value: `$${wallet.pendingBalance.toFixed(2)}`, icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
          { label: t('totalEarned'), value: `$${wallet.totalEarned.toFixed(2)}`, icon: ArrowDownLeft, color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
          { label: t('totalWithdrawn'), value: `$${wallet.totalWithdrawn.toFixed(2)}`, icon: ArrowUpRight, color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">{t('transactionHistory')}</CardTitle>
          <CardDescription>{t('recentActivity')}</CardDescription>
        </CardHeader>
        <CardContent>
          {txLoading ? <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          : !transactions || transactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('noTransactions')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead className="text-right">{t('amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isEarn = tx.type.startsWith('earn') || tx.type === 'deposit';
                    return (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isEarn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isEarn ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{tx.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusClass(tx.status)}>{statusLabel(tx.status)}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400 text-sm">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className={`text-right font-bold ${isEarn ? 'text-green-600' : 'text-red-600'}`}>
                          {isEarn ? '+' : '-'}${tx.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
