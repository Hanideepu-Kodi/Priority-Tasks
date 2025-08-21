// src/app/components/TaskList.jsx
"use client";

import TaskItem from "./TaskItem";
import { SortAscIcon, SortDescIcon } from "./Icons";

export default function TaskList({
  tasks,                 // already filtered/sorted list from parent, or raw list if you prefer
  onEdit,
  onDelete,
  onToggleComplete,
  filterPriority,
  setFilterPriority,
  sortOrder,             // "asc" | "desc"
  setSortOrder,
}) {
  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Your Tasks
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="priority-filter" className="text-sm font-medium text-gray-400">
              Filter by:
            </label>
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white hover:bg-white/10 transition-colors text-sm"
          >
            {sortOrder === "asc" ? <SortAscIcon /> : <SortDescIcon />}
            <span>Due Date</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-gray-900/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-300">No tasks found!</h3>
            <p className="text-gray-500 mt-1">Try changing your filters or adding a new task.</p>
          </div>
        )}
      </div>
    </div>
  );
}
