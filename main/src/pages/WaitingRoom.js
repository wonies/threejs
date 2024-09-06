import InGamePage from './InGamePage.js';

export default class WaitingRoom extends InGamePage {
  setup() {
    super.setup();

    const players = JSON.parse(sessionStorage.getItem('players') || '{}');

    const playerNames = Object.entries(players)
      .filter(([key]) => key.startsWith('opt'))
      .map(([_, value]) => value || 'Anonymous')
      .filter((name) => name.trim() !== '');

    this.$state = {
      ...this.$state,
      image: '../../main/public/aiphoto.png',
      playerNames,
    };
  }

  template() {
    const { image, playerNames } = this.$state;

    const playerList = playerNames
      .map(
        (name, index) => `
            <div>Player ${index + 1}: ${name}</div>
        `
      )
      .join('');

    return `
        <div class="ingame-container">
            <div class="account-image">
                <img src="${image}" alt="pong">
            </div>
            <div class="pick-option">
                <h1>New Challenge!</h1>
                <div>Are you ready?</div>
                ${playerList}
                ${this.getGameStartButton()}
            </div>
        </div>
        `;
  }

  getGameStartButton() {
    const playerCount = this.$state.playerNames.length;
    if (playerCount < 2) {
      return '<div>Waiting for more players...</div>';
    } else if (playerCount === 2) {
      return '<button class="start-game">Start 1v1 Game</button>';
    } else {
      return '<button class="start-tournament">Start Tournament</button>';
    }
  }

  handleGameStart() {
    const playerCount = this.$state.playerNames.length;
    if (playerCount === 2) {
      console.log('1v1 게임 시작!');
      window.location.hash = '#game-1v1';
    } else {
      console.log('토너먼트 시작!');
      window.location.hash = '#tournament';
    }
  }

  goToHome() {
    window.location.hash = 'ingame-1';
  }

  removeEvent() {
    if (this.$target && this.clickHandler) {
      this.$target.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  setEvent() {
    this.removeEvent();

    this.clickHandler = function ({ target }) {
      if (
        target.matches('.start-game') ||
        target.matches('.start-tournament')
      ) {
        this.handleGameStart();
        this.removeEvent();
      } else if (target.closest('.go-home')) {
        this.goToHome();
        this.removeEvent();
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
