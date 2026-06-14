import { useLang } from "@/context/LanguageContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-blue-700 text-blue-100 hover:text-white border border-blue-600 ${className}`}
      title="Toggle Language"
    >
      {lang === "en" ? "عربي" : "EN"}
    </button>
  );
}
