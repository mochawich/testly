from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from testly.tasks import start_test_run
from .models import TestRun


class TestRunSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestRun
        fields = ('url', 'id', 'status', 'requested_by', 'path', 'environment', 'interface', 'logs', 'created_at')

    def validate_environment(self, environment):
        if TestRun.exists(environment=environment, status__in=[TestRun.PENDING, TestRun.RUNNING]):
            msg = _('Environment %(id)s has already running tests. Please wait for them to finish before starting '
                    'new ones, or pick another environment') % {'id': environment}
            raise ValidationError(msg)
        return environment

    def create(self, validated_data):
        test_run = super(TestRunSerializer, self).create(validated_data)
        start_test_run.delay(test_run)
        return test_run
