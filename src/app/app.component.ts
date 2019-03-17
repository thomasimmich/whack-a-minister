import { Counterpart, CounterpartTypes, HitEvent, HitStatus } from './counterpart.class';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprite, Application, Sound, Text, Point, Container, Graphics, TextStyle } from 'pixi.js';
import createPlayer from 'web-audio-player';


//import * as PIXI from "pixi.js/dist/pixi.js"
declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

enum GameStates {
  SplashState = 'Splash',
  IdleState = 'Idle',
  HittingState = 'Hitting',
  GameOverState = 'Game Over'
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
    backingTrack: 'assets/sounds/scheuertrack1.mp3',
    enemyImageWhacked: 'assets/images/scheuer-whacked.png',
    friendImage: 'assets/images/greta.png',
    friendImageWhacked: 'assets/images/greta-whacked.png',
    timeBonusImage: 'assets/images/scheuermilch.png',
    timeBonusImageWhacked: 'assets/images/scheuermilch-whacked.png',
    punchCorona: 'assets/images/punch-corona.png',
    backgroundImage0: 'assets/images/back0.png',
    backgroundImage1: 'assets/images/back1.png',
    backgroundImage2: 'assets/images/back2.png',
    backgroundImage3: 'assets/images/back3.png',
    backgroundImage4: 'assets/images/back4.png',
    boxingGloveImage: 'assets/images/boxing-glove.png',
    fuelgauge: 'assets/images/fuelgauge.png',
    needle: 'assets/images/needle.png',
    failureSound: 'assets/sounds/failure.mp3',
    squeezeSound: 'assets/sounds/squeeze.mp3',
    // punchSound0: 'assets/sounds/punch0.png', 
    punchSound0: 'assets/sounds/punch0.mp3',
    punchSound1: 'assets/sounds/punch1.mp3',
    punchSound2: 'assets/sounds/punch2.mp3',
    punchSound3: 'assets/sounds/punch3.mp3',
    punchSound4: 'assets/sounds/punch4.mp3',
    punchSound5: 'assets/sounds/punch5.mp3',
    punchSound6: 'assets/sounds/punch6.mp3',
    punchSound7: 'assets/sounds/punch7.mp3',
    punchSound8: 'assets/sounds/punch8.mp3',
    timeBonusJingle: 'assets/sounds/party.mp3',
    honk: 'assets/sounds/honk.mp3',
  };

  title = 'Scheuer den Scheuer';

  @ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
  public app: Application; // this will be our pixi application

  public gameState: GameStates;

  public readonly version = '0.0.13'
  private referenceWidth: number;
  private relStreetHeight: number;
  private progressText: Text;

  private chanceForEnemy: number;
  private chanceForTimeBonus: number;
  private counterpartType: CounterpartTypes;
  public counterparts: Counterpart[];
  private counterpartHiddenTime: number;
  private audio: any;

  private stillAllowedFailuresCount: number;
  private maxAllowedFailuresCount: number;
  private allowedFailureSlotSprites: Sprite[];
  private needleSprite: Sprite;
  private gameOverContainer: Container;
  private restartText: Text;

  private score: number;
  private scoreRoll: number;
  private speed: number;
  private availableTime: number;
  private timeLeft: number;

  private landscape: Container;
  private landscapeZoom: number;
  private carSprite: Sprite;
  private frontWheelSprite: Sprite;
  private rearWheelSprite: Sprite;
  private counterpartSprite: Sprite;
  private cursorSprite: Sprite;
  private backgroundSprites: PIXI.extras.TilingSprite[];
  private stateText: Text;
  private stateTime: number;

  private scoreText: Text;
  private textStyle: TextStyle;
  private holeRelPositions: Point[] = [
    //new Point(0.16, 0.43),//1-Kofferraum
    new Point(0.16, 1),//2-ganzhinten
    new Point(0.31, 1),//3-fasthinten
    new Point(0.45, 1),//4-zweitevonvorne
    //new Point(0.54, 0.32),//5-dachluke
    new Point(0.61, 1),//6-vorne
    //new Point(0.85, 0.50),//7-motorhaube 
  ];

  private counterpartHiddenDuration: number;
  private counterpartVisibleDuration: number;

  ngOnInit() {

    // reference width is taken from iPad Pro Retina
    this.referenceWidth = 2732;
    this.landscapeZoom = 1.0;
    this.relStreetHeight = 0.05;
    this.availableTime = 60;
    this.audio = null;

    this.maxAllowedFailuresCount = 3;
    this.allowedFailureSlotSprites = [];
    this.backgroundSprites = [];
    this.counterparts = [];

    const parent = this.pixiContainer.nativeElement;
    this.app = new PIXI.Application({
      width: parent.clientWidth,
      height: parent.clientHeight,
      backgroundColor: 0xbcd6f8
    }); // this creates our pixi application

    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document

    if (!PIXI.utils.isWebGLSupported()) {
    }

    this.loadFonts();
    this.progressText = new PIXI.Text();
    this.stateText = new PIXI.Text(this.gameState);


    // Add to the PIXI loader
    for (let name in this.manifest) {
      PIXI.loader.add(name, this.manifest[name]);
    }

    PIXI.loader.on('progress', this.onProgress.bind(this));

    PIXI.loader.on('complete', this.onLoadCompleted.bind(this));

    PIXI.loader.load(this.onLoad.bind(this));

  }

  loadBackingTrack() {
    this.audio = createPlayer('assets/sounds/scheuertrack1.mp3')
    this.audio.on('load', () => {
      console.log('Audio loaded...')

      // start playing audio file
      this.audio.play();

      // and connect your node somewhere, such as
      // the AudioContext output so the user can hear it!
      this.audio.node.connect(this.audio.context.destination)
    })

    this.audio.on('ended', () => {
      console.log('Audio ended...')
    })
  }

  onLoadCompleted() {
    this.progressText.style = this.textStyle;
    this.progressText.text = 'PRESS TO START';
    
    this.progressText.x = (this.app.screen.width - this.progressText.width) / 2;
    this.progressText.y = this.app.screen.height / 2;
    this.progressText.interactive = true;
    this.goToState(GameStates.SplashState);

    this.progressText.on("pointerdown", this.onStart.bind(this));
  }

  onStart() {
    this.setup();
  }

  onLoad(loader, resources) {
    


    //this.setup();
  }

  onProgress(loader, resource) {
    this.progressText.text = 'Loading '+Math.round(loader.progress.toString())+'%';

    this.progressText.x = (this.app.screen.width - this.progressText.width) / 2;
    this.progressText.y = this.app.screen.height / 2;

    this.app.stage.addChild(this.progressText);
    console.log(`loaded ${resource.url}. Loading is ${loader.progress}% complete.`);
  }

  loadFonts() {
    // window.we.WebFontConfig = {
    //   google: {
    //     families: ['Snippet', 'Arvo:700italic', 'Podkova:700']
    //   },

    //   active: function () {
    //     // do something
    //     init();
    //   }
    // };

    // include the web-font loader script
    /* jshint ignore:start */
    (function () {
      var wf = document.createElement('script');
      wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = true;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
    /* jshint ignore:end */

    this.textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });
  }

  setupGameVariables() {
    this.initGameVariables();
    this.updateTurnVariables();
  }

  setupText() {

    this.stateText.visible = false;
    this.app.stage.addChild(this.stateText);

    let versionText = new PIXI.Text(this.title + ' ' + this.version);
    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    versionText.scale.x *= scaleFactor / 0.35;
    versionText.scale.y *= scaleFactor / 0.35;

    versionText.position.x = (this.app.screen.width - versionText.width) / 2;
    versionText.position.y = this.app.screen.height - versionText.height;
    versionText.alpha = 0.5;
    this.app.stage.addChild(versionText);
  }

  setupScore() {
    this.scoreText = new PIXI.Text('', this.textStyle);
    this.app.stage.addChild(this.scoreText);
  }

  setupCounterparts() {
    for (let i = 0; i < this.holeRelPositions.length; i++) {
      let relPosition = this.holeRelPositions[i];
      let position = new Point(
        relPosition.x * this.app.screen.width,
        this.app.screen.height - relPosition.y * this.carSprite.height / 0.85
        //- this.relStreetHeight * this.app.screen.height // street offset
      );
      let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);

      let c = new Counterpart(
        this.app.ticker,
        position.x,
        position.y,
        scaleFactor,
        this.textStyle
      );

      c.wasHit.subscribe((event: HitEvent) => this.onWasHit(event))
      this.counterparts.push(c);
      this.landscape.addChild(c.container);
    }
  }

  onWasHit(event: HitEvent) {


    let sender = event.sender;
    let hitStatus = event.hitStatus;
    let scoreDelta = 0;
    if (hitStatus == HitStatus.EnemyHitSuccess) {
      this.cursorSprite.visible = true;
      this.goToState(GameStates.HittingState);

      scoreDelta = 10 + this.scoreRoll;
      this.scoreRoll += 2;
    } else if (hitStatus == HitStatus.FriendHitFailure) {
      scoreDelta = -30;
      this.scoreRoll = 0;
    } else if (hitStatus == HitStatus.TimeBonusHit) {
      scoreDelta = 10;
      this.timeLeft += 10;
      if (this.timeLeft > this.availableTime) {
        this.timeLeft = this.availableTime;
      }
    } else {
      this.scoreRoll = 0;
    }
    this.increaseScore(scoreDelta);
    sender.setScore(scoreDelta);
  }

  setupGameOver() {
    let textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: this.app.screen.width / 8,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#DE3249'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    this.gameOverContainer = new PIXI.Container();

    let shield = new PIXI.Graphics();
    shield.beginFill(0xDE3249);
    shield.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    shield.endFill();
    shield.alpha = 0.5;

    let gameOverText = new PIXI.Text(this.gameState, textStyle);
    gameOverText.text = 'GAME OVER';
    gameOverText.position.x = (this.app.screen.width - gameOverText.width) / 2;
    gameOverText.position.y = (this.app.screen.height - gameOverText.height) / 2;

    this.restartText = new PIXI.Text(this.gameState);
    this.restartText.text = 'PRESS TO RESTART';
    this.restartText.position.x = (this.app.screen.width - this.restartText.width) / 2;
    this.restartText.position.y = (this.app.screen.height - this.restartText.height * 4);
    this.restartText.visible = false;

    this.gameOverContainer.addChild(shield);
    this.gameOverContainer.addChild(gameOverText);
    this.gameOverContainer.addChild(this.restartText);

    this.gameOverContainer.interactive = false;
    this.gameOverContainer.visible = false;
    this.gameOverContainer.on("pointerdown", this.onPointerDownOnGameOverScreen.bind(this));

    this.app.stage.addChild(this.gameOverContainer);
  }

  onPointerDownOnGameOverScreen() {
    this.initGameVariables();
    this.gameOverContainer.visible = false;
    this.gameOverContainer.interactive = false;
    this.goToState(GameStates.IdleState);
  }

  setupBackground() {
    let tileSize = 2048;
    for (let i = 0; i < 5; i++) {
      let scaleFactor = (this.app.renderer.view.width / tileSize);
      this.backgroundSprites.push(new PIXI.extras.TilingSprite(
        PIXI.loader.resources['backgroundImage' + i.toString()].texture,
        tileSize,
        tileSize
      ));
      this.backgroundSprites[i].position.y = (this.app.renderer.height - tileSize * scaleFactor);
      this.backgroundSprites[i].scale.x *= scaleFactor;
      this.backgroundSprites[i].scale.y *= scaleFactor;
      this.landscape.addChild(this.backgroundSprites[i]);
    }
  }


  setupTimerDisplay() {
    let container = new PIXI.DisplayObjectContainer();

    let gaugeSprite = new PIXI.Sprite(
      PIXI.loader.resources['fuelgauge'].texture
    );
    container.addChild(gaugeSprite);

    this.needleSprite = new PIXI.Sprite(
      PIXI.loader.resources['needle'].texture
    );

    this.needleSprite.x = gaugeSprite.width / 2;
    this.needleSprite.y = this.needleSprite.height * 0.7;
    this.needleSprite.anchor.x = 0.5;
    this.needleSprite.anchor.y = 0.5;
    container.addChild(this.needleSprite);

    let scaleFactor = (this.app.renderer.view.height / this.referenceWidth) * 2;

    container.scale.x *= scaleFactor;
    container.scale.y *= scaleFactor;
    container.x = 40 * scaleFactor;
    container.y = 20 * scaleFactor;

    this.app.stage.addChild(container);
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
    //this.app.renderer.plugins.interaction.cursorStyles.default = 'none';

    let interaction = this.app.renderer.plugins.interaction;

    this.cursorSprite = new PIXI.Sprite(
      PIXI.loader.resources['boxingGloveImage'].texture
    );



    this.cursorSprite.anchor.set(0.35, 0.25); // position specific to where the actual cursor point is

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    this.cursorSprite.scale.x *= scaleFactor;
    this.cursorSprite.scale.y *= scaleFactor;
    this.cursorSprite.visible = false;

    this.app.stage.addChild(this.cursorSprite);

    // interaction.on("pointerover", () => {
    //   this.cursorSprite.visible = true;
    // });
    // interaction.on("pointerout", () => {
    //   this.cursorSprite.visible = false;
    // });
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
      this.app.screen.width * 0.5065,
      (this.app.screen.height - this.carSprite.height * 0.8)
      // street offset
      // - Math.min(
      //   this.app.renderer.view.height * 0.15, // relative to screen height the car will become higher
      //   this.carSprite.height * 0.4 // but not higher than one forth of the car's height
      // )
    );
    this.landscape.addChild(this.carSprite);

    this.carSprite.interactive = true;
    this.carSprite.on("pointerdown", this.onPointerDownOnCar.bind(this));

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
      this.app.screen.width * 0.82,
      this.app.screen.height - this.frontWheelSprite.height / 2
      //- this.relStreetHeight * this.app.screen.height // street offset
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
      //- this.relStreetHeight * this.app.screen.height // street offset
    );

    this.landscape.addChild(this.rearWheelSprite);
  }

  createCounterpartSprite(): Sprite {
    let sprite = new PIXI.Sprite(
      this.getTextureFromCounterpartType(false)
    );

    sprite.anchor.set(0.5);

    let scaleFactor = (this.app.renderer.view.width / this.referenceWidth);
    sprite.scale.x *= scaleFactor;
    sprite.scale.y *= scaleFactor;

    sprite.interactive = true;
    //sprite.on("pointerdown", this.onPointerDown.bind(this));

    this.landscape.addChild(sprite);

    return sprite;
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
    this.counterpartSprite.visible = false;
    this.landscape.addChild(this.counterpartSprite);
    this.changeCounterpart();
  }

  setup() {

    this.setupLandscape();
    this.setupBackground();
    this.setupGameOver();
    this.setupCar();
    this.setupCounterparts();
    this.setupCounterpart();
    this.setupCursor();
    this.setupText();
    this.setupScore();
    //this.setupFailuresDisplay();
    this.setupTimerDisplay();
    this.setupGameVariables();

    this.app.ticker.add(this.update.bind(this));
  }

  onPointerDownOnCar() {
    let sound = PIXI.loader.resources['honk'].data;
    sound.play();
    this.scoreRoll = 0;
  }

  onPointerDown() {
    // if (this.gameState != GameStates.GameOverState) {
    //   return;
    // }

    // let hitSound: Sound;
    // if (this.counterpartType == CounterpartTypes.EnemyCounterpart) {
    //   hitSound = PIXI.loader.resources['punchSound0'].data;
    //   this.increaseScore(1000);
    // } else {
    //   hitSound = PIXI.loader.resources['failureSound'].data;
    //   this.increaseScore(-2000);

    //   this.stillAllowedFailuresCount--;
    //   this.allowedFailureSlotSprites[this.stillAllowedFailuresCount].alpha = 0.5;
    // }

    // hitSound.play();
  }

  update(delta: number) {

    this.stateTime += delta;
    this.counterpartHiddenTime += delta;

    if (this.counterpartHiddenTime > this.counterpartHiddenDuration) {
      let counterpart = this.counterparts[Math.floor(this.counterparts.length * Math.random())];
      counterpart.show(this.calculateCounterpartTypeRandomly(), this.counterpartVisibleDuration);
      this.updateTurnVariables();
    }

    switch (this.gameState) {
      // case GameStates.CounterpartHiddenState: {
      //   if (this.landscape.scale.x > 1.0) {
      //     this.landscape.scale.x -= 0.05;
      //     this.landscape.scale.y -= 0.05;
      //   }

      //   if (this.stateTime > this.counterpartHiddenDuration) {
      //     this.speed += 0.2;
      //     this.counterpartSprite.visible = true;
      //     this.goToState(GameStates.CounterpartVisibleState);
      //   }
      // } break;
      // case GameStates.CounterpartVisibleState: {
      //   if (this.landscape.scale.x < this.landscapeZoom) {
      //     this.landscape.scale.x += 0.05;
      //     this.landscape.scale.y += 0.05;
      //   }

      //   if (this.stateTime > this.counterpartVisibleDuration) {
      //     // the player missed an enemy
      //     this.counterpartSprite.visible = false;

      //     if (this.counterpartType == CounterpartTypes.EnemyCounterpart) {
      //       this.increaseScore(-500);
      //       PIXI.loader.resources['failureSound'].data.play();
      //     }

      //     this.changeCounterpart();
      //     this.goToState(GameStates.CounterpartHiddenState);
      //   }
      // } break;
      case GameStates.IdleState: {

      } break;
      case GameStates.HittingState: {
        if (this.stateTime < 5) {
          this.cursorSprite.x -= 3;
        }
        if (this.stateTime >= 5) {
          this.cursorSprite.x += 3;
        }

        if (this.stateTime > 10) {
          this.cursorSprite.visible = false;
          this.goToState(GameStates.IdleState);
        }
      } break;
      case GameStates.GameOverState: {
        if (this.stateTime > 200) {
          this.restartText.visible = true;
          this.gameOverContainer.interactive = true;
        }
      } break;
    }
    //this.enemy.rotation += 0.1 * delta;

    if (this.gameState != GameStates.GameOverState) {
      this.updateRide(delta);
      this.updateTimerProgress(delta);
    }




    // if (this.score <= 0) {
    //   this.landscape.alpha = 0.5;
    //   this.goToState(GameStates.GameOverState);
    // }
  }

  updateRide(delta: number) {
    this.carSprite.rotation = Math.sin(this.stateTime / 2) / 320 * this.speed;
    this.frontWheelSprite.rotation += 0.05 * delta * this.speed;
    this.rearWheelSprite.rotation += 0.05 * delta * this.speed;

    for (let i = 0; i < 5; i++) {
      this.backgroundSprites[i].tilePosition.x -= 2 * this.speed * (i + 1);
    }
  }

  updateTimerProgress(delta: number) {
    this.timeLeft -= delta / 60;

    if (this.timeLeft <= 0) {
      //this.landscape.alpha = 0.5;
      this.gameOverContainer.visible = true;
      for (let i = 0; i < this.counterparts.length; i++) {
        let c = this.counterparts[i];
        c.container.visible = false;
      }
      this.cursorSprite.visible = false;
      this.carSprite.interactive = false;
      this.goToState(GameStates.GameOverState);
      return;
    }

    this.speed = (this.availableTime / this.timeLeft);

    for (let i = 0; i < this.counterparts.length; i++) {
      this.counterparts[i].setSpeed(this.speed);
    }
    //this.stateText.text = this.speed.toString();

    this.needleSprite.rotation = Math.sin(10) + Math.sin(90) / this.speed + Math.random() / 30;


    //console.log(this.timeLeft);
    // let width = this.timerProgress.parent.width * 0.5;
    // this.timerProgress.beginFill(0xFF0000);
    // this.timerProgress.drawRoundedRect(
    //   0,
    //   0,
    //   width,
    //   this.timerProgress.height,
    //   this.timerProgress.height / 2);
    // this.timerProgress.endFill();
  }

  updateTurnVariables() {
    this.counterpartHiddenDuration = (Math.random() * 50 + 50) / this.speed;
    this.counterpartVisibleDuration = (Math.random() * 200 + 50) / this.speed;
    // this.counterpartSprite.texture = this.getTextureFromCounterpartType(false);
    this.counterpartHiddenTime = 0;
  }

  initGameVariables() {
    this.score = 0;
    this.scoreText.text = '';

    this.scoreRoll = 0;
    this.speed = 1.0;
    this.timeLeft = this.availableTime;
    this.chanceForEnemy = 0.8;
    this.chanceForTimeBonus = 0.05;
    this.counterpartType = this.calculateCounterpartTypeRandomly();


    for (let i = 0; i < this.counterparts.length; i++) {
      let c = this.counterparts[i];
      c.container.visible = true;
    }
    this.carSprite.interactive = true;
    this.restartText.visible = false;

    if (this.audio == null) {
      this.loadBackingTrack(); 
    }

    if (this.audio) {
      this.audio.play();
    }
    

    this.stillAllowedFailuresCount = this.maxAllowedFailuresCount;+
    this.goToState(GameStates.IdleState);
    // for (let i = 0; i < this.maxAllowedFailuresCount; i++) {
    //   this.allowedFailureSlotSprites[i].alpha = 1.0;
    // }
  }

  increaseScore(inc: number) {
    this.score += inc;
    if (this.score < 0) {
      this.score = 0;
    }
    let scaleFactor = (this.app.screen.width / this.referenceWidth);
    this.scoreText.text = this.score.toString();
    this.scoreText.position.x = this.app.screen.width - this.scoreText.width - 80 * scaleFactor;
    this.scoreText.position.y = 20;
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

  calculateCounterpartTypeRandomly(): CounterpartTypes {
    if (Math.random() >= this.chanceForEnemy) {
      if (Math.random() <= this.chanceForTimeBonus) {
        return CounterpartTypes.TimeBonusCounterpart;
      }
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
    this.counterpartType = this.calculateCounterpartTypeRandomly();
    this.counterpartSprite.texture = this.getTextureFromCounterpartType(false);
  }

  goToState(nextState: GameStates) {
    this.gameState = nextState;
    this.stateText.text = nextState;
    this.stateTime = 0;
    this.updateTurnVariables();
  }
}
