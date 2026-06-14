import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useRegister } from '@/api-client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLang();
  const registerMutation = useRegister();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferralCode(ref);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: { name, email, password, referralCode: referralCode || undefined } }, {
      onSuccess: (data) => { login(data.token, data.user); setLocation('/dashboard'); },
      onError: (error: any) => {
        toast({ title: t('registrationFailed'), description: error.message || t('couldNotCreate'), variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 end-4 flex items-center gap-2">
        <LanguageToggle className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
        <ThemeToggle className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
      </div>
      <Card className="w-full max-w-md shadow-lg border-0 dark:bg-gray-800">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-300">{t('createAccount')}</CardTitle>
          <CardDescription>{t('registerSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')}</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" placeholder={t('emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode">{t('referralCodeOptional')}</Label>
              <Input id="referralCode" placeholder={t('enterCode')} value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-11" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? t('creatingAccount') : t('signUp')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('haveAccount')} <Link href="/login" className="text-blue-600 font-semibold hover:underline">{t('login')}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
