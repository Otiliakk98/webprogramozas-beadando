/**
 * Objektumorientált JavaScript alkalmazás
 * Egyszerű memóriajáték
 */

// Alaposztály a játék elemekhez
class GameElement {
    constructor(type, content) {
        this.type = type;
        this.content = content;
        this.element = document.createElement('div');
        this.element.className = `game-element ${type}`;
        this.element.textContent = content;
    }

    // Elem megjelenítése
    render(container) {
        container.appendChild(this.element);
        return this;
    }

    // Eseményfigyelő hozzáadása
    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
        return this;
    }
}

// Játékos osztály
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    increaseScore(points) {
        this.score += points;
        return this;
    }

    displayScore(container) {
        const scoreElement = new GameElement('score', `${this.name} pontjai: ${this.score}`);
        scoreElement.render(container);
        return this;
    }
}

// Játék osztály (a GameElement-ből örököl)
class MemoryGame extends GameElement {
    constructor(containerId) {
        super('game-container', '');
        this.container = document.getElementById(containerId);
        this.player = new Player("Játékos");
        this.cards = [];
        this.selectedCards = [];
        this.initGame();
    }

    initGame() {
        // Kártyapárok létrehozása
        const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const pairs = [...symbols, ...symbols];
        
        // Keverés
        pairs.sort(() => Math.random() - 0.5);
        
        // Kártyák generálása
        this.cards = pairs.map((symbol, index) => {
            const card = new GameElement('card', '❓');
            card.symbol = symbol;
            card.isFlipped = false;
            card.isMatched = false;
            
            card.render(this.container)
                .addEventListener('click', () => this.flipCard(card));
            
            return card;
        });
        
        // Pontszám megjelenítése
        this.player.displayScore(document.getElementById('scoreBoard'));
    }

    flipCard(card) {
        // Ha már felfordították vagy párosították, ne csináljunk semmit
        if (card.isFlipped || card.isMatched || this.selectedCards.length >= 2) return;
        
        // Kártya megfordítása
        card.element.textContent = card.symbol;
        card.isFlipped = true;
        this.selectedCards.push(card);
        
        // Ha két kártya van kiválasztva, ellenőrizzük
        if (this.selectedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    checkMatch() {
        const [card1, card2] = this.selectedCards;
        
        if (card1.symbol === card2.symbol) {
            // Páros találat
            card1.isMatched = true;
            card2.isMatched = true;
            this.player.increaseScore(10);
        } else {
            // Nem páros, visszafordítjuk
            card1.element.textContent = '❓';
            card2.element.textContent = '❓';
            card1.isFlipped = false;
            card2.isFlipped = false;
        }
        
        this.selectedCards = [];
        this.updateScore();
        
        // Játék vége ellenőrzése
        if (this.cards.every(card => card.isMatched)) {
            this.endGame();
        }
    }

    updateScore() {
        document.querySelector('.score').textContent = 
            `${this.player.name} pontjai: ${this.player.score}`;
    }

    endGame() {
        const message = new GameElement(
            'message', 
            `Gratulálok! ${this.player.name}, nyertél! Pontszám: ${this.player.score}`
        );
        message.render(this.container);
    }
}

// Új játék indítása
document.getElementById('newGameBtn').addEventListener('click', () => {
    document.getElementById('gameContainer').innerHTML = '';
    document.getElementById('scoreBoard').innerHTML = '';
    new MemoryGame('gameContainer');
});

// Oldal betöltésekor automatikusan elindul egy játék
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame('gameContainer');
});