import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprite, Application, Rectangle, Texture, Container, DisplayObject, Text, loader } from 'pixi.js';
//import * as PIXI from "pixi.js/dist/pixi.js"
declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'Scheuer-Den-Scheuer';

  @ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
  public app: Application; // this will be our pixi application
  public state;
  private enemy: Sprite;

  ngOnInit() {

    this.app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x1099bb }); // this creates our pixi application

    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document
    
    let type = "WebGL"
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas"
    }

    loader.add(['assets/images/scheuer.png']).
      on("progress", this.onLoad).
      load(this.setup.bind(this));

    this.app.ticker.add(this.update.bind(this));
  }

  onLoad(loader, resource) {
    console.log(`loaded ${resource.url}. Loading is ${loader.progress}% complete.`);
  }

  setup() {
    this.enemy = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/scheuer.png'].texture
    );

    this.enemy.anchor.set(0.5);
    this.enemy.interactive = true;
    this.enemy.buttonMode = true;
    this.enemy.on("pointerdown", this.onPointerDown.bind(this));
    this.enemy.on("pointerup", this.onPointerUp.bind(this));

    this.enemy.position.set(this.app.renderer.view.width / 2, this.app.screen.height / 2);

    this.app.stage.addChild(this.enemy);
  }

  onPointerDown() {
    this.enemy.scale.x -= 0.1;
    this.enemy.scale.y -= 0.1;
  }

  onPointerUp() {
    this.enemy.scale.x += 0.1;
    this.enemy.scale.y += 0.1;
  }  

  update(delta: number) {
    //this.enemy.rotation += 0.1 * delta;
  }
}
