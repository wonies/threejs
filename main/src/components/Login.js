import Component from '../core/Component.js';

export default class Login extends Component {
  setup() {
    this.$state = {
      counter: 0,
    };
  }

  template() {
    return `
     <div>
        <h2>Login</h2>

      </div>
    `;
  }

  //   setEvent() {
  //     this.addEvent('click', '.up', ({ target }) => {
  //       const prev = this.$state.counter;
  //       this.up(prev);
  //     });
  //     this.addEvent('click', '.down', ({ target }) => {
  //       const prev = this.$state.counter;
  //       this.down(prev);
  //     });
  //   }
  //   up(prev) {
  //     this.setState({ counter: prev + 1 });
  //   }
  //   down(prev) {
  //     this.setState({ counter: prev - 1 });
  //   }
}
