# Frontend Testing Guide

## Features to Test in Browser

### 1. Search Functionality
**URL**: `http://localhost:3000/`

**Test Steps**:
1. Click the search icon in the header
2. Type "django" - should show blog posts and projects
3. Type "python" - should show projects with Python technology
4. Type "analytics" - should show relevant content
5. Click on a search result - should navigate to the page
6. Visit `/search?q=test` - should show full search results page

**Expected Results**:
- Search dropdown appears when clicking search icon
- Results update as you type (debounced)
- Results show blog posts and projects
- Clicking result navigates correctly
- Full search page shows all results

### 2. Resume Page
**URL**: `http://localhost:3000/resume`

**Test Steps**:
1. Navigate to Resume page from header
2. Verify experience timeline displays
3. Check education section
4. Review certifications
5. View skills by category with proficiency bars
6. Test download button (may need PDF endpoint implementation)

**Expected Results**:
- All resume sections display correctly
- Experience shows in chronological order
- Skills organized by category
- Proficiency bars show correct percentages
- Responsive layout works on mobile

### 3. Blog Comments
**URL**: `http://localhost:3000/blog/{slug}`

**Test Steps**:
1. Navigate to any blog post
2. Scroll to comments section
3. Fill out comment form (name, email, message)
4. Submit comment
5. Verify comment appears (if auto-approved) or shows "awaiting moderation"
6. Check admin panel to approve/reject comments

**Expected Results**:
- Comment form displays correctly
- Form validation works
- Success message appears after submission
- Comments list shows approved comments
- Honeypot spam protection works

### 4. Social Sharing
**URL**: `http://localhost:3000/blog/{slug}`

**Test Steps**:
1. Navigate to any blog post
2. Scroll to share buttons section
3. Click Twitter button - should open Twitter share dialog
4. Click LinkedIn button - should open LinkedIn share dialog
5. Click Facebook button - should open Facebook share dialog
6. Click Copy Link - should copy URL to clipboard
7. On mobile, test native share button

**Expected Results**:
- All share buttons visible
- Buttons open correct share URLs
- Copy link shows "Copied!" confirmation
- Native share works on mobile devices

### 5. Reading Time & View Counts
**URL**: `http://localhost:3000/blog/{slug}`

**Test Steps**:
1. Navigate to any blog post
2. Check meta information section
3. Verify reading time displays (e.g., "5 min read")
4. Verify view count displays
5. Refresh page - view count should increment

**Expected Results**:
- Reading time calculated correctly
- View count displays
- View count increments on page load
- Clock and Eye icons visible

### 6. Related Content
**URL**: `http://localhost:3000/blog/{slug}` or `/portfolio/{slug}`

**Test Steps**:
1. Navigate to a blog post
2. Scroll to bottom
3. Verify "You Might Also Like" section appears
4. Check related posts display
5. Click on a related post
6. Repeat for portfolio projects

**Expected Results**:
- Related content section appears
- Shows posts/projects with similar tags/categories
- Cards display correctly
- Clicking navigates to related content

### 7. Testimonials
**URL**: `http://localhost:3000/` and `/testimonials`

**Test Steps**:
1. Visit homepage
2. Scroll to testimonials section
3. Verify carousel displays
4. Test navigation arrows
5. Test dot indicators
6. Verify auto-rotation (5 seconds)
7. Visit `/testimonials` page
8. Check all testimonials display

**Expected Results**:
- Testimonials carousel on homepage
- Auto-rotates every 5 seconds
- Manual navigation works
- Star ratings display correctly
- Testimonials page shows all testimonials
- Responsive on mobile

### 8. RSS Feed
**URL**: `http://localhost:8000/feed/` and `http://localhost:8000/feed/atom/`

**Test Steps**:
1. Visit RSS feed URL in browser
2. Verify XML/RSS format
3. Check feed contains blog posts
4. Test Atom feed URL
5. Subscribe to feed in RSS reader (optional)

