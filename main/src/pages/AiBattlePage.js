import InGamePage from './InGamePage.js';
import GamePage from './GamePage.js';

export default class AiBattlePage extends InGamePage {
  constructor(props) {
    console.log('Ai Battle Constructor');
    super(props);
    this.typingInterval = null;
    this.gamePage = null;
    // console.log(this.$target);
  }

  setup() {
    super.setup();

    this.$state = {
      ...this.$state,
      image: '../../main/public/aiphoto.png',
      opt: '나랑 진짜 게임할거야? 쉽지않을걸..',
    };
    setTimeout(() => this.startTypingEffect(), 0);
  }

  template() {
    const { image, opt } = this.$state;
    return `
        <div class="ingame-container">
        <div class="account-image">
            <img src="${image}" alt="pong">
        </div>
        <div class="pick-option">
            <div class="option" data-option="opt1">
            <span id="typing-text"></span>
             <button id="hon" class="hon" style="display: none;">혼내주러가기</button>
            </div>
        </div>
        </div>
      `;
  }

  startTypingEffect() {
    const textElement = document.getElementById('typing-text');
    const button = document.getElementById('hon');
    if (!textElement || !button) return;

    const text = this.$state.opt;
    let index = 0;

    textElement.textContent = '';

    this.typingInterval = setInterval(() => {
      if (index < text.length) {
        textElement.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(this.typingInterval);
        this.showButton();
      }
    }, 100);
  }

  showButton() {
    const button = document.getElementById('hon');
    if (button) {
      button.style.display = 'inline-block';
    }
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
      if (target.classList.contains('hon')) {
        this.routeToGame();
        this.removeEvent();
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  destroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.gamePage) {
      this.gamePage.destroy();
    }
    super.destroy();
  }

  goToHome() {
    window.location.hash = 'ingame-1';
  }

  routeToGame() {
    console.log('Routing to game page');
    window.location.hash = '#game';
  }
}
