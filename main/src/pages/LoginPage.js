import Component from '../core/Component.js';

export default class LoginPage extends Component {
  template() {
    return `
        <div>Login</div>
        <div data-component="counter"></div>
        `;
  }
  mounted() {
    const $login = this.$target.querySelector('[data-component="counter"]');
    new Counter($counter);
  }
}
