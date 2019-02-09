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
  title = 'first-app';

  @ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
  public app: Application; // this will be our pixi application
  public state;

  ngOnInit() {

    this.app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x1099bb }); // this creates our pixi application

    this.pixiContainer.nativeElement.appendChild(this.app.view); // this places our pixi application onto the viewable document
    let type = "WebGL"
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas"
    }
    console.log(type);
    loader.add(['assets/images/canon.png']).
      on("progress", this.loadProgressHandler).
      load(this.setup.bind(this));
  }

  loadProgressHandler(loader, resource) {
    console.log(`loaded ${resource.url}. Loading is ${loader.progress}% complete.`);
  }

  setup() {
    const bunny: Sprite = new PIXI.Sprite(
      PIXI.loader.resources['assets/images/canon.png'].texture
    );

    bunny.position.set(this.app.renderer.view.width / 2, this.app.screen.height / 2);

    this.app.stage.addChild(bunny);
  }

  gameLoop(delta) {
    this.state(delta); // run the function of the current game state
  }


}
