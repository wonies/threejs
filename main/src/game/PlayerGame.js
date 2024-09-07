import Component from '../core/Component.js';

export default class PlayerGame extends Component {
  constructor(props) {
    super(props);
    this.playerCount = 0;
    this.players = [];
    this.currentRound = 0;
    this.tournamentRounds = [];
    this.currentMatch = null;
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.engine = null;
    this.world = null;
    this.ball = null;
    this.paddle_one = null;
    this.paddle_two = null;
    this.ballMesh = null;
    this.paddle_One_Mesh = null;
    this.paddle_Two_Mesh = null;
    this.scoreElement = null;
    this.playerOnePoint = 0;
    this.playerTwoPoint = 0;
    this.isGameOver = false;
    this.AiOpponent = false;
    this.aiTargetY = 0;
    this.lastBallPosition = { x: 0, y: 0 };
    this.lastUpdateTime = Date.now();
    this.initialSpeed = this.gameWidth * 0.003;
    this.players = [];
    this.init();
    console.log('-----------constructor-----------');
    this.setup();
    this.loadPlayersFromSessionStorage();
  }

  setup() {
    this.setState({
      image: '../../main/public/pongmatch.png',
      scoreLeft: 0,
      scoreRight: 0,
      playerLeft: '',
      playerRight: '',
      players: [],
    });

    this.loadPlayersFromSessionStorage();
    if (this.players.length > 0) {
      this.setupTournament();
    } else {
      console.error('No players available for the tournament');
    }
  }

  getPlayerCount() {
    const playersJSON = sessionStorage.getItem('players');
    if (playersJSON) {
      const players = JSON.parse(playersJSON);
      return Object.keys(players).length;
    }
    return 2;
  }

  loadPlayersFromSessionStorage() {
    const playersJSON = sessionStorage.getItem('players');
    if (playersJSON) {
      try {
        const playersObj = JSON.parse(playersJSON);
        this.players = Object.entries(playersObj).map(([key, value]) => ({
          id: key,
          name: value,
        }));
        this.playerCount = this.players.length;
        console.log(`Loaded ${this.playerCount} players:`, this.players);
      } catch (error) {
        console.error('Error parsing players from sessionStorage:', error);
        this.players = [];
      }
    } else {
      console.error('No players found in sessionStorage');
      this.players = [];
    }

    if (this.players.length === 0) {
      console.error('Unable to start game: No players available');
    }

    this.setState({ players: this.players });
  }

  init() {
    this.setupScene();
    this.setupPhysics();
    this.createWalls();
    this.createBall();
    this.createPaddles();
    this.createThreeJsObjects();
    this.createScoreDisplay();
    this.setupEventListeners();
    this.animate();
    this.loadBackground();
  }

  template() {
    const { scoreLeft, scoreRight, image, playerLeft, playerRight } =
      this.$state;
    return `
    <div class="game-canvas">
      <div class="game-ui">
        <div class="score-display">${scoreLeft} : ${scoreRight}</div>
        <div class="playerLeft-display">${playerLeft}</div>
        <div class="playerRight-display">${playerRight}</div>
        </div>
        </div>
         <div id="myModal" class="modal">
          <div class="modal-content">
            <h2 id="modalText"></h2>
            <div class="modal-buttons">
              <button id="homeButton">홈으로 가기</button>
            </div>
          </div>
        </div>
        </div>
        `;
  }

  loadBackground() {
    const loader = new THREE.TextureLoader();
    loader.load('public/tables.png', (texture) => {
      this.backgroundTexture = texture;
      this.backgroundTexture.encoding = THREE.sRGBEncoding;
      this.scene.background = this.backgroundTexture;
    });
  }

  setupTournament() {
    if (this.players.length === 0) {
      console.error('Cannot start tournament: No players available');
      return;
    }

    const playerCount = this.players.length;
    if (![2, 4, 8].includes(playerCount)) {
      console.error('Invalid number of players for tournament');
      return;
    }

    this.tournamentRounds = [this.players];
    while (this.tournamentRounds[this.tournamentRounds.length - 1].length > 1) {
      const currentRound =
        this.tournamentRounds[this.tournamentRounds.length - 1];
      const nextRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        nextRound.push(null); // Placeholder for the winner
      }
      this.tournamentRounds.push(nextRound);
    }

