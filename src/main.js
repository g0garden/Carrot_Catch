'use strict';

import PopUp from './popup.js';
import GameBuilder from './game.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
.gameDuration(5)
.carrotCount(3)
.bugCount(3)
.build();
//이렇게 빌터패턴을 사용하면 우리가 정확하게 어떤 값을 사용하는지 한눈에 확인가능

game.setGameStopListener(reason => {
    console.log(reason);
    let message;
    switch(reason){
        case 'cancel':
            message = 'Replay?!';
            break;
        case 'win':
            message = 'YOU WON!!';
            break;
        case 'lose':
            message = 'YOU LOST~';
            break;
            default:
                throw new Error('not valid reason');
    }
    gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(()=> {
    game.start();
});




