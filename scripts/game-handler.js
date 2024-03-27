

class GameHandler {
    constructor (){
        this.players = [];
        this.pot = 0;
        this.curBet = 0;
        this.curTurn = null;
        this.curBtn = 0;

        this.handHistory = [];
        this.deck = [];
        this.board = [];

        this.playersCountBeforeSwitch = 0;
        this.phase = 'pre-flop';
    }

    init () {
        // Create players
        this.createPlayer ('user', false, 0);
        this.createPlayer ('gemini', true, 1);

        this.startNewHand ();
    }

    createPlayer (name, isAI, index) { this.debugLog (`joining new player ${name}. isAI = ${isAI}`);
        let newPlayer = new Player (name, isAI, index);
        this.players.push (newPlayer);

        domTable.createPlayer (name, index);
    }

    shuffleDeck () {
        // Create a new deck
        this.deck = [];
        this.handHistoryAI = [];

        let values = ['A', 'K', 'Q', 'J', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
            suits = ['h', 'd', 'c', 's'];

        suits.forEach ((suit) => {
            let cardsInSuit = values.map ((value) => value + suit);
            this.deck.push (...cardsInSuit);
        });
        
        // Shuffle the deck
        let currentIndex = this.deck.length;
        let temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor (Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = this.deck [currentIndex];
            this.deck [currentIndex] = this.deck [randomIndex];
            this.deck [randomIndex] = temporaryValue;
        }

        this.debugLog (`deck shuffled`);
    }

    startNewHand () { this.debugLog (`starting a new hand`);
        this.shuffleDeck ();
        this.phase = 'pre-flop';

        this.players.forEach ((player) => {
            player.hand = this.dealCard (2);

            this.debugLog (`${player.name}'s new hand is ${player.hand[0]}, ${player.hand[1]}`);
            player.handHistoryAI = [];
            this.addHandHistory_AI (player, `You are dealt ${player.hand[0]} & ${player.hand[1]}`, false);
        });
        this.playersCountBeforeSwitch = this.players.length - 1;
        this.assignPositions ();

        this.updateAllPlayerStackInDom ();
    }

    dealCard (amount) { 
        return this.deck.splice (0, amount);
    }

    assignPositions () {
        this.curBtn++;
        if (this.curBtn >= this.players.length) this.curBtn = 0;

        let positions = ['BTN', 'BB'],
            curPlayerToAssign = this.curBtn;
        while (positions.length > 0) {
            let curPlayer = this.players [curPlayerToAssign];

            this.debugLog (`assigning position of ${positions[0]} to ${curPlayer.name}`);
            this.addHandHistory_AI (curPlayer, `{player} position: ${positions[0]}`);
            curPlayer.pos = positions [0];

            if (curPlayer.pos == 'BB') {
                this.debugLog (`${curPlayer.name} is betting the big blind`);

                this.curTurn = curPlayer;
                this.player_doAction (curPlayer, 'bet', _RULES.BIG_BLIND);
            }

            positions.splice (0, 1);
            curPlayerToAssign++;
            if (curPlayerToAssign > this.players.length - 1) curPlayerToAssign = 0;
        }
    }

    player_doAction (player, action, amount) {
        if (typeof (player) === "string") {
            player = this.players.find (obj => obj.name === player);
        }

        switch (action) {
            case 'bet': 
                player.betCur = amount;
                player.stack -= amount;

                this.debugLog (`${player.name} bets ${amount}`);
                this.addHandHistory_AI (player, `{player} bets: ${amount}. {pot-stat}`);

                this.curBet = amount;
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length - 1;

                break;
            case 'raise': 
                this.curBet += amount;

                let amountToRaise = this.curBet - player.betCur;
                player.betCur += amountToRaise;
                player.stack -= amountToRaise;

                this.debugLog (`${player.name} raised for ${amount} more`);
                this.addHandHistory_AI (player, `{player} raised to ${this.curBet} chips. {pot-stat}`);
                
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length - 1;

                break;
            case 'call': 
                player.stack -= this.curBet - player.betCur;
                player.betCur = this.curBet;

                this.debugLog (`${player.name} calls`);
                this.addHandHistory_AI (player, `{player} called. {pot-stat}`);

                this.playersCountBeforeSwitch--;

                break;
            case 'fold': 
                player.hand = [];

                this.debugLog (`${player.name} folds`);
                this.addHandHistory_AI (player, `{player} folds.`);

                this.playersCountBeforeSwitch--;

                break;

        }

        this.updateAllPlayerStackInDom ();

        this.changeTurn ();
    }

    changeTurn () { 
        this.debugLog (`changing the turn`);

        let playersLeft = this.players.filter ((player)=>player.hand.length > 0).length;

        if (playersLeft > 1) {
            if (this.playersCountBeforeSwitch > 0) {
                this.switchCurTurn ();
            } else {
                this.changePhase ();
            }
        } else {
            this.awardPot ();
        }
    }

    changePhase () { 
        this.debugLog (`changing the phase`);

        // Collect the pot
        this.players.forEach ((player) => { console.log ('betCur = ' + player.betCur);
            this.pot += player.betCur;
            player.betCur = 0;
        });
        domTable.updatePot (this.pot);
        this.curBet = 0;

        // Change Phase
        let phases = ['pre-flop', 'flop', 'turn', 'river', 'showdown'];
        this.phase = phases [phases.indexOf (this.phase) + 1];

        switch (this.phase) {
            case 'flop': 
                this.debugLog (`dealing the flop`);

                this.board.push (...this.dealCard (3)); 
                
                this.debugLog (`Flop is ${this.board.join (', ')}`);
                this.addHandHistory_AI (null, `Flop is ${this.board.join (', ')}`);

                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();
                break;

            case 'turn': 
                this.debugLog (`dealing the turn`);

                this.board.push (...this.dealCard (1)); 
                
                this.debugLog (`Turn is ${this.board [0]}`);
                this.addHandHistory_AI (null, `Turn is ${this.board [0]}`);
                
                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();
                break;

            case 'river': 
                this.debugLog (`dealing the river`);

                this.board.push (...this.dealCard (1));

                this.debugLog (`River is ${this.board [0]}`);
                this.addHandHistory_AI (null, `River is ${this.board [0]}`);

                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();
                break;

            case 'showdown':
                
                break;
        }

        this.updateAllPlayerStackInDom ();
    }

    switchCurTurn () { 
        this.debugLog (`switching whose turn is it`);

        let curIndex = this.players.indexOf (this.curTurn);
        while (curIndex === this.players.indexOf (this.curTurn) || this.players[curIndex].hand.length <= 0) {
            curIndex++; if (curIndex >= this.players.length) curIndex = 0;
        }

        this.curTurn = this.players [curIndex];
        
        this.debugLog (`cur turn is now ${this.curTurn.name}`);


        /* PUT AI CODES HERE */
    }

    awardPot () {
        let winner = this.players.filter ((player)=>player.hand.length > 0)[0];
        console.log (`hand is done, winner is ${winner.name}`);
    }

    addHandHistory (action) {
        this.handHistory.push (action);
    }

    addHandHistory_AI (playerDoingAction, action, addToNotPlayer = true) {
        this.players.forEach ((playerToAddHistory) => {
            if (playerDoingAction === null) playerDoingAction = playerToAddHistory;
            if (!playerToAddHistory.isAI) return;
            if (!addToNotPlayer && playerDoingAction.id !== playerToAddHistory.id) return;

            action = action.replace (/{pot-stat}/g, `({player} cur chips: ${playerDoingAction.stack})`);
            action = action.replace (/{player}/g, (playerDoingAction.id === playerToAddHistory.id) ? 'You' : playerDoingAction.name);

            playerToAddHistory.handHistoryAI.push (action);
        });
    }

    updateAllPlayerStackInDom (){
        this.players.forEach ((player) => {
            domTable.updatePlayerStack (player.name, player.betCur, player.stack);
        });
        domTable.updatePot (this.pot);
    }

    debugLog (msg){
        console.log (msg);
    }

    handleShowdown (){

    }
}

window.gameHandler = new GameHandler ();