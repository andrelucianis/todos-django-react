from django_filters import rest_framework as filters
from core.models import Todo


class TodoFilter(filters.FilterSet):
    description = filters.CharFilter(lookup_expr="icontains")
    is_completed = filters.BooleanFilter()
    created_at = filters.DateFromToRangeFilter()
    category = filters.CharFilter(field_name="category__name", lookup_expr="icontains")

    class Meta:
        model = Todo
        fields = ["description", "is_completed", "created_at", "category"]
