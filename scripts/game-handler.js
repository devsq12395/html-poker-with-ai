

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
        this.lastPlay = 'bet';

        this.expectedAnswers = [];
    }

    init () {
        // Setup other scripts
        domController.setup ();
        domPopup.setup ();
        domPopup.hidePopup ();
        preloader.preload ();

        // Create players
        this.createPlayer ('User', false, 0);
        this.createPlayer ('Gemini', true, 1);
        this.createPlayer ('Bob', true, 2);

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

        let values = ['A', 'K', 'Q', 'J', '0', '9', '8', '7', '6', '5', '4', '3', '2'],
            suits = ['H', 'D', 'C', 'S'];

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

    startNewHand () { 
        this.debugLog (`starting a new hand`);
        this.addHandHistory (`Starting a new hand.`);

        this.shuffleDeck ();
        this.phase = 'pre-flop';

        this.board = [];
        domTable.removeAllPlayerCards ();
        domTable.removeAllCardsOnBoard ();
        domTable.hideWin ();

        this.players.forEach ((player) => {
            player.hand = this.dealCard (2);
            player.hand.forEach ((card) => {
                domTable.createCardForPlayer (player, (player.isAI) ? 'back' : card);
            })

            this.debugLog (`${player.name}'s new hand is ${player.hand[0]}, ${player.hand[1]}`);
            player.handHistoryAI = [];
            this.addHandHistory_AI (player, `You are dealt ${player.hand[0]} & ${player.hand[1]}`, false);
        });
        this.playersCountBeforeSwitch = this.players.length - 1;
        this.assignPositions ();

        this.updateAllPlayerTextsInDom ();
        domController.changeControlSituation ();
    }

    dealCard (amount) { 
        return this.deck.splice (0, amount);
    }

    assignPositions () {
        this.curBtn++;
        if (this.curBtn >= this.players.length) this.curBtn = 0;

        let positions = ['', 'BB', 'BTN'],
            curPlayerToAssign = this.curBtn;
        while (positions.length > 0) {
            let curPlayer = this.players [curPlayerToAssign];

            this.debugLog (`assigning position of ${positions[0]} to ${curPlayer.name}`);
            this.addHandHistory_AI (curPlayer, `{player} position: ${positions[0]}`);
            curPlayer.pos = positions [0];

            if (curPlayer.pos == 'BB') {
                this.debugLog (`${curPlayer.name} is betting the big blind`);

                this.curTurn = curPlayer;
                this.player_doAction (curPlayer, 'bet', _GLOBALS.BIG_BLIND);
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
        this.debugLog (`Doing action ${action} for ${player.name} with amount ${amount}`);
        amount = (isNaN (amount) ? 0 : Number (amount));
        this.debugLog (`amount is ${amount}`);

        switch (action) {
            case 'check': case 'checks':
                this.debugLog (`${player.name} checks`);
                this.addHandHistory_AI (player, `{player} checks`);
                this.addHandHistory (`${player.name} checks`);

                this.playersCountBeforeSwitch--;
                console.log (this.playersCountBeforeSwitch);

                break;
            case 'bet': 
                player.betCur = amount;
                player.stack -= amount;

                this.debugLog (`${player.name} bets ${amount}`);
                this.addHandHistory_AI (player, `{player} bets: ${amount}. {pot-stat}`);
                this.addHandHistory (`${player.name} bets: ${amount}.`);

                this.lastPlay = 'bet';
                this.curBet = amount;
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length - 1;
                
                domTable.setBetForPlayer (player);

                break;
            case 'raise': 
                this.curBet += amount;

                let amountToRaise = this.curBet - player.betCur;
                player.betCur += amountToRaise;
                player.stack -= amountToRaise;

                this.debugLog (`${player.name} raised for ${amount} more`);
                this.addHandHistory_AI (player, `{player} raised to ${this.curBet} chips. {pot-stat}`);
                this.addHandHistory (`${player.name} raised to ${this.curBet} chips.`);

                domTable.setBetForPlayer (player);
                
                this.lastPlay = 'raise';
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length - 1;

                break;
            case 'call': case 'calls':
                if (this.curBet > player.stack) {
                    player.betCur += player.stack;
                    player.stack = 0;
                } else {
                    player.stack -= this.curBet - player.betCur;
                    player.betCur = this.curBet;
                }

                this.debugLog (`${player.name} calls`);
                this.addHandHistory_AI (player, `{player} called. {pot-stat}`);
                this.addHandHistory (`${player.name} called.`);

                domTable.setBetForPlayer (player);

                this.playersCountBeforeSwitch--;

                break;
            case 'fold':case 'folds':
                player.hand = [];
                domTable.removeCardsForPlayer (player);

                this.debugLog (`${player.name} folds`);
                this.addHandHistory_AI (player, `{player} folds.`);
                this.addHandHistory (`${player.name} folds.`);

                this.playersCountBeforeSwitch--;

                break;

        }

        this.updateAllPlayerTextsInDom ();

        this.changeTurn ();
        domController.changeControlSituation ();
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
        this.players.forEach ((player) => {
            this.pot += player.betCur;
            player.betCur = 0;
        });
        domTable.updatePotAndBoard (this.pot, this.board.join (', '));
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
                this.addHandHistory (`Flop is ${this.board.join (', ')}`);
                
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length;
                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();
                break;

            case 'turn': 
                this.debugLog (`dealing the turn`);

                this.board.push (...this.dealCard (1)); 
                
                this.debugLog (`Turn is ${this.board [3]}`);
                this.addHandHistory_AI (null, `Turn is ${this.board [3]}`);
                this.addHandHistory (`Turn is ${this.board [3]}`);
                
                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length;
                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();

                break;

            case 'river':
                this.debugLog (`dealing the river`);

                this.board.push (...this.dealCard (1));

                this.debugLog (`River is ${this.board [4]}`);
                this.addHandHistory_AI (null, `River is ${this.board [4]}`);
                this.addHandHistory (`River is ${this.board [4]}`);

                this.playersCountBeforeSwitch = this.players.filter ((player)=>player.hand.length > 0).length;
                this.curTurn = this.players.find ((player) => player.pos === 'BB');
                this.switchCurTurn ();
                break;

            case 'showdown':
                this.debugLog (`Showdown`);
                this.addHandHistory (`Showdown`);

                this.revealAllHand ();
                let winningPlayers = handEvaluator.compareHands ();
                this.awardPot (winningPlayers);
                break;
        }

        this.updateAllPlayerTextsInDom ();
        domController.changeControlSituation ();
        domTable.setBetForPlayers ();
    }

    async switchCurTurn () { 
        this.debugLog (`switching whose turn is it`);

        let curIndex = this.players.indexOf (this.curTurn),
            isChangePhase = false;

        curIndex++; if (curIndex >= this.players.length) curIndex = 0;
        while (this.players[curIndex].hand.length <= 0 || this.players[curIndex].stack <= 0 || curIndex === this.players.indexOf (this.curTurn)) {
            curIndex++; if (curIndex >= this.players.length) curIndex = 0;

            if (curIndex === this.players.indexOf (this.curTurn)) {
                isChangePhase = true;
                break;
            }
        }

        if (!isChangePhase) {
            this.curTurn = this.players [curIndex];

            this.debugLog (`cur turn is now ${this.curTurn.name}`);
            this.updateAllPlayerTextsInDom ();

            /* PUT AI CODES HERE */
            if (this.curTurn.isAI) {
                domController.hideDisplay ();
                let response = await this.askAIForDecision (),
                    data = response.split (' ').filter ((val, ind) => ind < 2),
                    explanation = response.split (' ').filter ((val, ind) => ind >= 2).join (' ');

                domController.showDisplay ();
                
                this.debugLog (`Explanation: ${explanation}`);
                this.player_doAction (this.curTurn, data[0].toLowerCase (), data[1]);
            }
        } else {
            this.changePhase ();
        }
    }

    async askAIForDecision (){
        let msg = `Let's play poker, situation: `;
        msg += `${this.curTurn.handHistoryAI.join (', ')}. You are only allowed to reply with any of your current options: `;
        msg += (this.curBet === 0) ? `CHECK, BET [amount].` : `CALL, RAISE [total bet, call chips + raise chips], FOLD. Then add an explanation seperated by :.`;
        msg += `Sample response: ${(this.curBet === 0) ? `BET 5` : `RAISE 5`} : [Explanation] `;

        this.expectedAnswers = [];
        if (this.curBet === 0) {
            this.expectedAnswers = ['CHECK', 'BET'];
        } else {
            this.expectedAnswers = ['CALL', 'RAISE', 'FOLD'];
        }

        this.debugLog ('Sending message to AI:');
        this.debugLog (msg);

        await new Promise(resolve => setTimeout(resolve, 1000));

        let response = await window.apiHandler.sendMessage (msg);
        this.debugLog (`Received response: ${response}`);

        if (this.expectedAnswers.includes (response.split (' ')[0])) {
            return response;
        } else {
            this.debugLog ('Response invalid. Will ask AI again...');
            return this.askAIForDecision ();
        }
    }

    revealAllHand (){
        domTable.removeAllPlayerCards ();

        this.players.forEach ((player) => {
            if (player.hand.length > 0) {
                player.hand.forEach ((card, ind) => domTable.createCardForPlayer (player, player.hand [ind]));
            }
        });
    }

    async awardPot (winners) {
        let winner = null;
        if (!winners || winners.length === 1) {
            if (!winners){
                winner = this.players.filter ((player)=>player.hand.length > 0)[0];
                winners = [winner];
            } else {
                winner = winners[0];
            }
            
            this.debugLog (`Hand is done, winner is ${winner.name}`);
            this.addHandHistory (`Hand is done, winner is ${winner.name}`);

            winner.stack += this.pot;
            
        } else if (winners.length > 1) {
            this.debugLog (`Chopped pot.`);
            this.addHandHistory (`Chopped pot.`);

            let chop = this.pot / winners.length;
            winners.forEach ((player) => {
                player.stack += chop;
            });

        }

        this.pot = 0;

        this.players.forEach ((player) => {
            player.stack += player.betCur;
            player.betCur = 0;
        });
        domTable.setBetForPlayers ();

        this.updateAllPlayerTextsInDom ();
        domController.hideDisplay ();
        domTable.showWin (winners);

        if (this.players [0].stack > 0 && this.players [1].stack > 0) {
            this.addHandHistory (`Next hand starts in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));

            domController.showDisplay ();
            this.startNewHand ();
        } else {
            if (this.players [0].stack <= 0) {
                domPopup.showPopup ('You Lose!', 'You are out of chips!');
            } else if (this.players [1].stack <= 0) {
                domPopup.showPopup ('You Win!', 'AI is out of chips!');
            }
        }
    }

    addHandHistory (action) {
        this.handHistory.push (action);
        domHandHistory.addHistory (action);
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

    updateAllPlayerTextsInDom (){
        this.players.forEach ((player) => {
            domTable.updatePlayerBox (player);
        });
        domTable.updatePotAndBoard (this.pot, this.board.join (', '));

        domTable.removeAllCardsOnBoard ();
        this.board.forEach ((card) => domTable.createCardToBoard (card));
    }

    debugLog (msg){
        console.log (msg);
    }
}

window.gameHandler = new GameHandler ();