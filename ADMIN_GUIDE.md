# Admin Guide - Content Management

This guide explains how to upload and manage content, videos, and projects through the Django admin panel.

## Theme (Light / Dark Mode)

The frontend supports light and dark themes. The theme toggle is in the header (desktop and mobile). Theme choice is stored in `localStorage` and applied via `data-theme="light"` or `data-theme="dark"` on the document. For consistent contrast, layout components use Tailwind’s `dark:` variant with base classes for light mode (e.g. `bg-slate-100`, `text-slate-900`) and `dark:` for dark mode (e.g. `dark:bg-gray-900`, `dark:text-white`). New components should use the same pattern so text stays readable in both themes.

## Accessing the Admin Panel

1. Navigate to: http://localhost:8000/admin
2. Login with your superuser credentials
3. If you don't have a superuser, create one:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

## Uploading Content

### Projects

1. Go to **Portfolio > Projects**
2. Click **"Add Project"**
3. Fill in the project details:
   - **Title**: Project name
   - **Description**: Short description
   - **Long Description**: Detailed project description
   - **Featured Image**: Upload a main project image (JPG, PNG, etc.)
   - **Video**: Upload a project video file (MP4, WebM, etc.) OR
   - **Video URL**: Enter an external video URL (YouTube, Vimeo, etc.)
   - **GitHub URL**: Link to GitHub repository
   - **Live URL**: Link to live demo
   - **Category**: Select or create a category
   - **Technologies**: Select multiple technologies used
   - **Featured**: Check to show on homepage
   - **Published**: Check to make visible on frontend
   - **Order**: Display order (higher numbers appear first)

4. Click **"Save"**

**Note**: You can add multiple images to a project using the "Project Images" section at the bottom of the form.

### Blog Posts

1. Go to **Blog > Posts**
2. Click **"Add Post"**
3. Fill in the post details:
   - **Title**: Blog post title
   - **Author**: Select yourself
   - **Excerpt**: Short summary (max 300 characters)
   - **Content**: Full blog post content (rich text editor)
   - **Featured Image**: Upload a featured image
   - **Video**: Upload a video file OR
   - **Video URL**: Enter external video URL
   - **Category**: Select or create a category
   - **Tags**: Select or create tags
   - **Published**: Check to publish the post
   - **Featured**: Check to show on homepage
   - **Meta Title**: SEO title (optional)
   - **Meta Description**: SEO description (optional)

4. Click **"Save"**

**Project essays seed**: On the homelab API host, `python manage.py seed_blog --source-dir /essays` imports markdown from `/mnt/data/blogs/project_essays` as unpublished posts under the **Project Essays** category (idempotent). Essay images under `images/` are copied to media and linked as `https://api.gogirlabs.uk/media/blog/essays/...`. Use `--refresh` to re-import content and images for existing slugs. Review excerpts and content in admin, then publish when ready. Prefer admin publish for the first live batch so notifications fire intentionally; keep `NEWSLETTER_BROADCASTS_ENABLED=False` unless you intend campaign fan-out.

**Case-study publish runbook** (editorial centre of the public site):

1. Seed essays (dry-run first):
   ```bash
   python manage.py seed_blog --source-dir /essays --dry-run
   python manage.py seed_blog --source-dir /essays
   ```
2. In Django admin, publish **`tr-bot`** (slug `tr-bot`, from `tr_bot.md`) first, then 1–2 more essays (`traqhq`, `uk-energy-eff`, or blockchain-related files on the host).
3. Seed portfolio if needed: `python manage.py seed_portfolio` — creates all catalogue rows **unpublished** (`auto_publish` is always false).
4. Publish **only** these case-study cards when copy and images are ready:
   - **Traq Authenticator** (`traq-authenticator`) — IAM; link writing to `/blog/tr-bot` and Traq essays
   - **Energy Management Dashboard** — ISO 50001
   - One data / blockchain card only if an essay backs it
5. Keep Afri Cleans, e-commerce analytics, Urbana, Pipe Pop, Bria, Invenire, and API Gateway **unpublished** unless an essay backs them. After a seed that previously auto-published them, unpublish with:
   ```bash
   docker compose -f docker-compose.homelab.yml --env-file .env exec -T backend \
     python manage.py shell -c "
   from apps.portfolio.models import Project
   KEEP = {'traq-authenticator', 'energy-management-dashboard'}
   n = Project.objects.exclude(slug__in=KEEP).update(published=False)
   print('unpublished', n)
   "
   ```
