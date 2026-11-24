from django.urls import path

from .views import SiteProfileView

urlpatterns = [
    path("", SiteProfileView.as_view(), name="site-profile"),
]
