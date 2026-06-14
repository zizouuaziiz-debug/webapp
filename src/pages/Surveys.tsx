import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ClipboardList, ExternalLink, Clock } from "lucide-react";

export default function Surveys() {
  const { token } = useAuth();
  const { t } = useLang();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/surveys", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setSurveys(d); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("availableSurveys")}</h1>
      {loading ? <p className="text-gray-500">{t("loading")}</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {surveys.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-400"><ClipboardList size={48} className="mx-auto mb-3 opacity-50" /><p>{t("noSurveys")}</p></div>
          ) : surveys.map(s => (
            <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Clock size={14} /><span>{s.lengthMinutes} {t("minutes")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold text-lg">${s.reward.toFixed(2)}</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  {t("startSurvey")} <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
