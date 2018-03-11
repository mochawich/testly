from django.test import TestCase
import time


class LongTest(TestCase):
    def test_runs_list(self):
        for i in range(10):
            response = self.client.get('/runs')
            assert response.status_code == 200
            print(i, 'Fetching runs')
            time.sleep(1)
