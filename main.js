'use strict'

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game_button');
const gameTimer = document.querySelector('.game_timer');
const gameScore = document.querySelector('.game_score');

const popUp = document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up_refresh');
const popUpText = document.querySelector('.pop-up_message');

//게임의 상태를 기억하고 있어야 되는 변수 필요
let started = false;
let score = 0;
let timer = undefined;


field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
    if(started) {
        stopGame();
    } else {
        startGame();
    }
});
popUpRefresh.addEventListener('click',() => {
    startGame();
    hidePopUp();
})


//Start Game
function startGame(){
    started = true;
    initGame(); // 플레이버튼을 눌렀을때 게임이 시작되어야 하니까 
    showStopButton();
    showTimerAndScore();  
    startGameTimer();
}

//Stop Game
function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY🤩')
}

//Finish Game
function finishGame(win) {
    started = false;
    hideGameButton();
    showPopUpWithText(win? 'YOU WON' : 'YOU LOST');
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
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


function showPopUpWithText(text){
    popUpText.innerText = text;
    popUp.classList.remove('pop-up-hide');
}

function hidePopUp(){
    popUp.classList.add('pop-up-hide');
}

function initGame(){
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성한뒤 field에 추가해줌
    addItem('carrot', CARROT_COUNT, 'img/carrot.png');
    addItem('bug', BUG_COUNT, 'img/bug.png');
    
}

function onFieldClick(event) {
    //함수안에서 조건이 맞지 않을 때 빨리 함수를 리턴하도록 만들기! 
    if(!started){
        //started가 아니면 리턴함수로 나가기
        return; 
    }
    const target = event.target;
    if(target.matches('.carrot')){
        //당근!
        target.remove();
        score++;
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);   // 함수호출시, boolean으로 하는 것은 비추 true가 뭐고 false가 뭔지 모르니까 
        }
    }else if(target.matches('.bug')){
        stopGameTimer();
        finishGame(false);
    }
}



function updateScoreBoard(){
    //남은 당근의 개수
    gameScore.innerText = CARROT_COUNT - score; 
}

function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count ; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left=`${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}

