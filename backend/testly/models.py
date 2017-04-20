from django.db import models
from django.utils.translation import ugettext_lazy as _


class TestRun(models.Model):
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
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    def start(self):
        self.status = TestRun.RUNNING
        self.save()

    def finish(self, out, err):
        out = out.decode()
        err = err.decode()
        self.logs = f'Stdout:\n{out}\nStderr:\n{err}'
        if err or '=================================== FAILURES ===================================' in out:
            self.status = TestRun.FAILURE
        else:
            self.status = TestRun.SUCCESS
        self.save()

    @classmethod
    def exists(cls, *args, **kwargs):
        return cls.objects.filter(*args, **kwargs).exists()
