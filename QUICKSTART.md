# Quick Start Guide

## Getting Started

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No installation or build process required

2. **File Structure**
   ```
   polytech-quiz/
   ├── index.html          ← Open this file
   ├── css/                ← 5 CSS files
   ├── js/                 ← 7 JavaScript files
   ├── README.md           ← Full documentation
   └── ARCHITECTURE.md     ← Technical details
   ```

## Modifying the Quiz

### Adding/Removing Questions

Edit `js/data.js`:
```javascript
const cards = [
    {
        image: 'https://...',
        text: 'Your question here?'
    },
    // Add more cards...
];
```

### Changing Education Directions

Edit `js/data.js`:
```javascript
const educationDirections = [
    {
        id: 1,
        name: 'Direction Name',
        url: 'https://...'
    },
    // Add more directions...
];
```

### Adjusting Calculation Weights

Edit `js/calculator.js`:
```javascript
this.model = [
    {
        id: 1,
        weights: [0, 0.20, 0.25, ...] // One weight per question
    },
    // Weights for each direction...
];
```

## Styling Changes

- **Colors/Themes**: Edit `css/main.css`
- **Intro Screen**: Edit `css/intro.css`
- **Card Design**: Edit `css/card.css`
- **Indicators**: Edit `css/indicators.css`
- **Results Screen**: Edit `css/results.css`

## JavaScript Structure

1. **data.js** - Questions and directions
2. **state.js** - Application state
3. **calculator.js** - Results algorithm
4. **intro.js** - Intro screen logic
5. **card.js** - Swipe functionality
6. **results.js** - Results display
7. **app.js** - Initialization

## Troubleshooting

**Cards not showing?**
- Check browser console for errors
- Verify all JavaScript files are loaded in order
- Check that `cards` array in `data.js` is properly formatted

**Swipe not working?**
- Ensure touch/mouse events are not blocked
- Check that CardController is initialized
- Test in different browsers

**Results not calculating?**
- Verify weights array length matches cards array length
- Check calculator model IDs match direction IDs
- Look for console.log messages

## Browser Testing

Test in:
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop)

## Performance Tips

- Image URLs use Unsplash CDN (fast loading)
- CSS animations use GPU acceleration
- Event listeners properly cleaned up
- Minimal DOM manipulation

## Deployment

1. Upload entire `polytech-quiz/` folder to web server
2. Ensure proper MIME types:
   - `.html` → `text/html`
   - `.css` → `text/css`
   - `.js` → `application/javascript`
3. No server-side processing needed
4. Works with GitHub Pages, Netlify, etc.

## Need Help?

Check:
1. `README.md` - Project overview
2. `ARCHITECTURE.md` - Technical details
3. Browser console - Error messages
4. Code comments - Inline documentation
