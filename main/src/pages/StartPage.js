import Component from '../core/Component.js';
// import '../style/pages/StartPage.css';

export default class StartPage extends Component {
  // constructor($target) {
  //   super($target);
  //   this.loadCSS('../style/pages/StartPage.css');
  // }

  // loadCSS(href) {
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = href;
  //   document.head.appendChild(link);
  // }

  template() {
    return `
      <div class="start-page">
        <h1 class="welcome">Welcome to the Game</h1>
        <button type="button" class="btn btn-light">GAME START</button>
      </div>
    `;
  }

  setEvent() {
    const { $target } = this;
    $target.addEventListener('click', ({ target }) => {
      if (target.classList.contains('btn')) {
        console.log('Game started!');
        // 게임 시작 로직
      }
    });
  }

  mounted() {}
}
