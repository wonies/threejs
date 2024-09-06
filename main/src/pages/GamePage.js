import Component from '../core/Component.js';
import Game from '../game/Game.js';
export default class GamePage extends Component {
  constructor(props) {
    super(props);
    this.game = null;
    console.log('-----class export-----');
  }

  template() {
    return `
    <div class="game-wrapper">
        <canvas class="game-canvas"></canvas>
        <div class="game-ui">
          <div class="score-display"></div>
        </div>
      </div>
      `;
  }

  mounted() {
    const canvas = this.$target.querySelector('.game-canvas');
    if (canvas) {
      this.game = new Game(canvas);
    } else {
      console.error('Game canvas not found');
    }
  }

  unmount() {
    if (this.game) {
      this.game.cleanup();
      this.game = null;
    }
  }

  destroy() {
    if (this.game) {
      this.game = null;
    }
  }
}
