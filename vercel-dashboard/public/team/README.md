# Team Member Images

## How to Add Team Photos

Place your team member profile photos in this folder with the following naming convention:

### Required Filenames:

**Mentors:**
- `dr-aftab.jpg` - Dr. Aftab Ahmed Ansari
- `dr-praveen.jpg` - Dr. Praveen Bansal

**Student Development Team:**
- `aryan.jpg` - Aryan Kumar Bhargava
- `tejaswa.jpg` - Tejaswa Singh Rana
- `vansh-s.jpg` - Vansh Shrivastava
- `yuvraj.jpg` - Yuvraj Yadav
- `vansh-t.jpg` - Vansh Trivedi

### Image Specifications:
- **Size:** 400x400px minimum (recommended: 512x512px)
- **Format:** JPG or PNG
- **Aspect Ratio:** 1:1 (square)
- **File Size:** Under 500KB for optimal performance
- **Quality:** High resolution, professional headshots
- **Background:** Prefer solid or blurred backgrounds for better consistency

### Image Guidelines:
✅ **DO:**
- Use high-quality, professional photos
- Ensure good lighting and clear faces
- Center the face in the frame
- Use consistent style across all team members
- Compress images to reduce file size without quality loss

❌ **DON'T:**
- Use low-resolution or blurry images
- Include distracting backgrounds
- Use selfies or casual photos
- Exceed 1MB per image

## Fallback Behavior

If an image is not found or fails to load, the component will automatically display a gradient circle placeholder with the team member's assigned color:

- **Aryan** - Green gradient
- **Tejaswa** - Blue gradient
- **Vansh Shrivastava** - Purple gradient
- **Yuvraj** - Orange gradient
- **Vansh Trivedi** - Pink gradient

## Features Implemented

### ✨ Premium Effects:
- **Circular Avatars** with `rounded-full`
- **Object Cover** for proper image fitting
- **Subtle Borders** with semi-transparent white borders
- **Soft Shadow Effects** on hover
- **Consistent Sizing** (96px × 96px / w-24 h-24)

### 🎨 Animations:
- **Scroll Animations** - Cards fade in and slide up when scrolling into view
- **Staggered Delay** - Each card animates sequentially (0.1s intervals)
- **Hover Scale-up** - Images scale to 110% on hover
- **Glow Effect** - Pulsing green glow animation on hover
- **Card Lift** - Entire card lifts 12px with shadow enhancement

### ⚡ Performance:
- **Lazy Loading** - Images load only when near viewport
- **Intersection Observer** - Modern browser API for efficient detection
- **Fade-in Animation** - Smooth appearance when loaded
- **Error Handling** - Graceful fallback to gradients

### 🔗 Social Media:
- **Hover Overlay** - Dark overlay with social icons appears on image hover
- **GitHub Icon** - Links to GitHub profile
- **LinkedIn Icon** - Links to LinkedIn profile
- **Twitter Icon** - Links to Twitter profile
- **Smooth Transitions** - Icon hover effects with color changes

### 📱 Responsive Design:
- **Mobile:** Single column layout
- **Tablet:** 3 columns
- **Desktop:** 5 columns
- **Optimized animations** for mobile devices (reduced complexity)

## Updating Social Links

Edit the `social` prop in `/pages/index.js` for each team member:

```javascript
social={{
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username"
}}
```

Leave empty or remove properties you don't want to display.

## Testing

After adding images:
1. Clear your browser cache
2. Refresh the page
3. Scroll to the Team section
4. Verify lazy loading by checking network tab
5. Test hover effects on desktop
6. Test responsive behavior on mobile/tablet

---

**Note:** The component is designed to work beautifully with or without actual images. The gradient placeholders maintain the premium look until you're ready to add real photos.
