import Component from "../core/Component.js";

export default class InGame extends Component
{
    setup()
    {
        this.$state = 
        {
        
            image: '../../main/public/pongs.png',
            opt: '토 너 먼 트',
            opt2: 'AI 대전'
        }
    }
    
    template()
    {
        const { image, opt, opt2 } = this.$state;
        return `
        <div class="ingame-container">
        <div class="account-image">
            <img src="${image}" alt="pong">
        </div>
        <div class="pick-option">
            <div class="option" data-option="opt1">
            <span>${ opt }</span>
            </div>
            <div class="option" data-option="opt2">
            <span>${ opt2 }</span>
            </div>
        </div>
        </div>
      `
    }

    setEvent(){
        const { $target } = this;
        $target.addEventListener('click', ({ target }) => {
            const option = target.closest('.option');
            if ( target.closest('.account-image img'))
            {
                this.goToHome();
            }
            if (option)
            {
                const optType  = option.dataset.option;
                if (optType === 'opt1')
                {
                    console.log(`selected option: ${ this.$state.opt }`);
                    this.handleTournament();
                }
                else if (optType === 'opt2')
                {
                    console.log(`selected option: ${ this.$state.opt2 }`);
                    this.handleAi();
                }

            }
        })
    }

    handleTournament()
    {
        console.log("Tour!");
        // this.routeToTour();
        window.location.hash = '#tournament';

    }

    handleAi()
    {
        console.log("ai");
        window.location.hash = '#ai-battle';
    }
    goToHome()
    {
        window.location.hash = '';
    }
    mounted()
    {
        this.setEvent();
    }
}