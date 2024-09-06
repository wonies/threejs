import Component from './core/Component.js';
import HomePage from './pages/HomePage.js';
import InGamePage from './pages/InGamePage.js';
import AiBattlePage from './pages/AiBattlePage.js';
import TournamentPage from './pages/TournamentPage.js';
import TourStandBy from './pages/TourStandBy.js';
import TourStandByFour from './pages/TourStandByFour.js';
import TourStandByEight from './pages/TourStandByEight.js';
import WaitingRoom from './pages/WaitingRoom.js';
import GamePage from './pages/GamePage.js';
import Game from './game/Game.js';
import InGame from './game/InGame.js';

export default class App extends Component {
  setup() {
    this.$state = {
      routes: [
        { path: '', component: HomePage },
        { path: 'ingame-1', component: InGamePage },
        { path: 'ai-battle', component: AiBattlePage },
        { path: 'tournament', component: TournamentPage },
        { path: 'standby-2', component: TourStandBy },
        { path: 'standby-4', component: TourStandByFour },
        { path: 'standby-8', component: TourStandByEight },
        { path: 'waiting-room', component: WaitingRoom },
        { path: 'game', component: GamePage },
        { path: 'game-direct', component: Game },
        { path: 'ingame', component: InGame },
      ],
    };
    this.route = this.route.bind(this);
  }

  template() {
    return `
    <main data-component="container">
      </main>
    `;
  }

  setEvent() {
    window.addEventListener('hashchange', this.route);
  }

  mounted() {
    this.route();
  }

  route() {
    const hash = window.location.hash.replace('#', '') || '';
    const routeInfo =
      this.$state.routes.find((route) => route.path === hash) ||
      this.$state.routes[0];

    const $main = this.$target.querySelector('main');
    new routeInfo.component($main);
    console.log('hash------', hash);
    console.log('route info: ', routeInfo);
  }
}
