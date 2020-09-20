'use strict'


const carrotSound = new Audio('./sound/carrot_pull.mp3');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

//사용자가 어떤 사운드를 재생해야되는지 
//일일이 인자(sound)를 전달하지 않아도 되게 함수만들어보자
export function playCarrot(){
    playSound(carrotSound);
}

export function playBug(){
    playSound(bugSound);
}

export function playAlert(){
    playSound(alertSound);
}

export function playWin(){
    playSound(winSound);
}

export function playBackground(){
    playSound(bgSound);
}

export function stopBackground(){
    stopSound(bgsound);
}

function playSound(sound){
    sound.currentTime = 0; //다시 시작할때는 항상 처음부터 재생되도록
    sound.play();
}

function stopSound(sound){
    sound.pause();
}