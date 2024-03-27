


const domTable = {
    divTable:           document.querySelector ('.table'),
    pot:                document.querySelector ('.table-pot'),
    potTxt:             document.querySelector ('#pot-txt'),

    tablePositions: [
        {x: '10%', y: '40%'},
        {x: '70%', y: '10%'},
    ],

    playerDivs: {},

    createPlayer (name, index) {
        let div                     = document.createElement ('div'),
            elems = {
                txtName                 : document.createElement ('h3'),
                txtBet                  : document.createElement ('h3'),
                txtStack                : document.createElement ('h3')
            };

        elems.txtName.textContent = name;
        elems.txtBet.textContent = `Bet: 0`;
        elems.txtStack.textContent = `Stack: 0`;

        div.classList.add ('table-player');

        let pos             = this.tablePositions [index];
        div.style.left      = `${pos.x}`;
        div.style.top       = `${pos.y}`;

        Object.entries (elems).forEach (([key, value]) => div.appendChild (value));
        
        this.divTable.appendChild (div);

        this.playerDivs[name] = {};
        this.playerDivs[name].elems = elems;
    },

    updatePlayerStack (player, newBet, newStack){ console.log (newBet, newStack);
        this.playerDivs [player].elems.txtBet.textContent = `Bet: ${newBet}`;
        this.playerDivs [player].elems.txtStack.textContent = `Stack: ${newStack}`;
    },

    updatePot (newPot){
        this.potTxt.textContent = `Pot: ${newPot}`;
    }
}