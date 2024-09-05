export class Game {
  constructor(screen) {
    this.screen = screen;
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

    this.init();
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
    this.scoreElement.style.fontSize = '24px';
    this.scoreElement.style.fontFamily = 'Arial, sans-serif';
    this.scoreElement.textContent = '0 - 0';
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
      this.playerOnePoint += 1;
      this.resetBall();
    } else if (this.ball.position.x < -this.gameWidth / 2) {
      this.playerTwoPoint += 1;
      this.resetBall();
    }
    this.scoreElement.textContent = `${this.playerOnePoint} - ${this.playerTwoPoint}`;
  }

  endGame() {
    if (this.isGameOver) return;
    var modal = document.getElementById('myModal');
    var closeModalBtn = document.getElementsByClassName('close')[0];
    var modalText = document.getElementById('modalText');

    if (this.playerOnePoint >= 2) {
      modal.style.display = 'block';
      modalText.textContent = 'Player One Win!';
      this.isGameOver = true;
      this.cleanup();
    } else if (this.playerTwoPoint >= 2) {
      modal.style.display = 'block';
      modalText.textContent = 'Player Two Win!';
      this.isGameOver = true;
      this.cleanup();
    }

    closeModalBtn.onclick = function () {
      modal.style.display = 'none';
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
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

  cleanup() {
    console.log('game: cleanup method called');
    if (this.renderer && this.renderer.domElement)
      document.body.removeChild(this.renderer.domElement);

    document.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('resize', this.handleResize);

    while (this.scene.children.length > 0)
      this.scene.remove(this.scene.children[0]);

    Matter.World.clear(this.engine.world);
    Matter.Engine.clear(this.engine);

    this.isSetup = false;
  }

  animate() {
    if (this.isGameOver) {
      return;
    }

    const { Engine, Body } = Matter;
    Engine.update(this.engine, 1000 / 60);

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
      Body.setVelocity(this.ball, {
        x: (velocity.x / currentSpeed) * this.initialSpeed,
        y: (velocity.y / currentSpeed) * this.initialSpeed,
      });
    }

    this.updateScore();
    this.endGame();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}

// export class Game {
//   constructor(screen) {
//     this.screen = screen;
//     this.init();
//   }

//   init() {
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x4558f0);

//     const gameWidth = window.innerWidth;
//     const gameHeight = window.innerHeight;

//     // Set up camera to match the game area
//     const camera = new THREE.OrthographicCamera(
//       -gameWidth / 2,
//       gameWidth / 2,
//       gameHeight / 2,
//       -gameHeight / 2,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(gameWidth, gameHeight);
//     document.body.appendChild(renderer.domElement);

//     // Matter.js setup
//     const { Engine, Runner, Bodies, World, Body, Constraint, Resolver } =
//       Matter;

//     const engine = Engine.create({
//       gravity: { x: 0, y: 0, scale: 0 },
//     });

//     Matter.Resolver._restingThresh = 0.001;

//     const world = engine.world;

//     // Create walls (only top and bottom)
//     const wallThickness = 10; // Increased thickness for visibility

//     function createWall(x, y, width, height) {
//       return Bodies.rectangle(x, y, width, height, {
//         isStatic: true,
//         restitution: 1,
//         friction: 0,
//         density: 1,
//         slop: 0,
//         render: { visible: false },
//       });
//     }

//     const topWall = createWall(0, -gameHeight / 2, gameWidth, wallThickness);
//     const bottomWall = createWall(0, gameHeight / 2, gameWidth, wallThickness);

//     World.add(world, [topWall, bottomWall]);

//     // Create ball
//     const ballRadius = gameWidth * 0.01; // Scale ball size relative to game width
//     const ball = Bodies.circle(0, 0, ballRadius, {
//       label: 'ball',
//       restitution: 1,
//       friction: 0,
//       frictionAir: 0,
//       density: 1,
//       slop: 0,
//     });
//     World.add(world, ball);

//     // Create Paddles
//     const paddleWidth = gameWidth * 0.02;
//     const paddleHeight = gameHeight * 0.15;
//     const paddleOffsetX = gameWidth * 0.45;
//     const paddle_one = Bodies.rectangle(
//       -paddleOffsetX,
//       0,
//       paddleWidth,
//       paddleHeight,
//       {
//         label: 'paddle_one',
//         isStatic: true,
//         friction: 0,
//         frictionAir: 0,
//         density: 1,
//         slop: 0,
//       }
//     );

