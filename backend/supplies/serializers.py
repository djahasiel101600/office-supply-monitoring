from rest_framework import serializers  
from django.contrib.auth.models import User  
from .models import SupplyCategory, Supply, SupplyTransaction  
  
class UserSerializer(serializers.ModelSerializer):  
    class Meta:  
        model = User  
        fields = ['id', 'username', 'first_name', 'last_name', 'email'] 

class SupplyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyCategory
        fields = '__all__'

class SupplySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Supply
        fields = '__all__'

class SupplyTransactionSerializer(serializers.ModelSerializer):
    supply_name = serializers.CharField(source='supply.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SupplyTransaction
        fields = '__all__' 
