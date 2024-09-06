import Component from '../core/Component.js';

export default class StartPage extends Component {
  template() {
    return `
    <div class="start-page-wrapper">
      <div class="trans-box">
           <span class="badge text-bg-primary">English</span>
           <span class="badge text-bg-success">한국어</span>
           <span class="badge text-bg-secondary">日本語</span>
      </div>
      <div class="start-page">
        <h1 class="welcome">Welcome to the Game</h1>
        <button type="button" class="btn btn-light start-button">GAME START</button>
      </div>
    </div>
    `;
  }

  removeEvent() {
    if (this.$target && this.clickHandler) {
      this.$target.removeEventListener('click', this.clickHandler);
      this.clickHandler = null; // 핸들러 참조 제거
    }
  }

  setEvent() {
    this.removeEvent(); // 기존 이벤트 리스너 제거

    this.clickHandler = function ({ target }) {
      if (target.classList.contains('btn')) {
        console.log('Game started!');
        this.routeToGame();
        this.removeEvent(); // 게임 시작 후에도 버튼이 유효해야 한다면 이 줄은 제거
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  routeToGame() {
    window.location.hash = '#ingame-1';
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
