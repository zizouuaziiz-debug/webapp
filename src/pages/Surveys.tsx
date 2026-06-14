import { useGetSurveys } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Surveys() {
  const { data: surveys, isLoading } = useGetSurveys();
  const { user } = useAuth();
  const { t } = useLang();

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48 mb-2" /><Skeleton className="h-5 w-64 mb-8" />
        <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('surveysTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('surveysSubtitle')}</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 py-1">Powered by CPX Research</Badge>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-700 dark:text-blue-300 mt-0.5">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Tips for success</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Answer questions honestly. Rewards are credited automatically upon completion.</p>
        </div>
      </div>
      <div className="space-y-4">
        {!surveys || surveys.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('noOffers')}</p>
          </div>
        ) : surveys.map((survey: any) => (
          <Card key={survey.id} className="border-0 shadow-sm dark:bg-gray-800 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center p-5 gap-4">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="flex-1 text-center md:text-start">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{survey.title}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> ~{survey.lengthMinutes} mins</span>
                  </div>
                </div>
                <div className="text-center md:text-end w-full md:w-auto">
                  <p className="text-2xl font-bold text-green-600 mb-3 md:mb-1">${survey.reward.toFixed(2)}</p>
                  <a href={`${survey.url}&ext_user_id=${user?.id}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white group">
                      Start Survey <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
