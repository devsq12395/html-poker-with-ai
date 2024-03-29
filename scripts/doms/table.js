


const domTable = {
    divTable:           document.querySelector ('.table'),
    divPot:             document.querySelector ('.table-pot'),
    divBoardCards:      document.querySelector ('.board-cards'),
    potTxt:             document.querySelector ('#pot-txt'),

    tablePositions: [
        {x: 10, y: 34},
        {x: 70, y: 3},
    ],

    playerDivs: {},

    createPlayer (name, index) {
        let div                     = document.createElement ('div'),
            divTexts                = document.createElement ('div'),
            divCards                = document.createElement ('div'),
            elems = {
                txtName                 : document.createElement ('h3'),
                txtBet                  : document.createElement ('h3'),
                txtStack                : document.createElement ('h3'),
            };

        elems.txtName.innerHTML = name;
        elems.txtBet.innerHTML = `Bet: 0`;
        elems.txtStack.innerHTML = `Stack: 0`;
        
        divTexts.classList.add ('table-texts');
        divCards.classList.add ('table-cards');
        div.classList.add ('table-player');

        let pos             = this.tablePositions [index];
        div.style.left      = `${pos.x}%`;
        div.style.top       = `${pos.y}%`;

        Object.entries (elems).forEach (([key, value]) => divTexts.appendChild (value));
        
        div.appendChild (divCards);
        div.appendChild (divTexts);
        this.divTable.appendChild (div);

        this.playerDivs[name] = {};
        this.playerDivs[name].div = div;
        this.playerDivs[name].divCards = divCards;
        this.playerDivs[name].pos = this.tablePositions [index];
        this.playerDivs[name].elems = elems;
    },

    createCard (card){
        let div                     = document.createElement ('div'),
            imgCard                 = document.createElement ('img');

        div.classList.add ('table-card');

        imgCard.src = `https://www.deckofcardsapi.com/static/img/${card}.png`;
        div.appendChild (imgCard);

        return div;
    },

    createCardForPlayer (player, card) {
        let div = this.createCard (card);

        this.playerDivs[player.name].divCards.appendChild (div);
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

    updatePlayerStack (player, nameTxt){ 
        this.playerDivs [player.name].elems.txtName.innerHTML = nameTxt;
        this.playerDivs [player.name].elems.txtBet.innerHTML = `Bet: ${player.betCur}`;
        this.playerDivs [player.name].elems.txtStack.innerHTML = `Stack: ${player.stack}`;
    },

    updatePotAndBoard (newPot, board){
        this.potTxt.innerHTML = `Pot: ${newPot}<br>Board: ${board}`;
    }
}