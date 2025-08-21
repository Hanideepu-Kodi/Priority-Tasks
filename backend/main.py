import os
from typing import Optional, Dict, Any, List

import pymysql
from fastapi import FastAPI, HTTPException, Query, Body
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

load_dotenv()

DB_HOST = os.environ["DB_HOST"]
DB_PORT = int(os.environ["DB_PORT"])
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASS"]

app = FastAPI(
    title="Mini To-Do API",
    description="FastAPI + MySQL with plain SQL for tasks",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
    )

# Create Task
@app.post("/tasks", status_code=201)
def create_task(payload: Dict[str, Any] = Body(
    ...,
    example={"title": "Buy milk", "description": "2 liters", "priority": "high", "due_date": "2025-08-21"}
)):
    title = (payload or {}).get("title")
    description = (payload or {}).get("description", "")
    priority = (payload or {}).get("priority")
    due_date = (payload or {}).get("due_date")

    if not title or not priority:
        raise HTTPException(status_code=400, detail="title and priority are required")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            sql = "INSERT INTO tasks (title, description, priority, due_date) VALUES (%s, %s, %s, %s)"
            cur.execute(sql, (title, description, priority, due_date))
            task_id = cur.lastrowid

            cur.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
            row = cur.fetchone()
        conn.commit()
        return row
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# List Tasks (with filtering and sorting)
@app.get("/tasks")
def list_tasks(
    priority: Optional[str] = Query(default=None),
    completed: Optional[bool] = Query(default=None),
    sort: str = Query(default="desc", regex="^(asc|desc)$")
) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        sql = "SELECT * FROM tasks WHERE 1 = 1"
        params = []

        if priority:
            sql += " AND priority=%s"
            params.append(priority)
        if completed is not None:
            sql += " AND completed=%s"
            params.append(completed)

        sql += f" ORDER BY due_date {sort.upper()}"

        with conn.cursor() as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Update Task (details only)
@app.put("/tasks/{task_id}")
def update_task_details(
    task_id: int,
    payload: Dict[str, Any] = Body(..., example={
        "title": "Updated Task",
        "description": "New details",
        "priority": "medium",
        "due_date": "2025-08-30"
    })
):
    title = payload.get("title")
    description = payload.get("description")
    priority = payload.get("priority")
    due_date = payload.get("due_date")

    if not title or not priority:
        raise HTTPException(status_code=400, detail="title and priority are required")

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            sql = "UPDATE tasks SET title=%s, description=%s, priority=%s, due_date=%s WHERE id=%s"
            cur.execute(sql, (title, description, priority, due_date, task_id))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Task not found")

            cur.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
            row = cur.fetchone()
        conn.commit()
        return row
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Update Task (completed only)
@app.patch("/tasks/{task_id}/completed")
def update_task_completed(task_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            sql = "UPDATE tasks SET completed=TRUE, completed_date=%s WHERE id=%s"
            cur.execute(sql, (datetime.now(), task_id))

            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Task not found")

            cur.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
            row = cur.fetchone()

        conn.commit()
        return row
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Delete Task
@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM tasks WHERE id=%s", (task_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Task not found")
        conn.commit()
        return
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
