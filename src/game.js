'use strict'
import * as sound from './sound.js';
import Field from './field.js';


export default class Game{
    constructor(gameDuration, carrotCount, bugCount){
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        this.gameTimer = document.querySelector('.game_timer');
        this.gameScore = document.querySelector('.game_score');
        this.gameBtn = document.querySelector('.game_button');
        this.gameBtn.addEventListener('click', () => {
            if(this.started) {
                this.stop();
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
    stop(){
        this.started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.playAlert();
        sound.stopBackground();
        this.onGameStop && this.onGameStop('cancel');
        //사용자가 stop버튼을 눌렀으니까 게임이 멈춤cancel
    }

    //Finish Game
    finish(win) {
        this.started = false;
        this.hideGameButton();
        if(win){
            sound.playWin();
        } else {
            sound.playBug();
        }
        this.stopGameTimer();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(win ? 'win' : 'lose');
        //게임이 끝났으니까 게임이 멈췄겠지 그리고 결과가 있겠지? 이겼거나 젔거나
    }

    onItemClick = (item) => {
        //함수안에서 조건이 맞지 않을 때 빨리 함수를 리턴하도록 만들기! 
        if(!this.started){
            //started가 아니면 리턴함수로 나가기
            return; 
        }
        if(item === 'carrot'){
            this.score++;
            this.updateScoreBoard();
            if(this.score === this.carrotCount){
                this.finish(true);   // 함수호출시, boolean으로 하는 것은 비추 true가 뭐고 false가 뭔지 모르니까 
            }
        } else if(item === 'bug'){  
            this.finish(false);
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
            this.finish(this.carrotCount === this.score);
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
