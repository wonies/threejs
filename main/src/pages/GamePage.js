import Component from '../core/Component.js';
import Game from '../game/Game.js';
export default class GamePage extends Component {
  constructor(props) {
    super(props);
    this.game = null;
    console.log('-----class export-----');
  }

  template() {
    return `<div class="game-content"></div>`;
  }

  mounted() {
    const $content = this.$target.querySelector('.game-content');
    if ($content) {
      this.game = new Game($content);
    } else {
      console.error('Game content container not found');
    }
  }

  unmount() {
    console.log('game_page: unmount called');
    if (this.game) this.game.cleanup();
  }

  destroy() {
    if (this.game) {
      this.game = null;
    }
  }
}
