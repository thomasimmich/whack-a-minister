import { Sprite, Container, Sound, Point, Graphics } from "pixi.js";
import { Ease } from './ease.class';

export enum CounterpartTypes {
    EnemyCounterpart = 'Enemy',
    FriendCounterpart = 'Friend'
}

export enum CounterpartStates {
    HiddenState = 'Hidden',
    HidingState = 'Hiding',
    ShowingState = 'Showing',
    WaitingState = 'Waiting'
}

export class Counterpart {
    public readonly container: Container;

    public type: CounterpartTypes;

    private state: CounterpartStates;
    private stateTime: number;
    private stateDuration: number;

    private waitingTime: number;

    private sprite: Sprite;
    private origin: Point;
    private mask: Graphics;
    private maskPosition;
    private visbilityFactor: number;

    public constructor(ticker: PIXI.ticker.Ticker, x: number, y: number, scaleFactor: number) {
        ticker.add(this.update.bind(this));
        this.state = CounterpartStates.HiddenState;

        this.container = new PIXI.Container();

        this.type = CounterpartTypes.EnemyCounterpart;
        this.sprite = new PIXI.Sprite(
            this.getTextureFromCounterpartType(false)
        );
        this.origin = new Point(x, y);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.x *= scaleFactor;
        this.sprite.scale.y *= scaleFactor;

        this.sprite.anchor.set(0.5);
        this.sprite.interactive = true;
        this.sprite.on("pointerdown", this.onPointerDown.bind(this));


        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF, 1);   
        this.mask.drawRect(
            this.sprite.x - this.sprite.width / 2,
            this.sprite.y - this.sprite.height / 2,
            this.sprite.width,
            this.sprite.height
        );

        this.container.interactive = true;
        this.container.mask = this.mask;
        this.container.addChild(this.sprite);

        this.visbilityFactor = 0;
        this.waitingTime = 200;
    }

    hide() {
        if (this.state == CounterpartStates.WaitingState) {
            this.goToState(CounterpartStates.HidingState);
        }
    }

    show(type: CounterpartTypes, waitingTime: number) {
        if (this.state == CounterpartStates.HiddenState) {
            this.type = type;
            this.waitingTime = waitingTime;
            this.sprite.texture = this.getTextureFromCounterpartType(false);
            this.goToState(CounterpartStates.ShowingState);
        }
    }

    update(delta: number) {
        this.stateTime += delta;

        if (this.state == CounterpartStates.ShowingState) {
            this.visbilityFactor = Math.min(1.0, Ease.inSine(this.stateTime / this.stateDuration));

            if (this.isStateFinished()) {
                this.goToState(CounterpartStates.WaitingState);
            }
        }
        if (this.state == CounterpartStates.HidingState) {
            this.visbilityFactor = Math.max(0.0, Ease.outSine(this.stateTime / this.stateDuration));
            
            if (this.isStateFinished()) {
                this.goToState(CounterpartStates.HiddenState);
            }
        }
        if (this.state == CounterpartStates.WaitingState) {
            if (this.isStateFinished()) {
                this.goToState(CounterpartStates.HidingState);
            }
        }
        this.sprite.y = this.origin.y + this.sprite.height * (1 - this.visbilityFactor);

        this.container.rotation = Math.sin(this.stateTime / 2) / 320;
    }

    isStateFinished(): boolean {
        return this.stateTime > this.stateDuration;
    }

    goToState(state: CounterpartStates) {
        this.state = state;
        this.stateTime = 0;

        if (state == CounterpartStates.ShowingState || state == CounterpartStates.HidingState) {
            this.stateDuration = 15;
        } else if (this.state == CounterpartStates.WaitingState) {
            this.stateDuration = this.waitingTime;
        }
    }

    onPointerDown() {
        let hitSound: Sound;
        if (this.type == CounterpartTypes.EnemyCounterpart) {
            hitSound = PIXI.loader.resources['punchSound'].data;
            this.hide();
        } else {
            hitSound = PIXI.loader.resources['failureSound'].data;
            // this.increaseScore(-2000);

            // this.stillAllowedFailuresCount--;
            // this.allowedFailureSlotSprites[this.stillAllowedFailuresCount].alpha = 0.5;
        }

        hitSound.play();
    }

    getTextureFromCounterpartType(isWhacked: boolean): any {
        let addon = '';
        if (isWhacked) {
            addon = 'Whacked';
        }
        if (this.type == CounterpartTypes.EnemyCounterpart) {
            return PIXI.loader.resources['enemyImage' + addon].texture
        } else if (this.type == CounterpartTypes.FriendCounterpart) {
            return PIXI.loader.resources['friendImage' + addon].texture
        }
    }

   
}