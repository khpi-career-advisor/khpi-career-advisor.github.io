// Results Calculator: відсоток напряму = округл(100 × Σ вагаᵢ × відповідьᵢ)
// Відповіді — значення 0 / 0.25 / 0.75 / 1 зі шкали js/answers.js.
class ResultsCalculator {
    constructor(model) {
        this.model = model;
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

        return probabilities.map(item => ({
            id: item.id,
            percentage: Math.round(item.probability * 100)
        }));
    }
}

const resultsCalculator = new ResultsCalculator(MODEL_WEIGHTS);
