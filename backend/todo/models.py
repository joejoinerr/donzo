from django.db import models


class Context(models.Model):
    """Model representing a context."""
    name = models.TextField(unique=True)
    color_hex = models.CharField(max_length=7, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Returns the string representation of the Context."""
        return self.name


class Task(models.Model):
    """Model representing a task in the actions list."""
    EnergyLevels = models.TextChoices("EnergyLevels", "LOW MEDIUM HIGH")

    completed = models.DateTimeField(null=True)
    starred = models.BooleanField(default=False)
    title = models.TextField()
    notes = models.TextField(null=True)
    time_mins = models.IntegerField(null=True)
    energy = models.TextField(null=True, choices=EnergyLevels)
    due_date = models.DateField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Returns the string representation of the Task."""
        return self.title
