"use client";
import { useEffect, useState } from "react";

export default function DeleteConfirmationModal({ task, onClose, onConfirm }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center
                  transition-opacity duration-300 ease-in ${mounted ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`m-4 w-full max-w-md transition-[opacity,transform] duration-300 ease-in
                    ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20 p-8
                        transition-all duration-300 ease-out
                        hover:scale-105">
          <h2 className="text-2xl font-bold mb-4 text-white">Confirm Deletion?</h2>
          <p className="text-gray-400 mb-6">Delete the task “{task.title}”? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600">Cancel</button>
            <button onClick={onConfirm} className="px-6 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
