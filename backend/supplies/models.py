from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class SupplyCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Supply(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(SupplyCategory, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    unit = models.CharField(max_length=50)
    minimum_quantity = models.IntegerField(default=0)
    current_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class SupplyTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('IN', 'Incoming'),
        ('OUT', 'Outgoing'),
    ]

    supply = models.ForeignKey(Supply, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    reason = models.TextField(blank=True)
    date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.supply.name} - {self.quantity}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            if self.transaction_type == 'IN':
                self.supply.current_quantity += self.quantity
            else:
                self.supply.current_quantity -= self.quantity
            self.supply.save()
