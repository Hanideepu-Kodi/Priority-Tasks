// src/app/components/TaskItem.jsx
"use client";
import { useEffect, useState } from "react";
import { EditIcon, DeleteIcon, CheckIcon } from "./Icons";

const priorityStyles = {
  High: "from-red-500 to-orange-500",
  Medium: "from-yellow-500 to-amber-500",
  Low: "from-green-500 to-emerald-500",
};
const priorityBorder = {
  High: "border-red-500/50",
  Medium: "border-yellow-500/50",
  Low: "border-green-500/50",
};

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);

  useEffect(() => { setIsCompleted(task.completed); }, [task.completed]);

  const handleCompleteClick = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => { onToggleComplete(task.id); }, 300);
      }, 500);
    } else {
      onToggleComplete(task.id);
    }
  };

  return (
    <div className={`
      bg-gray-800/70 p-4 rounded-xl border-l-4 ${priorityBorder[task.priority] || ""}
      flex items-start gap-4 transition-all duration-300 ease-out hover:bg-gray-700/80 hover:shadow-2xl hover:-translate-y-1 group
      ${isLeaving ? "opacity-0 scale-90 -translate-x-4" : "opacity-100 scale-100 translate-x-0"}
    `}>
      <div className="flex-shrink-0 pt-1">
        <button onClick={handleCompleteClick}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${isCompleted ? "bg-green-500 border-green-500 scale-110" : "border-gray-500 hover:border-indigo-400"}`}
          aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}>
          {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-semibold text-lg ${isCompleted ? "line-through text-gray-500" : "text-white"}`}>
              {task.title}
            </h3>
            <p className={`text-sm mt-1 ${isCompleted ? "line-through text-gray-600" : "text-gray-400"}`}>
              {task.description}
            </p>
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${priorityStyles[task.priority] || ""}`}>
            {task.priority}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—"}
          </p>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-blue-400 rounded-full hover:bg-blue-500/10" aria-label={`Edit ${task.title}`}>
              <EditIcon />
            </button>
            <button onClick={() => onDelete(task)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10" aria-label={`Delete ${task.title}`}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
