from django.contrib.auth import login
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, generics, status, filters
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication
from core.filters import TodoFilter
from core.models import Todo, Category
from core.serializers import (
    RegisterUserSerializer,
    TodoSerializer,
    CreateTodoSerializer,
    UpdateTodoSerializer,
    CategorySerializer,
)


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AuthTokenSerializer

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"user": RegisterUserSerializer(user).data}, status=status.HTTP_201_CREATED)


class TodoListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateTodoSerializer
        return TodoSerializer

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["description", "category__name"]
    filterset_class = TodoFilter

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)


class TodoDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return UpdateTodoSerializer
        return TodoSerializer

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["description", "category__name"]
    filterset_class = TodoFilter

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)


class CategoryDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)
