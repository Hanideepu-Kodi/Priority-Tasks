// src/app/completed/page.js
"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { CheckIcon } from "../components/Icons";
import { tasksApi } from "../lib/api";

export default function CompletedPage() {
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await tasksApi.list({ completed: true, sort: "desc" });
        setTasks(data);
      } catch (e) {
        setErr(e?.message || "Failed to load completed tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {err && <div className="mb-4 text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded">{err}</div>}

        <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Completed Tasks</h2>
              <p className="text-gray-400">Great job on finishing these!</p>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-900/50 p-4 rounded-lg flex justify-between items-center border border-transparent hover:border-green-500/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-500 line-through">{task.title}</h3>
                    <p className="text-xs text-gray-600">
                      Completed on: {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Done</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300">No completed tasks yet.</h3>
              <p className="text-gray-500 mt-1">Get to work and check some off your list!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
