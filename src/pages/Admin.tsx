import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { useGetAnalytics, useGetAdminUsers, useUpdateAdminUser, useGetAdminTransactions, useGetAdminSettings, useUpdateAdminSettings } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}><Icon className="w-6 h-6 text-white" /></div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data, isLoading } = useGetAnalytics();
  const { t } = useLang();
  const a = data as any;
  if (isLoading) return <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-24" />)}</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label={t('totalUsers')} value={a?.totalUsers ?? 0} icon={Users} color="bg-blue-600" />
      <StatCard label={t('activeUsers')} value={a?.activeUsers ?? 0} icon={Activity} color="bg-green-600" />
      <StatCard label={t('totalEarnings')} value={`$${Number(a?.totalEarnings ?? 0).toFixed(2)}`} icon={DollarSign} color="bg-yellow-500" />
      <StatCard label={t('totalWithdrawals')} value={`$${Number(a?.totalWithdrawals ?? 0).toFixed(2)}`} icon={TrendingUp} color="bg-purple-600" />
      <StatCard label="Ad Clicks" value={a?.totalClicks ?? 0} icon={Activity} color="bg-cyan-600" />
      <StatCard label="Revenue (month)" value={`$${Number(a?.revenueMonth ?? 0).toFixed(2)}`} icon={DollarSign} color="bg-orange-500" />
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading, refetch } = useGetAdminUsers();
  const updateMutation = useUpdateAdminUser();
  const { toast } = useToast();
  const { t } = useLang();
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>({});

  const openEdit = (u: any) => { setEditUser(u); setEditData({ balance: u.balance, vipLevel: u.vipLevel, isAdmin: u.isAdmin, isBanned: u.isBanned }); };

  const handleSave = () => {
    updateMutation.mutate({ userId: editUser.id, data: editData }, {
      onSuccess: () => { toast({ title: t('save') }); setEditUser(null); refetch(); },
      onError: (err: any) => toast({ title: t('error'), description: err.message, variant: 'destructive' })
    });
  };

  if (isLoading) return <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}</div>;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>{['ID','Name','Email','Balance','VIP','Admin','Banned',''].map(h => <th key={h} className="px-4 py-3 text-start text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {(users as any[] ?? []).map((u: any) => (
              <tr key={u.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-4 py-3 font-semibold text-green-600">${u.balance?.toFixed(2)}</td>
                <td className="px-4 py-3"><Badge variant="outline">VIP {u.vipLevel}</Badge></td>
                <td className="px-4 py-3">{u.isAdmin && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">Admin</Badge>}</td>
                <td className="px-4 py-3">{u.isBanned && <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0">{t('ban')}</Badge>}</td>
                <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => openEdit(u)}>{t('edit')}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader><DialogTitle>{t('edit')}: {editUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>{t('currentBalance')}</Label>
              <Input type="number" value={editData.balance ?? ''} onChange={e => setEditData({...editData, balance: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>VIP Level</Label>
              <Input type="number" min="0" max="3" value={editData.vipLevel ?? 0} onChange={e => setEditData({...editData, vipLevel: Number(e.target.value)})} /></div>
            <div className="flex items-center justify-between"><Label>Admin</Label>
              <Switch checked={editData.isAdmin ?? false} onCheckedChange={v => setEditData({...editData, isAdmin: v})} /></div>
            <div className="flex items-center justify-between"><Label>{t('ban')}</Label>
              <Switch checked={editData.isBanned ?? false} onCheckedChange={v => setEditData({...editData, isBanned: v})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>{t('cancel')}</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-blue-700 text-white">{updateMutation.isPending ? t('loading') : t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TransactionsTab() {
  const { data, isLoading } = useGetAdminTransactions();
  const { t } = useLang();
  if (isLoading) return <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}</div>;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>{[t('users'),t('type'),t('amount'),t('status'),t('description'),t('date')].map(h => <th key={h} className="px-4 py-3 text-start text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {(data as any[] ?? []).map((tx: any) => (
            <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{tx.userName || tx.userId}</td>
              <td className="px-4 py-3"><Badge className="border-0 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{tx.type}</Badge></td>
              <td className={`px-4 py-3 font-semibold ${tx.type === 'withdraw' ? 'text-red-600' : 'text-green-600'}`}>{tx.type === 'withdraw' ? '-' : '+'}${Number(tx.amount).toFixed(2)}</td>
              <td className="px-4 py-3">
                <Badge className={`border-0 text-xs ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{tx.status}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">{tx.description}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab() {
  const { data: settings, isLoading } = useGetAdminSettings();
  const updateMutation = useUpdateAdminSettings();
  const { toast } = useToast();
  const { t } = useLang();
  const [form, setForm] = useState<any>(null);
  if (isLoading) return <Skeleton className="h-64 w-full" />;
  const current = form ?? settings ?? {};
  const update = (key: string, value: any) => setForm({ ...current, [key]: value });
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: current }, {
      onSuccess: () => toast({ title: t('settingsSaved') }),
      onError: (err: any) => toast({ title: t('error'), description: err.message, variant: 'destructive' })
    });
  };
  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 max-w-xl">
      {[
        { label: t('monetagId'), key: 'monetagPublisherId', type: 'text' },
        { label: t('cpxAppId'), key: 'cpxAppId', type: 'text' },
        { label: t('referralRewardLabel'), key: 'referralReward', type: 'number' },
        { label: t('adClickReward'), key: 'adClickReward', type: 'number' },
        { label: t('withdrawalMinimum'), key: 'withdrawalMinimum', type: 'number' },
      ].map(({ label, key, type }) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Input type={type} step={type === 'number' ? '0.01' : undefined} value={current[key] ?? ''} onChange={e => update(key, type === 'number' ? Number(e.target.value) : e.target.value)} />
        </div>
      ))}
      <div className="space-y-1.5">
        <Label>{t('cpxSecret')}</Label>
        <Input type="password" value={current.cpxSecretKey ?? ''} onChange={e => update('cpxSecretKey', e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <Label>{t('withdrawalsEnabled')}</Label>
        <Switch checked={current.withdrawalsEnabled ?? false} onCheckedChange={v => update('withdrawalsEnabled', v)} />
      </div>
      <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-700 hover:bg-blue-800 text-white">
        {updateMutation.isPending ? t('loading') : t('saveSettings')}
      </Button>
    </form>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const { t } = useLang();
  const [, setLocation] = useLocation();
  if (!user?.isAdmin) { setLocation('/dashboard'); return null; }
  return (
    <DashboardLayout>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="overview">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="users">{t('users')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
          <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="transactions"><TransactionsTab /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
