from django.test import TestCase

from testly.models import TestRun as Run


class TestRuns(TestCase):
    def setUp(self):
        self.test_run1 = Run.objects.create(requested_by='Jenkins', path='test_runs.py', environment=1)
        self.test_run2 = Run.objects.create(requested_by='Jenkins', path='test_runs.py', environment=2)

    def test_runs_list(self):
        response = self.client.get('/runs')
        assert response.status_code == 200
        run_ids = [run['id'] for run in response.json()['results']]
        print('xyz')
        assert set(run_ids) == {str(self.test_run1.id), str(self.test_run2.id)}

    def test_run_detail(self):
        print('abc')
        response = self.client.get('/runs/{}'.format(self.test_run1.id))
        assert response.status_code == 200
        assert response.json()['id'] == str(self.test_run1.id)
