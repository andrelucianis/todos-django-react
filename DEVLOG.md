# Develog

## Creating the backend

```bash
export PIPENV_VENV_IN_PROJECT=1
pipenv install django
pipenv shell
python manage.py runserver # check if installation was successful
```

## Creating the database

I've created a `docker-compose.yaml` file to spin up a postgreSQL database.

The configurations allow to commit the persisted data to the repository, which simplifies the testing later (no migrations needed, and will be populated with a few examples too).

To run the database, on `/database` directory:

```bash
docker compose up
```

The db will be available on port 5432 and pgAdmin on port 8888.

On the server code, I've installed the `psycopg2-binary` lib and updated the database setting on `settings.py`

## Adding core app

```bash
django-admin startapp core
```

## Installing dependencies for Rest API and Authentication (JWT)

```bash
pipenv install djangorestframework
pipenv install markdown
pipenv install django-filter
pipenv install django-rest-knox
```

Then, the serializer, the views and URLs for user registration were configured.

To test the authentication process, I've applied the migrations, created a django superuser and and a regular user too.

```bash
python manage.py migrate
python manage.py createsuperuser
```

Superuser:
- Username: `admin`
- Email: `admin@test.com`
- Password: `admin123`

Regular user:
- Username: `testuser`
- Email: `test@email.com`
- Password: `testuser123`

## Adding Todos and Categories models, serializers, views and urls

The next step was to create the models and API needed to manage the todos.

Rules used in the models:
- A todo should have only one owner and is protected from other users
- A todo may have one or more categories
- A category should have only one owner and is protected from other users
- A user can not have categories with the same name

After the models were created, the migrations were applied to the database:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Adding tests with Pytest

Install the dependencies:

```bash
pipenv install pytest pytest-django
```

I've then added a `pytest.ini` file, wrote some tests and added a pipenv shortcut on `Pipfile` to run the tests with `pipenv run test`.

## Adding filter and pagination

Some configurations were added to allow filtering results.