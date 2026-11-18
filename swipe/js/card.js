// Card Controller
class CardController {
    constructor() {
        this.container = document.getElementById('container');
        this.noIndicator = document.getElementById('noIndicator');
        this.yesIndicator = document.getElementById('yesIndicator');
        
        // Bind methods to maintain context
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }

    createCard(index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundImage = `url(${cards[index].image})`;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        card.appendChild(overlay);

        const glowText = document.createElement('div');
        glowText.className = 'glow-text';

        // start: add swipe tip
        glowText.innerHTML = cards[index].text;
        glowText.innerHTML += '</br><small>(cвайп вліво або вправо)<small>';
        // end: add swipe tip

        card.appendChild(glowText);

        const leftHint = document.createElement('div');
        leftHint.className = 'swipe-hint left';
        leftHint.textContent = '✕';
        card.appendChild(leftHint);

        const rightHint = document.createElement('div');
        rightHint.className = 'swipe-hint right';
        rightHint.textContent = '✓';
        card.appendChild(rightHint);

        card.addEventListener('touchstart', this.handleStart);
        card.addEventListener('mousedown', this.handleStart);

        return card;
    }

    showNextCard() {
        // Remove old behind card if exists
        const oldBehind = document.querySelector('.card.behind');
        if (oldBehind) {
            oldBehind.remove();
        }

        // Create and add current card on top
        const index = appState.getNextCardIndex();
        appState.currentCard = this.createCard(index);
        this.container.appendChild(appState.currentCard);
    }

    handleStart(e) {
        appState.isDragging = true;
        appState.currentCard = e.currentTarget;
        appState.currentCard.classList.add('swiping');

        const touch = e.touches ? e.touches[0] : e;
        appState.startX = touch.clientX;

        document.addEventListener('touchmove', this.handleMove);
        document.addEventListener('mousemove', this.handleMove);
        document.addEventListener('touchend', this.handleEnd);
        document.addEventListener('mouseup', this.handleEnd);
    }

    handleMove(e) {
        if (!appState.isDragging) return;

        const touch = e.touches ? e.touches[0] : e;
        appState.currentX = touch.clientX - appState.startX;

        const rotation = appState.currentX / 20;
        appState.currentCard.style.transform = `translateX(${appState.currentX}px) rotate(${rotation}deg)`;

        const leftHint = appState.currentCard.querySelector('.swipe-hint.left');
        const rightHint = appState.currentCard.querySelector('.swipe-hint.right');

        if (appState.currentX < -50) {
            leftHint.classList.add('visible');
            rightHint.classList.remove('visible');
            this.noIndicator.classList.add('active');
            this.yesIndicator.classList.remove('active');
        } else if (appState.currentX > 50) {
            rightHint.classList.add('visible');
            leftHint.classList.remove('visible');
            this.yesIndicator.classList.add('active');
            this.noIndicator.classList.remove('active');
        } else {
            leftHint.classList.remove('visible');
            rightHint.classList.remove('visible');
            this.noIndicator.classList.remove('active');
            this.yesIndicator.classList.remove('active');
        }
    }

    handleEnd() {
        if (!appState.isDragging) return;
        appState.isDragging = false;

        document.removeEventListener('touchmove', this.handleMove);
        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('touchend', this.handleEnd);
        document.removeEventListener('mouseup', this.handleEnd);

        this.noIndicator.classList.remove('active');
        this.yesIndicator.classList.remove('active');

        if (appState.currentX < -100) {
            appState.currentCard.classList.remove('swiping');
            appState.currentCard.classList.add('swipe-left');
            appState.addSwipe(0); // NO
            setTimeout(() => {
                appState.currentCard.remove();
                this.checkIfComplete();
            }, 500);
        } else if (appState.currentX > 100) {
            appState.currentCard.classList.remove('swiping');
            appState.currentCard.classList.add('swipe-right');
            appState.addSwipe(1); // YES
            setTimeout(() => {
                appState.currentCard.remove();
                this.checkIfComplete();
            }, 500);
        } else {
            appState.currentCard.classList.remove('swiping');
            appState.currentCard.style.transform = '';
            const hints = appState.currentCard.querySelectorAll('.swipe-hint');
            hints.forEach(hint => hint.classList.remove('visible'));
        }

        appState.currentX = 0;
    }

    checkIfComplete() {
        if (appState.isQuizComplete()) {
            // All cards swiped, show results
            if (typeof resultsController !== 'undefined') {
                resultsController.showResults();
            }
        } else {
            // Show next card
            this.showNextCard();
        }
    }

    reset() {
        // Clear container
        this.container.innerHTML = '';
        
        // Re-add decision indicators
        const indicators = `
            <div class="decision-indicators">
                <div class="indicator no" id="noIndicator">
                    <span class="arrow">←</span>
                    <span>НІ</span>
                </div>
                <div class="indicator yes" id="yesIndicator">
                    <span>ТАК</span>
                    <span class="arrow">→</span>
                </div>
            </div>
        `;
        this.container.innerHTML = indicators;
        
        // Re-initialize indicators
        this.noIndicator = document.getElementById('noIndicator');
        this.yesIndicator = document.getElementById('yesIndicator');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardController;
}
