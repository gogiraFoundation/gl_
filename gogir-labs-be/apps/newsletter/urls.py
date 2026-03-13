from django.urls import path

from .views import (
    NewsletterSendView,
    NewsletterStatsView,
    NewsletterSubscriberListView,
    NewsletterSubscribeView,
    NewsletterUnsubscribeView,
    NewsletterVerifyView,
)

urlpatterns = [
    path("subscribe/", NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
    path(
        "verify/<str:token>/", NewsletterVerifyView.as_view(), name="newsletter-verify"
    ),
    path(
        "unsubscribe/",
        NewsletterUnsubscribeView.as_view(),
        name="newsletter-unsubscribe",
    ),
    path(
        "subscribers/",
        NewsletterSubscriberListView.as_view(),
        name="newsletter-subscribers",
    ),
    path("stats/", NewsletterStatsView.as_view(), name="newsletter-stats"),
    path("send/", NewsletterSendView.as_view(), name="newsletter-send"),
]
