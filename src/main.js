'use strict';

import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';


const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game_button');
const gameTimer = document.querySelector('.game_timer');
const gameScore = document.querySelector('.game_score');


//게임의 상태를 기억하고 있어야 되는 변수 필요
let started = false;
let score = 0;
let timer = undefined;

//클래스가 어디에 쓰이는지에 따라서 적절한 변수명을 지어주기!! 
const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(( )=> {
    startGame();
});

const gameField = new Field(CARROT_COUNT,BUG_COUNT);
gameField.setClickListener(onItemClick);


function onItemClick(item) {
    //함수안에서 조건이 맞지 않을 때 빨리 함수를 리턴하도록 만들기! 
    if(!started){
        //started가 아니면 리턴함수로 나가기
        return; 
    }
    if(item === '.carrot'){
        score++;
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);   // 함수호출시, boolean으로 하는 것은 비추 true가 뭐고 false가 뭔지 모르니까 
        }
    } else if(item === '.bug'){  
        finishGame(false);
    }
}


gameBtn.addEventListener('click', () => {
    if(started) {
        stopGame();
    } else {
        startGame();
    }
});


//Start Game
function startGame(){
    started = true;
    initGame(); // 플레이버튼을 눌렀을때 게임이 시작되어야 하니까 
    showStopButton();
    showTimerAndScore();  
    startGameTimer();
    sound.playBackground();
}

//Stop Game
function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    gameFinishBanner.showWithText('REPLAY🤩')
    sound.playAlert();
    sound.stopBackground();
}

//Finish Game
function finishGame(win) {
    started = false;
    hideGameButton();
    if(win){
        sound.playWin();
    } else {
        sound.playBug();
    }
    stopGameTimer();
    stopSound(bgSound);
    gameFinishBanner.showWithText(win? 'YOU WON' : 'YOU LOST');
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}


function startGameTimer(){
    let remaininTimeSec = GAME_DURATION_SEC;
    updateTimerText( remaininTimeSec);
    timer = setInterval(() => {
        if(remaininTimeSec <= 0) {
            clearInterval(timer);
            //시간안에 당근개수못 채워도 lost
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remaininTimeSec);
    }, 1000); 
}

function stopGameTimer(){
    clearInterval(timer);
    
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

//initGame
function initGame(){
    score = 0; // 게임끝나면 다시 0에서 시작해야쥬
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성한뒤 field에 추가해줌
    gameField.init(); 
}



//Sound

function updateScoreBoard(){
    //남은 당근의 개수
    gameScore.innerText = CARROT_COUNT - score; 
}



