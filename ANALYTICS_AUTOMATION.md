# Analytics Automation System

## Overview

This document describes the end-to-end automated analytics system implemented for the Gogir Labs portfolio website. The system provides automatic tracking of page views and user interactions while maintaining GDPR/privacy compliance through user consent management.

## Architecture

### Frontend Components

#### 1. Analytics Context (`contexts/AnalyticsContext.tsx`)
- Manages user consent state (stored in localStorage)
- Provides session management (30-minute sessions)
- Handles automatic IP address extraction (via backend)
- Provides `trackPageView` and `trackEvent` functions
- Exports `useAnalytics` hook for components

#### 2. Analytics Tracker Component (`components/analytics/AnalyticsTracker.tsx`)
- Wraps the consent banner
- Automatically tracks page views on route changes
- Integrated into root layout

#### 3. Consent Banner (`components/analytics/ConsentBanner.tsx`)
- GDPR-compliant consent management
- Shows on first visit (when consent is null)
- Allows users to accept or decline analytics
- Links to privacy policy page

#### 4. Privacy Page (`app/privacy/page.tsx`)
- Full privacy policy
- Allows users to change consent preferences
- Shows current tracking status
- Explains data collection and usage

### Hooks

#### 1. `usePageView` (`hooks/usePageView.ts`)
- Automatically tracks page views on route changes
- Uses Next.js `usePathname` hook
- Only tracks when consent is given
- Prevents duplicate tracking

#### 2. `useAnalyticsEvent` (`hooks/useAnalyticsEvent.ts`)
- Provides convenient event tracking functions:
  - `trackClick` - For click events
  - `trackDownload` - For file downloads
  - `trackFormSubmit` - For form submissions
  - `trackVideoPlay` - For video interactions
  - `trackCustom` - For custom events

### Backend Components

#### 1. Enhanced Views (`apps/analytics/views.py`)
- **PageViewTrackView**: Automatically extracts IP address from request headers
- **EventTrackView**: Handles custom event tracking with IP extraction
- Both endpoints are public (no authentication required)
- Traffic spike detection and admin notifications

#### 2. Enhanced Admin (`apps/analytics/admin.py`)
- Read-only admin interface (prevents manual entry)
- Better display of analytics data
- Search and filtering capabilities
- Date hierarchy for easy navigation

## Automatic Tracking

### Page Views
- **Automatic**: Every page navigation is tracked automatically
- **Trigger**: Next.js route changes
- **Data Collected**:
  - Path (URL)
  - Referer (previous page)
  - User agent
  - IP address (extracted server-side)
  - Session ID (30-minute sessions)

### Events
The following events are automatically tracked:

#### Navigation
- **Event**: `nav_link`
- **Trigger**: Navigation link clicks (header, footer, mobile menu)
- **Metadata**: Link name, href, location

#### Social Media
- **Event**: `social_github`, `social_linkedin`, `social_medium`
- **Trigger**: Social media icon clicks
- **Metadata**: Platform, location (header/footer/mobile)

#### Blog
- **Event**: `blog_post_view`
- **Trigger**: Blog post card clicks
- **Metadata**: Post ID, title, category, featured status

#### Portfolio
- **Event**: `project_view`
- **Trigger**: Project card "Learn More" clicks
- **Metadata**: Project ID, title, category

#### Forms
- **Event**: `form_submit_contact`, `form_submit_newsletter`
- **Trigger**: Form submissions
- **Metadata**: Form name, additional context

#### Footer Links
- **Event**: `footer_link`
- **Trigger**: Footer navigation clicks
- **Metadata**: Link name

## Privacy & Compliance

### GDPR Compliance
- **Consent Management**: Users must explicitly consent before tracking
- **Opt-out**: Users can revoke consent at any time
- **Privacy Policy**: Dedicated page explaining data collection
- **Data Minimization**: Only necessary data is collected
- **Anonymization**: IP addresses and session data are anonymized

### Consent States
1. **Null** (Not decided): Consent banner shown
2. **True** (Accepted): Full tracking enabled
3. **False** (Declined): No tracking, banner hidden

### Data Storage
- Consent preference: `localStorage` (persists across sessions)
- Session ID: `sessionStorage` (cleared when browser closes)
- Analytics data: Backend database (anonymized)

## Usage Examples

### Automatic Page View Tracking
```typescript
// Already integrated - no code needed!
// Just include <AnalyticsTracker /> in layout
```

### Manual Event Tracking
```typescript
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

function MyComponent() {
  const { trackClick, trackFormSubmit } = useAnalyticsEvent()
  
  const handleButtonClick = () => {
    trackClick('button_click', { buttonName: 'CTA' })
  }
  
  const handleFormSubmit = () => {
    trackFormSubmit('contact', { source: 'homepage' })
  }
}
```

