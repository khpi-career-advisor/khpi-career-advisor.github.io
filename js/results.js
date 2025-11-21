// Results Controller
class ResultsController {
    constructor() {
        this.resultsScreen = document.getElementById('resultsScreen');
        this.resultsList = document.getElementById('resultsList');
        this.retryBtn = document.getElementById('retryBtn');
        
        this.init();
    }

    init() {
        this.retryBtn.addEventListener('click', () => this.handleRetry());
    }

    showResults() {
        // Calculate percentages based on swipe results
        const categoryResults = resultsCalculator.calculatePercentages(appState.swipeResults.swipes);

        appState.swipeResults.suggestion = categoryResults;

        console.log('Final results:', JSON.stringify(appState.swipeResults, null, 2));

        // Map results to education directions using IDs
        const results = categoryResults
            .map(cat => {
                const direction = educationDirections.find(d => d.id === cat.id);
                return {
                    name: direction.name,
                    url: direction.url,
                    percentage: cat.percentage
                };
            })
            .sort((a, b) => b.percentage - a.percentage);

        // Clear and populate results list
        this.resultsList.innerHTML = '';
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.onclick = () => window.open(result.url, '_blank');

            const bg = document.createElement('div');
            bg.className = 'result-item-bg';
            bg.style.width = '0%';
            item.appendChild(bg);

            const content = document.createElement('div');
            content.className = 'result-item-content';

            const name = document.createElement('span');
            name.className = 'result-item-name';
            name.textContent = result.name;

            const percent = document.createElement('span');
            percent.className = 'result-item-percent';
            percent.textContent = result.percentage + '%';

            content.appendChild(name);
            content.appendChild(percent);
            item.appendChild(content);

            this.resultsList.appendChild(item);

            // Animate background width after a delay
            setTimeout(() => {
                bg.style.width = result.percentage + '%';
            }, 100 * (index + 1));
        });

        // Show results screen
        this.resultsScreen.classList.add('visible');
    }

    handleRetry() {
        // Hide results screen
        this.resultsScreen.classList.remove('visible');

        // Reset state
        appState.reset();

        // Reset other controllers
        if (typeof introController !== 'undefined') {
            introController.reset();
        }
        if (typeof cardController !== 'undefined') {
            cardController.reset();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsController;
}
