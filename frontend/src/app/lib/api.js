// src/app/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

async function j(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const isEmpty =
    res.status === 204 ||
    res.headers.get("content-length") === "0" ||
    (res.headers.get("content-type") || "").indexOf("application/json") === -1;

  if (!isEmpty) {
    try { data = await res.json(); } catch {}
  }

  if (!res.ok) {
    const message = data?.detail || data?.message || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

const toUi = (row) => ({
  id: String(row.id),
  title: row.title,
  description: row.description || "",
  dueDate: row.due_date || "",
  priority: row.priority ? (row.priority[0].toUpperCase() + row.priority.slice(1).toLowerCase()) : "Medium",
  completed: !!row.completed,
  completedDate: row.completed_date || null,
});

const toApiDetails = ({ title, description, priority, dueDate }) => ({
  title,
  description,
  priority: (priority || "").toLowerCase(),
  due_date: dueDate || null,
});

export const tasksApi = {
  list: async (opts = {}) => {
    const data = await j("GET", `/tasks${qs({
      priority: opts.priority ? String(opts.priority).toLowerCase() : undefined,
      completed: opts.completed,
      sort: opts.sort || "desc",
    })}`);
    return Array.isArray(data) ? data.map(toUi) : [];
  },
  create: async (payload) => {
    const data = await j("POST", "/tasks", toApiDetails(payload));
    return toUi(data);
  },
  updateDetails: async (id, payload) => {
    const data = await j("PUT", `/tasks/${id}`, toApiDetails(payload));
    return toUi(data);
  },
  markCompleted: async (id) => {
    const data = await j("PATCH", `/tasks/${id}/completed`);
    return toUi(data);
  },
  remove: (id) => j("DELETE", `/tasks/${id}`), // 204 → null
};

export { j, BASE };

export async function addTask(task) {
  try {
    const res = await fetch("http://127.0.0.1:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Something went wrong");
    }

    return await res.json();
  } catch (error) {
    throw error; // pass the error up to frontend
  }
}
