from datetime import datetime, date
from enum import StrEnum

from ninja import Schema


class EnergyLevels(StrEnum):
    """Enumeration for energy levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class TaskBase(Schema):
    """Base schema for Task."""
    completed: datetime | None = None
    starred: bool = False
    title: str
    notes: str | None = None
    time_mins: int | None = None
    energy: EnergyLevels | None = None
    due_date: date | None = None


class Task(TaskBase):
    """Public schema for Task."""
    id: int
    created: datetime
    updated: datetime


class TaskInDB(TaskBase):
    """Schema for Task stored in the database."""
    id: int
    owner_id: int
    created: datetime
    updated: datetime


class TaskCreate(TaskBase):
    """Schema for creating a Task."""
    # This is so that we don't have to provide the starred field when creating a task.
    starred: bool | None = False


class TaskUpdate(TaskBase):
    """Schema for updating a Task."""
    title: str | None = None
    starred: bool | None = False


class TaskList(Schema):
    """Schema for listing Tasks."""
    tasks: list[Task]


class ContextBase(Schema):
    """Base schema for Context."""
    name: str
    color_hex: str | None = None


class Context(ContextBase):
    """Public schema for Context."""
    id: int
    created: datetime
    updated: datetime


class ContextInDB(ContextBase):
    """Schema for Context stored in the database."""
    id: int
    owner_id: int
    created: datetime
    updated: datetime


class ContextCreate(ContextBase):
    """Schema for creating a Context."""
    pass


class ContextUpdate(ContextBase):
    """Schema for updating a Context."""
    name: str | None = None


class ContextList(Schema):
    """Schema for listing Contexts."""
    contexts: list[Context]
