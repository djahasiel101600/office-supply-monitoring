from django.urls import path, include  
from rest_framework.routers import DefaultRouter  
from . import views  
  
router = DefaultRouter()  
router.register(r'users', views.UserViewSet)  
router.register(r'categories', views.SupplyCategoryViewSet)  
router.register(r'supplies', views.SupplyViewSet)  
router.register(r'transactions', views.SupplyTransactionViewSet)  
  
urlpatterns = [  
    path('', include(router.urls)),
    path("me/", views.MeView.as_view(), name="me"),
] 
