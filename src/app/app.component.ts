import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprite, Application, Sound, Rectangle, Texture, Container, DisplayObject, Text, loader, Point } from 'pixi.js';
import { updateClassProp } from '@angular/core/src/render3/styling';
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
  private enemySprite: Sprite;
  private cursorSprite: Sprite;
  private stateText: Text;
  private stateTime: number;
  private enemyCommentText: Text;
  private holeRelPositions: Point[] = [
    new Point(0.2, 0.4),
    new Point(0.7, 0.2),
    new Point(0.5, 0.3),
    new Point(0.2, 0.4),
    new Point(0.7, 0.2),
    new Point(0.5, 0.3)    
  ];

  private enemyHiddenTime: number;
  private enemyVisibleTime: number;

  ngOnInit() {
    this.gameState = GameStates.IdleState;

    const parent = this.pixiContainer.nativeElement;
    this.app = new PIXI.Application({
      width: parent.clientWidth,
      height: parent.clientHeight,
      backgroundColor: 0x1099bb
    }); // this creates our pixi application

    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document

    let type = "WebGL"
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas"
    }

    // Add to the PIXI loader
    for (let name in this.manifest) {
      PIXI.loader.add(name, this.manifest[name]);
    }

    PIXI.loader.
      on("progress", this.onLoad).
      load(this.setup.bind(this));

    this.app.ticker.add(this.update.bind(this));
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

  setupEnemy() {
    this.enemySprite = new PIXI.Sprite(
      PIXI.loader.resources['enemyImage'].texture
    );

    this.enemySprite.anchor.set(0.5);
    this.enemySprite.scale.x *= 0.75;
    this.enemySprite.scale.y *= 0.75;

    this.enemySprite.interactive = true;
    this.enemySprite.on("pointerdown", this.onPointerDown.bind(this));

    this.enemySprite.position.set(this.app.renderer.view.width / 2, this.app.screen.height / 2);

    this.app.stage.addChild(this.enemySprite);
  }

  setup() {
    this.setupEnemy();
    this.setupCursor();
    this.setupText();
    this.setupGameVariables();
  }

  onPointerDown(event: any) {
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

    this.cursorSprite.x = event.data.global.x;
    this.cursorSprite.y = event.data.global.y;

    this.goToState(GameStates.EnemyHittingState);
  }

  update(delta: number) {
    this.stateTime += delta;
    //this.stateText.text = 'dfd';

    switch (this.gameState) {
      case GameStates.EnemyHiddenState: {
        if (this.stateTime > this.enemyHiddenTime) {
          this.enemySprite.visible = true;
          this.goToState(GameStates.EnemyVisibleState);
        }
      } break;
      case GameStates.EnemyVisibleState: {
        if (this.stateTime > this.enemyVisibleTime) {
          this.enemySprite.visible = false;
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
  }

  updateGameVariables() {
    this.enemyHiddenTime = Math.random() * 50 + 50;
    this.enemyVisibleTime = Math.random() * 200 + 50;
  }

  changeEnemyPosition() {
    let relPosition = this.holeRelPositions[Math.floor(this.holeRelPositions.length * Math.random())];
    let position = new Point(
      relPosition.x * this.app.screen.width,
      relPosition.y * this.app.screen.height,
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
