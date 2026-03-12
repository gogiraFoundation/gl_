# Admin Guide - Content Management

This guide explains how to upload and manage content, videos, and projects through the Django admin panel.

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
- Mark messages as "Read" or "Replied" after handling them

## Tips

1. **Always publish content** by checking the "Published" checkbox
2. **Use featured items** to highlight important content on the homepage
3. **Set display order** to control how items appear (higher numbers first)
4. **Optimize images** before uploading for better performance
5. **Use video URLs** for large videos instead of direct uploads
6. **Test on frontend** after publishing to ensure everything displays correctly

