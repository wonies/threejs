import StartPage from './StartPage.js';
import { BackGround } from '../threejs/BackGround.js';
import Component from '../core/Component.js';

export default class FetchPage extends Component {
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

    // Initialize BackGround
    new BackGround($back);

    // Initialize StartPage
    new StartPage($start);
  }
}
