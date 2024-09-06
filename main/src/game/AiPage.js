import AiGame from './AiGame.js';
import BtnGame from './BtnGame.js';
import Component from '../core/Component.js';

export default class AiPage extends Component {
  template() {
    return `
      <div class="app-container">
        <div data-component="background-container">
        </div>
        <div data-component="add-page-container"></div>
      </div>
    `;
  }
  mounted() {
    const $back = this.$target.querySelector(
      '[data-component="background-container"]'
    );
    const $start = this.$target.querySelector(
      '[data-component="add-page-container"]'
    );

    new AiGame($back);
    // new BtnGame($start);
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
