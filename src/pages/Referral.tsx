import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useGetReferral, useGetReferredUsers } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Users, DollarSign, Gift, CheckCircle } from 'lucide-react';

export default function Referral() {
  const { data: referral, isLoading: loadingReferral } = useGetReferral();
  const { data: referred, isLoading: loadingReferred } = useGetReferredUsers();
  const { toast } = useToast();
  const { t } = useLang();
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const referralCode = (referral as any)?.referralCode ?? '';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  const totalReferred = (referral as any)?.totalReferred ?? 0;
  const totalEarned = (referral as any)?.totalEarned ?? 0;

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast({ title: t('copied'), description: `Referral ${type} copied.` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8" />
            <h2 className="text-xl font-bold">{t('referralTitle')}</h2>
          </div>
          <p className="text-green-100 text-sm">{t('referralSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: t('referredUsers'), value: totalReferred, icon: Users, color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400', loading: loadingReferral },
            { label: t('referralEarnings'), value: `$${Number(totalEarned).toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400', loading: loadingReferral },
          ].map(({ label, value, icon: Icon, color, loading }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('yourCode')}</h3>
          {loadingReferral ? <Skeleton className="h-14 w-full" /> : (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl px-5 py-3 text-center">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-widest">{referralCode}</span>
              </div>
              <Button variant="outline" onClick={() => copyToClipboard(referralCode, 'code')} className="flex-shrink-0 gap-2">
                {copied === 'code' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {t('copyLink')}
              </Button>
            </div>
          )}
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('copyLink')}</h3>
          {loadingReferral ? <Skeleton className="h-12 w-full" /> : (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {referralLink}
              </div>
              <Button variant="outline" onClick={() => copyToClipboard(referralLink, 'link')} className="flex-shrink-0 gap-2">
                {copied === 'link' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {t('copyLink')}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t('referredUsers')}</h3>
          {loadingReferred ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !(referred as any[])?.length ? (
            <div className="text-center py-10 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{t('noReferrals')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-start">
                    <th className="pb-3 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                    <th className="pb-3 text-gray-500 dark:text-gray-400 font-medium">Email</th>
                    <th className="pb-3 text-gray-500 dark:text-gray-400 font-medium text-end">Bonus</th>
                  </tr>
                </thead>
                <tbody>
                  {(referred as any[]).map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="py-3 text-end text-green-600 font-semibold">+$1.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
