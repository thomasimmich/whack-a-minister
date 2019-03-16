import { EventEmitter, Output } from '@angular/core';
import { Sprite, Container, Sound, Point, Graphics, Text, TextStyle } from "pixi.js";
import { Ease } from './ease.class';

export enum CounterpartTypes {
    EnemyCounterpart = 'Enemy',
    FriendCounterpart = 'Friend'
}

export enum CounterpartStates {
    HiddenState = 'Hidden',
    HidingState = 'Hiding',
    HidingHitState = 'HidingHit',
    ShowingState = 'Showing',
    WaitingState = 'Waiting',
    HitState = 'Hit'
}

export class HitEvent {
    public constructor(public sender: Counterpart, public success: boolean) {}
}

export class Counterpart {
    public readonly container: Container;

    public type: CounterpartTypes;

    private state: CounterpartStates;
    private stateTime: number;
    private stateDuration: number;

    private waitingTime: number;

    private sprite: Sprite;
    private scoreText: Text;
    private origin: Point;
    private mask: Graphics;
    private visbilityFactor: number;

    @Output() wasHit = new EventEmitter();

    public constructor(ticker: PIXI.ticker.Ticker, x: number, y: number, scaleFactor: number, textStyle: TextStyle) {
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

        this.scoreText = new PIXI.Text('', textStyle);
        this.setScore(0);

        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF, 1);
        this.mask.drawRect(
            this.sprite.x - this.sprite.width / 2,
            this.sprite.y - this.sprite.height / 2 - 200,
            this.sprite.width,
            this.sprite.height + 200
        );

        this.container.interactive = true;
        this.container.mask = this.mask;
        this.container.addChild(this.sprite);
        this.container.addChild(this.scoreText);

        this.visbilityFactor = 0;
        this.waitingTime = 200;
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
        if (this.state == CounterpartStates.HidingState || this.state == CounterpartStates.HidingHitState) {
            this.visbilityFactor = Math.max(0.0, Ease.outSine(this.stateTime / this.stateDuration));

            if (this.isStateFinished()) {
                this.scoreText.scale.x = 0;
                this.scoreText.scale.y = 0;
                this.goToState(CounterpartStates.HiddenState);
            }
        }
        if (this.state == CounterpartStates.WaitingState) {
            if (this.isStateFinished()) {
                if (this.type == CounterpartTypes.EnemyCounterpart) {
                    // enemy is hiding without being hit at all
                    this.wasHit.emit(new HitEvent(this, false));
                }
                this.goToState(CounterpartStates.HidingState);
            }
        }
        if (this.state == CounterpartStates.HitState) {
            if (this.scoreText.scale.x < 1.0) {
                this.scoreText.scale.x += 0.1;
                this.scoreText.scale.y += 0.1;
            }

            if (this.isStateFinished()) {
                this.goToState(CounterpartStates.HidingHitState);
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
        } else if (this.state == CounterpartStates.HitState) {
            this.stateDuration = 20;
        }
    }

    setScore(score: number) {
        let prefix = '';
        if (score > 0) {
            prefix = '+';
        }          
        this.scoreText.text = prefix + score.toString();
        this.scoreText.x = this.sprite.x - this.scoreText.width / 2;
        this.scoreText.y = this.sprite.y - this.sprite.height / 2;
        this.scoreText.scale.x = 0;
        this.scoreText.scale.y = 0;
    }

    setSpeed(speed: number) {
        this.waitingTime = 200 - (speed * 2);
    }

    onPointerDown() {
        if (this.state == CounterpartStates.HitState || this.state == CounterpartStates.HidingHitState) {
            return;
        }

        let hitSound: Sound;

        if (this.type == CounterpartTypes.EnemyCounterpart) {
            hitSound = PIXI.loader.resources['punchSound'].data;
            this.wasHit.emit(new HitEvent(this, true));
        } else {
            hitSound = PIXI.loader.resources['failureSound'].data;
            this.wasHit.emit(new HitEvent(this, false));
            // this.increaseScore(-2000);

            // this.stillAllowedFailuresCount--;
            // this.allowedFailureSlotSprites[this.stillAllowedFailuresCount].alpha = 0.5;
        }


        hitSound.play();

        this.sprite.texture = this.getTextureFromCounterpartType(true);
        this.goToState(CounterpartStates.HitState);
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