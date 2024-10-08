import StartPage from './StartPage.js';
import { BackGround } from '../threejs/BackGround.js';
import Component from '../core/Component.js';

export default class HomePage extends Component {
  template() {
    return `
      <div class="app-container">
        <div data-component="background-container"></div>
        <div data-component="start-page-container"></div>
      </div>
    `;
  }
  mounted() {
    const $back = this.$target.querySelector(
      '[data-component="background-container"]'
    );
    const $start = this.$target.querySelector(
      '[data-component="start-page-container"]'
    );

    new BackGround($back);
    new StartPage($start);
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
