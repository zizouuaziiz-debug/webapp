import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle(credential: string) {
    setError(""); setLoading(true);
    try {
      await loginWithGoogle(credential);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">ClickEarn</Link>
        <div className="flex items-center gap-2"><LanguageToggle /><ThemeToggle /></div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t("welcomeBack")}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t("signInAccount")}</p>

          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}

          <GoogleButton onSuccess={handleGoogle} disabled={loading} />

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">{t("orContinueWith")}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("emailAddress")}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("password")}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60">
              {loading ? t("loading") : t("signIn")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("noAccount")}{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">{t("createOne")}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
