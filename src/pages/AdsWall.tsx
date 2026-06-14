import { useGetAds, useClaimAd, getGetAdsQueryKey, getGetWalletQueryKey } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdsWall() {
  const { data: ads, isLoading } = useGetAds();
  const claimMutation = useClaimAd();
  const { toast } = useToast();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const handleAdClick = (adId: number, url: string, isClaimed: boolean) => {
    if (isClaimed) return;
    window.open(url, '_blank');
    claimMutation.mutate({ data: { adId } }, {
      onSuccess: (res: any) => {
        if (res.success) {
          toast({ title: t('adClaimed'), description: `${t('adEarned')} $${res.reward.toFixed(4)}`, className: "bg-green-50 border-green-200 text-green-800" });
          queryClient.invalidateQueries({ queryKey: getGetAdsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        }
      },
      onError: () => toast({ title: t('adFailed'), variant: 'destructive' })
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48 mb-2" /><Skeleton className="h-5 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('adsTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('adsSubtitle')}</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 py-1">Powered by Monetag</Badge>
      </div>
      {!ads || ads.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('noAds')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ads.map((ad: any) => (
            <Card key={ad.id}
              className={`border-0 shadow-sm dark:bg-gray-800 overflow-hidden cursor-pointer group transition-all duration-300 ${ad.isClaimed ? 'opacity-50 grayscale' : 'hover:-translate-y-1 hover:shadow-md'}`}
              onClick={() => handleAdClick(ad.id, ad.adUrl, ad.isClaimed)}>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
                <img src={ad.imageUrl} alt={ad.title} className="max-h-full max-w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=300'; }} />
                {!ad.isClaimed && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                )}
                {ad.isClaimed && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-green-700">
                      <CheckCircle className="w-4 h-4" /> {t('taskCompleted')}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-50 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">{ad.title}</p>
                <span className="font-bold text-green-600">+${ad.reward.toFixed(4)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
