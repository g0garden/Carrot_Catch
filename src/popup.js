'use strict'

export default class PopUp{
    constructor(){
        this.popUp = document.querySelector('.pop-up');
        this.popUpText = document.querySelector('.pop-up_message');
        this.popUpRefresh = document.querySelector('.pop-up_refresh');
        this.popUpRefresh.addEventListener('click', () =>{
            //등록된 onclick(멤버변수)이라는 함수가 있으면!(&&) 뒤에를 실행해라 
            this.onClick && this.onClick();
            this.hide();
        });  
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    hide() {
        this.popUp.classList.add('pop-up-hide');
    }

    showWithText(text){
        this.popUpText.innerText = text;
        this.popUp.classList.remove('pop-up-hide');
    }
    
}           