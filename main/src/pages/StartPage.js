import Component from '../core/Component.js';
import Pages from '../components/Pages.js';

export default class StartPage extends Component {
  template() {
    return `
        <div>Start</div>
        <div data-component="menubar"></div>
        `;
  }
  mounted() {
    const $login = this.$target.querySelector('[data-component="menubar"]');
    new Pages($login);
  }
}