6. Confirm `FRONTEND_URL=https://www.gogirlabs.uk` so feed/sitemap item URLs point at the Worker, not the API host.

### Search Console (indexing)

1. Verify property **`https://www.gogirlabs.uk`** in [Google Search Console](https://search.google.com/search-console) (and Bing Webmaster Tools).
2. Submit sitemap: **`https://api.gogirlabs.uk/sitemap.xml`** (FE `/sitemap.xml` is not served; feeds are on the API origin).
3. Request indexing for `/`, `/portfolio/traq-authenticator`, `/blog/tr-bot`, `/resume`, `/about`.
4. Confirm `https://www.gogirlabs.uk/robots.txt` lists that Sitemap URL after a Workers deploy.

### Testimonials

1. Go to **Testimonials > Testimonials**
2. Click **"Add Testimonial"**
3. Fill in:
   - **Client Name**: Name of the person
   - **Client Role**: Their job title/role
   - **Company**: Company name (optional)
   - **Content**: Testimonial text
   - **Rating**: 1-5 stars
   - **Client Image**: Upload client photo (optional)
   - **Company Logo**: Upload company logo (optional)
   - **Featured**: Check to show on homepage
   - **Published**: Check to make visible
   - **Order**: Display order

4. Click **"Save"**

## File Upload Guidelines

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP

### Supported Video Formats
- MP4 (recommended)
- WebM
- OGG

### File Size Recommendations
- **Images**: Keep under 5MB for optimal performance
- **Videos**: Keep under 50MB for direct uploads (consider using video URLs for larger files)

### Using External Video URLs

Instead of uploading large video files, you can use external video URLs:
- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Other**: Any direct video URL

## Managing Categories and Tags

### Portfolio Categories
- Go to **Portfolio > Categories**
- Create categories to organize your projects (e.g., "Web Development", "Mobile Apps", "Data Science")

### Technologies
- Go to **Portfolio > Technologies**
- Add technologies you use (e.g., "Django", "React", "AWS")
- You can add an icon name/class for each technology

### Blog Categories
- Go to **Blog > Categories**
- Create categories for blog posts

### Blog Tags
- Go to **Blog > Tags**
- Create tags for blog posts (e.g., "Python", "DevOps", "Tutorial")

## Contact Messages

- Go to **Contact > Contact Messages**
- View messages submitted through the contact form
- Use reply fields when available, then mark messages as handled
- Frontend admin: `/admin/contact` (staff JWT)

## Newsletter and announcements

- Subscribers: **Newsletter** in Django admin (verify / unsubscribe tokens are credentials — do not paste them into tickets or commits)
- Post announcements: management command `send_post_announcements` (keep `NEWSLETTER_BROADCASTS_ENABLED=False` unless you intend campaign fan-out)
- Frontend admin: `/admin/newsletter`

## Blog scheduling

- Set **Publish at** on a post when you want deferred publish
- Cron / host job should run `publish_scheduled_posts` periodically

## Testimonials

- Create invite tokens from admin / API; share the submit link privately
- Public site only shows approved testimonials
- Frontend invite flow: `/testimonials/submit/[token]`

## Analytics and preferences

- Frontend: `/admin/analytics`, `/admin/preferences`, `/admin/notifications`
- Privacy: `purge_analytics` respects `ANALYTICS_IP_RETENTION_DAYS` / `ANALYTICS_ROW_RETENTION_DAYS`

## Troubleshooting (portfolio URLs)

If the browser console shows **`GET /portfolio/<slug>?_rsc=… 404`**, that is Next.js **prefetching** a project page. The frontend disables prefetch on portfolio cards/search links to avoid noise; you may still see 404s if:

- A project was **unpublished or deleted** but the user has an **old tab** or **cached** list data—refresh or clear site data.
- The **slug was changed** in admin—old bookmarks and external links break. Prefer not changing slugs after launch, or add redirects at the host if you must.

If clicking **Learn more** shows “Project not found” while the project appears in the list, check that **slug** matches in Django admin and that the project is **Published**.

## Tips

1. **Always publish content** by checking the "Published" checkbox
2. **Use featured items** to highlight important content on the homepage
3. **Set display order** to control how items appear (higher numbers first)
4. **Optimize images** before uploading for better performance
5. **Use video URLs** for large videos instead of direct uploads
6. **Test on frontend** after publishing to ensure everything displays correctly

