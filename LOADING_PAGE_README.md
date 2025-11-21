# Loading Page for ThreeJS Graces

This loading page provides a beautiful, animated introduction to your ThreeJS Graces project before users enter the main 3D experience.

## Features

- **Smooth GSAP Animations**: Professional-grade animations using GSAP and ScrollTrigger
- **Responsive Design**: Works on all device sizes
- **Interactive Elements**: Click button or use keyboard/touch controls to enter
- **Auto-advance**: Automatically proceeds to main experience after 15 seconds
- **Modern UI**: Clean, professional design with gradient effects

## Files

- `loading.html` - Main loading page HTML
- `loading.css` - Styling for the loading page
- `loading.js` - Animation logic and interactions

## How to Use

1. **Set as Entry Point**: Make `loading.html` your default page or redirect users there first
2. **Customize Content**: Update the text, images, and branding to match your project
3. **Modify Redirect**: Change the `enterExperience()` function to point to your main page

## Customization

### Changing Text Content

Edit the HTML content in `loading.html`:

```html
<h3 class="hero-text">
    Loading<br />
    Experience<br />
    ...
</h3>
```

### Updating Images

Replace the placeholder SVG images with your own:

```html
<img
    class="hero-main-logo"
    src="path/to/your/logo.png"
    alt="Your Logo"
/>
```

### Modifying Colors

Update the color scheme in `loading.css`:

```css
.hero-text-logo {
    background: radial-gradient(circle at center, #your-color 0%, #your-secondary-color 100%);
}
```

### Adjusting Animation Timing

Modify the animation durations in `loading.js`:

```javascript
gsap.from(".hero-main-container", {
    scale: 1.45,
    duration: 2.8, // Adjust this value
    ease: "power3.out",
});
```

## Integration with Your Project

### Option 1: Replace Main Entry Point
- Rename `loading.html` to `index.html`
- Rename your current `index.html` to `main.html`
- Update the redirect in `loading.js` to point to `main.html`

### Option 2: Add to Existing Structure
- Keep both files
- Add a link to `loading.html` from your main navigation
- Users can choose to view the loading experience

### Option 3: Conditional Loading
- Add logic to show loading page only on first visit
- Use localStorage to track user preferences

## Browser Support

- Modern browsers with ES6+ support
- GSAP 3.12.2+ required
- ScrollTrigger plugin required
- Mobile-friendly with touch support

## Performance Notes

- Animations are optimized for smooth 60fps playback
- Uses CSS transforms and opacity for best performance
- Minimal DOM manipulation during animations
- Responsive design prevents layout shifts

## Troubleshooting

### Animations Not Working
- Ensure GSAP and ScrollTrigger are loaded
- Check browser console for JavaScript errors
- Verify all CSS classes are properly defined

### Mobile Issues
- Test touch interactions on actual devices
- Adjust animation timing for slower devices
- Consider reducing animation complexity on mobile

### Performance Issues
- Reduce animation duration values
- Simplify gradient effects
- Use `will-change` CSS property for animated elements

## Credits

- **GSAP**: GreenSock Animation Platform
- **ScrollTrigger**: GSAP plugin for scroll-based animations
- **Fonts**: Google Fonts (Josefin Sans, DM Serif Display, Nanum Myeongjo)

## License

This loading page is part of the ThreeJS Graces project. Customize and use as needed for your projects.
