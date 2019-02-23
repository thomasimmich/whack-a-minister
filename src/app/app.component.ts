import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprite, Application, Sound, Text, Point, Container } from 'pixi.js';
//import * as PIXI from "pixi.js/dist/pixi.js"
declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

enum GameStates {
  IdleState = 'Idle',
  CounterpartVisibleState = 'Visible',
  CounterpartHiddenState = 'Hidden',
  CounterpartHittingState = 'Hitting',
  CounterpartRepositioningState = 'Repositioning',
  GameOverState = 'Game Over'
};

enum CounterpartTypes {
  EnemyCounterpart = 'Enemy',
  FriendCounterpart = 'Friend'
}

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
    enemyImageWhacked: 'assets/images/scheuer-whacked.png',
    friendImage: 'assets/images/peterlustig.png',
    friendImageWhacked: 'assets/images/peterlustig-whacked.png',
    handImage: 'assets/images/hand.png',
    handSmackingImage: 'assets/images/hand-smacking.png',
    clapSound: 'assets/sounds/clap.mp3',
    punchSound: 'assets/sounds/punch.mp3',
    failureSound: 'assets/sounds/failure.mp3'
  };

  title = 'Scheuer-Den-Scheuer';

  @ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
  public app: Application; // this will be our pixi application
  public gameState: GameStates;

  private referenceWidth: number;
  private relStreetHeight: number;

  private chanceForEnemy: number;
  private counterpartType: CounterpartTypes;

  private stillAllowedFailuresCount: number;
  private maxAllowedFailuresCount: number;
  private allowedFailureSlotSprites: Sprite[];

  private landscape: Container;
  private landscapeZoom: number;
  private carSprite: Sprite;
  private frontWheelSprite: Sprite;
  private rearWheelSprite: Sprite;
  private counterpartSprite: Sprite;
  private cursorSprite: Sprite;
  private stateText: Text;
  private stateTime: number;
  private enemyCommentText: Text;
  private holeRelPositions: Point[] = [
    //new Point(0.16, 0.43),//1-Kofferraum
    new Point(0.16, 1),//2-ganzhinten
    new Point(0.31, 1),//3-fasthinten
    new Point(0.45, 1),//4-zweitevonvorne
    //new Point(0.54, 0.32),//5-dachluke
    new Point(0.61, 1),//6-vorne
    //new Point(0.85, 0.50),//7-motorhaube 
  ];

  private counterpartHiddenTime: number;
  private counterpartVisibleTime: number;

  ngOnInit() {

    // reference width is taken from iPad Pro Retina
    this.referenceWidth = 2732;
    this.landscapeZoom = 1.0;
    this.relStreetHeight = 0.05;

    this.maxAllowedFailuresCount = 3;
    this.allowedFailureSlotSprites = [];

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
    this.initGameVariables();
    this.updateTurnVariables();
    this.goToState(GameStates.CounterpartHiddenState);
  }

  setupText() {
    this.enemyCommentText = new PIXI.Text('AUA! Friss Staub!');
    this.enemyCommentText.x = this.counterpartSprite.x - this.enemyCommentText.width / 2;
    this.enemyCommentText.y = this.counterpartSprite.y - this.counterpartSprite.height / 2 - this.enemyCommentText.height;

    this.app.stage.addChild(this.enemyCommentText);

    this.stateText = new PIXI.Text(this.gameState);
    this.app.stage.addChild(this.stateText);
  }

  setupFailuresDisplay() {
    for (let i = 0; i < this.maxAllowedFailuresCount; i++) {
      let slotSprite = new PIXI.Sprite(
        PIXI.loader.resources['friendImage'].texture
      );
      this.allowedFailureSlotSprites.push(slotSprite);
      slotSprite.scale.x *= 0.2;
      slotSprite.scale.y *= 0.2;
      slotSprite.position.x = 10 + i * slotSprite.width;
      slotSprite.position.y = 10;
      this.app.stage.addChild(slotSprite);
    }
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

  setupCounterpart() {
    this.counterpartSprite = new PIXI.Sprite(
      this.getTextureFromCounterpartType(false)
    );

    this.counterpartSprite.anchor.set(0.5);

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    this.counterpartSprite.scale.x *= scaleFactor;
    this.counterpartSprite.scale.y *= scaleFactor;

    this.counterpartSprite.interactive = true;
    this.counterpartSprite.on("pointerdown", this.onPointerDown.bind(this));

    this.landscape.addChild(this.counterpartSprite);
    this.changeCounterpart();
  }

  setup() {

    this.setupLandscape();
    this.setupCar();
    this.setupCounterpart();
    this.setupCursor();
    this.setupText();
    this.setupFailuresDisplay();
    this.setupGameVariables();

    this.app.ticker.add(this.update.bind(this));
  }

  onPointerDown() {
    if (this.gameState != GameStates.CounterpartVisibleState) {
      return;
    }

    let hitSound: Sound;
    if (this.counterpartType == CounterpartTypes.EnemyCounterpart) {
      hitSound = PIXI.loader.resources['punchSound'].data;
    } else {
      hitSound = PIXI.loader.resources['failureSound'].data;

      this.stillAllowedFailuresCount--;
      this.allowedFailureSlotSprites[this.stillAllowedFailuresCount].alpha = 0.5;
    }

    hitSound.play();

    if (this.stillAllowedFailuresCount > 0) {

      this.cursorSprite.texture = PIXI.loader.resources['handSmackingImage'].texture;
      this.enemyCommentText.visible = true;

      this.counterpartSprite.texture = this.getTextureFromCounterpartType(true);
      this.counterpartSprite.scale.x -= 0.1;
      this.counterpartSprite.scale.y -= 0.1;
      this.goToState(GameStates.CounterpartHittingState);
    } else {
      this.landscape.alpha = 0.5;
      this.goToState(GameStates.GameOverState);
    }
  }

  update(delta: number) {
    this.stateTime += delta;

    switch (this.gameState) {
      case GameStates.CounterpartHiddenState: {
        if (this.landscape.scale.x > 1.0) {
          this.landscape.scale.x -= 0.05;
          this.landscape.scale.y -= 0.05;
        }

        if (this.stateTime > this.counterpartHiddenTime) {
          this.counterpartSprite.visible = true;
          this.goToState(GameStates.CounterpartVisibleState);
        }
      } break;
      case GameStates.CounterpartVisibleState: {
        if (this.landscape.scale.x < this.landscapeZoom) {
          this.landscape.scale.x += 0.05;
          this.landscape.scale.y += 0.05;
        }

        if (this.stateTime > this.counterpartVisibleTime) {
          this.counterpartSprite.visible = false;
          this.changeCounterpart();
          this.goToState(GameStates.CounterpartHiddenState);
        }
      } break;
      case GameStates.CounterpartHittingState: {
        if (this.stateTime > 5) {
          let clapSound: Sound = PIXI.loader.resources['clapSound'].data;
          clapSound.play();
        }
        if (this.stateTime > 30) {
          this.cursorSprite.texture = PIXI.loader.resources['handImage'].texture;
          this.enemyCommentText.visible = false;
          this.counterpartSprite.scale.x += 0.1;
          this.counterpartSprite.scale.y += 0.1;
          this.counterpartSprite.visible = false;
          this.counterpartSprite.texture = this.getTextureFromCounterpartType(false);

          this.counterpartSprite.visible = false;
          this.changeCounterpart();
          this.goToState(GameStates.CounterpartHiddenState);
        }
      } break;
      case GameStates.GameOverState: {
        if (this.stateTime > 100) {
          this.landscape.alpha = 1.0
          this.changeCounterpart();
          this.initGameVariables();
          this.goToState(GameStates.CounterpartHiddenState)
        }
      } break;
    }
    //this.enemy.rotation += 0.1 * delta;
    this.carSprite.rotation = Math.sin(this.stateTime / 2) / 320;
    this.frontWheelSprite.rotation += 0.1 * delta;
    this.rearWheelSprite.rotation += 0.1 * delta;
  }

  updateTurnVariables() {
    this.counterpartHiddenTime = Math.random() * 50 + 50;
    this.counterpartVisibleTime = Math.random() * 200 + 50;
    this.counterpartSprite.texture = this.getTextureFromCounterpartType(false);
  }

  initGameVariables() {
    this.chanceForEnemy = 0.8;
    this.counterpartType = this.calculateOpponentTypeRandomly();

    this.stillAllowedFailuresCount = this.maxAllowedFailuresCount;
    for (let i = 0; i < this.maxAllowedFailuresCount; i++) {
      this.allowedFailureSlotSprites[i].alpha = 1.0;
    }
  }

  getTextureFromCounterpartType(isWhacked: boolean): any {
    let addon = '';
    if (isWhacked) {
      addon = 'Whacked';
    }
    if (this.counterpartType == CounterpartTypes.EnemyCounterpart) {
      return PIXI.loader.resources['enemyImage' + addon].texture
    } else if (this.counterpartType == CounterpartTypes.FriendCounterpart) {
      return PIXI.loader.resources['friendImage' + addon].texture
    }
  }

  calculateOpponentTypeRandomly(): CounterpartTypes {
    if (Math.random() >= this.chanceForEnemy) {
      return CounterpartTypes.FriendCounterpart;
    } else {
      return CounterpartTypes.EnemyCounterpart;
    }
  }

  changeCounterpart() {
    let relPosition = this.holeRelPositions[Math.floor(this.holeRelPositions.length * Math.random())];
    let position = new Point(
      relPosition.x * this.app.screen.width,
      this.app.screen.height - relPosition.y * this.carSprite.height
      - this.relStreetHeight * this.app.screen.height // street offset
    );
    this.counterpartSprite.x = position.x;
    this.counterpartSprite.y = position.y;
    this.counterpartType = this.calculateOpponentTypeRandomly();
    this.counterpartSprite.texture = this.getTextureFromCounterpartType(false);
  }

  goToState(nextState: GameStates) {
    this.gameState = nextState;
    this.stateText.text = nextState;
    this.stateTime = 0;
    this.updateTurnVariables();
  }
}
