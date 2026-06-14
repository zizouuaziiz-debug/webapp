import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "ar";

export const translations = {
  en: {
    // Nav
    dashboard: "Dashboard", tasks: "Tasks", offers: "Offers", ads: "Ads",
    surveys: "Surveys", vip: "VIP", wallet: "Wallet", referral: "Referral",
    adminPanel: "Admin Panel", logout: "Logout", balance: "Balance",
    // Common
    loading: "Loading...", error: "Error", submit: "Submit", cancel: "Cancel",
    save: "Save", edit: "Edit", delete: "Delete", confirm: "Confirm",
    // Auth
    login: "Login", register: "Register", signUp: "Sign Up",
    email: "Email", password: "Password", fullName: "Full Name",
    referralCode: "Referral Code", referralCodeOptional: "Referral Code (Optional)",
    welcomeBack: "Welcome Back", loginSubtitle: "Login to your ClickEarn account",
    createAccount: "Create Account", registerSubtitle: "Join ClickEarn and start earning today",
    loginFailed: "Login Failed", invalidCredentials: "Invalid credentials",
    registrationFailed: "Registration Failed", couldNotCreate: "Could not create account",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    loggingIn: "Logging in...", creatingAccount: "Creating Account...",
    enterCode: "Enter code", emailPlaceholder: "name@example.com",
    // Home
    heroTitle: "Earn Money by\nClicking Ads!",
    heroSubtitle: "Get paid for viewing ads and completing simple tasks online.",
    joinNow: "Join Now & Start Earning",
    itsFree: "It's Free to Join!",
    secure: "Secure & Trusted", instant: "Instant Payouts", rating: "4.8 / 5 Rating",
    viewAdsGetPaid: "View Ads & Get Paid", viewAdsDesc: "Earn cash by clicking on ads daily.",
    completeTasks: "Complete Tasks", completeTasksDesc: "Boost your earning with easy online tasks",
    referralRewards: "Referral Rewards", referralDesc: "Invite friends and earn commissions.",
    yourDashboard: "Your Earnings Dashboard",
    currentBalance: "Current Balance", todayEarnings: "Today's Earnings", clicksToday: "Clicks Today",
    dailyGoalProgress: "Daily Goal Progress", keepClicking: "Keep clicking!",
    earningsOverview: "Earnings Overview", earnings: "Earnings", clicks: "Clicks",
    topOffers: "Top Offers from Our Partners",
    howItWorks: "How It Works", howItWorksSubtitle: "Start earning in 3 simple steps",
    step1Title: "Create Account", step1Desc: "Sign up for free in under 60 seconds. No credit card required.",
    step2Title: "Click & Complete", step2Desc: "View ads, complete surveys, and finish tasks to earn rewards.",
    step3Title: "Get Paid", step3Desc: "Withdraw your earnings instantly via PayPal, bank transfer, or gift cards.",
    whatMembersSay: "What Our Members Say",
    readyToStart: "Ready to Start Earning?",
    readySubtitle: "Join over 2.4 million members and start making money online today. It's completely free!",
    getStartedFree: "Get Started for Free",
    home: "Home", howItWorksNav: "How It Works", offersNav: "Offers", support: "Support",
    company: "Company", aboutUs: "About Us", careers: "Careers", press: "Press", blog: "Blog",
    helpCenter: "Help Center", contactUs: "Contact Us", terms: "Terms of Service", privacy: "Privacy Policy",
    viewAds: "View Ads", referralProgram: "Referral Program", partnerOffers: "Partner Offers",
    footerTagline: "The easiest way to earn money online by clicking ads and completing tasks.",
    footerRights: "© 2026 ClickEarn. All rights reserved.",
    footerMade: "Made with care for online earners worldwide.",
    surveyBonus: "Survey Bonus", surveyDesc: "Earn up to $5 per survey", completeSurvey: "Complete Survey",
    shoppingDeals: "Shopping Deals", shoppingDesc: "Cashback on popular retailers", startSaving: "Start Saving",
    watchVideos: "Watch Videos", watchDesc: "Get paid to watch videos", watchEarn: "Watch & Earn",
    members: "Members", earnedToday: "Earned Today", todayVsYest: "+12% vs yesterday",
    todayEarnedSub: "+$2.50 today",
    // Dashboard
    welcomeBackUser: "Welcome back", dashboardSubtitle: "Here is what's happening with your earnings today.",
    pendingBalance: "Pending Balance", totalEarned: "Total Earned", todaysClicks: "Today's Clicks",
    dailyGoal: "Daily Goal", progress: "Progress", quickActions: "Quick Actions",
    inviteFriends: "Invite Friends",
    // Wallet
    walletTitle: "Wallet", walletSubtitle: "Manage your funds and request withdrawals",
    withdrawFunds: "Withdraw Funds", requestWithdrawal: "Request Withdrawal",
    withdrawalDesc: "Minimum withdrawal amount is $5.00. Processing takes up to 48 hours.",
    amount: "Amount (USD)", paymentMethod: "Payment Method", selectMethod: "Select method",
    paypal: "PayPal", bankTransfer: "Bank Transfer", crypto: "Cryptocurrency (USDT)",
    available: "Available", processing: "Processing...", submitRequest: "Submit Request",
    withdrawalRequested: "Withdrawal Requested", withdrawalProcessing: "Your withdrawal is being processed.",
    withdrawalFailed: "Withdrawal Failed",
    availableBalance: "Available Balance", pending: "Pending",
    totalWithdrawn: "Total Withdrawn", transactionHistory: "Transaction History",
    recentActivity: "Recent activity on your account", noTransactions: "No transactions yet.",
    type: "Type", description: "Description", status: "Status", date: "Date",
    completed: "completed", pendingStatus: "pending", rejected: "rejected",
    // Tasks
    tasksTitle: "Tasks", tasksSubtitle: "Complete tasks to earn rewards",
    vipBonus: "VIP Bonus Active", completeTask: "Complete", taskCompleted: "Completed",
    taskCompletedMsg: "Task Completed!", youEarned: "You earned",
    taskFailed: "Task Failed", noTasks: "No tasks available right now.",
    daily: "Daily", special: "Special", general: "General",
    // Offers
    offersTitle: "Offers", offersSubtitle: "Browse partner offers and earn rewards",
    claimOffer: "Claim Offer", noOffers: "No offers available right now.",
    // Ads
    adsTitle: "Ads Wall", adsSubtitle: "Watch ads and earn rewards",
    watchAd: "Watch Ad", adClaimed: "Ad Claimed!", adEarned: "You earned from this ad.",
    adFailed: "Failed to claim ad reward", noAds: "No ads available right now.",
    // Surveys
    surveysTitle: "Surveys", surveysSubtitle: "Complete surveys to earn extra",
    // VIP
    vipTitle: "VIP Levels", vipSubtitle: "Upgrade your level to earn more",
    currentLevel: "Current Level", upgrade: "Upgrade", deposit: "Deposit",
    requiredDeposit: "Required Deposit", multiplier: "Earnings Multiplier",
    benefits: "Benefits",
    // Referral
    referralTitle: "Referral Program", referralSubtitle: "Invite friends and earn commissions",
    yourCode: "Your Referral Code", copyLink: "Copy Link", copied: "Copied!",
    referredUsers: "Referred Users", referralEarnings: "Referral Earnings",
    noReferrals: "No referrals yet. Share your code!",
    // Admin
    adminTitle: "Admin Panel", analytics: "Analytics", users: "Users", transactions: "Transactions",
    settings: "Settings", totalUsers: "Total Users", activeUsers: "Active Users",
    totalEarnings: "Total Earnings", totalWithdrawals: "Total Withdrawals",
    ban: "Ban", unban: "Unban", makeAdmin: "Make Admin",
    withdrawalsEnabled: "Withdrawals Enabled", adClickReward: "Ad Click Reward",
    referralRewardLabel: "Referral Reward", withdrawalMinimum: "Withdrawal Minimum",
    monetagId: "Monetag Publisher ID", cpxAppId: "CPX App ID", cpxSecret: "CPX Secret Key",
    saveSettings: "Save Settings", settingsSaved: "Settings Saved",
  },
  ar: {
    // Nav
    dashboard: "لوحة التحكم", tasks: "المهام", offers: "العروض", ads: "الإعلانات",
    surveys: "الاستبيانات", vip: "VIP", wallet: "المحفظة", referral: "الإحالة",
    adminPanel: "لوحة الإدارة", logout: "تسجيل الخروج", balance: "الرصيد",
    // Common
    loading: "جاري التحميل...", error: "خطأ", submit: "إرسال", cancel: "إلغاء",
    save: "حفظ", edit: "تعديل", delete: "حذف", confirm: "تأكيد",
    // Auth
    login: "تسجيل الدخول", register: "إنشاء حساب", signUp: "سجّل الآن",
    email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل",
    referralCode: "كود الإحالة", referralCodeOptional: "كود الإحالة (اختياري)",
    welcomeBack: "مرحباً بعودتك", loginSubtitle: "سجّل دخولك إلى حسابك في ClickEarn",
    createAccount: "إنشاء حساب", registerSubtitle: "انضم إلى ClickEarn وابدأ الكسب اليوم",
    loginFailed: "فشل تسجيل الدخول", invalidCredentials: "بيانات غير صحيحة",
    registrationFailed: "فشل إنشاء الحساب", couldNotCreate: "تعذّر إنشاء الحساب",
    noAccount: "ليس لديك حساب؟", haveAccount: "لديك حساب بالفعل؟",
    loggingIn: "جاري تسجيل الدخول...", creatingAccount: "جاري إنشاء الحساب...",
    enterCode: "أدخل الكود", emailPlaceholder: "name@example.com",
    // Home
    heroTitle: "اكسب المال\nعبر الإعلانات!",
    heroSubtitle: "احصل على أموال مقابل مشاهدة الإعلانات وإتمام مهام بسيطة.",
    joinNow: "انضم الآن وابدأ الكسب",
    itsFree: "الاشتراك مجاني!",
    secure: "آمن وموثوق", instant: "دفع فوري", rating: "4.8 / 5 تقييم",
    viewAdsGetPaid: "شاهد إعلانات واحصل على أموال", viewAdsDesc: "اكسب نقداً بالنقر على الإعلانات يومياً.",
    completeTasks: "أنجز المهام", completeTasksDesc: "زِد أرباحك بإنجاز مهام سهلة عبر الإنترنت",
    referralRewards: "مكافآت الإحالة", referralDesc: "ادعُ أصدقاءك واكسب عمولات.",
    yourDashboard: "لوحة أرباحك",
    currentBalance: "الرصيد الحالي", todayEarnings: "أرباح اليوم", clicksToday: "نقرات اليوم",
    dailyGoalProgress: "تقدّم الهدف اليومي", keepClicking: "استمر بالنقر!",
    earningsOverview: "نظرة عامة على الأرباح", earnings: "الأرباح", clicks: "النقرات",
    topOffers: "أفضل العروض من شركائنا",
    howItWorks: "كيف يعمل", howItWorksSubtitle: "ابدأ الكسب في 3 خطوات بسيطة",
    step1Title: "أنشئ حساباً", step1Desc: "سجّل مجاناً في أقل من 60 ثانية. لا يلزم بطاقة ائتمانية.",
    step2Title: "انقر وأنجز", step2Desc: "شاهد الإعلانات وأجرِ الاستبيانات وأنجز المهام لكسب المكافآت.",
    step3Title: "احصل على أموالك", step3Desc: "اسحب أرباحك فوراً عبر PayPal أو البنك أو بطاقات الهدايا.",
    whatMembersSay: "ماذا يقول أعضاؤنا",
    readyToStart: "هل أنت مستعد للبدء؟",
    readySubtitle: "انضم إلى أكثر من 2.4 مليون عضو وابدأ الكسب عبر الإنترنت اليوم. مجاناً تماماً!",
    getStartedFree: "ابدأ مجاناً",
    home: "الرئيسية", howItWorksNav: "كيف يعمل", offersNav: "العروض", support: "الدعم",
    company: "الشركة", aboutUs: "من نحن", careers: "وظائف", press: "صحافة", blog: "مدوّنة",
    helpCenter: "مركز المساعدة", contactUs: "اتصل بنا", terms: "شروط الخدمة", privacy: "سياسة الخصوصية",
    viewAds: "شاهد الإعلانات", referralProgram: "برنامج الإحالة", partnerOffers: "عروض الشركاء",
    footerTagline: "أسهل طريقة لكسب المال عبر الإنترنت بالنقر على الإعلانات وإنجاز المهام.",
    footerRights: "© 2026 ClickEarn. جميع الحقوق محفوظة.",
    footerMade: "صُنع بعناية لكاسبي المال عبر الإنترنت حول العالم.",
    surveyBonus: "مكافأة الاستبيان", surveyDesc: "اكسب حتى 5$ لكل استبيان", completeSurvey: "أجرِ الاستبيان",
    shoppingDeals: "عروض تسوق", shoppingDesc: "استرداد نقدي من المتاجر الشهيرة", startSaving: "ابدأ التوفير",
    watchVideos: "شاهد مقاطع", watchDesc: "احصل على أموال مقابل مشاهدة الفيديوهات", watchEarn: "شاهد واكسب",
    members: "عضو", earnedToday: "أُكسب اليوم", todayVsYest: "+12% مقارنة بالأمس",
    todayEarnedSub: "+2.50$ اليوم",
    // Dashboard
    welcomeBackUser: "مرحباً بك", dashboardSubtitle: "إليك ما يحدث مع أرباحك اليوم.",
    pendingBalance: "الرصيد المعلّق", totalEarned: "إجمالي الأرباح", todaysClicks: "نقرات اليوم",
    dailyGoal: "الهدف اليومي", progress: "التقدم", quickActions: "إجراءات سريعة",
    inviteFriends: "ادعُ أصدقاء",
    // Wallet
    walletTitle: "المحفظة", walletSubtitle: "أدِر أموالك واطلب السحب",
    withdrawFunds: "سحب الأموال", requestWithdrawal: "طلب سحب",
    withdrawalDesc: "الحد الأدنى للسحب 5.00$. المعالجة تستغرق حتى 48 ساعة.",
    amount: "المبلغ (دولار)", paymentMethod: "طريقة الدفع", selectMethod: "اختر الطريقة",
    paypal: "PayPal", bankTransfer: "تحويل بنكي", crypto: "عملة مشفرة (USDT)",
    available: "المتاح", processing: "جاري المعالجة...", submitRequest: "إرسال الطلب",
    withdrawalRequested: "تم طلب السحب", withdrawalProcessing: "جاري معالجة طلب السحب.",
    withdrawalFailed: "فشل السحب",
    availableBalance: "الرصيد المتاح", pending: "معلّق",
    totalWithdrawn: "إجمالي المسحوب", transactionHistory: "سجل المعاملات",
    recentActivity: "آخر نشاطات في حسابك", noTransactions: "لا توجد معاملات بعد.",
    type: "النوع", description: "الوصف", status: "الحالة", date: "التاريخ",
    completed: "مكتمل", pendingStatus: "معلّق", rejected: "مرفوض",
    // Tasks
    tasksTitle: "المهام", tasksSubtitle: "أنجز المهام لكسب المكافآت",
    vipBonus: "مضاعفة VIP نشطة", completeTask: "إنجاز", taskCompleted: "مكتملة",
    taskCompletedMsg: "تم إنجاز المهمة!", youEarned: "ربحت",
    taskFailed: "فشل إنجاز المهمة", noTasks: "لا توجد مهام متاحة الآن.",
    daily: "يومية", special: "مميزة", general: "عامة",
    // Offers
    offersTitle: "العروض", offersSubtitle: "تصفّح عروض الشركاء واكسب مكافآت",
    claimOffer: "احصل على العرض", noOffers: "لا توجد عروض متاحة الآن.",
    // Ads
    adsTitle: "جدار الإعلانات", adsSubtitle: "شاهد الإعلانات واكسب مكافآت",
    watchAd: "شاهد الإعلان", adClaimed: "تم المطالبة بالإعلان!", adEarned: "ربحت من هذا الإعلان.",
    adFailed: "فشل المطالبة بمكافأة الإعلان", noAds: "لا توجد إعلانات متاحة الآن.",
    // Surveys
    surveysTitle: "الاستبيانات", surveysSubtitle: "أكمل الاستبيانات لكسب المزيد",
    // VIP
    vipTitle: "مستويات VIP", vipSubtitle: "رقّي مستواك لكسب أكثر",
    currentLevel: "مستواك الحالي", upgrade: "ترقية", deposit: "إيداع",
    requiredDeposit: "الإيداع المطلوب", multiplier: "مضاعف الأرباح",
    benefits: "المزايا",
    // Referral
    referralTitle: "برنامج الإحالة", referralSubtitle: "ادعُ أصدقاءك واكسب عمولات",
    yourCode: "كود الإحالة الخاص بك", copyLink: "نسخ الرابط", copied: "تم النسخ!",
    referredUsers: "المستخدمون المُحالون", referralEarnings: "أرباح الإحالة",
    noReferrals: "لا إحالات بعد. شارك كودك!",
    // Admin
    adminTitle: "لوحة الإدارة", analytics: "التحليلات", users: "المستخدمون", transactions: "المعاملات",
    settings: "الإعدادات", totalUsers: "إجمالي المستخدمين", activeUsers: "المستخدمون النشطون",
    totalEarnings: "إجمالي الأرباح", totalWithdrawals: "إجمالي السحوبات",
    ban: "حظر", unban: "رفع الحظر", makeAdmin: "تعيين مديراً",
    withdrawalsEnabled: "تفعيل السحب", adClickReward: "مكافأة نقرة الإعلان",
    referralRewardLabel: "مكافأة الإحالة", withdrawalMinimum: "الحد الأدنى للسحب",
    monetagId: "معرف Monetag Publisher", cpxAppId: "معرف CPX App", cpxSecret: "مفتاح CPX السري",
    saveSettings: "حفظ الإعدادات", settingsSaved: "تم حفظ الإعدادات",
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("clickearn_lang") as Lang) ?? "en";
  });

  const isRtl = lang === "ar";

  const setLang = (l: Lang) => {
    localStorage.setItem("clickearn_lang", l);
    setLangState(l);
  };

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
