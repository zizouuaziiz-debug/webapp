import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

export default function Admin() {
  const { token, user } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetch("/api/admin/analytics", { headers: h }).then(r => r.json()).then(setAnalytics).catch(() => {});
    fetch("/api/admin/users", { headers: h }).then(r => r.json()).then(setUsers).catch(() => {});
    fetch("/api/admin/transactions", { headers: h }).then(r => r.json()).then(setTransactions).catch(() => {});
    fetch("/api/admin/settings", { headers: h }).then(r => r.json()).then(setSettings).catch(() => {});
  }, [token]);

  async function patchUser(userId: number, updates: any) {
    await fetch(`/api/admin/users/${userId}`, { method: "PATCH", headers: h, body: JSON.stringify(updates) });
    const d = await fetch("/api/admin/users", { headers: h }).then(r => r.json());
    setUsers(d);
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/settings", { method: "PATCH", headers: h, body: JSON.stringify(settings) });
  }

  if (!user?.isAdmin) return <DashboardLayout><p className="text-red-500">Access denied</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("admin")}</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["analytics", "users", "transactions", "settings"].map(tab2 => (
          <button key={tab2} onClick={() => setTab(tab2)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === tab2 ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50"}`}>
            {t(tab2 as any)}
          </button>
        ))}
      </div>

      {tab === "analytics" && analytics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: t("totalUsers"), value: analytics.totalUsers },
            { label: t("activeUsers"), value: analytics.activeUsers },
            { label: t("totalClicks"), value: analytics.totalClicks },
            { label: t("totalEarnings"), value: `$${analytics.totalEarnings?.toFixed(2)}` },
            { label: t("totalWithdrawals"), value: `$${analytics.totalWithdrawals?.toFixed(2)}` },
            { label: "Revenue (month)", value: `$${analytics.revenueMonth?.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-700">
              <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Balance</th><th className="px-4 py-3">VIP</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">${u.balance?.toFixed(2)}</td>
                  <td className="px-4 py-3">VIP {u.vipLevel}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.isBanned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{u.isBanned ? "Banned" : "Active"}</span></td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => patchUser(u.id, { isBanned: !u.isBanned })} className={`px-2 py-1 rounded text-xs font-medium ${u.isBanned ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {u.isBanned ? t("unban") : t("ban")}
                    </button>
                    {!u.isAdmin && <button onClick={() => patchUser(u.id, { isAdmin: true })} className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600">{t("makeAdmin")}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transactions" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-700">
              <th className="px-4 py-3">User</th><th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th>
            </tr></thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{tx.userName}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.type}</td>
                  <td className="px-4 py-3 font-medium text-green-600">${tx.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === "completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{tx.status}</span></td>
                  <td className="px-4 py-3 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "settings" && settings && (
        <form onSubmit={saveSettings} className="max-w-lg bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
          {[
            { key: "monetagPublisherId", label: "Monetag Publisher ID" },
            { key: "cpxAppId", label: "CPX Research App ID" },
            { key: "cpxSecretKey", label: "CPX Research Secret Key" },
            { key: "referralReward", label: "Referral Reward ($)", type: "number" },
            { key: "adClickReward", label: "Ad Click Reward ($)", type: "number" },
            { key: "withdrawalMinimum", label: "Withdrawal Minimum ($)", type: "number" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type ?? "text"} value={settings[key] ?? ""} onChange={e => setSettings({ ...settings, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" step="0.01" />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wd" checked={settings.withdrawalsEnabled} onChange={e => setSettings({ ...settings, withdrawalsEnabled: e.target.checked })} />
            <label htmlFor="wd" className="text-sm text-gray-700 dark:text-gray-300">Enable Withdrawals</label>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{t("saveSettings")}</button>
        </form>
      )}
    </DashboardLayout>
  );
}
