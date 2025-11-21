# Polytech Quiz - "Який ти Політехнік?"

An interactive quiz application to help prospective students find their ideal education direction at Kharkiv Polytechnic Institute (KPI).

## Project Structure

```
polytech-quiz/
├── index.html              # Main HTML file
├── css/                    # Stylesheets
│   ├── main.css           # Base styles and animations
│   ├── intro.css          # Intro screen styles
│   ├── card.css           # Card swipe styles
│   ├── indicators.css     # Decision indicators styles
│   └── results.css        # Results screen styles
├── js/                     # JavaScript modules
│   ├── data.js            # Quiz questions and education directions data
│   ├── state.js           # Application state management
│   ├── calculator.js      # Results calculation logic
│   ├── intro.js           # Intro screen controller
│   ├── card.js            # Card swipe controller
│   ├── results.js         # Results screen controller
│   └── app.js             # Main application initialization
└── README.md              # This file
```

## Architecture

### CSS Organization

- **main.css**: Base styles, reset, animations, and container layout
- **intro.css**: Intro screen with gender/age selection
- **card.css**: Swipeable card interface with questions
- **indicators.css**: Visual YES/NO swipe indicators
- **results.css**: Results screen with animated percentages

### JavaScript Modules

1. **data.js**: Contains all quiz questions (cards) and education direction definitions
2. **state.js**: Central state management using AppState class
3. **calculator.js**: Algorithm to calculate education direction percentages based on answers
4. **intro.js**: Handles intro screen logic (gender/age selection)
5. **card.js**: Manages card creation, swipe gestures, and animations
6. **results.js**: Displays results and handles retry functionality
7. **app.js**: Initializes all controllers when DOM is ready

## Dependencies Loading Order

The JavaScript files must be loaded in this specific order:

1. `data.js` - Provides card and education direction data
2. `state.js` - Creates global state management
3. `calculator.js` - Results calculation utility
4. `intro.js` - Intro screen controller
5. `card.js` - Card swipe controller
6. `results.js` - Results screen controller
7. `app.js` - Initializes all controllers

## Features

- **Responsive Design**: Works on mobile and desktop
- **Touch & Mouse Support**: Swipe with touch or drag with mouse
- **Smooth Animations**: Rainbow gradients and smooth transitions
- **State Management**: Clean separation of concerns
- **Modular Architecture**: Easy to maintain and extend

## How It Works

1. **Intro Screen**: User selects gender and age range
2. **Quiz Cards**: User swipes left (NO) or right (YES) on 20 questions
3. **Calculation**: Weighted algorithm calculates match percentages for 4 education directions
4. **Results**: Display sorted results with links to KPI admission pages

## Education Directions

1. **ІТ-освіта** (IT Education)
2. **Інженерно-технічна освіта** (Engineering Education)
3. **Бізнес-освіта** (Business Education)
4. **Соціально-гуманітарна освіта** (Social & Humanitarian Education)

## Running the Application

Simply open `index.html` in a modern web browser. No build process or server required.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

- Uses vanilla JavaScript (no frameworks)
- CSS-only animations with keyframes
- Module pattern for organization
- Event delegation for performance
- Touch events for mobile support
