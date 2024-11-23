from django.db import models
from django.core.exceptions import ValidationError


class Todo(models.Model):
    description = models.CharField(max_length=100)
    is_completed = models.BooleanField(default=False)
    category = models.ManyToManyField("Category", blank=True)
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    def clean(self):
        if self.pk:
            for category in self.category.all():
                if category.owner != self.owner:
                    raise ValidationError("All categories must belong to the todo owner.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description

    class Meta:
        ordering = ("created_at",)


class Category(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ("name", "owner")
        ordering = ("name",)