//     const paddle_two = Bodies.rectangle(
//       paddleOffsetX,
//       0,
//       paddleWidth,
//       paddleHeight,
//       {
//         label: 'paddle_two',
//         isStatic: true,
//         friction: 0,
//         frictionAir: 0,
//         density: 1,
//         slop: 0,
//       }
//     );

//     World.add(world, [paddle_one, paddle_two]);

//     // Set initial velocity
//     const initialSpeed = gameWidth * 0.003;
//     const angle = Math.random() * Math.PI * 2;

//     Body.setVelocity(ball, {
//       x: Math.cos(angle) * initialSpeed,
//       y: Math.sin(angle) * initialSpeed,
//     });

//     // Create Three.js objects
//     const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//     const wallGeometryTop = new THREE.BoxGeometry(gameWidth, wallThickness, 0);
//     const wallGeometryBottom = new THREE.BoxGeometry(
//       gameWidth,
//       wallThickness,
//       0
//     );

//     const wallMeshTop = new THREE.Mesh(wallGeometryTop, wallMaterial);
//     const wallMeshBottom = new THREE.Mesh(wallGeometryBottom, wallMaterial);

//     wallMeshTop.position.set(0, -gameHeight / 2, 0);
//     wallMeshBottom.position.set(0, gameHeight / 2, 0);

//     scene.add(wallMeshTop, wallMeshBottom);

//     const ballGeometry = new THREE.CircleGeometry(ballRadius, 32);
//     const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
//     scene.add(ballMesh);

//     const paddle_One_Geometry = new THREE.BoxGeometry(
//       paddleWidth,
//       paddleHeight,
//       0.1
//     );
//     const paddle_One_Material = new THREE.MeshBasicMaterial({
//       color: 0xcd4b57,
//     });
//     const paddle_One_Mesh = new THREE.Mesh(
//       paddle_One_Geometry,
//       paddle_One_Material
//     );
//     scene.add(paddle_One_Mesh);

//     const paddle_Two_Geometry = new THREE.BoxGeometry(
//       paddleWidth,
//       paddleHeight,
//       0.1
//     );
//     const paddle_Two_Material = new THREE.MeshBasicMaterial({
//       color: 0xcd4b57,
//     });
//     const paddle_Two_Mesh = new THREE.Mesh(
//       paddle_Two_Geometry,
//       paddle_Two_Material
//     );
//     scene.add(paddle_Two_Mesh);

//     // Create score display
//     const scoreElement = document.createElement('div');
//     scoreElement.style.position = 'absolute';
//     scoreElement.style.top = '20px';
//     scoreElement.style.left = '50%';
//     scoreElement.style.transform = 'translateX(-50%)';
//     scoreElement.style.color = 'white';
//     scoreElement.style.fontSize = '24px';
//     scoreElement.style.fontFamily = 'Arial, sans-serif';
//     scoreElement.textContent = '0 - 0';
//     document.body.appendChild(scoreElement);

//     document.addEventListener('keydown', pressdown);

//     function pressdown(event) {
//       const moveSpeed = gameHeight * 0.02;
//       const halfPaddleHeight = paddleHeight / 2;
//       const maxY = gameHeight / 2 - halfPaddleHeight;
//       const minY = -gameHeight / 2 + halfPaddleHeight;

//       if (event.key == 'w' || event.key == 'W') {
//         const newY = Math.min(paddle_one.position.y + moveSpeed, maxY);
//         Body.setPosition(paddle_one, { x: paddle_one.position.x, y: newY });
//       } else if (event.key == 's' || event.key == 'S') {
//         const newY = Math.max(paddle_one.position.y - moveSpeed, minY);
//         Body.setPosition(paddle_one, { x: paddle_one.position.x, y: newY });
//       } else if (event.key == 'ArrowUp') {
//         const newY = Math.min(paddle_two.position.y + moveSpeed, maxY);
//         Body.setPosition(paddle_two, { x: paddle_two.position.x, y: newY });
//       } else if (event.key == 'ArrowDown') {
//         const newY = Math.max(paddle_two.position.y - moveSpeed, minY);
//         Body.setPosition(paddle_two, { x: paddle_two.position.x, y: newY });
//       }
//     }

//     function resetBall() {
//       Body.setPosition(ball, { x: 0, y: 0 });
//       const angle = Math.random() * Math.PI * 2;
//       Body.setVelocity(ball, {
//         x: Math.cos(angle) * initialSpeed,
//         y: Math.sin(angle) * initialSpeed,
//       });
//     }

//     let playerOnePoint = 0;
//     let playerTwoPoint = 0;

