import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useGetMe, useGetWallet } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Clock, MousePointer, Gift, MonitorPlay, CheckSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_AR = ['الإث', 'الثل', 'الأر', 'الخم', 'الجم', 'السب', 'الأح'];
const EARNINGS_DATA = [1.2, 0.5, 2.8, 1.5, 4.2, 3.0, 5.5];

export default function Dashboard() {
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { t, lang } = useLang();
  const [clicks, setClicks] = useState(0);
  const DAYS = lang === 'ar' ? DAYS_AR : DAYS_EN;

  useEffect(() => {
    const timer = setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => { c += 1; setClicks(c); if (c >= 12) clearInterval(interval); }, 100);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (meLoading || walletLoading || !me || !wallet) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const goalProgress = Math.min((wallet.balance / 10) * 100, 100);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('welcomeBackUser')}, {me.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('currentBalance'), value: `$${wallet.balance.toFixed(2)}`, icon: DollarSign, color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
          { label: t('pendingBalance'), value: `$${wallet.pendingBalance.toFixed(2)}`, icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
          { label: t('totalEarned'), value: `$${wallet.totalEarned.toFixed(2)}`, icon: Gift, color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
          { label: t('todaysClicks'), value: String(clicks), icon: MousePointer, color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('earningsOverview')}</h3>
              <div className="flex items-end gap-2 h-48 mt-2">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex justify-center h-40 items-end">
                      <div className="bg-blue-600 dark:bg-blue-500 rounded-t-md w-full max-w-[40px] transition-all duration-1000"
                        style={{ height: `${(EARNINGS_DATA[i] / 6) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dailyGoal')}</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('progress')}</span>
                <span className="text-green-600 font-bold">{goalProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${goalProgress}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">${wallet.balance.toFixed(2)} / $10.00</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-blue-800 dark:bg-blue-950 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">{t('quickActions')}</h3>
              <div className="space-y-3">
                <Link href="/ads">
                  <Button className="w-full bg-blue-700 hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 justify-start gap-3 h-12 border-0">
                    <MonitorPlay className="w-5 h-5" /> {t('viewAds')}
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button className="w-full bg-blue-700 hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 justify-start gap-3 h-12 border-0">
                    <CheckSquare className="w-5 h-5" /> {t('completeTasks')}
                  </Button>
                </Link>
                <Link href="/referral">
                  <Button className="w-full bg-green-500 hover:bg-green-600 justify-start gap-3 h-12 border-0 text-white">
                    <Users className="w-5 h-5" /> {t('inviteFriends')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
