import Component from "../core/Component.js";
import TourStandBy from "./TourStandBy.js";

export default class TourStandByFour extends TourStandBy
{
    setup()
    {
        super.setup(); 
        this.$state = 
        {
            image: '../../main/public/doublepong.png',
            optCount: 4, 
            optArray: Array(4).fill(''),
        }
    }

    template()
    {
        const { image, optCount, optArray } = this.$state;

        const inputs = Array(optCount).fill(0).map((_, index) => `
            <input type="text" class="match-opt" data-option="opt${index + 1}" value="${optArray[index]}">
        `).join('');

        return `
        <div class="ingame-container">
            <div class="account-image">
                <img src="${image}" alt="pong">
            </div>
                <div class="pick-option">
                    ${inputs}
                    <button class="match-btn">MATCH</button>
                </div>
        </div>
      `
    }
    setEvent(){
        const { $target } = this;
        $target.addEventListener('input', ({ target }) => {
            if (target.matches('.option')) {
                console.log('Input value:', target.value);
            }
        })
        $target.addEventListener('click', ({ target }) => {
            if ( target.closest('.account-image img'))
            {
                this.goToHome();
            }
            if (target.matches('.match-btn')) {
                this.handleMatchButtonClick();
                this.goMatchRoom();
            }
            
        });
    }
    handleMatchButtonClick() {
        console.log('Match button clicked');
    

        const optValues = {};
        let anonymousCount = 1;

        for (let i = 1; i <= 4; i++) {
            let value = this.$target.querySelector(`.match-opt[data-option="opt${i}"]`).value.trim();
            
            if (value === '') {
                value = `anonymous${anonymousCount}`;
                anonymousCount++;
            }

            optValues[`opt${i}`] = value;
            console.log(`Option ${i}:`, value);
        }
        sessionStorage.setItem('players', JSON.stringify(optValues));
        console.log('Values saved to sessionStorage');

    }
    
    goToHome()
    {
        window.location.hash = '#ingame-1';
    }

    goMatchRoom()
    {
        window.location.hash = '#waiting-room';
    }

    mounted()
    {
        this.setEvent();
    }
}