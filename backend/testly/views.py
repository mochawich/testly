from django.conf import settings, os
from rest_framework import viewsets
from rest_framework.response import Response

from .models import TestRun
from .serializers import TestRunSerializer


class TestRunViewSet(viewsets.ModelViewSet):
    queryset = TestRun.objects.all()
    serializer_class = TestRunSerializer


class AssetsViewSet(viewsets.ViewSet):
    def list(self, request):
        data = {
            'interfaces': dict(TestRun.Interface),
            'statuses': dict(TestRun.Status),
            'available_tests': os.listdir(settings.TESTS_DIR)
        }
        return Response(data)
