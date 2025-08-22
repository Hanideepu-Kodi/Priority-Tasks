// src/app/components/AddTaskForm.jsx
/*"use client";
import { useState } from "react";
import { PlusIcon } from "./Icons";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description, dueDate, priority });
      setTitle(""); setDescription(""); setDueDate(""); setPriority("Medium");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-2">Add a New Task</h2>
        <input type="text" placeholder="Task Title" value={title} onChange={(e)=>setTitle(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        <textarea placeholder="Description (optional)" value={description} onChange={(e)=>setDescription(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <select value={priority} onChange={(e)=>setPriority(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
          <PlusIcon className="w-5 h-5 mr-2" />
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
*/

// src/app/components/AddTaskForm.jsx
"use client";
import { useState } from "react";
import { PlusIcon } from "./Icons";
import { addTask } from "../lib/api";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description, dueDate, priority });
      setTitle(""); 
      setDescription(""); 
      setDueDate(""); 
      setPriority("Medium");
    } catch (error) {
      // 👇 show popup with error message from backend
      alert(error.message || "Something went wrong while adding the task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-2">Add a New Task</h2>
        
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={dueDate}
            onChange={(e)=>setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} 
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          
          <select
            value={priority}
            onChange={(e)=>setPriority(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
