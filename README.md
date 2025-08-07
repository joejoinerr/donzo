# Donzo - Task Management Application

A modern task management application built with Django and Vue.js, designed to help you organize and track your tasks effectively.

## Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Context-based Organization**: Group tasks by contexts for better organization
- **Multiple Task States**: Organize tasks into Inbox, Next Actions, Someday, and Waiting lists
- **Energy Levels**: Assign energy requirements to tasks for better planning
- **Project Management**: Organize tasks within projects
- **Clean API**: RESTful API built with Django Ninja
- **Modern Frontend**: Responsive Vue.js interface

## Project Structure

```
.
├── backend/          # Django backend application
│   ├── donzo/        # Main Django project
│   └── todo/         # Todo app with models, API, and schemas
└── frontend/         # Vue.js frontend application
    ├── src/
    │   ├── components/   # Vue components
    │   ├── stores/       # Pinia stores for state management
    │   └── views/        # Application views
    └── e2e/             # End-to-end tests
```

## Technology Stack

### Backend
- **Django** - Web framework
- **Django Ninja** - API framework
- **SQLite** - Database (default)
- **Python** - Programming language

### Frontend
- **Vue.js 3** - Frontend framework
- **Pinia** - State management
- **Vite** - Build tool
- **Dexie.js** - IndexedDB wrapper for offline functionality
- **Playwright** - E2E testing

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- uv (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Run database migrations:
   ```bash
   uv run python manage.py migrate
   ```

4. Start the development server:
   ```bash
   uv run python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173/`

## API Endpoints

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `PATCH /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Contexts
- `POST /api/contexts` - Create a new context
- `GET /api/contexts` - List all contexts
- `GET /api/contexts/{id}` - Get a specific context
- `PATCH /api/contexts/{id}` - Update a context
- `DELETE /api/contexts/{id}` - Delete a context

## Development

### Running Tests

Backend tests:
```bash
cd backend
uv run python manage.py test
```

Frontend tests:
```bash
cd frontend
npm run test:unit
```

End-to-end tests:
```bash
cd frontend
npm run test:e2e
```

### Building for Production

Backend:
```bash
cd backend
uv run python manage.py collectstatic
```

Frontend:
```bash
cd frontend
npm run build
```

## Contributing

This project is being built in public. Feel free to submit issues, feature requests, or pull requests.

## License

[Add your license information here]
