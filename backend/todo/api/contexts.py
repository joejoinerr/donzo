from django.http import HttpRequest
from django.shortcuts import aget_object_or_404
from ninja import Router
from todo.models import Context as ContextModel
from todo.schemas import Context, ContextCreate, ContextList, ContextUpdate

router = Router(tags=["contexts"])


@router.post("/contexts", response=Context)
async def create_context(request: HttpRequest, context: ContextCreate):
    """Creates a new context."""
    context_model = await ContextModel.objects.acreate(**context.model_dump())
    return Context.model_validate(context_model)


@router.get("/contexts/{context_id}", response=Context)
async def get_context(request: HttpRequest, context_id: int):
    """Retrieves a context by its ID."""
    context_model = await aget_object_or_404(ContextModel, id=context_id)
    return Context.model_validate(context_model)


@router.patch("/contexts/{context_id}", response=Context)
async def update_context(request: HttpRequest, context_id: int, context: ContextUpdate):
    """Updates an existing context."""
    await ContextModel.objects.filter(id=context_id).aupdate(**context.model_dump(exclude_unset=True))
    context_model = await aget_object_or_404(ContextModel, id=context_id)
    return Context.model_validate(context_model)


@router.delete("/contexts/{context_id}", response={204: None})
async def delete_context(request: HttpRequest, context_id: int):
    """Deletes a context by its ID."""
    context_model = await aget_object_or_404(ContextModel, id=context_id)
    await context_model.adelete()
    return 204, None


@router.get("/contexts", response=ContextList)
async def list_contexts(request: HttpRequest):
    """Lists all contexts."""
    context_models = ContextModel.objects.all()
    return ContextList(contexts=[Context.model_validate(cm) async for cm in context_models])