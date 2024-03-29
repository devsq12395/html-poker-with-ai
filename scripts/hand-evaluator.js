

const handEvaluator = {

    compareHands (){
        let winningPlayer = null;
        window.gameHandler.players.forEach ((player) => {
            player.handValue = this.getHandValue (player.hand);
            if (winningPlayer === null) {
                winningPlayer = player;
            } else if (winningPlayer.handValue < player.handValue){
                winningPlayer = player;
            }
        });

        return winningPlayer;
    },

    getHandValue (hand) {
        let valuesNum = ['2','3','4','5','6','7','8','9','0','J','Q','K','A'];

        let values = hand.map ((card) => valuesNum.indexOf (card.split ('')[0])),
            suits = hand.map ((card) => card.split('')[1]);
        let value = 0;

        // High card
        value = values.reduce ((acc, curVal) => Math.max (acc, curVal));

        // Pairs
        let pairs = 0,
            pairsValue = 0,
            counts = {};
        values.forEach ((val) => {
            counts [val] = counts [val] ? counts [val] + 1 : 1;
        });
        Object.entries(counts).forEach(([val, count]) => {
            if (count === 2) {
                pairs++;
                pairsValue = Math.max(pairsValue, parseInt (val));
            }
        });
        if (pairs === 1) {
            value = Math.max (value, pairsValue + 100);
        } else if (pairs === 2) {
            value = Math.max (value, pairsValue + 200);
        }

        // Three-of-a-kind
        let trips = 0,
            tripsValue = 0;
        Object.entries(counts).forEach(([val, count]) => {
            if (count === 3) {
                trips++;
                tripsValue = Math.max(tripsValue, parseInt (val));
            }
        });
        if (trips >= 1) {
            value = Math.max (value, tripsValue + 1000);
        } 

        // Straight
        let strMaxVal = 0,
            strChain = 1;
        values.sort((a, b) => a - b);
        values.forEach((val, index, arr) => {
            if (index < arr.length - 1 && val + 1 === arr[index + 1]) {
                strChain++;
                strMaxVal = arr[index + 1];
            } else {
                if (strChain < 5) {
                    strChain = 1;
                    strMaxVal = 0;
                }
            }
        });
        if (strChain >= 5) {
            value = 10000 + strMaxVal;
        }

        // Flush
        let suitsCount = {'H': 0, 'D': 0, 'C': 0, 'S': 0},
            flushSuit = '',
            flushHighestVal = 0,
            isFlush = false;
        suits.forEach ((suit) => {
            suitsCount [suit]++;

            if (suitsCount [suit] >= 5) {
                flushSuit = suit;
            }
        });
        if (flushSuit !== '') {
            hand.forEach ((card) => {
                let cardSplit = card.split ('');
                if (cardSplit[1] === flushSuit) {
                    if (valuesNum.indexOf (cardSplit [0]) > flushHighestVal) {
                        flushHighestVal = valuesNum.indexOf (cardSplit [0]);
                    }
                }
            });

            value = 100000 + flushHighestVal;
            isFlush = true;
        }

        // Full House
        if (pairs >= 1 && trips >= 1){
            value = 1000000 + tripsValue * 1000 + pairsValue;
        }

        // Straight Flush
        if (isFlush) {
            let cardsInSuit = hand.filter ((card) => card.split('')[1] === flushSuit),
                sfValues = cardsInSuit.map ((card) => valuesNum.indexOf (card.split ('')[0]));

            sfValues.sort((a, b) => a - b);

            let strFlushMaxVal = 0,
                strFlushChain = 1;
            sfValues.sort((a, b) => a - b);
            sfValues.forEach((val, index, arr) => {
                if (index < arr.length - 1 && val + 1 === arr[index + 1]) {
                    strFlushChain++;
                    strFlushMaxVal = arr[index + 1];
                } else {
                    if (strFlushChain < 5) {
                        strFlushChain = 1;
                        strFlushMaxVal = 0;
                    }
                }
            });
            if (strFlushChain >= 5) {
                value = 100000000 + strFlushMaxVal;
            }
        }

        return value;
    }
}