from ninja import NinjaAPI

import todo.api.tasks
import todo.api.contexts

api = NinjaAPI()

api.add_router("", todo.api.tasks.router)
api.add_router("", todo.api.contexts.router)
