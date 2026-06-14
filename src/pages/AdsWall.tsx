import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { MonitorPlay, CheckCircle } from "lucide-react";

export default function AdsWall() {
  const { token } = useAuth();
  const { t } = useLang();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  async function load() {
    if (!token) return;
    const data = await fetch("/api/ads", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    setAds(data); setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function claim(adId: number, adUrl: string) {
    if (!token) return;
    window.open(adUrl, "_blank");
    setClaiming(adId);
    try {
      await fetch(`/api/ads/${adId}/claim`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      load();
    } finally { setClaiming(null); }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("watchAds")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Click the ad to visit, then claim your reward.</p>
      {loading ? <p className="text-gray-500">{t("loading")}</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <MonitorPlay size={48} className="mx-auto mb-3 opacity-50" />
              <p>{t("noAds")}</p>
            </div>
          ) : ads.map(ad => (
            <div key={ad.id} className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm ${ad.isClaimed ? "opacity-70" : "hover:shadow-md"} transition-shadow`}>
              {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-36 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{ad.title}</h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-bold">${ad.reward.toFixed(4)}</span>
                  {ad.isClaimed ? (
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium"><CheckCircle size={16} /> {t("adClaimed")}</div>
                  ) : (
                    <button onClick={() => claim(ad.id, ad.adUrl)} disabled={claiming === ad.id}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                      {claiming === ad.id ? t("loading") : t("claimReward")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
