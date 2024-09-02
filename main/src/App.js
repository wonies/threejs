import StartPage from './pages/StartPage.js';
import Component from './core/Component.js';
import { BackGround } from './threejs/BackGround.js';

export default class App extends Component {
  template() {
    return `
    <main data-component="Background-container"></main>
    `;
  }

  mounted() {
    const $back = this.$target.querySelector(
      '[data-component="Background-container"]'
    );
    console.log('this!');
    console.log('this is three Container', $threeContainer);
    new BackGround($back);

    const $counterApp = this.$target.querySelector('main');
    new StartPage($counterApp);
  }
}
