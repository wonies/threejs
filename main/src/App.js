import StartPage from './pages/StartPage.js';
import Component from './core/Component.js';
import { BackGround } from './threejs/BackGround.js';
import HomePage from './pages/HomePage.js';
import Home from './pages/Home.js';

export default class App extends Component {
  setup() {
    this.$state = {
      routes: [],
    };
  }
  template() {
    return `
    <main data-component="container">
      <div class="app-container">
        <div data-component="background-container"></div>
        <div data-component="start-page-container"></div>
      </div>
      </main>
    `;
  }

  mounted() {
    const $back = this.$target.querySelector(
      '[data-component="background-container"]'
    );
    const $start = this.$target.querySelector(
      '[data-component="start-page-container"]'
    );

    // Initialize BackGround
    new BackGround($back);

    // Initialize StartPage
    new StartPage($start);
  }
}

// export default class App extends Component {
//   setup() {
//     this.$state = {
//       routes: [],
//     };
//   }
//   template() {
//     return `
//     <main data-component="container">
//       </main>
//     `;
//   }

//   mounted() {
//     const $main = this.$target.querySelector('main');
//     const pages = Home($main);
//     this.$state.routes.push({ fragment: '#/', component: pages.home });
//     // Initialize BackGround
//     // new BackGround($back);
//     // // Initialize StartPage
//     // new StartPage($start);
//   }
// }
