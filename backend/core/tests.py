import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from core.models import Todo, Category


@pytest.fixture
def api_client():
    return APIClient()


### Authentication Test Cases
@pytest.mark.django_db
def test_register_user(api_client):
    url = reverse("register")
    data = {
        "username": "testuser",
        "email": "test@email.com",
        "password": "testuser123",
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["user"]["username"] == "testuser"
    assert response.data["user"]["email"] == "test@email.com"


@pytest.fixture
def auth_user():
    return User.objects.create_user(username="testuser", password="testuser123")


@pytest.mark.django_db
def test_login(api_client, auth_user):
    url = reverse("knox_login")
    data = {"username": "testuser", "password": "testuser123"}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["token"] != None


### Todos Test Cases
@pytest.fixture
def user():
    return User.objects.create_user(username="todosuser", password="todospass")


@pytest.fixture
def auth_client(api_client, user):
    response = api_client.post(reverse("knox_login"), {"username": "todosuser", "password": "todospass"})
    token = response.data["token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return api_client


@pytest.fixture
def category(user):
    return Category.objects.create(name="Work", owner=user)


@pytest.fixture
def todo(user):
    return Todo.objects.create(description="Example Todo", owner=user)


@pytest.mark.django_db
def test_create_todo(auth_client):
    url = reverse("todo-list-create")
    data = {
        "description": "Test app",
    }
    response = auth_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["description"] == "Test app"
    assert not response.data["is_completed"]
    assert len(response.data["category"]) == 0


@pytest.mark.django_db
def test_get_todo_list(auth_client, todo):
    url = reverse("todo-list-create")
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0


@pytest.mark.django_db
def test_get_todo_detail(auth_client, todo):
    url = reverse("todo-detail-update-destroy", args=[todo.id])
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["description"] == "Example Todo"


@pytest.mark.django_db
def test_update_todo(auth_client, todo, category):
    url = reverse("todo-detail-update-destroy", args=[todo.id])
    data = {"description": "Updated Todo", "is_completed": True, "category": [1]}
    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["description"] == "Updated Todo"
    assert response.data["is_completed"] is True
    assert len(response.data["category"]) == 1
    assert response.data["category"][0] == category.name


@pytest.mark.django_db
def test_delete_todo(auth_client, todo):
    url = reverse("todo-detail-update-destroy", args=[todo.id])
    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Todo.objects.filter(id=todo.id).exists()


@pytest.fixture
def another_user():
    return User.objects.create_user(username="anothertodosuser", password="todospass")


@pytest.fixture
def another_todo(another_user):
    return Todo.objects.create(description="Another Todo", owner=another_user)


@pytest.fixture
def another_auth_client(api_client, another_user):
    response = api_client.post(reverse("knox_login"), {"username": "anothertodosuser", "password": "todospass"})
    token = response.data["token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return api_client


@pytest.mark.django_db
def test_get_todo_detail_not_found(another_auth_client, todo):
    url = reverse("todo-detail-update-destroy", args=[todo.id])
    response = another_auth_client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_update_todo_with_forbidden_category(another_auth_client, another_todo, category):
    url = reverse("todo-detail-update-destroy", args=[another_todo.id])
    data = {"category": [1]}
    response = another_auth_client.patch(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "All categories must belong to the todo owner." in response.data["category"]


@pytest.mark.django_db
def test_filter_todos(auth_client, user, category):
    todo = Todo.objects.create(description="Example Todo", is_completed=False, owner=user)
    todo.category.set([category])
    url = reverse("todo-list-create")
    response = auth_client.get(url, {"search": "Example"})
    assert response.status_code == status.HTTP_200_OK
    assert all("Example" in todo["description"] for todo in response.data["results"])


### Caterogies Test Cases
@pytest.mark.django_db
def test_create_category(auth_client):
    url = reverse("category-list-create")
    data = {
        "name": "Example Category",
    }
    response = auth_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["name"] == "Example Category"


@pytest.mark.django_db
def test_get_category_list(auth_client, category):
    url = reverse("category-list-create")
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0


@pytest.mark.django_db
def test_get_category_detail(auth_client, category):
    url = reverse("category-detail-update-destroy", args=[category.id])
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Work"


@pytest.mark.django_db
def test_update_category(auth_client, category):
    url = reverse("category-detail-update-destroy", args=[category.id])
    data = {"name": "Updated Category"}
    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Updated Category"


@pytest.mark.django_db
def test_delete_category(auth_client, category):
    url = reverse("category-detail-update-destroy", args=[category.id])
    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Category.objects.filter(id=category.id).exists()
