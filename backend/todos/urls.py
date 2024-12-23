"""
URL configuration for todos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from knox import views as knox_views
from core.views import (
    LoginView,
    RegisterUserView,
    TodoListCreateView,
    TodoDetailUpdateDestroyView,
    CategoryListCreateView,
    CategoryDetailUpdateDestroyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", RegisterUserView.as_view(), name="register"),
    path("api/login/", LoginView.as_view(), name="knox_login"),
    path("api/logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("api/todos/", TodoListCreateView.as_view(), name="todo-list-create"),
    path(
        "api/todos/<int:pk>/",
        TodoDetailUpdateDestroyView.as_view(),
        name="todo-detail-update-destroy",
    ),
    path(
        "api/categories/", CategoryListCreateView.as_view(), name="category-list-create"
    ),
    path(
        "api/categories/<int:pk>/",
        CategoryDetailUpdateDestroyView.as_view(),
        name="category-detail-update-destroy",
    ),
]
