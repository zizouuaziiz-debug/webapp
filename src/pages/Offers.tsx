import { useState } from 'react';
import { useGetOffers } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Survey', 'Shopping', 'Video', 'Gaming'];

export default function Offers() {
  const { data: offers, isLoading } = useGetOffers();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState('All');

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  const filtered = activeTab === 'All' ? offers : offers?.filter((o: any) => o.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('offersTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('offersSubtitle')}</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm w-full md:w-auto overflow-x-auto justify-start h-auto p-1">
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/40 dark:data-[state=active]:text-blue-300 px-4 py-2">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {!filtered || filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('noOffers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((offer: any) => (
            <Card key={offer.id} className="border-0 shadow-sm dark:bg-gray-800 overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600'; }} />
                <div className="absolute top-3 end-3 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md">
                  Up to ${offer.reward.toFixed(2)}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wider">{offer.category}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">{offer.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 line-clamp-2">{offer.description}</p>
                <a href={offer.ctaUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-blue-800 hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 text-white text-center font-medium py-2.5 rounded-lg transition-colors">
                  {offer.ctaLabel || t('claimOffer')}
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
