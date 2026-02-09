// Main Application Initialization
// Initialize controllers when DOM is ready
let introController;
let cardController;
let resultsController;
let jsonBucket;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Polytech Quiz application...');

    // Initialize all controllers
    introController = new IntroController();
    cardController = new CardController();
    resultsController = new ResultsController();
    jsonBucket = new LocalStorageCollection('khpi-career-advisor');

    console.log('Application initialized successfully!');
});