### Check Consent Status
```typescript
import { useAnalytics } from '@/contexts/AnalyticsContext'

function MyComponent() {
  const { consentGiven, trackingEnabled } = useAnalytics()
  
  if (!trackingEnabled) {
    // Show alternative UI or skip tracking
  }
}
```

## API Endpoints

### Public Endpoints (No Auth Required)

#### POST `/api/v1/analytics/pageviews/`
Track a page view.

**Request Body**:
```json
{
  "path": "/blog/my-post",
  "referer": "https://example.com",
  "user_agent": "Mozilla/5.0...",
  "session_id": "session_1234567890_abc123"
}
```

**Response**:
```json
{
  "status": "tracked"
}
```

#### POST `/api/v1/analytics/events/`
Track a custom event.

**Request Body**:
```json
{
  "event_type": "click",
  "event_name": "button_click",
  "path": "/",
  "metadata": {
    "buttonName": "CTA",
    "location": "hero"
  },
  "user_agent": "Mozilla/5.0...",
  "session_id": "session_1234567890_abc123"
}
```

**Response**:
```json
{
  "status": "tracked"
}
```

### Protected Endpoints (Admin Only)

#### GET `/api/v1/analytics/pageviews/stats/?days=30`
Get page view statistics.

#### GET `/api/v1/analytics/events/stats/?days=30`
Get event statistics.

## Admin Interface

### Page Views
- View all tracked page views
- Filter by date, path
- Search by path, session ID, IP
- Read-only (prevents manual entry)

### Events
- View all tracked events
- Filter by event type, date
- Search by event name, path
- View event metadata
- Read-only (prevents manual entry)

## Session Management

- **Session Duration**: 30 minutes of inactivity
- **Session ID Format**: `session_{timestamp}_{random}`
- **Storage**: `sessionStorage` (cleared on browser close)
- **Tracking**: Same session ID used for all events in a session

## Traffic Spike Detection

The system automatically detects traffic spikes:
- Checks every 10th page view
- Alerts if >100 views in 5 minutes on same path
- Sends notification to admin users
- Configurable thresholds

## Testing

### Manual Testing
1. Clear localStorage: `localStorage.removeItem('analytics_consent')`
2. Refresh page - consent banner should appear
3. Accept consent - banner should disappear
4. Navigate pages - check admin for page views
5. Click links - check admin for events
6. Visit `/privacy` - change consent preference

### Automated Testing
- Test consent management
- Test page view tracking
- Test event tracking
- Test session management
- Test privacy compliance

## Future Enhancements

1. **Real-time Dashboard**: WebSocket updates for live analytics
2. **Advanced Segmentation**: User behavior analysis
3. **A/B Testing**: Built-in experimentation framework
4. **Export Functionality**: CSV/JSON export of analytics data
5. **Custom Dashboards**: User-configurable analytics views
6. **Retention Analysis**: User return rate tracking
7. **Funnel Analysis**: Conversion path tracking

## Troubleshooting

### Page Views Not Tracking
1. Check consent status: `localStorage.getItem('analytics_consent')`
2. Check browser console for errors
3. Verify API endpoint is accessible
4. Check network tab for failed requests

### Events Not Tracking
1. Verify `useAnalyticsEvent` hook is used
2. Check `trackingEnabled` is true
3. Verify event name and metadata format
4. Check backend logs for errors

### Consent Banner Not Showing
1. Check if consent already given: `localStorage.getItem('analytics_consent')`
2. Clear localStorage and refresh
3. Check component is included in layout
4. Verify `AnalyticsProvider` wraps the app

## Security Considerations

1. **IP Address Handling**: Extracted server-side, not sent from client
2. **Rate Limiting**: Consider adding rate limits to prevent abuse
3. **Data Retention**: Implement data retention policies
4. **PII Protection**: No personally identifiable information collected
5. **HTTPS Only**: Analytics should only work over HTTPS in production

## Performance

- **Non-blocking**: Analytics calls don't block page rendering
- **Error Handling**: Failures are silent (don't interrupt UX)
- **Batching**: Consider batching events for better performance
- **Caching**: Session ID cached in sessionStorage

## Maintenance

### Regular Tasks
1. Monitor analytics data volume
2. Review traffic spike alerts
3. Clean up old analytics data (if retention policy)
4. Update privacy policy as needed
5. Review consent rates

### Data Cleanup
```python
# Example: Delete analytics older than 1 year
from apps.analytics.models import PageView, Event
from django.utils import timezone
from datetime import timedelta

one_year_ago = timezone.now() - timedelta(days=365)
PageView.objects.filter(created_at__lt=one_year_ago).delete()
Event.objects.filter(created_at__lt=one_year_ago).delete()
```