**Expected Results**:
- RSS feed returns valid XML
- Contains all published blog posts
- Feed metadata correct
- Atom feed works separately

### 9. Sitemap
**URL**: `http://localhost:8000/sitemap.xml`

**Test Steps**:
1. Visit sitemap URL
2. Verify XML format
3. Check all pages included
4. Verify lastmod dates
5. Check priorities and changefreq

**Expected Results**:
- Valid XML sitemap
- All published content included
- Static pages included
- Proper XML structure

### 10. Analytics Dashboard
**URL**: `http://localhost:3000/admin/analytics` (requires login)

**Test Steps**:
1. Login to admin
2. Navigate to analytics dashboard
3. Check summary cards display
4. Verify top pages list
5. Check top events list
6. Review events by type

**Expected Results**:
- Dashboard loads correctly
- Summary statistics display
- Charts/lists show data
- Responsive layout

### 11. Breadcrumbs
**URL**: `http://localhost:3000/blog/{slug}` or `/portfolio/{slug}`

**Test Steps**:
1. Navigate to blog post detail page
2. Check breadcrumbs at top
3. Click on "Blog" in breadcrumbs
4. Navigate to project detail page
5. Check breadcrumbs there
6. Click on "Portfolio" in breadcrumbs

**Expected Results**:
- Breadcrumbs display at top of detail pages
- Shows navigation path
- Clicking breadcrumb navigates correctly
- Home icon works

### 12. 404 Page
**URL**: `http://localhost:3000/nonexistent-page`

**Test Steps**:
1. Visit a non-existent URL
2. Verify custom 404 page displays
3. Test "Go Home" button
4. Test "Browse Blog" button
5. Test "View Portfolio" button

**Expected Results**:
- Custom 404 page displays
- Helpful error message
- Navigation buttons work
- Styled consistently with site

### 13. Bulk Operations (Admin)
**URL**: `http://localhost:8000/admin/`

**Test Steps**:
1. Login to Django admin
2. Go to Blog > Posts
3. Select multiple posts
4. Use "Publish selected posts" action
5. Use "Mark as featured" action
6. Repeat for Projects and Testimonials

**Expected Results**:
- Bulk actions appear in dropdown
- Actions execute successfully
- Success messages display
- Changes reflect immediately

## Content Added for Testing

### Blog Posts (5 total)
1. "The Secret Menu Behind Every Blog Post" (Featured)
2. "Test" 
3. "Building Scalable Django Applications with PostgreSQL" (Featured)
4. "CI/CD Best Practices for Django Projects"
5. "Data Analysis with Python and Power BI"

### Portfolio Projects (7 total)
1. Urbana
2. pipe-pop
3. Bria
4. Invenire
5. E-Commerce Analytics Platform (Featured)
6. API Gateway Service
7. Energy Management Dashboard

### Comments (3 total)
- 3 approved comments on first blog post
- Ready for moderation testing

### Testimonials (3 total)
- All featured and published
- Display on homepage carousel

## Testing Checklist

- [ ] Search functionality works
- [ ] Resume page displays all sections
- [ ] Blog comments can be submitted
- [ ] Social sharing buttons work
- [ ] Reading time calculates correctly
- [ ] View counts increment
- [ ] Related content displays
- [ ] Testimonials carousel works
- [ ] RSS feed accessible
- [ ] Sitemap generates correctly
- [ ] Analytics dashboard loads
- [ ] Breadcrumbs navigate correctly
- [ ] 404 page displays
- [ ] Bulk operations work in admin
- [ ] All pages responsive on mobile

## Known Issues

1. **RSS Feed**: May need Feed.as_view() - testing in progress
2. **PDF Resume Download**: Endpoint needs to be implemented
3. **Comment Approval**: Comments need admin approval before showing (expected behavior)

## Next Steps After Testing

1. Fix any issues found during testing
2. Add more content as needed
3. Test on different browsers
4. Test on mobile devices
5. Performance testing
6. SEO verification

