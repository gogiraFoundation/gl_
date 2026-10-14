from rest_framework.pagination import PageNumberPagination


class StaffListPagination(PageNumberPagination):
    """Larger default page for staff inboxes; clients may request up to max_page_size."""

    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 200
