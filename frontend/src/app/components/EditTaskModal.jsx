"use client";
import { useEffect, useState } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [edited, setEdited] = useState(task);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setEdited(task); }, [task]);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((p) => ({ ...p, [name]: value }));
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center
                  transition-opacity duration-300 ease-in ${mounted ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`m-4 w-full max-w-lg transition-[opacity,transform] duration-300 ease-in
                    ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 rounded-2xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/20 p-8
                        transition-all duration-300 ease-out
                        hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-white">Edit Task</h2>

          <div className="space-y-4">
            <input
              type="text" name="title" value={edited.title} onChange={handleChange}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="description" value={edited.description} onChange={handleChange}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date" name="dueDate" value={edited.dueDate || ""} onChange={handleChange}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="priority" value={edited.priority} onChange={handleChange}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600">Cancel</button>
            <button onClick={() => onSave(edited)} className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
