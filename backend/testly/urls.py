"""
testly URL Configuration
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

from testly import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'runs', views.TestRunViewSet, base_name='testrun')
router.register(r'assets', views.AssetsViewSet, base_name='assets')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
]
