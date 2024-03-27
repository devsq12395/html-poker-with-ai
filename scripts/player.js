

class Player {
    constructor (name, isAI, id){
        this.name = name;
        this.id = id;
        this.stack = _RULES.STARTING_STACK;
        this.betCur = 0;
        this.pos = '';

        this.hand = [];
        this.handHistoryAI = [];

        this.isAI = isAI;
    }

    bet = (amount) => {
        window.gameHandler.player_doAction (this, 'bet', amount);
    }
}