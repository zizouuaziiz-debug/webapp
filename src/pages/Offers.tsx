import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ExternalLink, Gift } from "lucide-react";

export default function Offers() {
  const { token } = useAuth();
  const { t } = useLang();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/offers", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setOffers(d); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("featuredOffers")}</h1>
      {loading ? <p className="text-gray-500">{t("loading")}</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <Gift size={48} className="mx-auto mb-3 opacity-50" />
              <p>{t("noOffers")}</p>
            </div>
          ) : offers.map(offer => (
            <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {offer.imageUrl && <img src={offer.imageUrl} alt={offer.title} className="w-full h-36 object-cover" />}
              <div className="p-4">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{offer.category}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-2 mb-1">{offer.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">${offer.reward.toFixed(2)}</span>
                  <a href={offer.ctaUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    {offer.ctaLabel} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
