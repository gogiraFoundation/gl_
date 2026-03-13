from django.urls import path

from .views import ContactMessageCreateView, ContactMessageListView

urlpatterns = [
    path("", ContactMessageCreateView.as_view(), name="contact-create"),
    path("messages/", ContactMessageListView.as_view(), name="contact-list"),
]
