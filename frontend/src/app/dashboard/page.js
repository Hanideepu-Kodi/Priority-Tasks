// src/app/dashboard/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { tasksApi } from "../lib/api";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // asc|desc
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  async function load() {
    setLoading(true); setErr("");
    try {
      const list = await tasksApi.list({
        completed: false,
        sort: sortOrder,
        priority: filterPriority === "All" ? undefined : filterPriority,
      });
      setTasks(list);
    } catch (e) {
      setErr(e?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filterPriority, sortOrder]);

  async function handleAdd(fields) {
    const created = await tasksApi.create(fields);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleSave(edited) {
    const updated = await tasksApi.updateDetails(edited.id, edited);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setTaskToEdit(null);
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) return;
    await tasksApi.remove(taskToDelete.id);
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);
  }

  async function handleToggleComplete(id) {
    await tasksApi.markCompleted(id);
    setTasks((prev) => prev.filter((t) => t.id !== id)); // remove from "open" list
  }

  const filtered = useMemo(() => tasks, [tasks]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {err && <div className="mb-4 text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded">{err}</div>}
        <AddTaskForm onAdd={handleAdd} />
        {loading ? (
          <div className="text-gray-400">Loading tasks…</div>
        ) : (
          <TaskList
            tasks={filtered}
            onEdit={setTaskToEdit}
            onDelete={setTaskToDelete}
            onToggleComplete={handleToggleComplete}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        )}
      </main>


      {taskToEdit && (
        <EditTaskModal task={taskToEdit} onClose={() => setTaskToEdit(null)} onSave={handleSave} />
      )}
      {taskToDelete && (
        <DeleteConfirmationModal task={taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleConfirmDelete} />
      )}
    </>
  );
}
