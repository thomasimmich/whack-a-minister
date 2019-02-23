import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprite, Application, Sound, Text, Point, Container } from 'pixi.js';
//import * as PIXI from "pixi.js/dist/pixi.js"
declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

enum GameStates {
  IdleState = 'Idle',
  EnemyVisibleState = 'Visible',
  EnemyHiddenState = 'Hidden',
  EnemyHittingState = 'Hitting',
  EnemyRepositioningState = 'Repositioning'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  // List of files to load
  private manifest = {
    carImage: 'assets/images/car.png',
    wheelImage: 'assets/images/wheel.png',
    enemyImage: 'assets/images/scheuer.png',
    enemyWhackedImage: 'assets/images/scheuer-whacked.png',
    handImage: 'assets/images/hand.png',
    handSmackingImage: 'assets/images/hand-smacking.png',
    clapSound: 'assets/sounds/clap.mp3',
    punchSound: 'assets/sounds/punch.mp3'
  };

  title = 'Scheuer-Den-Scheuer';

  @ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
  public app: Application; // this will be our pixi application
  public gameState: GameStates;

  private referenceWidth: number;
  private relStreetHeight: number;

  private landscape: Container;
  private landscapeZoom: number;
  private carSprite: Sprite;
  private frontWheelSprite: Sprite;
  private rearWheelSprite: Sprite;
  private enemySprite: Sprite;
  private cursorSprite: Sprite;
  private stateText: Text;
  private stateTime: number;
  private enemyCommentText: Text;
  private holeRelPositions: Point[] = [
    //new Point(0.16, 0.43),//1-Kofferraum
    new Point(0.16, 1-0.54),//2-ganzhinten
    new Point(0.31, 0.48),//3-fasthinten
    new Point(0.45, 0.48),//4-zweitevonvorne
    //new Point(0.54, 0.32),//5-dachluke
    new Point(0.61, 0.48),//6-vorne
    //new Point(0.85, 0.50),//7-motorhaube 
  ];

  private enemyHiddenTime: number;
  private enemyVisibleTime: number;

  ngOnInit() {

    // reference width is taken from iPad Pro Retina
    this.referenceWidth = 2732;
    this.landscapeZoom = 1.0;
    this.relStreetHeight = 0.05;

    const parent = this.pixiContainer.nativeElement;
    this.app = new PIXI.Application({
      width: parent.clientWidth,
      height: parent.clientHeight,
      backgroundColor: 0x1099bb
    }); // this creates our pixi application

    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document

    if (!PIXI.utils.isWebGLSupported()) {
    }

    // Add to the PIXI loader
    for (let name in this.manifest) {
      PIXI.loader.add(name, this.manifest[name]);
    }

    PIXI.loader.
      on("progress", this.onLoad).
      load(this.setup.bind(this));
  }

  onLoad(loader, resource) {
    console.log(`loaded ${resource.url}. Loading is ${loader.progress}% complete.`);
  }

  setupGameVariables() {
    this.updateGameVariables();
    this.goToState(GameStates.EnemyHiddenState);
  }

  setupText() {
    this.enemyCommentText = new PIXI.Text('AUA! Friss Staub!');
    this.enemyCommentText.x = this.enemySprite.x - this.enemyCommentText.width / 2;
    this.enemyCommentText.y = this.enemySprite.y - this.enemySprite.height / 2 - this.enemyCommentText.height;

    this.app.stage.addChild(this.enemyCommentText);

    this.stateText = new PIXI.Text(this.gameState);
    this.app.stage.addChild(this.stateText);
  }

  setupCursor() {
    this.app.renderer.plugins.interaction.cursorStyles.default = 'none';

    let interaction = this.app.renderer.plugins.interaction;

    this.cursorSprite = new PIXI.Sprite(
      PIXI.loader.resources['handImage'].texture
    );



    this.cursorSprite.anchor.set(0.35, 0.25); // position specific to where the actual cursor point is
    
    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    this.cursorSprite.scale.x *= scaleFactor;
    this.cursorSprite.scale.y *= scaleFactor;
    
    this.app.stage.addChild(this.cursorSprite);

    interaction.on("pointerover", () => {
      this.cursorSprite.visible = true;
    });
    interaction.on("pointerout", () => {
      this.cursorSprite.visible = false;
    });
    interaction.on("pointermove", (event) => {
      this.cursorSprite.position = event.data.global;
    });
  }

  setupLandscape() {
    this.landscape = new PIXI.DisplayObjectContainer(); 
    this.landscape.pivot.x = 0.5;
    this.landscape.pivot.y = 0.5;
    //(PIXI.DisplayObjectContainer)(this.landscape).anchor.x = 0.5;
    //(PIXI.DisplayObjectContainer)(this.landscape).anchor.y = 0.5;
    this.app.stage.addChild(this.landscape);
  }

  setupCar() {
    this.carSprite = new PIXI.Sprite(
      PIXI.loader.resources['carImage'].texture
    );
    this.carSprite.anchor.x = 0.5;
    this.carSprite.anchor.y = 0.5;

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    this.carSprite.scale.x *= scaleFactor;
    this.carSprite.scale.y *= scaleFactor;

    this.carSprite.position.set(
      this.app.renderer.view.width * 0.5065,
      this.app.renderer.view.height - this.carSprite.height * 0.8
      - this.relStreetHeight * this.app.screen.height // street offset
      // - Math.min(
      //   this.app.renderer.view.height * 0.15, // relative to screen height the car will become higher
      //   this.carSprite.height * 0.4 // but not higher than one forth of the car's height
      // )
    );
    this.landscape.addChild(this.carSprite);
    
    // this.app.ticker.add(function (delta) {
    //   // just for fun, let's rotate mr rabbit a little
    //   // delta is 1 if running at 100% performance
    //   // creates frame-independent transformation
    //   this.carSprite.rotation += 0.1 * delta;
    // });

    this.setupWheels();
  }

