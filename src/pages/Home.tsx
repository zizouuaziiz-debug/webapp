import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLang } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import {
  CheckCircle, Monitor, ClipboardList, Users, TrendingUp, DollarSign,
  MousePointer, ChevronRight, Menu, X, Star, Shield, Zap,
} from 'lucide-react';

const EARNINGS_DATA = [65, 45, 80, 55, 120, 90, 140];
const CLICKS_DATA = [30, 25, 50, 35, 80, 60, 100];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Freelancer', quote: 'I made $120 in my first week just by clicking ads and completing tasks.', stars: 5 },
  { name: 'Ahmed K.', role: 'Student', quote: 'ClickEarn has been a game changer for my pocket money!', stars: 5 },
  { name: 'Maria L.', role: 'Stay-at-home Mom', quote: 'Simple, easy and pays on time. Totally recommend it.', stars: 4 },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);
  const { t, lang } = useLang();
  const DAYS = lang === 'ar'
    ? ['الإث', 'الثل', 'الأر', 'الخم', 'الجم', 'السب', 'الأح']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const FEATURES = [
    { icon: Monitor, titleKey: 'viewAdsGetPaid', descKey: 'viewAdsDesc', color: 'bg-blue-700' },
    { icon: ClipboardList, titleKey: 'completeTasks', descKey: 'completeTasksDesc', color: 'bg-green-600' },
    { icon: Users, titleKey: 'referralRewards', descKey: 'referralDesc', color: 'bg-cyan-500' },
  ] as const;

  const OFFERS = [
    { titleKey: 'surveyBonus', descKey: 'surveyDesc', ctaKey: 'completeSurvey', img: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { titleKey: 'shoppingDeals', descKey: 'shoppingDesc', ctaKey: 'startSaving', img: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { titleKey: 'watchVideos', descKey: 'watchDesc', ctaKey: 'watchEarn', img: 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ] as const;

  const STEPS = [
    { num: '1', titleKey: 'step1Title', descKey: 'step1Desc' },
    { num: '2', titleKey: 'step2Title', descKey: 'step2Desc' },
    { num: '3', titleKey: 'step3Title', descKey: 'step3Desc' },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => { c += 1; setCount(c); if (c >= 12) clearInterval(interval); }, 80);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const max = Math.max(...EARNINGS_DATA, ...CLICKS_DATA);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 bg-blue-800 dark:bg-blue-950 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ClickEarn</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[t('home'), t('howItWorksNav'), t('offersNav'), t('support')].map((link) => (
              <a key={link} href="#" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">{link}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login"><button className="text-white border border-blue-400 hover:border-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">{t('login')}</button></Link>
            <Link href="/register"><button className="bg-green-500 hover:bg-green-400 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-md">{t('signUp')}</button></Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button className="text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-blue-900 dark:bg-blue-950 px-4 py-4 flex flex-col gap-3 border-t border-blue-700">
            {[t('home'), t('howItWorksNav'), t('offersNav'), t('support')].map(link => (
              <a key={link} href="#" className="text-blue-100 text-sm font-medium py-1">{link}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login"><button className="flex-1 text-white border border-blue-400 px-4 py-2 rounded-lg text-sm font-medium">{t('login')}</button></Link>
              <Link href="/register"><button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">{t('signUp')}</button></Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center min-h-[480px] py-12 gap-8">
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-300 leading-tight mb-4 whitespace-pre-line">
              {t('heroTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">{t('heroSubtitle')}</p>
            <Link href="/register">
              <button className="bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 group">
                {t('joinNow')}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <div className="mt-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
              <em className="not-italic font-medium">{t('itsFree')}</em>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {[{ icon: Shield, key: 'secure' }, { icon: Zap, key: 'instant' }, { icon: Star, key: 'rating' }].map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Icon className="w-4 h-4 text-green-500" />{t(key as any)}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center relative">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-40 scale-110" />
              <img src="https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=700" alt="Earn online"
                className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-[4/3]" />
              <div className="absolute -top-4 -start-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div>
                <div><p className="text-xs text-gray-500 dark:text-gray-400">{t('earnedToday')}</p><p className="text-sm font-bold text-gray-900 dark:text-gray-100">$8.20</p></div>
              </div>
              <div className="absolute -bottom-4 -end-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
                <div><p className="text-xs text-gray-500 dark:text-gray-400">{t('members')}</p><p className="text-sm font-bold text-gray-900 dark:text-gray-100">2.4M+</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, titleKey, descKey, color }) => (
              <div key={titleKey} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t(titleKey)}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12">{t('yourDashboard')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: t('currentBalance'), value: '$12.40', sub: t('todayEarnedSub') },
                    { label: t('todayEarnings'), value: `$${(count * 0.2).toFixed(2)}`, sub: t('todayVsYest') },
                    { label: t('clicksToday'), value: String(count), sub: '' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                      {sub && <p className="text-xs text-green-600 mt-1 font-medium">{sub}</p>}
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('earningsOverview')}</h3>
                <div className="flex items-end gap-2 h-36 mt-2">
                  {DAYS.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-1 flex-1">
                      <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '112px' }}>
                        <div className="bg-green-500 rounded-t w-3 transition-all duration-700" style={{ height: `${(EARNINGS_DATA[i] / max) * 112}px` }} />
                        <div className="bg-blue-500 rounded-t w-3 transition-all duration-700" style={{ height: `${(CLICKS_DATA[i] / max) * 112}px` }} />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{t('earnings')}</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />{t('clicks')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">{t('dailyGoalProgress')}</h3>
                <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                  <span>{t('keepClicking')}</span><span className="text-green-600 font-bold">62%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '62%' }} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">$6.20 / $10.00</p>
              </div>
              <div className="bg-blue-800 dark:bg-blue-950 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <MousePointer className="w-5 h-5 text-blue-200" />
                  <span className="font-bold">{t('ads')}</span>
                </div>
                <p className="text-blue-200 text-sm mb-4">{t('viewAdsDesc')}</p>
                <Link href="/register">
                  <button className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2.5 rounded-lg transition-colors">{t('joinNow')}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12">{t('topOffers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {OFFERS.map(({ titleKey, descKey, ctaKey, img }) => (
              <div key={titleKey} className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-600">
                <div className="h-48 overflow-hidden">
                  <img src={img} alt={t(titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600'; }} />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t(titleKey)}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t(descKey)}</p>
                  <Link href="/register">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors">{t(ctaKey)}</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-3">{t('howItWorks')}</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">{t('howItWorksSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ num, titleKey, descKey }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 bg-blue-800 dark:bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4">{num}</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">{t(titleKey)}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12">{t('whatMembersSay')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, role, quote, stars }) => (
              <div key={name} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                <div className="flex gap-1 mb-4">{Array.from({ length: stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 italic">"{quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">{name[0]}</div>
                  <div><p className="font-bold text-sm text-gray-900 dark:text-gray-100">{name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-800 dark:bg-blue-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t('readyToStart')}</h2>
          <p className="text-blue-200 text-lg mb-8">{t('readySubtitle')}</p>
          <Link href="/register">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all">
              {t('getStartedFree')}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>
                <span className="text-white font-bold text-lg">ClickEarn</span>
              </div>
              <p className="text-sm leading-relaxed">{t('footerTagline')}</p>
            </div>
            {[
              { title: t('company'), links: [t('aboutUs'), t('careers'), t('press'), t('blog')] },
              { title: t('support'), links: [t('helpCenter'), t('contactUs'), t('terms'), t('privacy')] },
              { title: t('earn'), links: [t('viewAds'), t('completeTasks'), t('referralProgram'), t('partnerOffers')] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white font-bold mb-3">{title}</h4>
                <ul className="space-y-2">{links.map(link => <li key={link}><a href="#" className="hover:text-white transition-colors text-sm">{link}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">{t('footerRights')}</p>
            <p className="text-sm">{t('footerMade')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
