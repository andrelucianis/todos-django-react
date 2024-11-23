# Todos

Todos application built with Django, PostgreSQL and React

## Instructions

### Using Docker (recommended)

#### Backend

To start the server, clone the repository and run:

```bash
docker compose up
```

This will start the Django server on port `8000`, a PostgreSQL database on port `5432` and pgAdmin on port `8888`.

The database is already populated with a user with a set of todos:
- Username: usertest
- Password: usertest123

#### Frontend

The client is deployed on [https://andrelucianis.github.io/todos-django-react/](https://andrelucianis.github.io/todos-django-react/) and configured to use the API on localhost.

### Running locally

#### Backend

To run the project locally, you'll need:
- Python
- Pipenv
- Docker

Spin up the database:

```bash
cd database
docker compose up
```

Create virtual environment, migrate and start server:

```bash
cd backend
pipenv install
pipenv shell
python manage.py migrate
python manage.py runserver
```

#### Frontend

To run the project locally, you'll need:
- Node

To start the development server run the command:

```bash
cd frontend
npm install
npm run dev
```

The client will be available on port `5173`