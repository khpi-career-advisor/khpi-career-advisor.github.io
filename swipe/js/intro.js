// Intro Screen Controller
class IntroController {
    constructor() {
        this.introScreen = document.getElementById('introScreen');
        this.genderButtons = document.querySelectorAll('.gender-btn');
        this.ageButtons = document.querySelectorAll('.age-btn');
        this.confirmBtn = document.getElementById('confirmBtn');
        
        this.init();
    }

    init() {
        // Initialize button as disabled
        this.confirmBtn.disabled = true;

        // Setup event listeners
        this.genderButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleGenderSelect(btn));
        });

        this.ageButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleAgeSelect(btn));
        });

        this.confirmBtn.addEventListener('click', () => this.handleConfirm());
    }

    handleGenderSelect(btn) {
        this.genderButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        appState.setGender(btn.dataset.gender);
        this.updateConfirmButton();
    }

    handleAgeSelect(btn) {
        this.ageButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        appState.setAge(btn.dataset.age);
        this.updateConfirmButton();
    }

    updateConfirmButton() {
        this.confirmBtn.disabled = !appState.isFormComplete();
    }

    handleConfirm() {
        // Hide intro screen
        this.introScreen.classList.add('hidden');

        // Start the card swiping
        setTimeout(() => {
            if (typeof cardController !== 'undefined') {
                cardController.showNextCard();
            }
        }, 500);
    }

    reset() {
        // Reset form
        this.genderButtons.forEach(b => b.classList.remove('selected'));
        this.ageButtons.forEach(b => b.classList.remove('selected'));
        this.confirmBtn.disabled = true;

        // Show intro screen
        this.introScreen.classList.remove('hidden');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntroController;
}
