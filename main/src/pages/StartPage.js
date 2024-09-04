import Component from '../core/Component.js';

export default class StartPage extends Component {
  // template() {
  //   return `
  //   <div class="trans-box">
  //     <span class="badge text-bg-primary">English</span>
  //     <span class="badge text-bg-success">한국어</span>
  //     <span class="badge text-bg-secondary">日本語</span>
  //   </div>
  //   <div class="start-page">
  //       <h1 class="welcome">Welcome to the Game</h1>
  //       <button type="button" class="btn btn-light">GAME START</button>
  //     </div>
  //   `;
  // }
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


  setEvent() {
    const { $target } = this;
    $target.addEventListener('click', ({ target }) => {
      if (target.classList.contains('btn')) {
        console.log('Game started!');
        this.routeToGame();
      }
    });
  }
  
  routeToGame()
  {
    window.location.hash = '#ingame-1';
  }

  mounted() {}
}
