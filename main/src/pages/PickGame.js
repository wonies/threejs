import Component from '../core/Component.js';
import InGamePage from './InGamePage.js'

export default class PickGame extends Component {
  template() {
    return `
      <div class="main-container">
      </div>
    `;
  }
  mounted() {
    const $in = this.$targer.querySelector(
        'main-container'
    )
    new InGamePage($in);
  }
}
