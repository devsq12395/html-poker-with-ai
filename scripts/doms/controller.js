


const domController = {
    divControl:             document.querySelector ('.control'),
    betInput:               document.querySelector ('#bet-input'),
    btns: {
        check:          document.querySelector ('#btn-check'),
        call:           document.querySelector ('#btn-call'),
        bet:            document.querySelector ('#btn-bet'),
        raise:           document.querySelector ('#btn-raise'),
        fold:           document.querySelector ('#btn-fold'),
    },

    setupBtns (){
        this.btns.check.addEventListener ('click', this.callbackCheck.bind (this));
        this.btns.call.addEventListener ('click', this.callbackCall.bind (this));
        this.btns.bet.addEventListener ('click', this.callbackBet.bind (this));
        this.btns.raise.addEventListener ('click', this.callbackRaise.bind (this));
        this.btns.fold.addEventListener ('click', this.callbackFold.bind (this));
    },

    callbackCheck (){
        let curTurn = window.gameHandler.curTurn;
        window.gameHandler.player_doAction (`${curTurn.name}`, 'check', 0);
    },

    callbackCall (){
        let val = Number (this.betInput.value),
            curTurn = window.gameHandler.curTurn;
        window.gameHandler.player_doAction (`${curTurn.name}`, 'call', val);
    },

    callbackBet (){
        let val = Number (this.betInput.value),
            curTurn = window.gameHandler.curTurn;
        window.gameHandler.player_doAction (`${curTurn.name}`, 'bet', val);
    },

    callbackRaise (){
        let val = Number (this.betInput.value),
            curTurn = window.gameHandler.curTurn;
        window.gameHandler.player_doAction (`${curTurn.name}`, 'raise', val);
    },

    callbackFold (){
        window.gameHandler.player_doAction (`${curTurn.name}`, 'fold', 0);
    },

    hideDisplay (){
        this.divControl.style.display = 'none';
    },

    showDisplay (){
        this.divControl.style.display = 'flex';
    },

    
}