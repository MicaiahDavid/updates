# Micaiah David - Retinoblastoma Updates

This site uses a simple JSON-based content management system that allows you to update content without editing HTML files directly.

## How to Update Content

All content is stored in `data.json`. To update the site:

1. **Open `data.json`** in any text editor
2. **Edit the content** you want to change
3. **Commit and push** to GitHub
4. GitHub Pages will automatically rebuild the site

## Content Structure

### Sidebar Content
- `sidebar.treatmentMilestones` - Update treatment status (diagnosis, MRI results, chemo start date)
- `sidebar.howToPray` - List of prayer requests
- `sidebar.howToGiveThanks` - List of things to give thanks for

### Adding a New Blog Post

To add a new blog post:

1. Add a new object to the `blogPosts` array in `data.json`
2. Use the next sequential ID (current posts are IDs 1, 2, 3)
3. Include these required fields:
   - `id`: Unique number for the post
   - `title`: Post title
   - `date`: Publication date
   - `excerpt`: Short summary for the index page
   - `heroImage`: Path to hero image (in `images/` folder)
   - `heroImagePosition`: Image focus position (e.g., "[50%_30%]")
   - `color`: Theme color (green, blue, purple, etc.)
   - `isStart`: Set to `true` for the first post readers should see
   - `content`: Array of content blocks (see below)

4. Create a new HTML file `blog-post-{id}.html` by copying an existing blog post file
5. The JavaScript will automatically load content based on the post ID

### Content Block Types

Blog post content uses these block types:

**Paragraph:**
```json
{
  "type": "paragraph",
  "text": "Your paragraph text here"
}
```

**Single Image:**
```json
{
  "type": "image",
  "src": "images/your-image.jpg",
  "alt": "Image description",
  "caption": "Image caption",
  "width": "w-full"  // or "w-2/5" for smaller images
}
```

**Multiple Images (single caption):**
```json
{
  "type": "images",
  "images": [
    {"src": "images/image1.jpg", "alt": "Description 1"},
    {"src": "images/image2.jpg", "alt": "Description 2"}
  ],
  "caption": "Shared caption for both images"
}
```

**Multiple Images (individual captions):**
```json
{
  "type": "images",
  "images": [
    {"src": "images/image1.jpg", "alt": "Description 1"},
    {"src": "images/image2.jpg", "alt": "Description 2"}
  ],
  "captions": ["Caption 1", "Caption 2"]
}
```

## Adding Images

1. Place new images in the `images/` folder
2. Reference them in `data.json` using the path `images/your-image.jpg`
3. Commit and push both the image and the updated `data.json`

## Site Information

Update site-wide information in `data.json` under the `site` object:
- `lastUpdated`: Date shown in hero section
- `shareMessage`: Message encouraging visitors to share the page

## GitHub Pages Deployment

This site is designed for GitHub Pages. To deploy:

1. Push all changes to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the branch to deploy (usually `main` or `gh-pages`)
4. The site will be available at `https://yourusername.github.io/repository-name`

## Troubleshooting

If content doesn't update:
1. Clear your browser cache
2. Check that `data.json` is valid JSON (use a JSON validator)
3. Ensure `load-content.js` is in the same directory as your HTML files
4. Check browser console for JavaScript errors
