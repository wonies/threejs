import Component from '../core/Component.js';

export default class StartPage extends Component {
  template() {
    const language = this.getLanguage();
    return `
    <div class="start-page-wrapper">
      <div class="trans-box">
        <span class="badge ${
          language === 'en' ? 'text-bg-primary' : 'text-bg-secondary'
        }" data-lang="en">English</span>
        <span class="badge ${
          language === 'ko' ? 'text-bg-primary' : 'text-bg-secondary'
        }" data-lang="ko">한국어</span>
        <span class="badge ${
          language === 'ja' ? 'text-bg-primary' : 'text-bg-secondary'
        }" data-lang="ja">日本語</span>
      </div>
      <div class="start-page">
        <h1 class="welcome">${this.getWelcomeMessage(language)}</h1>
        <button type="button" class="btn btn-light start-button">${this.getStartButtonText(
          language
        )}</button>
      </div>
    </div>
    `;
  }

  setEvent() {
    this.removeEvent();

    this.clickHandler = function ({ target }) {
      if (target.classList.contains('btn')) {
        console.log('Game started!');
        this.routeToGame();
        this.removeEvent();
      } else if (target.classList.contains('badge')) {
        const lang = target.dataset.lang;
        if (lang) {
          this.setLanguage(lang);
          sessionStorage.setItem('language', lang);
        }
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  getWelcomeMessage(lang) {
    const messages = {
      en: 'Welcome to the Game',
      ko: '게임에 오신 것을 환영합니다',
      ja: 'ゲームへようこそ',
    };
    return messages[lang] || messages.en;
  }

  getStartButtonText(lang) {
    const texts = {
      en: 'GAME START',
      ko: '게임 시작',
      ja: 'ゲーム開始',
    };
    return texts[lang] || texts.en;
  }
  removeEvent() {
    if (this.$target && this.clickHandler) {
      this.$target.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  // setEvent() {
  //   this.removeEvent();

  //   this.clickHandler = function ({ target }) {
  //     if (target.classList.contains('btn')) {
  //       console.log('Game started!');
  //       this.routeToGame();
  //       this.removeEvent();
  //     }
  //   }.bind(this);

  //   if (this.$target) {
  //     this.$target.addEventListener('click', this.clickHandler);
  //   }
  // }

  routeToGame() {
    window.location.hash = '#ingame-1';
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
