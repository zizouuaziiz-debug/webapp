import { useGetTasks, useCompleteTask, getGetTasksQueryKey, getGetWalletQueryKey } from '@/api-client';
import { useLang } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Tasks() {
  const { data: tasks, isLoading } = useGetTasks();
  const completeMutation = useCompleteTask();
  const { toast } = useToast();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleComplete = (taskId: number) => {
    completeMutation.mutate({ data: { taskId } }, {
      onSuccess: (res: any) => {
        if (res.success) {
          toast({ title: t('taskCompletedMsg'), description: `${t('youEarned')} $${res.reward.toFixed(2)}`, className: "bg-green-50 border-green-200 text-green-800" });
          queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        }
      },
      onError: (err: any) => {
        toast({ title: t('taskFailed'), description: err.message, variant: "destructive" });
      }
    });
  };

  const multipliers: Record<number, number> = { 1: 1.5, 2: 2, 3: 3 };
  const multiplier = user && user.vipLevel > 0 ? multipliers[user.vipLevel] : null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </DashboardLayout>
    );
  }

  const typeLabel = (type: string) =>
    type === 'daily' ? t('daily') : type === 'special' ? t('special') : t('general');

  const typeBadgeClass = (type: string) =>
    type === 'daily' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
    type === 'special' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('tasksTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('tasksSubtitle')}</p>
        </div>
        {multiplier && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 px-3 py-1">
            {t('vipBonus')} ({multiplier}x)
          </Badge>
        )}
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('noTasks')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task: any) => {
            const reward = multiplier ? task.reward * multiplier : task.reward;
            return (
              <Card key={task.id} className={`border-0 shadow-sm dark:bg-gray-800 relative overflow-hidden ${task.isCompleted ? 'opacity-70' : 'hover:shadow-md transition-shadow'}`}>
                {task.isCompleted && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px]">
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> {t('taskCompleted')}
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <Badge variant="secondary" className={typeBadgeClass(task.type)}>{typeLabel(task.type)}</Badge>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">${reward.toFixed(2)}</p>
                      {multiplier && <p className="text-[10px] text-gray-400">{t('vipBonus')}</p>}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3 leading-tight dark:text-gray-100">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
                  {task.expiresAt && (
                    <div className="flex items-center gap-1 mt-4 text-xs text-red-500 font-medium">
                      <Clock className="w-3 h-3" /> {new Date(task.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={task.isCompleted || completeMutation.isPending}
                    onClick={() => handleComplete(task.id)}>
                    {t('completeTask')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
