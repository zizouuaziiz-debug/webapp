import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { DollarSign, Users, CheckSquare, TrendingUp, LogIn } from "lucide-react";

export default function Home() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xl font-bold text-blue-600">ClickEarn</span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">{t("dashboard")}</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium">{t("login")}</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">{t("register")}</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">{t("heroSub")}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">{t("getStarted")}</Link>
            <Link to="/login" className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t("learnMore")}</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { icon: DollarSign, label: t("totalPaid"), value: "$2.4M+" },
            { icon: Users, label: t("activeUsers"), value: "80,000+" },
            { icon: CheckSquare, label: t("tasksAvailable"), value: "500+" },
            { icon: TrendingUp, label: t("avgEarning"), value: "$8.20" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <Icon className="mx-auto mb-2 opacity-80" size={28} />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm opacity-80 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{t("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: t("signUp"), desc: t("signUpDesc") },
              { num: "02", title: t("earnMoney"), desc: t("earnMoneyDesc") },
              { num: "03", title: t("withdraw"), desc: t("withdrawDesc") },
            ].map(({ num, title, desc }) => (
              <div key={num} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">{num}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("heroTitle")}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t("heroSub")}</p>
        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          <LogIn size={18} /> {t("getStarted")}
        </Link>
      </section>

      <footer className="py-6 text-center text-sm text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800">
        © 2025 ClickEarn. All rights reserved.
      </footer>
    </div>
  );
}
