'use strict';

import PopUp from './popup.js';
import * as sound from './sound.js';
import {GameBuilder, Reason } from './game.js';

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
        case Reason.cancle:
            message = 'Replay?!';
            sound.playAlert();
            break;
        case Reason.win:
            message = 'YOU WON!!';
            sound.playWin();
            break;
        case Reason.lose:
            message = 'YOU LOST~';
            sound.playBug();
            break;
            default:
                throw new Error('not valid reason');
    }
    gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(()=> {
    game.start();
});




