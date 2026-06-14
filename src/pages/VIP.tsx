import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { Crown, Check } from "lucide-react";

export default function VIP() {
  const { token, user, refreshUser } = useAuth();
  const { t } = useLang();
  const [levels, setLevels] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Binance");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/vip/levels").then(r => r.json()).then(setLevels).catch(() => {});
  }, []);

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/vip/deposit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(t("success")); setAmount(""); refreshUser();
    } catch (err: any) { setMsg(err.message); }
    finally { setLoading(false); }
  }

  const levelColors = ["gray", "gray", "yellow", "blue", "purple"];
  const levelBg: Record<number, string> = {
    0: "border-gray-200 dark:border-gray-700",
    1: "border-gray-400 dark:border-gray-500",
    2: "border-yellow-400 dark:border-yellow-600",
    3: "border-blue-400 dark:border-blue-600",
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("vipProgram")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("currentLevel")}: <span className="font-semibold text-blue-600">VIP {user?.vipLevel}</span></p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {levels.map(lvl => (
          <div key={lvl.level} className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 ${levelBg[lvl.level]} ${user?.vipLevel === lvl.level ? "ring-2 ring-blue-500" : ""}`}>
            <Crown size={22} className={lvl.level === 0 ? "text-gray-400" : lvl.level === 1 ? "text-gray-500" : lvl.level === 2 ? "text-yellow-500" : "text-blue-500"} />
            <h3 className="font-bold text-gray-900 dark:text-white mt-2">{lvl.name}</h3>
            <div className="text-2xl font-bold text-blue-600 mt-1">{lvl.earningsMultiplier}x</div>
            <div className="text-xs text-gray-500 mb-3">Earnings Multiplier</div>
            <ul className="space-y-1">
              {lvl.benefits.map((b: string) => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            {lvl.level > 0 && <div className="text-xs text-gray-400 mt-3">Min deposit: ${lvl.requiredDeposit}</div>}
          </div>
        ))}
      </div>

      <div className="max-w-md bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t("upgradeVip")}</h2>
        {msg && <p className={`mb-3 text-sm ${msg === t("success") ? "text-green-500" : "text-red-500"}`}>{msg}</p>}
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("depositAmount")} (USD)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="50" step="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("paymentMethod")}</label>
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none">
              <option>Binance</option><option>Bank Transfer</option><option>PayPal</option><option>Wise</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
            {loading ? t("loading") : t("upgrade")}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
