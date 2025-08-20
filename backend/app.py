from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
import mysql.connector
import os

# -------------------------
# Database connection
# -------------------------
def get_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",                 # change if different
        password="yourpassword",     # change if different
        database="prioritytasks"
    )
    return conn

# -------------------------
# FastAPI App
# -------------------------
app = FastAPI(title="Priority Tasks API")

# -------------------------
# Models
# -------------------------
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdateDetails(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None

class TaskUpdateCompleted(BaseModel):
    completed: bool

class Task(TaskBase):
    id: int
    completed: bool
    created_at: str
    updated_at: str

# -------------------------
# Routes
# -------------------------

@app.get("/")
def root():
    return {"message": "✅ Priority Tasks API is running"}

# Create Task
@app.post("/api/tasks", response_model=dict)
def create_task(task: TaskCreate):
    conn = get_db()
    cursor = conn.cursor()
    sql = """
        INSERT INTO tasks (title, description, priority, due_date)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (task.title, task.description, task.priority, task.due_date))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task created successfully"}

# Get Tasks (with filters and sorting)
@app.get("/api/tasks", response_model=List[dict])
def get_tasks(
    priority: Optional[str] = Query(None),
    completed: Optional[bool] = Query(None),
    sort: Optional[str] = Query("due_date")  # sort by due_date default
):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    sql = "SELECT * FROM tasks WHERE 1=1"
    params = []

    if priority:
        sql += " AND priority = %s"
        params.append(priority)

    if completed is not None:
        sql += " AND completed = %s"
        params.append(completed)

    if sort in ["due_date", "created_at", "updated_at"]:
        sql += f" ORDER BY {sort}"

    cursor.execute(sql, tuple(params))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

# Update Task (details only)
@app.put("/api/tasks/{task_id}", response_model=dict)
def update_task_details(task_id: int, updates: TaskUpdateDetails):
    conn = get_db()
    cursor = conn.cursor()

    fields = []
    values = []

    for key, value in updates.dict().items():
        if value is not None:
            fields.append(f"{key} = %s")
            values.append(value)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    sql = f"UPDATE tasks SET {', '.join(fields)} WHERE id = %s"
    values.append(task_id)

    cursor.execute(sql, tuple(values))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task updated successfully"}

# Update Task (completed only)
@app.patch("/api/tasks/{task_id}/completed", response_model=dict)
def update_task_completed(task_id: int, update: TaskUpdateCompleted):
    conn = get_db()
    cursor = conn.cursor()
    sql = "UPDATE tasks SET completed = %s WHERE id = %s"
    cursor.execute(sql, (update.completed, task_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task completion status updated"}

# Delete Task
@app.delete("/api/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int):
    conn = get_db()
    cursor = conn.cursor()
    sql = "DELETE FROM tasks WHERE id = %s"
    cursor.execute(sql, (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Task deleted successfully"}
