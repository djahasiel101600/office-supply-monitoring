from django.db import models 
from django.contrib.auth.models import User 
from django.utils import timezone 
 
# Supply Category Model 
class SupplyCategory(models.Model): 
    name = models.CharField(max_length=100) 
    description = models.TextField(blank=True) 
    created_at = models.DateTimeField(auto_now_add=True) 
 
    def __str__(self): 
        return self.name 

