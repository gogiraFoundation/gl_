from django.urls import path

from .views import (
    ContactMessageCreateView,
    ContactMessageDetailView,
    ContactMessageListView,
    ContactMessageReplyView,
)

urlpatterns = [
    path("", ContactMessageCreateView.as_view(), name="contact-create"),
    path("messages/", ContactMessageListView.as_view(), name="contact-list"),
    path(
        "messages/<int:pk>/",
        ContactMessageDetailView.as_view(),
        name="contact-detail",
    ),
    path(
        "messages/<int:pk>/reply/",
        ContactMessageReplyView.as_view(),
        name="contact-reply",
    ),
]
