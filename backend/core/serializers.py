from django.contrib.auth.models import User
from django.forms import ValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from core.models import Todo, Category


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password", "email")

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

    def validate_name(self, value):
        if Category.objects.filter(name=value, owner=self.context["request"].user).exists():
            raise serializers.ValidationError("Category with this name already exists.")
        return value

    def create(self, validated_data):
        return Category.objects.create(**validated_data, owner=self.context["request"].user)


class TodoSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True)

    class Meta:
        model = Todo
        fields = ["id", "description", "is_completed", "category", "created_at"]


class CreateTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["description"]

    def create(self, validated_data):
        return Todo.objects.create(**validated_data, owner=self.context["request"].user)

    def to_representation(self, instance):
        return TodoSerializer(instance).data


class UpdateTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["description", "is_completed", "category"]

    def validate_category(self, value):
        for category in value:
            if category.owner != self.context["request"].user:
                raise serializers.ValidationError("All categories must belong to the todo owner.")
        return value

    def update(self, instance, validated_data):
        categories = validated_data.pop("category", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if categories is not None:
            instance.category.set(categories)
        instance.save()
        return instance

    def to_representation(self, instance):
        return TodoSerializer(instance).data
