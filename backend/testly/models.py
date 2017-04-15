import uuid

from django.db import models
from django.utils.translation import ugettext_lazy as _


class UUIDModel(models.Model):
    """
    Base model that has necessary fields. Its primary key is a UUID field instead of the default AutoField.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    class Meta:
        abstract = True

    @classmethod
    def exists(cls, *args, **kwargs):
        return cls.objects.filter(*args, **kwargs).exists()


class TestRun(UUIDModel):
    """
    Record for a test run request.
    """
    PENDING = 0
    RUNNING = 1
    SUCCESS = 2
    FAILURE = 3
    Status = (
        (PENDING, _('Pending')),
        (RUNNING, _('Running')),
        (SUCCESS, _('Success')),
        (FAILURE, _('Failure')),
    )
    SOAP_API = 0
    Interface = (
        (SOAP_API, _('SOAP API')),
    )
    status = models.SmallIntegerField(choices=Status, default=PENDING, editable=False)
    task_id = models.CharField(_('Django RQ Task ID'), blank=True, default='', max_length=36)
    requested_by = models.CharField(_('Requester'), max_length=50)
    path = models.CharField(max_length=4096, default='.', help_text=_('Path relative to tests directory'))
    environment = models.SmallIntegerField(_('Environment ID'))
    interface = models.SmallIntegerField(choices=Interface, default=SOAP_API,
                                         help_text=_('Interface between the test executor web application '
                                                     'and the Python test runner'))
    logs = models.TextField(blank=True, default='')

    def start(self):
        self.status = TestRun.RUNNING
        self.save()

    def finish(self, out, err):
        self.logs = f'Stdout:\n{out}\n\Strerr:\n{err}'
        self.status = TestRun.SUCCESS if not err else TestRun.FAILURE
        self.save()
