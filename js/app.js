// Main Application Initialization
// Initialize controllers when DOM is ready
let introController;
let cardController;
let resultsController;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Polytech Quiz application...');
    
    // Initialize all controllers
    introController = new IntroController();
    cardController = new CardController();
    resultsController = new ResultsController();
    
    console.log('Application initialized successfully!');
});
