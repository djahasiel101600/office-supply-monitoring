from django.contrib import admin
from .models import *

# Register your models here.
from .models import SupplyCategory, Supply, SupplyTransaction

admin.site.register(SupplyCategory)
admin.site.register(Supply)
admin.site.register(SupplyTransaction)