//     function updateScore() {
//       if (ball.position.x > gameWidth / 2) {
//         playerOnePoint += 1;
//         resetBall();
//       } else if (ball.position.x < -gameWidth / 2) {
//         playerTwoPoint += 1;
//         resetBall();
//       }
//       scoreElement.textContent = `${playerOnePoint} - ${playerTwoPoint}`;
//     }

//     let isGameOver = false;

//     function endGame() {
//       if (isGameOver) return;
//       var modal = document.getElementById('myModal');
//       var closeModalBtn = document.getElementsByClassName('close')[0];
//       var modalText = document.getElementById('modalText');

//       if (playerOnePoint >= 2) {
//         modal.style.display = 'block';
//         modalText.textContent = 'Player One Win!';
//         isGameOver = true;
//       } else if (playerTwoPoint >= 2) {
//         modal.style.display = 'block';
//         modalText.textContent = 'Player Two Win!';
//         isGameOver = true;
//       }

//       closeModalBtn.onclick = function () {
//         modal.style.display = 'none';
//       };

//       window.onclick = function (event) {
//         if (event.target == modal) {
//           modal.style.display = 'none';
//         }
//       };
//     }

//     let AiOpponent = false;
//     let aiTargetY = 0;
//     let lastBallPosition = { x: 0, y: 0 };
//     let lastUpdateTime = Date.now();

//     function updateAiTarget() {
//       const currentTime = Date.now();
//       if (currentTime - lastUpdateTime >= 1000) {
//         aiTargetY = lastBallPosition.y;
//         lastBallPosition = { x: ball.position.x, y: ball.position.y };
//         lastUpdateTime = currentTime;
//       }
//     }

//     function moveAiPaddle() {
//       if (!AiOpponent) return;

//       const moveSpeed = gameHeight * 0.002; // Adjust this value to change AI speed
//       const paddleY = paddle_two.position.y;
//       const direction = aiTargetY > paddleY ? 1 : -1;
//       const newY = paddleY + direction * moveSpeed;

//       // Constrain the paddle within the game bounds
//       const halfPaddleHeight = paddleHeight / 2;
//       const maxY = gameHeight / 2 - halfPaddleHeight;
//       const minY = -gameHeight / 2 + halfPaddleHeight;
//       const clampedY = Math.max(minY, Math.min(maxY, newY));

//       Body.setPosition(paddle_two, { x: paddle_two.position.x, y: clampedY });
//     }

//     function animate() {
//       if (isGameOver) {
//         return;
//       }

//       Engine.update(engine, 1000 / 60);

//       ballMesh.position.set(ball.position.x, ball.position.y, 0);
//       paddle_One_Mesh.position.set(
//         paddle_one.position.x,
//         paddle_one.position.y,
//         0
//       );
//       paddle_Two_Mesh.position.set(
//         paddle_two.position.x,
//         paddle_two.position.y,
//         0
//       );

//       // Update AI target and move AI paddle
//       updateAiTarget();
//       moveAiPaddle();

//       const velocity = ball.velocity;
//       const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
//       if (Math.abs(currentSpeed - initialSpeed) > 0.0001) {
//         Body.setVelocity(ball, {
//           x: (velocity.x / currentSpeed) * initialSpeed,
//           y: (velocity.y / currentSpeed) * initialSpeed,
//         });
//       }

//       updateScore();
//       endGame();
//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     }
//     animate();
//     // Handle window resizing
//     window.addEventListener('resize', function () {
//       const newWidth = window.innerWidth;
//       const newHeight = window.innerHeight;

//       camera.left = -newWidth / 2;
//       camera.right = newWidth / 2;
//       camera.top = newHeight / 2;
//       camera.bottom = -newHeight / 2;
//       camera.updateProjectionMatrix();

//       renderer.setSize(newWidth, newHeight);

//       // Update wall positions
//       Body.setPosition(topWall, { x: 0, y: -newHeight / 2 });
//       Body.setPosition(bottomWall, { x: 0, y: newHeight / 2 });
//       wallMeshTop.position.set(0, -newHeight / 2, 0);
//       wallMeshBottom.position.set(0, newHeight / 2, 0);

//       // Update paddle positions
//       const newPaddleOffsetX = newWidth * 0.4;
//       Body.setPosition(paddle_one, {
//         x: -newPaddleOffsetX,
//         y: paddle_one.position.y,
//       });
//       Body.setPosition(paddle_two, {
//         x: newPaddleOffsetX,
//         y: paddle_two.position.y,
//       });
//     });
//   }
// }
