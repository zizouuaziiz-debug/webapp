import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "ar";

const translations = {
  en: {
    // Nav
    home: "Home", login: "Login", register: "Register", dashboard: "Dashboard",
    wallet: "Wallet", tasks: "Tasks", offers: "Offers", adsWall: "Ads Wall",
    surveys: "Surveys", vip: "VIP", referral: "Referral", admin: "Admin", logout: "Logout",
    // Home
    heroTitle: "Earn Real Money Online", heroSub: "Complete tasks, watch ads, and take surveys to earn real dollars daily.",
    getStarted: "Get Started Free", learnMore: "Learn More",
    howItWorks: "How It Works", signUp: "Sign Up Free",
    signUpDesc: "Create your free account in seconds. No credit card required.",
    earnMoney: "Earn Money", earnMoneyDesc: "Complete simple tasks, watch ads, and fill surveys to earn real cash.",
    withdraw: "Withdraw", withdrawDesc: "Cash out your earnings via PayPal, Binance, or bank transfer.",
    totalPaid: "Total Paid", activeUsers: "Active Users", tasksAvailable: "Tasks Available", avgEarning: "Avg Daily Earning",
    // Auth
    welcomeBack: "Welcome Back", signInAccount: "Sign in to your account",
    emailAddress: "Email Address", password: "Password", forgotPassword: "Forgot Password?",
    signIn: "Sign In", noAccount: "Don't have an account?", createOne: "Create one",
    createAccount: "Create Account", joinClickEarn: "Join ClickEarn today",
    fullName: "Full Name", confirmPassword: "Confirm Password", referralCode: "Referral Code (optional)",
    haveAccount: "Already have an account?", orContinueWith: "Or continue with",
    continueWithGoogle: "Continue with Google",
    // Dashboard
    totalBalance: "Total Balance", pendingBalance: "Pending Balance", totalEarned: "Total Earned",
    recentActivity: "Recent Activity", quickActions: "Quick Actions", earnNow: "Earn Now",
    viewWallet: "View Wallet", vipLevel: "VIP Level",
    // Wallet
    walletBalance: "Wallet Balance", transactionHistory: "Transaction History",
    requestWithdrawal: "Request Withdrawal", amount: "Amount", method: "Payment Method",
    submit: "Submit", noTransactions: "No transactions yet", status: "Status",
    type: "Type", date: "Date", description: "Description",
    // Tasks
    availableTasks: "Available Tasks", completed: "Completed", pending: "Pending",
    completeTask: "Complete Task", taskReward: "Reward", noTasks: "No tasks available",
    // Offers
    featuredOffers: "Featured Offers", claimOffer: "Claim Offer", noOffers: "No offers available",
    // Ads Wall  
    watchAds: "Watch Ads & Earn", claimReward: "Claim Reward", adClaimed: "Claimed",
    noAds: "No ads available",
    // Surveys
    availableSurveys: "Available Surveys", startSurvey: "Start Survey", minutes: "min",
    noSurveys: "No surveys available",
    // VIP
    vipProgram: "VIP Program", currentLevel: "Current Level", upgradeVip: "Upgrade VIP",
    depositAmount: "Deposit Amount", paymentMethod: "Payment Method", upgrade: "Upgrade",
    benefits: "Benefits", earningsMultiplier: "Earnings Multiplier",
    // Referral
    referralProgram: "Referral Program", yourReferralLink: "Your Referral Link",
    copyLink: "Copy Link", copied: "Copied!", totalReferrals: "Total Referrals",
    totalReferralEarnings: "Total Earnings", referredUsers: "Referred Users",
    joinedOn: "Joined On",
    // Admin
    analytics: "Analytics", users: "Users", transactions: "Transactions", settings: "Settings",
    totalUsers: "Total Users", totalClicks: "Total Clicks", totalEarnings: "Total Earnings",
    totalWithdrawals: "Total Withdrawals", revenue: "Revenue",
    ban: "Ban", unban: "Unban", makeAdmin: "Make Admin",
    save: "Save", saveSettings: "Save Settings",
    // Common
    loading: "Loading...", error: "Error", success: "Success",
    close: "Close", cancel: "Cancel", confirm: "Confirm",
    darkMode: "Dark Mode", language: "Language",
  },
  ar: {
    // Nav
    home: "الرئيسية", login: "تسجيل الدخول", register: "إنشاء حساب", dashboard: "لوحة التحكم",
    wallet: "المحفظة", tasks: "المهام", offers: "العروض", adsWall: "جدار الإعلانات",
    surveys: "الاستبيانات", vip: "VIP", referral: "الإحالات", admin: "الإدارة", logout: "تسجيل الخروج",
    // Home
    heroTitle: "اكسب أموالاً حقيقية عبر الإنترنت", heroSub: "أكمل المهام وشاهد الإعلانات وأجب على الاستبيانات لتكسب دولارات حقيقية يومياً.",
    getStarted: "ابدأ مجاناً", learnMore: "اعرف المزيد",
    howItWorks: "كيف يعمل؟", signUp: "سجّل مجاناً",
    signUpDesc: "أنشئ حسابك المجاني في ثوانٍ. لا تحتاج بطاقة ائتمانية.",
    earnMoney: "اكسب المال", earnMoneyDesc: "أكمل مهام بسيطة، شاهد إعلانات، وأجب على استبيانات لكسب نقود حقيقية.",
    withdraw: "اسحب الأرباح", withdrawDesc: "اسحب أرباحك عبر PayPal أو Binance أو تحويل بنكي.",
    totalPaid: "إجمالي المدفوع", activeUsers: "المستخدمون النشطون", tasksAvailable: "المهام المتاحة", avgEarning: "متوسط الدخل اليومي",
    // Auth
    welcomeBack: "مرحباً بعودتك", signInAccount: "سجّل الدخول إلى حسابك",
    emailAddress: "البريد الإلكتروني", password: "كلمة المرور", forgotPassword: "نسيت كلمة المرور؟",
    signIn: "تسجيل الدخول", noAccount: "ليس لديك حساب؟", createOne: "أنشئ حساباً",
    createAccount: "إنشاء حساب", joinClickEarn: "انضم إلى ClickEarn اليوم",
    fullName: "الاسم الكامل", confirmPassword: "تأكيد كلمة المرور", referralCode: "رمز الإحالة (اختياري)",
    haveAccount: "لديك حساب بالفعل؟", orContinueWith: "أو تابع باستخدام",
    continueWithGoogle: "تابع مع Google",
    // Dashboard
    totalBalance: "الرصيد الإجمالي", pendingBalance: "الرصيد المعلق", totalEarned: "إجمالي المكتسب",
    recentActivity: "النشاط الأخير", quickActions: "إجراءات سريعة", earnNow: "اكسب الآن",
    viewWallet: "عرض المحفظة", vipLevel: "مستوى VIP",
    // Wallet
    walletBalance: "رصيد المحفظة", transactionHistory: "سجل المعاملات",
    requestWithdrawal: "طلب سحب", amount: "المبلغ", method: "طريقة الدفع",
    submit: "إرسال", noTransactions: "لا توجد معاملات بعد", status: "الحالة",
    type: "النوع", date: "التاريخ", description: "الوصف",
    // Tasks
    availableTasks: "المهام المتاحة", completed: "مكتملة", pending: "معلقة",
    completeTask: "أكمل المهمة", taskReward: "المكافأة", noTasks: "لا توجد مهام متاحة",
    // Offers
    featuredOffers: "العروض المميزة", claimOffer: "احصل على العرض", noOffers: "لا توجد عروض متاحة",
    // Ads Wall
    watchAds: "شاهد الإعلانات واكسب", claimReward: "احصل على المكافأة", adClaimed: "تم الاستلام",
    noAds: "لا توجد إعلانات متاحة",
    // Surveys
    availableSurveys: "الاستبيانات المتاحة", startSurvey: "ابدأ الاستبيان", minutes: "دقيقة",
    noSurveys: "لا توجد استبيانات متاحة",
    // VIP
    vipProgram: "برنامج VIP", currentLevel: "المستوى الحالي", upgradeVip: "ترقية VIP",
    depositAmount: "مبلغ الإيداع", paymentMethod: "طريقة الدفع", upgrade: "ترقية",
    benefits: "المزايا", earningsMultiplier: "مضاعف الأرباح",
    // Referral
    referralProgram: "برنامج الإحالات", yourReferralLink: "رابط إحالتك",
    copyLink: "نسخ الرابط", copied: "تم النسخ!", totalReferrals: "إجمالي الإحالات",
    totalReferralEarnings: "إجمالي الأرباح", referredUsers: "المستخدمون المُحالون",
    joinedOn: "انضم في",
    // Admin
    analytics: "التحليلات", users: "المستخدمون", transactions: "المعاملات", settings: "الإعدادات",
    totalUsers: "إجمالي المستخدمين", totalClicks: "إجمالي النقرات", totalEarnings: "إجمالي الأرباح",
    totalWithdrawals: "إجمالي المسحوبات", revenue: "الإيرادات",
    ban: "حظر", unban: "رفع الحظر", makeAdmin: "تعيين كمشرف",
    save: "حفظ", saveSettings: "حفظ الإعدادات",
    // Common
    loading: "جاري التحميل...", error: "خطأ", success: "نجاح",
    close: "إغلاق", cancel: "إلغاء", confirm: "تأكيد",
    darkMode: "الوضع الداكن", language: "اللغة",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("clickearn_lang") as Lang) ?? "en";
  });

  const setLang = (l: Lang) => {
    localStorage.setItem("clickearn_lang", l);
    setLangState(l);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey): string => translations[lang][key] as string;
  const isRTL = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
