from rest_framework import viewsets  
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User  
from .models import SupplyCategory, Supply, SupplyTransaction  
from .serializers import UserSerializer, SupplyCategorySerializer, SupplySerializer, SupplyTransactionSerializer 

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })

class UserViewSet(viewsets.ReadOnlyModelViewSet):  
    queryset = User.objects.all()  
    serializer_class = UserSerializer  
    # permission_classes = [AllowAny]  
  
class SupplyCategoryViewSet(viewsets.ModelViewSet):  
    queryset = SupplyCategory.objects.all()  
    serializer_class = SupplyCategorySerializer  
    # permission_classes = [AllowAny] 
  
class SupplyViewSet(viewsets.ModelViewSet):  
    queryset = Supply.objects.all()  
    serializer_class = SupplySerializer  
    # permission_classes = [AllowAny]  
  
class SupplyTransactionViewSet(viewsets.ModelViewSet):  
    queryset = SupplyTransaction.objects.all().order_by('-created_at')  
    serializer_class = SupplyTransactionSerializer  
    # permission_classes = [AllowAny]  
  
    def perform_create(self, serializer):  
        serializer.save(user=self.request.user) 
