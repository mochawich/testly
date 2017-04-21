from django.test import TestCase


class FailedTest(TestCase):
    def test_empty_post(self):
        response = self.client.post('/runs', {})
        assert response.status_code == 201
