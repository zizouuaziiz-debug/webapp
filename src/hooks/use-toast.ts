import { useState } from "react";
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" }>>([]);
  function toast({ title, description }: { title: string; description?: string }) {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: title + (description ? ": " + description : ""), type: "success" }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }
  return { toast, toasts };
}
