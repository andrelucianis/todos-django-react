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
