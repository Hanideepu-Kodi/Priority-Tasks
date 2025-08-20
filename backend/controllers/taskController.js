const pool = require('../db');

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)",
      [title, description, priority, due_date]
    );
    res.json({ id: result.insertId, title, description, priority, due_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Tasks (with filtering + sorting)
exports.getTasks = async (req, res) => {
  try {
    let { priority, completed, sort } = req.query;
    let sql = "SELECT * FROM tasks WHERE 1=1";
    let params = [];

    if (priority) {
      sql += " AND priority = ?";
      params.push(priority);
    }
    if (completed) {
      sql += " AND completed = ?";
      params.push(completed === 'true');
    }
    sql += " ORDER BY " + (sort === 'asc' ? 'due_date ASC' : 'due_date DESC');

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Task (details only)
exports.updateTaskDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date } = req.body;
    await pool.query(
      "UPDATE tasks SET title=?, description=?, priority=?, due_date=? WHERE id=?",
      [title, description, priority, due_date, id]
    );
    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Task (completed only)
exports.updateTaskCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query(
      "UPDATE tasks SET completed=? WHERE id=?",
      [completed, id]
    );
    res.json({ message: "Task completion updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id=?", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
