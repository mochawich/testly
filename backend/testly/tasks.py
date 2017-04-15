import subprocess
import os

from django.conf import settings
from django_rq import job


@job(settings.RQ_QUEUE_DEFAULT)
def start_test_run(test_run):
    test_run.start()
    tests_dir = settings.TESTS_DIR if test_run.path == '.' else os.path.join(settings.TESTS_DIR, test_run.path)
    args = [settings.PY_TEST_BIN, *settings.PY_TEST_OPS, tests_dir]
    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()
    test_run.finish(out, err)