  setupWheels() {

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);

    this.frontWheelSprite = new PIXI.Sprite(
      PIXI.loader.resources['wheelImage'].texture
    );
    this.frontWheelSprite.anchor.set(0.5);

    this.frontWheelSprite.scale.x *= scaleFactor;
    this.frontWheelSprite.scale.y *= scaleFactor;

    this.frontWheelSprite.position.set(
      this.app.renderer.view.width * 0.82,
      this.app.screen.height - this.frontWheelSprite.height / 2
      - this.relStreetHeight * this.app.screen.height // street offset
    );
    this.landscape.addChild(this.frontWheelSprite);

    this.rearWheelSprite = new PIXI.Sprite(
      PIXI.loader.resources['wheelImage'].texture
    );
    this.rearWheelSprite.anchor.set(0.5);
    this.rearWheelSprite.scale.x *= scaleFactor;
    this.rearWheelSprite.scale.y *= scaleFactor;

    this.rearWheelSprite.position.set(
      this.app.renderer.view.width * 0.249,
      this.app.screen.height - this.rearWheelSprite.height / 2
      - this.relStreetHeight * this.app.screen.height // street offset
    );

    this.landscape.addChild(this.rearWheelSprite);  
  }

  setupEnemy() {
    this.enemySprite = new PIXI.Sprite(
      PIXI.loader.resources['enemyImage'].texture
    );

    this.enemySprite.anchor.set(0.5);

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    this.enemySprite.scale.x *= scaleFactor;
    this.enemySprite.scale.y *= scaleFactor;

    this.enemySprite.interactive = true;
    this.enemySprite.on("pointerdown", this.onPointerDown.bind(this));

    this.landscape.addChild(this.enemySprite);
    this.changeEnemyPosition();
  }

  setup() {
    this.setupLandscape();
    this.setupCar();
    this.setupEnemy();
    this.setupCursor();
    this.setupText();
    this.setupGameVariables();

    this.app.ticker.add(this.update.bind(this));
  }

  onPointerDown() {
    if (this.gameState != GameStates.EnemyVisibleState) {
      return;
    }

    let punchSound: Sound = PIXI.loader.resources['punchSound'].data;
    punchSound.play();

    this.cursorSprite.texture = PIXI.loader.resources['handSmackingImage'].texture;
    this.enemyCommentText.visible = true;

    this.enemySprite.texture = PIXI.loader.resources['enemyWhackedImage'].texture;
    this.enemySprite.scale.x -= 0.1;
    this.enemySprite.scale.y -= 0.1;

    this.goToState(GameStates.EnemyHittingState);
  }

  update(delta: number) {
    this.stateTime += delta;

    switch (this.gameState) {
      case GameStates.EnemyHiddenState: {
        if (this.landscape.scale.x > 1.0) {
          this.landscape.scale.x -= 0.05;
          this.landscape.scale.y -= 0.05;
        }

        if (this.stateTime > this.enemyHiddenTime) {
          this.enemySprite.visible = true;
          this.goToState(GameStates.EnemyVisibleState);
        }
      } break;
      case GameStates.EnemyVisibleState: {
        if (this.landscape.scale.x < this.landscapeZoom) {
          this.landscape.scale.x += 0.05;
          this.landscape.scale.y += 0.05;
        }
        
        if (this.stateTime > this.enemyVisibleTime) {
          this.enemySprite.visible = false;
          this.changeEnemyPosition();
          this.goToState(GameStates.EnemyHiddenState);
        }
      } break;
      case GameStates.EnemyHittingState: {
        if (this.stateTime > 5) {
          let clapSound: Sound = PIXI.loader.resources['clapSound'].data;
          clapSound.play();
        }
        if (this.stateTime > 30) {
          this.cursorSprite.texture = PIXI.loader.resources['handImage'].texture;
          this.enemyCommentText.visible = false;
          this.enemySprite.scale.x += 0.1;
          this.enemySprite.scale.y += 0.1;
          this.enemySprite.visible = false;
          this.enemySprite.texture = PIXI.loader.resources['enemyImage'].texture;

          this.enemySprite.visible = false;
          this.changeEnemyPosition();
          this.goToState(GameStates.EnemyHiddenState);
        }
      } break;
      case GameStates.EnemyRepositioningState: {
        if (this.stateTime > 10) {
          this.changeEnemyPosition();
          this.goToState(GameStates.IdleState)
        }
      } break;
    }
    //this.enemy.rotation += 0.1 * delta;
    this.carSprite.rotation = Math.sin(this.stateTime / 2) / 320;
    this.frontWheelSprite.rotation += 0.1 * delta;
    this.rearWheelSprite.rotation += 0.1 * delta;
  }

  updateGameVariables() {
    this.enemyHiddenTime = Math.random() * 50 + 50;
    this.enemyVisibleTime = Math.random() * 200 + 50;
  }

  changeEnemyPosition() {
    let relPosition = this.holeRelPositions[Math.floor(this.holeRelPositions.length * Math.random())];
    let position = new Point(
      relPosition.x * this.app.screen.width,
      this.app.screen.height - relPosition.y * this.app.screen.height,
    );
    this.enemySprite.x = position.x;
    this.enemySprite.y = position.y;
  }

  goToState(nextState: GameStates) {
    this.gameState = nextState;
    this.stateText.text = nextState;
    this.stateTime = 0;
    this.updateGameVariables();
  }
}
