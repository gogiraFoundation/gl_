from django.urls import path
from .views import (
    PageViewTrackView,
    PageViewStatsView,
    EventTrackView,
    EventStatsView,
)

urlpatterns = [
    path('pageviews/', PageViewTrackView.as_view(), name='pageview-track'),
    path('pageviews/stats/', PageViewStatsView.as_view(), name='pageview-stats'),
    path('events/', EventTrackView.as_view(), name='event-track'),
    path('events/stats/', EventStatsView.as_view(), name='event-stats'),
]

