import Component from '../core/Component.js';

export default class TourStandBy extends Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.removeEvent();
  }
  setup() {
    super.setup();
    this.$state = {
      image: '../../main/public/doublepong.png',
      optCount: 2,
      optArray: Array(2).fill(''),
    };
  }

  template() {
    const { image, optCount, optArray } = this.$state;

    const inputs = Array(optCount)
      .fill(0)
      .map(
        (_, index) => `
            <input type="text" class="match-opt" data-option="opt${
              index + 1
            }" value="${optArray[index]}">
        `
      )
      .join('');

    return `
        <div class="ingame-container">
            <div class="account-image">
                <img src="${image}" alt="pong">
            </div>
                <div class="pick-option">
                    ${inputs}
                    <button class="match-btn">MATCH</button>
                </div>
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
      if (target.closest('.account-image img')) {
        this.goToHome();
        this.removeEvent();
      }
      if (target.matches('.match-btn')) {
        this.handleMatchButtonClick();
        this.removeEvent();
        this.goMatchRoom();
        this.removeEvent();
      }
    }.bind(this);

    if (this.$target) {
      this.$target.addEventListener('click', this.clickHandler);
    }
  }

  handleMatchButtonClick() {
    const optValues = {};
    let anonymousCount = 1;
    for (let i = 1; i <= 2; i++) {
      let value = this.$target
        .querySelector(`.match-opt[data-option="opt${i}"]`)
        .value.trim();

      if (value === '') {
        value = `anonymous${anonymousCount}`;
        anonymousCount++;
      }

      optValues[`opt${i}`] = value;
      console.log(`Option ${i}:`, value);
    }

    sessionStorage.setItem('players', JSON.stringify(optValues));
    console.log('Values saved to sessionStorage');
  }

  goMatchRoom() {
    window.location.hash = '#waiting-room';
  }

  goToHome() {
    window.location.hash = '#ingame-1';
  }

  destroy() {
    this.removeEvent();
    super.destroy();
  }
}
