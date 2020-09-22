'use strict'

import {Field, IteType } from './field.js';

//JS에서 타입보장하는 방법 
export const Reason = Object.freeze({
    win:'win',
    lose:'lose',
    cancle:'cancle',
});


//Builder Pattern
export class GameBuilder{
    gameDuration(duration){
        this.gameDuration = duration;
        return this;
    }

    carrotCount(num){
        this.carrotCount = num;
        return this;
    }

    bugCount(num){
        this.bugCount = num;
        return this;
    }

    build(){
        return new Game(
            this.gameDuration,
            this.carrotCount,
            this.bugCount
        );
    }
}


class Game{
    constructor(gameDuration, carrotCount, bugCount){
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        this.gameTimer = document.querySelector('.game_timer');
        this.gameScore = document.querySelector('.game_score');
        this.gameBtn = document.querySelector('.game_button');
        this.gameBtn.addEventListener('click', () => {
            if(this.started) {
                this.stop(Reason.cancle);
            } else {
                this.start();
            }
        });

                
        this.gameField = new Field(carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);


        //게임의 상태를 기억하고 있어야 되는 변수 필요
        this.started = false;
        this.score = 0;
        this.timer = undefined;
    }
    //게임이 멈췄을때 main.js에게 알려줘야지?
    setGameStopListener(onGameStop){
        this.onGameStop = onGameStop;
    }
    //Start Game
    start(){
        this.started = true;
        this.initGame(); // 플레이버튼을 눌렀을때 게임이 시작되어야 하니까 
        this.showStopButton();
        this.showTimerAndScore();  
        this.startGameTimer();
        sound.playBackground();
    }

    //Stop Game
    stop(reason){
        this.started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(reason);
    }



    onItemClick = (item) => {
        //함수안에서 조건이 맞지 않을 때 빨리 함수를 리턴하도록 만들기! 
        if(!this.started){
            //started가 아니면 리턴함수로 나가기
            return; 
        }
        if(item === IteType.carrot){
            this.score++;
            this.updateScoreBoard();
            if(this.score === this.carrotCount){
                this.stop(Reason.win);   // 함수호출시, boolean으로 하는 것은 비추 true가 뭐고 false가 뭔지 모르니까 
            }
        } else if(item === ItemType.bug){  
            this.stop(Reason.lose);
        }
    };

    showStopButton(){
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
    }

    hideGameButton(){
    this.gameBtn.style.visibility = 'hidden';
    }

    showTimerAndScore(){
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
    }


    startGameTimer(){
    let remaininTimeSec = this.gameDuration;
    this.updateTimerText( remaininTimeSec);
    this.timer = setInterval(() => {
        if(remaininTimeSec <= 0) {
            clearInterval(this.timer);
            //시간안에 당근개수못 채워도 lost
            this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
            return;
        }
        this.updateTimerText(--remaininTimeSec);
    }, 1000); 
};

    stopGameTimer(){
    clearInterval(this.timer); //얘는 윈도우API니까 냅두고
    
}

    updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
}

//initGame
    initGame(){
    this.score = 0; // 게임끝나면 다시 0에서 시작해야쥬
    this.gameScore.innerText = this.carrotCount;
    //벌레와 당근을 생성한뒤 field에 추가해줌
    this.gameField.init(); 
}


//Sound
    updateScoreBoard(){
    //남은 당근의 개수
    this.gameScore.innerText = this.carrotCount - this.score; 
}

}
