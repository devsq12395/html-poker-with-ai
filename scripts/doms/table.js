


const domTable = {
    divTable:           document.querySelector ('.table'),
    divPot:             document.querySelector ('.table-pot'),
    divBoardCards:      document.querySelector ('.board-cards'),
    potTxt:             document.querySelector ('#pot-txt'),

    tablePositions: [
        {x: 43, y: 26},
        {x: 70, y: -5},
        {x: 20, y: -5},
    ],

    playerDivs: {},

    createPlayer (name, index) {
        let div                     = document.createElement ('div'),
            divPlayerBox            = document.createElement ('div'),
            divCards                = document.createElement ('div'),
            elems = {
                avatar              : document.createElement ('img'),
                txt                 : document.createElement ('h3'),
            };

        elems.txt.innerHTML = `${name}<br>Chips: 0`;
        elems.avatar.src = `media/imgs/avatar-${name}.png`;
        elems.avatar.classList.add ('table-player-box-avatar');
        
        divPlayerBox.classList.add ('table-player-box');
        divCards.classList.add ('table-cards');
        div.classList.add ('table-player');

        let pos             = this.tablePositions [index];
        div.style.left      = `${pos.x}%`;
        div.style.top       = `${pos.y}%`;

        Object.entries (elems).forEach (([key, value]) => divPlayerBox.appendChild (value));
        
        div.appendChild (divCards);
        div.appendChild (divPlayerBox);
        this.divTable.appendChild (div);

        this.playerDivs[name] = {div, divPlayerBox, divCards, elems};
        this.playerDivs[name].betDiv = null;
        this.playerDivs[name].betTxt = null;
        this.playerDivs[name].pos = this.tablePositions [index];

        this.createBetForPlayer (name);
    },

    createBetForPlayer (playerName){
        let div = document.createElement ('div'),
            divBg = document.createElement ('div'),
            win = document.createElement ('div'),
            txt = document.createElement ('p');

        div.classList.add ('bet-imgs-div');
        win.classList.add ('bet-img', 'img-win');
        divBg.classList.add ('bet-img', 'img-bet');
        
        txt.innerHTML = '';
        divBg.appendChild (txt);
        div.appendChild (win);
        div.appendChild (divBg);

        this.playerDivs[playerName].div.appendChild (div);
        this.playerDivs[playerName].betDiv = div;
        this.playerDivs[playerName].win = win;
        this.playerDivs[playerName].betDivBg = divBg;
        this.playerDivs[playerName].betTxt = txt;

        this.playerDivs[playerName].betDivBg.style.display = 'none';
        this.playerDivs[playerName].win.style.display = 'none';
    },

    createCard (card){
        let div                     = document.createElement ('div'),
            imgCard                 = document.createElement ('img');

        div.classList.add ('table-card');

        imgCard.src = `https://www.deckofcardsapi.com/static/img/${card}.png`;
        div.appendChild (imgCard);

        return div;
    },

    setBetForPlayer (player){
        if (player.betCur <= 0) {
            this.playerDivs[player.name].betDivBg.style.display = 'none';
            this.playerDivs[player.name].betTxt.innerHTML = '';
        } else {
            this.playerDivs[player.name].betDivBg.style.display = 'block';
            this.playerDivs[player.name].betTxt.innerHTML = player.betCur; 
        }
    },

    setBetForPlayers (){
        window.gameHandler.players.forEach ((player) => domTable.setBetForPlayer (player));
    },

    createCardForPlayer (player, card) {
        let div = this.createCard (card);

        this.playerDivs[player.name].divCards.appendChild (div);
    },

    removeCardsForPlayer (player){
        let playerDiv = this.playerDivs[player.name].divCards;

        while (playerDiv.firstChild) {
            let child = playerDiv.firstChild;
            playerDiv.removeChild(playerDiv.firstChild);
            child.remove ();
        }
    },

    removeAllPlayerCards () {
        window.gameHandler.players.forEach ((player) => this.removeCardsForPlayer (player));
    },

    createCardToBoard (card){
        let div = this.createCard (card);
            
        this.divBoardCards.appendChild (div);
    },

    removeAllCardsOnBoard (){
        while (this.divBoardCards.firstChild) {
            let child = this.divBoardCards.firstChild;
            this.divBoardCards.removeChild(this.divBoardCards.firstChild);
            child.remove ();
        }
    },

    updatePlayerBox (player){ 
        let pDivs = this.playerDivs [player.name],
            pDivColor = (window.gameHandler.curTurn.id === player.id) ? '#55DD55' : '#FF5555';

        pDivs.divPlayerBox.style.backgroundColor = pDivColor;
        pDivs.elems.txt.innerHTML = `${player.name}<br>Chips: ${player.stack}`;
    },

    updatePotAndBoard (newPot, board){
        this.potTxt.innerHTML = `Pot: ${newPot}`;
    },

    showWin (player){
        let pDivs = this.playerDivs [player.name];

        pDivs.win.style.display = 'block';
    },

    hideWin (){
        window.gameHandler.players.forEach ((player) => this.playerDivs [player.name].win.style.display = 'none');
    }
}