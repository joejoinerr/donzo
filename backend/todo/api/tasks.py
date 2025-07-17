from django.http import HttpRequest
from django.shortcuts import aget_object_or_404
from ninja import Router
from todo.models import Task as TaskModel
from todo.schemas import Task, TaskCreate, TaskList, TaskUpdate

router = Router(tags=["tasks"])


@router.post("/tasks", response=Task)
async def create_task(request: HttpRequest, task: TaskCreate):
    """Creates a new task."""
    task_model = await TaskModel.objects.acreate(**task.model_dump())
    return Task.model_validate(task_model)


@router.get("/tasks/{task_id}", response=Task)
async def get_task(request: HttpRequest, task_id: int):
    """Retrieves a task by its ID."""
    task_model = await aget_object_or_404(TaskModel, id=task_id)
    return Task.model_validate(task_model)


@router.patch("/tasks/{task_id}", response=Task)
async def update_task(request: HttpRequest, task_id: int, task: TaskUpdate):
    """Updates an existing task."""
    await TaskModel.objects.filter(id=task_id).aupdate(**task.model_dump(exclude_unset=True))
    task_model = await aget_object_or_404(TaskModel, id=task_id)
    return Task.model_validate(task_model)


@router.delete("/tasks/{task_id}", response={204: None})
async def delete_task(request: HttpRequest, task_id: int):
    """Deletes a task by its ID."""
    task_model = await aget_object_or_404(TaskModel, id=task_id)
    await task_model.adelete()
    return 204, None


@router.get("/tasks", response=TaskList)
async def list_tasks(request: HttpRequest):
    """Lists all tasks."""
    task_models = TaskModel.objects.all()
    return TaskList(tasks=[Task.model_validate(tm) async for tm in task_models])
