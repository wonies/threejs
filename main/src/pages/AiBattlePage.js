import InGamePage from "./InGamePage.js";

export default class AiBattlePage extends InGamePage {
    setup() {
        super.setup();

        this.$state = {
            ...this.$state,
            image: '../../main/public/aiphoto.png',
            opt: '초급',
            opt2: '고급'
        };
    }

    handleTournament() {
        console.log("초급 AI 선택!");
        window.location.hash = '#ai-battle-easy';
    }

    handleAi() {
        console.log("고급 AI 선택!");
        window.location.hash = '#ai-battle-hard';
    }

    goToHome()
    {
        window.location.hash = 'ingame-1';
    }
}