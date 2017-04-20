from rest_framework import pagination


class TestlyPagination(pagination.PageNumberPagination):
    page_size_query_param = 'limit'
    page_size = 10
