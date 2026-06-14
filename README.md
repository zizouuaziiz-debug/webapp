# ClickEarn — Frontend (Vite + React)

منصة ClickEarn للكسب عبر الإعلانات والمهام والإحالات.  
هذا المجلد يحتوي على الواجهة الأمامية فقط، جاهزة للرفع على **Vercel**.

---

## هيكل المشروع

```
clickearn-vercel/
├── src/
│   ├── api-client/          ← كود التواصل مع الـ API (مُضمّن)
│   │   ├── config.ts        ← إعداد رابط الـ API
│   │   ├── custom-fetch.ts  ← fetch مخصص مع التوكن
│   │   ├── api.ts           ← React Query hooks
│   │   ├── api.schemas.ts   ← أنواع TypeScript
│   │   └── index.ts         ← barrel export
│   ├── components/ui/       ← مكونات UI (Radix + Tailwind)
│   ├── context/             ← AuthContext (حالة المستخدم)
│   ├── hooks/               ← custom hooks
│   ├── lib/                 ← مساعدات عامة
│   ├── pages/               ← صفحات التطبيق
│   ├── App.tsx              ← الراوتر الرئيسي
│   ├── main.tsx             ← نقطة البداية
│   └── index.css            ← Tailwind CSS
├── index.html
├── vite.config.ts
├── vercel.json              ← إعداد Vercel (SPA routing)
├── tsconfig.json
└── package.json
```

---

## الصفحات الموجودة

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| Home | `/` | الصفحة الرئيسية |
| Login | `/login` | تسجيل الدخول |
| Register | `/register` | إنشاء حساب |
| Dashboard | `/dashboard` | لوحة التحكم |
| Wallet | `/wallet` | المحفظة والمعاملات |
| Tasks | `/tasks` | المهام والكسب |
| Offers | `/offers` | العروض |
| Ads Wall | `/ads` | جدار الإعلانات |
| Surveys | `/surveys` | الاستبيانات |
| VIP | `/vip` | مستويات VIP |
| Referral | `/referral` | نظام الإحالة |
| Admin | `/admin` | لوحة الإدارة |

---

## خطوات الرفع على Vercel

### الخطوة 1 — رفع قاعدة البيانات على Supabase

1. افتح [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
2. من القائمة الجانبية: **SQL Editor**
3. الصق محتوى ملف `supabase_schema.sql` (المرفق معك)
4. اضغط **Run** — سيتم إنشاء كل الجداول تلقائياً
5. احفظ الـ **Connection String** من:  
   `Settings → Database → Connection string → URI`

---

### الخطوة 2 — نشر الـ Backend (API Server)

> الـ backend يحتاج خادم Node.js — استخدم **Railway** أو **Render** أو **Fly.io**

#### على Railway:
1. ادفع مجلد `api-server` إلى GitHub repo خاص
2. افتح [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. أضف متغيرات البيئة:
   ```
   DATABASE_URL=<connection string من Supabase>
   SESSION_SECRET=<كلمة سرية قوية عشوائية>
   NODE_ENV=production
   PORT=3000
   ```
4. بعد النشر، احفظ رابط الـ API مثل: `https://your-api.up.railway.app`

---

### الخطوة 3 — رفع الـ Frontend على Vercel

1. افضّ ضغط هذا الـ ZIP وادفع المحتوى إلى GitHub repo
2. افتح [vercel.com](https://vercel.com) → New Project → Import Git Repository
3. اختر الـ repo الذي رفعت فيه المشروع
4. في صفحة الإعدادات:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. أضف متغير البيئة:
   ```
   VITE_API_URL=https://your-api.up.railway.app
   ```
6. اضغط **Deploy** ✅

---

## التشغيل محلياً (للتطوير)

```bash
# 1. تثبيت الحزم
npm install

# 2. إنشاء ملف .env.local
echo "VITE_API_URL=http://localhost:5000" > .env.local

# 3. تشغيل الواجهة
npm run dev
```

> تأكد أن الـ API server يعمل على المنفذ 5000 قبل التشغيل.

---

## متغيرات البيئة

| المتغير | مطلوب؟ | الوصف |
|---------|--------|-------|
| `VITE_API_URL` | ✅ نعم (في production) | رابط الـ API backend مثل `https://api.example.com` |

> في حالة التطوير المحلي، إذا لم تُحدد `VITE_API_URL`، سيستخدم التطبيق مسارات نسبية (`/api/...`) تلقائياً.

---

## ملاحظات مهمة

- **المصادقة**: تُخزَّن بيانات المستخدم والتوكن في `localStorage` تلقائياً
- **Admin Panel**: متاح على `/admin` للمستخدمين الذين لديهم `isAdmin: true` في قاعدة البيانات
- **CORS**: تأكد أن الـ backend يسمح بطلبات من نطاق Vercel الخاص بك

---

## إنشاء أول مدير (Admin)

بعد إنشاء حساب عبر التطبيق، شغّل هذا الـ SQL في Supabase:

```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

