// Results Calculator
class ResultsCalculator {
    constructor() {
        this.model = [
            {
                id: 1,
                weights: [0.0173, 0.0657, 0.0440, 0.1299, 0.0289, 0.0334, 0.1049, 0.0109, 0.0209, 0.0882, 0.0079, 0.0757, 0.0247, 0.0574, 0.0051, 0.1799, 0.0140, 0.0025, 0.0502, 0.0384]
            },
            {
                id: 2,
                weights: [0.0079, 0.1799, 0.0440, 0.1049, 0.0209, 0.1299, 0.0384, 0.0051, 0.0140, 0.0882, 0.0173, 0.0574, 0.0247, 0.0757, 0.0025, 0.0334, 0.0109, 0.0657, 0.0289, 0.0502]
            },
            {
                id: 3,
                weights: [0.0440, 0.0079, 0.1299, 0.0574, 0.1049, 0.0025, 0.0173, 0.0384, 0.1799, 0.0334, 0.0209, 0.0289, 0.0882, 0.0140, 0.0247, 0.0109, 0.0757, 0.0051, 0.0502, 0.0657]
            },
            {
                id: 4,
                weights: [0.1299, 0.0051, 0.0440, 0.0247, 0.0657, 0.0025, 0.0079, 0.1049, 0.0140, 0.0109, 0.0882, 0.0173, 0.0209, 0.0289, 0.1799, 0.0334, 0.0502, 0.0384, 0.0574, 0.0757]
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
