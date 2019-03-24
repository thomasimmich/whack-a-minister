import { EventEmitter, Output } from '@angular/core';
import { Sprite, Container, Sound, Point, Graphics, Text, TextStyle } from "pixi.js";
import { Ease } from './ease.class';

export enum CounterpartTypes {
    EnemyCounterpart = 'Enemy',
    FriendCounterpart = 'Friend',
    TimeBonusCounterpart = 'TimeBonus'
}

export enum CounterpartStates {
    HiddenState = 'Hidden',
    HidingState = 'Hiding',
    HidingHitState = 'HidingHit',
    ShowingState = 'Showing',
    WaitingState = 'Waiting',
    HitState = 'Hit'
}

export enum HitStatus {
    EnemyHitSuccess = 'Success',
    FriendHitFailure = 'Failure',
    CounterpartMissed = 'Missed',
    TimeBonusHit = 'TimeBonus'
}

export class HitEvent {
    public constructor(public sender: Counterpart, public hitStatus: HitStatus) {}
}

export class Counterpart {
    public readonly container: Container;

    public type: CounterpartTypes;

    private state: CounterpartStates;
    private stateTime: number;
    private stateDuration: number;

    private waitingTime: number;

    private sprite: Sprite;
    private punchCoronaSprite: Sprite;
    private lastSoundIndex: number;
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

        this.punchCoronaSprite = new PIXI.Sprite(PIXI.loader.resources['punchCorona'].texture);
        this.punchCoronaSprite.x = x;
        this.punchCoronaSprite.y = y - 100 * scaleFactor;
        this.punchCoronaSprite.scale.x *= scaleFactor;
        this.punchCoronaSprite.scale.y *= scaleFactor;
        this.punchCoronaSprite.anchor.set(0.5);   
        this.punchCoronaSprite.visible = false;     
        this.container.addChild(this.punchCoronaSprite);  

        
        let holeContainer = new PIXI.Container();   
        holeContainer.interactive = true;
        holeContainer.mask = this.mask;
        holeContainer.addChild(this.sprite);

        this.container.addChild(holeContainer);
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
                    this.wasHit.emit(new HitEvent(this, HitStatus.CounterpartMissed));
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
                // This sound does not play on Safari for iOS ...
                // if (this.type == CounterpartTypes.TimeBonusCounterpart) {
                //     let sound = PIXI.loader.resources['timeBonusJingle'].data;
                //     sound.play();
                // }
                this.punchCoronaSprite.visible = false;
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
        this.scoreText.y = this.sprite.y - this.sprite.height + 20;
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

        this.punchCoronaSprite.visible = true;

        let hitSound: Sound;
        if (this.type == CounterpartTypes.EnemyCounterpart) {
            let punchSoundsLength = 9;
            // two same sounds after another do not work in pixis
            // audio engine ... so we have to make sure that they
            // change even though we take random numbers!
            let soundIndex = Math.floor(punchSoundsLength * Math.random());
            if (soundIndex == this.lastSoundIndex) {
                soundIndex = this.lastSoundIndex - 1;
                if (soundIndex < 0) {
                    soundIndex = punchSoundsLength - 1;
                }
            }
            this.lastSoundIndex = soundIndex;

            hitSound = PIXI.loader.resources['punchSound' + soundIndex.toString()].data;

            this.wasHit.emit(new HitEvent(this, HitStatus.EnemyHitSuccess));
        } else if (this.type == CounterpartTypes.FriendCounterpart) {
            hitSound = PIXI.loader.resources['failureSound'].data;
            this.wasHit.emit(new HitEvent(this, HitStatus.FriendHitFailure));
            // this.increaseScore(-2000);

            // this.stillAllowedFailuresCount--;
            // this.allowedFailureSlotSprites[this.stillAllowedFailuresCount].alpha = 0.5;
        } else if (this.type == CounterpartTypes.TimeBonusCounterpart) {
            hitSound = PIXI.loader.resources['squeezeSound'].data;
            this.wasHit.emit(new HitEvent(this, HitStatus.TimeBonusHit));
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
        } else if (this.type == CounterpartTypes.TimeBonusCounterpart) {
            return PIXI.loader.resources['timeBonusImage' + addon].texture;
        }
    }
}