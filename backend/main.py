from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# -----------------------------
# Database setup
# -----------------------------
DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# -----------------------------
# DB Model
# -----------------------------
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    completed_date = Column(DateTime, nullable=True)

# -----------------------------
# Pydantic Schemas
# -----------------------------
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str
    due_date: Optional[datetime] = None
    completed: bool = False
    completed_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None

class TaskOut(TaskBase):
    id: int

    class Config:
        orm_mode = True

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Routes
# -----------------------------

# Create task
@app.post("/tasks/", response_model=TaskOut, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    completed_date = task.completed_date
    if task.completed and not completed_date:
        completed_date = datetime.utcnow()

    db_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        completed=task.completed,
        completed_date=completed_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Get all tasks (with optional filtering)
@app.get("/tasks/", response_model=List[TaskOut])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    completed: Optional[bool] = None,   # 👈 Filter param (easy to remove if needed)
    db: Session = Depends(get_db)
):
    query = db.query(Task)
    if completed is not None:  # 👈 Easy to remove block
        query = query.filter(Task.completed == completed)
    return query.offset(skip).limit(limit).all()

# Get single task by ID
@app.get("/tasks/{task_id}", response_model=TaskOut)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Update task
@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update fields
    if task.title is not None:
        db_task.title = task.title
    if task.description is not None:
        db_task.description = task.description
    if task.priority is not None:
        db_task.priority = task.priority
    if task.due_date is not None:
        db_task.due_date = task.due_date

    # Handle completion
    if task.completed is not None:
        db_task.completed = task.completed
        if task.completed and not db_task.completed_date:
            db_task.completed_date = datetime.utcnow()
        elif not task.completed:
            db_task.completed_date = None

    db.commit()
    db.refresh(db_task)
    return db_task

# Delete task
@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()
    return None
