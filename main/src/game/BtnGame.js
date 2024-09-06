import Component from '../core/Component.js';

export default class Game extends Component {
  template() {
    return `
    <div class="btn-wrapper">
    <button class="home-btn">Home</button>
    </div>
    `;
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
      if (target.classList.contains('home-btn')) {
        console.log('Game started!');
        this.routeToHome();
        this.removeEvent();
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  routeToHome() {
    window.location.hash = '#ingame-1';
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
