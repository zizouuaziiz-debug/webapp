import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { CheckCircle, Circle, Star } from "lucide-react";

export default function Tasks() {
  const { token } = useAuth();
  const { t } = useLang();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<number | null>(null);

  async function load() {
    if (!token) return;
    const data = await fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    setTasks(data); setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function complete(taskId: number) {
    if (!token) return;
    setCompleting(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) load();
    } finally { setCompleting(null); }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("availableTasks")}</h1>
      {loading ? <p className="text-gray-500">{t("loading")}</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.length === 0 ? (
            <p className="text-gray-400 col-span-2">{t("noTasks")}</p>
          ) : tasks.map(task => (
            <div key={task.id} className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 transition-colors ${task.isCompleted ? "border-green-200 dark:border-green-800" : "border-transparent hover:border-blue-200 dark:hover:border-blue-800"}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                </div>
                {task.isCompleted ? <CheckCircle className="text-green-500 flex-shrink-0" size={22} /> : <Circle className="text-gray-300 flex-shrink-0" size={22} />}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={15} fill="currentColor" />
                  <span className="text-sm font-semibold">${task.reward.toFixed(4)}</span>
                </div>
                {!task.isCompleted && (
                  <button onClick={() => complete(task.id)} disabled={completing === task.id}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {completing === task.id ? t("loading") : t("completeTask")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
