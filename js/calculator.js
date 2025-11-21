// Results Calculator
class ResultsCalculator {
    constructor() {
        this.model = [
            {
                id: 1,
                weights: [0, 0, 0, 0.20, 0, 0, 0.25, 0, 0, 0, 0, 0.15, 0, 0, 0, 0.30, 0, 0, 0.10, 0]
            },
            {
                id: 2,
                weights: [0, 0.25, 0, 0, 0, 0.30, 0, 0, 0, 0.20, 0, 0, 0, 0.15, 0, 0, 0, 0.10, 0, 0]
            },
            {
                id: 3,
                weights: [0, 0, 0.25, 0, 0.10, 0, 0, 0, 0.25, 0, 0, 0, 0.20, 0, 0, 0, 0.20, 0, 0, 0]
            },
            {
                id: 4,
                weights: [0.20, 0, 0, 0, 0, 0, 0, 0.25, 0, 0, 0.10, 0, 0, 0, 0.25, 0, 0, 0, 0, 0.20]
            }
        ];
    }

    calculatePercentages(swipes) {
        const probabilities = this.model.map(category => {
            let weightedSum = 0;

            for (let i = 0; i < swipes.length; i++) {
                weightedSum += category.weights[i] * swipes[i];
            }

            return {
                id: category.id,
                probability: weightedSum
            };
        });

        const results = probabilities.map(item => ({
            id: item.id,
            percentage: Math.round(item.probability * 100)
        }));

        console.log('Calculated results:', results);

        return results;
    }
}

// Create global calculator instance
const resultsCalculator = new ResultsCalculator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResultsCalculator, resultsCalculator };
}
