from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models





class User(AbstractUser):
    ROLE_CHOICES = (
        ('participant', 'Participant'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=11, choices=ROLE_CHOICES, default='participant')  # Corrected max_length to fit the longest choice

    # Prevent reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',
        blank=True,
    )

    def __str__(self):
        return self.username


class LeaderboardEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - Level {self.level}"
    

