// State Management
class AppState {
    constructor() {
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.currentCard = null;
        this.selectedGender = null;
        this.selectedAge = null;
        this.swipeResults = {
            gender: null,
            age: null,
            swipes: [],
            suggestion: null
        };
    }

    reset() {
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.currentCard = null;
        this.selectedGender = null;
        this.selectedAge = null;
        this.swipeResults = {
            gender: null,
            age: null,
            swipes: [],
            suggestion: null
        };
    }

    setGender(gender) {
        this.selectedGender = gender;
        this.swipeResults.gender = gender;
    }

    setAge(age) {
        this.selectedAge = age;
        this.swipeResults.age = age;
    }

    addSwipe(value) {
        this.swipeResults.swipes.push(value);
    }

    isFormComplete() {
        return this.selectedGender && this.selectedAge;
    }

    isQuizComplete() {
        return this.swipeResults.swipes.length >= cards.length;
    }

    getNextCardIndex() {
        const index = this.currentIndex;
        this.currentIndex = (this.currentIndex + 1) % cards.length;
        return index;
    }
}

// Create global state instance
const appState = new AppState();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, appState };
}
