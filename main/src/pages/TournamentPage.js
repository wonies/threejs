import InGamePage from "./InGamePage.js";

export default class TournamentPage extends InGamePage {
    setup() {
        super.setup(); 
        this.$state = {
            ...this.$state, 
            image: '../../main/public/doublepong.png',
            opt: '2명',
            opt2: '4명',
            opt3: '8명'
        };
    }

    template() {
        const { image, opt, opt2, opt3 } = this.$state;
        return `
        <div class="ingame-container">
            <div class="account-image">
                <img src="${image}" alt="tournament">
            </div>
            <div class="pick-option">
                <div class="option" data-option="opt1">
                    <span>${opt}</span>
                </div>
                <div class="option" data-option="opt2">
                    <span>${opt2}</span>
                </div>
                <div class="option" data-option="opt3">
                    <span>${opt3}</span>
                </div>
            </div>
        </div>
        `;
    }

    setEvent() {
        const { $target } = this;
        $target.addEventListener('click', ({ target }) => {
            const option = target.closest('.option');
            if (target.closest('.account-image img')) {
                this.goToHome();
            }
            if (option) {
                const optType = option.dataset.option;
                if (optType === 'opt1') {
                    console.log(`selected option: ${this.$state.opt}`);
                    this.handleTwoBattle();
                } else if (optType === 'opt2') {
                    console.log(`selected option: ${this.$state.opt2}`);
                    this.handleFourBattle();
                } else if (optType === 'opt3') {
                    console.log(`selected option: ${this.$state.opt3}`);
                    this.handleEightBattle();
                }
            }
        });
    }

    goToHome()
    {
        window.location.hash = 'ingame-1';
    }

    handleTwoBattle() {
        console.log("8강 선택!");
        window.location.hash = '#standby-2';
    }

    handleFourBattle() {
        console.log("4강 선택!");
        window.location.hash = '#standby-4';

    }

    handleEightBattle() {
        console.log("결승 선택!");
        window.location.hash = '#standby-8';
    }
}