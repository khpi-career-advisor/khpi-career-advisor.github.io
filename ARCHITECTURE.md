# Architecture Overview

## File Dependencies Flow

```
index.html
    │
    ├── CSS (Stylesheets loaded in parallel)
    │   ├── main.css        → Base styles & animations
    │   ├── intro.css       → Intro screen styles
    │   ├── card.css        → Card & swipe styles
    │   ├── indicators.css  → YES/NO indicators
    │   └── results.css     → Results screen styles
    │
    └── JavaScript (Loaded in sequence)
        ├── 1. data.js           → Cards & directions data
        │       └── Exports: cards[], educationDirections[]
        │
        ├── 2. state.js          → State management
        │       └── Exports: AppState class, appState instance
        │
        ├── 3. calculator.js     → Results calculation
        │       └── Exports: ResultsCalculator class, resultsCalculator instance
        │       └── Uses: data.js (cards length)
        │
        ├── 4. intro.js          → Intro screen logic
        │       └── Exports: IntroController class
        │       └── Uses: state.js (appState)
        │
        ├── 5. card.js           → Card swipe logic
        │       └── Exports: CardController class
        │       └── Uses: state.js (appState), data.js (cards)
        │
        ├── 6. results.js        → Results display logic
        │       └── Exports: ResultsController class
        │       └── Uses: state.js (appState), calculator.js, data.js
        │
        └── 7. app.js            → Initialize all controllers
                └── Uses: All controller classes
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
│                      (DOM Structure)                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├─────────────────┐
              │                 │
              ▼                 ▼
    ┌──────────────┐   ┌──────────────┐
    │  CSS Styles  │   │  JavaScript  │
    │   (Visual)   │   │   (Logic)    │
    └──────────────┘   └──────┬───────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
    ┌──────────────────┐          ┌──────────────────┐
    │   Data Layer     │          │   State Layer    │
    │   - cards        │◄─────────│   - appState     │
    │   - directions   │          │   - AppState     │
    └──────────────────┘          └────────┬─────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              ▼                            ▼                            ▼
    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │ IntroController  │        │  CardController  │        │ResultsController │
    │  - Gender/Age    │───────►│  - Swipe Logic   │───────►│  - Display       │
    │  - Validation    │        │  - Touch/Mouse   │        │  - Retry         │
    └──────────────────┘        └──────────────────┘        └──────────────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │ResultsCalculator │
                                │  - Weighted Sum  │
                                │  - Percentages   │
                                └──────────────────┘
```

## User Flow

```
1. Page Load
   │
   ▼
2. Intro Screen
   ├── Select Gender
   ├── Select Age
   └── Click "Почати тест"
   │
   ▼
3. Quiz (20 cards)
   ├── Swipe Left (NO) or Right (YES)
   ├── Progress through all questions
   └── Track answers in state
   │
   ▼
4. Results Screen
   ├── Calculate percentages
   ├── Display sorted results
   ├── Click direction → Open URL
   └── Click "Спробувати ще раз" → Go to step 2
```

## State Management Flow

```
AppState (Central State)
    │
    ├── selectedGender  ────► Set by IntroController
    ├── selectedAge     ────► Set by IntroController
    ├── currentIndex    ────► Updated by CardController
    ├── swipes[]        ────► Updated by CardController
    └── results         ────► Calculated by ResultsCalculator
                              Displayed by ResultsController
```

## Key Design Decisions

1. **Separation of Concerns**
   - CSS files organized by screen/component
   - JS files organized by functionality
   - Clear dependencies between modules

2. **State Centralization**
   - Single source of truth (appState)
   - All controllers interact through state
   - Easy to debug and maintain

3. **Controller Pattern**
   - Each screen has its own controller
   - Controllers handle UI events
   - Controllers update state

4. **No Build Step**
   - Pure vanilla JavaScript
   - Direct file references
   - Easy to deploy and debug

5. **Progressive Enhancement**
   - Works without JavaScript (shows HTML)
   - Touch and mouse support
   - Responsive design