    this.startNextMatch();
  }

  startNextMatch() {
    console.log('Starting next match, current round:', this.currentRound);
    if (this.currentRound >= this.tournamentRounds.length) {
      console.log('Tournament ended');
      this.endTournament();
      return;
    }

    const currentRoundPlayers = this.tournamentRounds[this.currentRound];
    if (!currentRoundPlayers) {
      console.error('No players found for current round:', this.currentRound);
      return;
    }

    let nextMatchIndex = currentRoundPlayers.findIndex(
      (player) => player !== null
    );
    console.log('Next match index:', nextMatchIndex);

    if (
      nextMatchIndex === -1 ||
      nextMatchIndex + 1 >= currentRoundPlayers.length
    ) {
      console.log('No more matches in current round, moving to next round');
      this.currentRound++;
      this.startNextMatch();
      return;
    }

    const player1 = currentRoundPlayers[nextMatchIndex];
    const player2 = currentRoundPlayers[nextMatchIndex + 1];

    const player1Name =
      player1 && player1.name ? player1.name : `Player ${nextMatchIndex + 1}`;
    const player2Name =
      player2 && player2.name ? player2.name : `Player ${nextMatchIndex + 2}`;

    this.currentMatch = {
      player1: { ...player1, name: player1Name },
      player2: { ...player2, name: player2Name },
      index: nextMatchIndex,
    };

    console.log('Starting match:', this.currentMatch);

    this.cleanupGameElements();

    this.createGameElements();
    this.setState({
      playerLeft: player1Name,
      playerRight: player2Name,
      scoreLeft: 0,
      scoreRight: 0,
    });

    this.isGameOver = false;
    if (!this.animationId) {
      this.animate();
    }

    console.log(`Match started: ${player1Name} vs ${player2Name}`);
  }

  cleanupGameElements() {
    // Remove existing paddles and ball from the physics world
    if (this.paddle_one) Matter.World.remove(this.world, this.paddle_one);
    if (this.paddle_two) Matter.World.remove(this.world, this.paddle_two);
    if (this.ball) Matter.World.remove(this.world, this.ball);

    // Remove existing meshes from the scene
    if (this.paddle_One_Mesh) this.scene.remove(this.paddle_One_Mesh);
    if (this.paddle_Two_Mesh) this.scene.remove(this.paddle_Two_Mesh);
    if (this.ballMesh) this.scene.remove(this.ballMesh);

    // Dispose of geometries and materials
    if (this.paddle_One_Mesh) {
      this.paddle_One_Mesh.geometry.dispose();
      this.paddle_One_Mesh.material.dispose();
    }
    if (this.paddle_Two_Mesh) {
      this.paddle_Two_Mesh.geometry.dispose();
      this.paddle_Two_Mesh.material.dispose();
    }
    if (this.ballMesh) {
      this.ballMesh.geometry.dispose();
      this.ballMesh.material.dispose();
    }

    // Reset references
    this.paddle_one = null;
    this.paddle_two = null;
    this.ball = null;
    this.paddle_One_Mesh = null;
    this.paddle_Two_Mesh = null;
    this.ballMesh = null;
  }

  createGameElements() {
    this.createBall();
    this.createPaddles();
    this.createThreeJsObjects();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x4558f0);

    this.camera = new THREE.OrthographicCamera(
      -this.gameWidth / 2,
      this.gameWidth / 2,
      this.gameHeight / 2,
      -this.gameHeight / 2,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.gameWidth, this.gameHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  setupPhysics() {
    const { Engine, World, Resolver } = Matter;

    this.engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
    });

    Resolver._restingThresh = 0.001;

    this.world = this.engine.world;
  }

  createWalls() {
    const { Bodies, World } = Matter;
    const wallThickness = 10;

    const createWall = (x, y, width, height) => {
      return Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        restitution: 1,
        friction: 0,
        density: 1,
        slop: 0,
        render: { visible: false },
      });
    };

    const topWall = createWall(
      0,
      -this.gameHeight / 2,
      this.gameWidth,
      wallThickness
    );
    const bottomWall = createWall(
      0,
      this.gameHeight / 2,
      this.gameWidth,
      wallThickness
    );

    World.add(this.world, [topWall, bottomWall]);
  }

  createBall() {
    const { Bodies, World, Body } = Matter;
    const ballRadius = this.gameWidth * 0.01;
    this.ball = Bodies.circle(0, 0, ballRadius, {
      label: 'ball',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      density: 1,
      slop: 0,
    });
    World.add(this.world, this.ball);

    const angle = Math.random() * Math.PI * 2;
    Body.setVelocity(this.ball, {
      x: Math.cos(angle) * this.initialSpeed,
      y: Math.sin(angle) * this.initialSpeed,
    });
  }

  createPaddles() {
    const { Bodies, World } = Matter;
    const paddleWidth = this.gameWidth * 0.02;
    const paddleHeight = this.gameHeight * 0.15;
    const paddleOffsetX = this.gameWidth * 0.45;

    this.paddle_one = Bodies.rectangle(
      -paddleOffsetX,
      0,
      paddleWidth,
      paddleHeight,
      {
        label: 'paddle_one',
        isStatic: true,
        friction: 0,
        frictionAir: 0,
        density: 1,
        slop: 0,
      }
    );

    this.paddle_two = Bodies.rectangle(
      paddleOffsetX,
      0,
      paddleWidth,
      paddleHeight,
      {
        label: 'paddle_two',
        isStatic: true,
        friction: 0,
        frictionAir: 0,
        density: 1,
        slop: 0,
      }
    );

    World.add(this.world, [this.paddle_one, this.paddle_two]);
  }

  createThreeJsObjects() {
    // Create walls
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wallGeometryTop = new THREE.BoxGeometry(this.gameWidth, 10, 0);
    const wallGeometryBottom = new THREE.BoxGeometry(this.gameWidth, 10, 0);
    const wallMeshTop = new THREE.Mesh(wallGeometryTop, wallMaterial);
    const wallMeshBottom = new THREE.Mesh(wallGeometryBottom, wallMaterial);
    wallMeshTop.position.set(0, -this.gameHeight / 2, 0);
    wallMeshBottom.position.set(0, this.gameHeight / 2, 0);
    this.scene.add(wallMeshTop, wallMeshBottom);

    // Create ball
    const ballGeometry = new THREE.CircleGeometry(this.gameWidth * 0.01, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    this.scene.add(this.ballMesh);

    // Create paddles
    const paddleGeometry = new THREE.BoxGeometry(
      this.gameWidth * 0.02,
      this.gameHeight * 0.15,
      0.1
    );
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xcd4b57 });
    this.paddle_One_Mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
    this.paddle_Two_Mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
    this.scene.add(this.paddle_One_Mesh, this.paddle_Two_Mesh);
  }

  createScoreDisplay() {
    this.scoreElement = document.createElement('div');
    this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '20px';
    this.scoreElement.style.left = '50%';
    this.scoreElement.style.transform = 'translateX(-50%)';
    this.scoreElement.style.color = 'white';
    this.scoreElement.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(this.scoreElement);
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleKeyPress(event) {
    const { Body } = Matter;
    const moveSpeed = this.gameHeight * 0.02;
    const halfPaddleHeight = (this.gameHeight * 0.15) / 2;
    const maxY = this.gameHeight / 2 - halfPaddleHeight;
    const minY = -this.gameHeight / 2 + halfPaddleHeight;

    if (event.key == 'w' || event.key == 'W') {
      const newY = Math.min(this.paddle_one.position.y + moveSpeed, maxY);
      Body.setPosition(this.paddle_one, {
        x: this.paddle_one.position.x,
        y: newY,
      });
    } else if (event.key == 's' || event.key == 'S') {
      const newY = Math.max(this.paddle_one.position.y - moveSpeed, minY);
      Body.setPosition(this.paddle_one, {
        x: this.paddle_one.position.x,
        y: newY,
      });
    } else if (event.key == 'ArrowUp') {
      const newY = Math.min(this.paddle_two.position.y + moveSpeed, maxY);
      Body.setPosition(this.paddle_two, {
        x: this.paddle_two.position.x,
        y: newY,
      });
    } else if (event.key == 'ArrowDown') {
      const newY = Math.max(this.paddle_two.position.y - moveSpeed, minY);
      Body.setPosition(this.paddle_two, {
        x: this.paddle_two.position.x,
        y: newY,
      });
    }
  }

  handleResize() {
    const { Body } = Matter;
    this.gameWidth = window.innerWidth;
    this.gameHeight = window.innerHeight;

    this.camera.left = -this.gameWidth / 2;
    this.camera.right = this.gameWidth / 2;
    this.camera.top = this.gameHeight / 2;
    this.camera.bottom = -this.gameHeight / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.gameWidth, this.gameHeight);

    // Update paddle positions
    const newPaddleOffsetX = this.gameWidth * 0.4;
    Body.setPosition(this.paddle_one, {
      x: -newPaddleOffsetX,
      y: this.paddle_one.position.y,
    });
    Body.setPosition(this.paddle_two, {
      x: newPaddleOffsetX,
      y: this.paddle_two.position.y,
    });
  }

  resetBall() {
    const { Body } = Matter;
    Body.setPosition(this.ball, { x: 0, y: 0 });
    const angle = Math.random() * Math.PI * 2;
    Body.setVelocity(this.ball, {
      x: Math.cos(angle) * this.initialSpeed,
      y: Math.sin(angle) * this.initialSpeed,
    });
  }

  updateScore() {
    if (this.ball.position.x > this.gameWidth / 2) {
      this.setState({ scoreLeft: this.$state.scoreLeft + 1 });
      this.resetBall();
    } else if (this.ball.position.x < -this.gameWidth / 2) {
      this.setState({ scoreRight: this.$state.scoreRight + 1 });
      this.resetBall();
    }
  }

  updateScoreDisplay() {
    const scoreDisplay = this.$target.querySelector('.score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = `${this.$state.scoreLeft} : ${this.$state.scoreRight}`;
    }
  }

  endGame() {
    if (this.isGameOver) return;
    var modal = document.getElementById('myModal');
    var closeModalBtn = document.getElementsByClassName('close')[0];
    var modalText = document.getElementById('modalText');

    let winner, loser;
    if (this.$state.scoreLeft >= 2) {
      winner = this.currentMatch.player1;
      loser = this.currentMatch.player2;
    } else if (this.$state.scoreRight >= 2) {
      winner = this.currentMatch.player2;
      loser = this.currentMatch.player1;
    } else {
      return; // Game is not over yet
    }

    this.isGameOver = true;

    // Update tournament brackets
    this.tournamentRounds[this.currentRound][this.currentMatch.index] = null;
    this.tournamentRounds[this.currentRound][this.currentMatch.index + 1] =
      null;
    this.tournamentRounds[this.currentRound + 1][
      Math.floor(this.currentMatch.index / 2)
    ] = winner;

    // Display result
    this.showGameResult(winner, loser);

    // Start next match after a short delay
    setTimeout(() => this.startNextMatch(), 3000);

    closeModalBtn.onclick = function () {
      modal.style.display = 'none';
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
    // restartButton.onclick = () => {
    //   modal.style.display = 'none';
    //   this.navigateToNewGame();
    // };
    homeButton.onclick = () => {
      modal.style.display = 'none';
      this.navigateToHome();
    };
  }

  navigateToNewGame() {
    console.log('Navigating to new game');
    this.cleanup();
    this.init(); // 게임 재초기화

    // 모달 닫기
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
    // window.location.hash = '#ai-game';
  }

  navigateToHome() {
    console.log('Navigating to home');
    this.cleanup();
    window.location.hash = '#ingame-1';
  }

  showGameResult(winner, loser) {
    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('modalText');
    modal.style.display = 'block';
    modalText.textContent = `${winner.name} wins against ${loser.name}!`;
    setTimeout(() => {
      modal.style.display = 'none';
    }, 2000);
  }

  endTournament() {
    const winner = this.tournamentRounds[this.tournamentRounds.length - 1][0];
    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('modalText');
    modal.style.display = 'block';
    modalText.textContent = `Tournament Winner: ${winner.name}!`;
  }

  navigateToHome() {
    console.log('Navigating to home');
    this.cleanup();
    window.location.hash = '#ingame-1';
  }

  updateAiTarget() {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime >= 1000) {
      this.aiTargetY = this.lastBallPosition.y;
      this.lastBallPosition = {
        x: this.ball.position.x,
        y: this.ball.position.y,
      };
      this.lastUpdateTime = currentTime;
    }
  }

  moveAiPaddle() {
    if (!this.AiOpponent) return;

    const { Body } = Matter;
    const moveSpeed = this.gameHeight * 0.002;
    const paddleY = this.paddle_two.position.y;
    const direction = this.aiTargetY > paddleY ? 1 : -1;
    const newY = paddleY + direction * moveSpeed;

    const halfPaddleHeight = (this.gameHeight * 0.15) / 2;
    const maxY = this.gameHeight / 2 - halfPaddleHeight;
    const minY = -this.gameHeight / 2 + halfPaddleHeight;
    const clampedY = Math.max(minY, Math.min(maxY, newY));

    Body.setPosition(this.paddle_two, {
      x: this.paddle_two.position.x,
      y: clampedY,
    });
  }

  setEvent() {
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  mounted() {
    const canvasContainer = this.$target.querySelector('#game-canvas');
  }

  animate() {
    if (this.isGameOver) {
      return;
    }

    Matter.Engine.update(this.engine, 1000 / 60);

    this.ballMesh.position.set(this.ball.position.x, this.ball.position.y, 0);
    this.paddle_One_Mesh.position.set(
      this.paddle_one.position.x,
      this.paddle_one.position.y,
      0
    );
    this.paddle_Two_Mesh.position.set(
      this.paddle_two.position.x,
      this.paddle_two.position.y,
      0
    );

    this.updateAiTarget();
    this.moveAiPaddle();

    const velocity = this.ball.velocity;
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (Math.abs(currentSpeed - this.initialSpeed) > 0.0001) {
      Matter.Body.setVelocity(this.ball, {
        x: (velocity.x / currentSpeed) * this.initialSpeed,
        y: (velocity.y / currentSpeed) * this.initialSpeed,
      });
    }

    this.updateScore();
    this.endGame();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  disposeSceneObjects(scene) {
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }

  cleanup() {
    console.log('-----------cleanup-----------');

    // Cancel animation frame
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Dispose Three.js objects
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
      this.renderer = null;
    }

    if (this.scene) {
      this.disposeSceneObjects(this.scene);
      this.scene = null;
    }

    // Clear Matter.js world and engine
    if (this.world) {
      Matter.World.clear(this.world);
      this.world = null;
    }

    if (this.engine) {
      Matter.Engine.clear(this.engine);
      this.engine = null;
    }

    // Clear DOM elements
    if (this.$target) {
      this.$target.innerHTML = '';
    }

    if (this.scoreElement && this.scoreElement.parentNode) {
      this.scoreElement.parentNode.removeChild(this.scoreElement);
    }

    // Reset game state
    this.isGameOver = true;
    this.ball = null;
    this.ballMesh = null;
    this.paddle_One_Mesh = null;
    this.paddle_Two_Mesh = null;

    super.cleanup();
  }

  unmounted() {
    console.log('-----------unmount-----------');
    this.cleanup();
    super.unmounted();
  }
}
