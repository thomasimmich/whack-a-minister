import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Container, Sprite, Graphics, Text, TextStyle, Point } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Ease } from '../utils/ease.class';



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

export interface HitEvent {
    sender: CounterpartComponent;
    hitStatus: HitStatus;
}

export interface CounterpartProps {
    ticker: PIXI.Ticker;
    index: number;
    x: number;
    y: number;
    scaleFactor: number;
    textStyle: TextStyle;
    onHit: (event: HitEvent) => void;
}

export interface CounterpartComponent {
    show: (type: CounterpartTypes, waitingTime: number) => void;
    setScore: (score: number) => void;
    setTimeLeft: (timeLeft: number) => void;
    container: Container;
}

export const Counterpart = React.forwardRef<CounterpartComponent, CounterpartProps>(
    ({ ticker, index, x, y, scaleFactor, textStyle, onHit }, ref) => {
        // State management
        const [state, setState] = useState<CounterpartStates>(CounterpartStates.HiddenState);
        const [stateTime, setStateTime] = useState<number>(0);
        const [stateDuration, setStateDuration] = useState<number>(0);
        const [waitingTime, setWaitingTime] = useState<number>(200);
        const [type, setType] = useState<CounterpartTypes>(CounterpartTypes.EnemyCounterpart);
        const [visibilityFactor, setVisibilityFactor] = useState<number>(0);
        const [lastSoundIndex, setLastSoundIndex] = useState<number>(0);

        // PIXI.js refs
        const containerRef = useRef<Container>(new Container());
        const spriteRef = useRef<Sprite | null>(null);
        const punchCoronaSpriteRef = useRef<Sprite | null>(null);
        const scoreTextRef = useRef<Text | null>(null);
        const maskRef = useRef<Graphics | null>(null);
        const originRef = useRef<Point>(new Point(x, y));

        // Initialize PIXI objects
        useEffect(() => {
            const container = containerRef.current;
            
            // Create sprite
            const sprite = new Sprite(getTextureFromCounterpartType(type, false));
            sprite.x = x;
            sprite.y = y;
            sprite.scale.x *= scaleFactor;
            sprite.scale.y *= scaleFactor;
            sprite.anchor.set(0.5);
            sprite.interactive = true;
            sprite.on("pointerdown", onPointerDown);
            spriteRef.current = sprite;

            // Create score text
            const scoreText = new Text('', textStyle);
            scoreTextRef.current = scoreText;
            setScoreInternal(0);

            // Create mask
            const mask = new Graphics();
            mask.beginFill(0xFFFFFF, 1);
            createMaskForIndex(mask, index, sprite, scaleFactor);
            maskRef.current = mask;

            // Create punch corona sprite
            const punchCoronaSprite = new Sprite((PIXI as any).loader.resources['punchCorona'].texture);
            punchCoronaSprite.x = x;
            punchCoronaSprite.y = y - 100 * scaleFactor;
            punchCoronaSprite.scale.x *= scaleFactor;
            punchCoronaSprite.scale.y *= scaleFactor;
            punchCoronaSprite.anchor.set(0.5);
            punchCoronaSprite.visible = false;
            punchCoronaSpriteRef.current = punchCoronaSprite;
            container.addChild(punchCoronaSprite);

            // Create hole container with mask
            const holeContainer = new Container();
            holeContainer.interactive = true;
            holeContainer.mask = mask;
            holeContainer.addChild(sprite);

            container.addChild(holeContainer);
            container.addChild(scoreText);

            return () => {
                // Cleanup
                sprite.off("pointerdown", onPointerDown);
                container.removeChildren();
            };
        }, []);

        const createMaskForIndex = (mask: Graphics, index: number, sprite: Sprite, scaleFactor: number) => {
            const maskConfigs = [
                { bottom: 150, bottomOffset: 200 },
                { bottom: 105, bottomOffset: 155 },
                { bottom: 215, bottomOffset: 185 },
                { bottom: 255, bottomOffset: 225 }
            ];

            const config = maskConfigs[index] || maskConfigs[0];
            
            mask.drawPolygon([
                new Point(
                    sprite.x - sprite.width / 2,
                    sprite.y - sprite.height / 2 - 200
                ),
                new Point(
                    sprite.x + sprite.width / 2,
                    sprite.y - sprite.height / 2 - 200
                ),
                new Point(
                    sprite.x + sprite.width / 2,
                    sprite.y + config.bottom * scaleFactor
                ),
                new Point(
                    sprite.x - sprite.width / 2,
                    sprite.y + config.bottomOffset * scaleFactor
                )
            ]);
        };

        const getTextureFromCounterpartType = (counterpartType: CounterpartTypes, isWhacked: boolean): any => {
            const addon = isWhacked ? 'Whacked' : '';
            const loader = (PIXI as any).loader;
            
            switch (counterpartType) {
                case CounterpartTypes.EnemyCounterpart:
                    return loader.resources[`enemyImage${addon}`].texture;
                case CounterpartTypes.FriendCounterpart:
                    return loader.resources[`friendImage${addon}`].texture;
                case CounterpartTypes.TimeBonusCounterpart:
                    return loader.resources[`timeBonusImage${addon}`].texture;
                default:
                    return loader.resources[`enemyImage${addon}`].texture;
            }
        };

        const goToState = useCallback((newState: CounterpartStates) => {
            setState(newState);
            setStateTime(0);

            if (newState === CounterpartStates.ShowingState || newState === CounterpartStates.HidingState) {
                setStateDuration(15);
            } else if (newState === CounterpartStates.WaitingState) {
                setStateDuration(waitingTime);
            } else if (newState === CounterpartStates.HitState) {
                setStateDuration(20);
            }
        }, [waitingTime]);

        const setScoreInternal = (score: number) => {
            const scoreText = scoreTextRef.current;
            const sprite = spriteRef.current;
            
            if (!scoreText || !sprite) return;

            const prefix = score > 0 ? '+' : '';
            scoreText.text = prefix + score.toString();
            scoreText.x = sprite.x - scoreText.width / 2;
            scoreText.y = sprite.y - sprite.height + 20;
            scoreText.scale.x = 0;
            scoreText.scale.y = 0;
        };

        const show = useCallback((counterpartType: CounterpartTypes, waitingTimeParam: number) => {
            if (state === CounterpartStates.HiddenState) {
                setType(counterpartType);
                setWaitingTime(waitingTimeParam);
                
                const sprite = spriteRef.current;
                if (sprite) {
                    sprite.texture = getTextureFromCounterpartType(counterpartType, false);
                }
                
                goToState(CounterpartStates.ShowingState);
            }
        }, [state, goToState]);

        const setScore = useCallback((score: number) => {
            setScoreInternal(score);
        }, []);

        const setTimeLeft = useCallback((timeLeft: number) => {
            setWaitingTime(15 + timeLeft * 2);
        }, []);

        const onPointerDown = useCallback(() => {
            if (state === CounterpartStates.HitState || state === CounterpartStates.HidingHitState) {
                return;
            }

            const punchCoronaSprite = punchCoronaSpriteRef.current;
            const sprite = spriteRef.current;
            
            if (punchCoronaSprite) {
                punchCoronaSprite.visible = true;
            }

            let hitSound: any;
            const loader = (PIXI as any).loader;

            if (type === CounterpartTypes.EnemyCounterpart) {
                const punchSoundsLength = 9;
                let soundIndex = Math.floor(punchSoundsLength * Math.random());
                if (soundIndex === lastSoundIndex) {
                    soundIndex = lastSoundIndex - 1;
                    if (soundIndex < 0) {
                        soundIndex = punchSoundsLength - 1;
                    }
                }
                setLastSoundIndex(soundIndex);

                hitSound = loader.resources[`punchSound${soundIndex}`].data;
                onHit({ sender: componentRef.current!, hitStatus: HitStatus.EnemyHitSuccess });
            } else if (type === CounterpartTypes.FriendCounterpart) {
                hitSound = loader.resources['failureSound'].data;
                onHit({ sender: componentRef.current!, hitStatus: HitStatus.FriendHitFailure });
            } else if (type === CounterpartTypes.TimeBonusCounterpart) {
                hitSound = loader.resources['squeezeSound'].data;
                onHit({ sender: componentRef.current!, hitStatus: HitStatus.TimeBonusHit });
            }

            if (hitSound) {
                hitSound.play();
            }

            if (sprite) {
                sprite.texture = getTextureFromCounterpartType(type, true);
            }
            
            goToState(CounterpartStates.HitState);
        }, [state, type, lastSoundIndex, onHit, goToState]);

        const isStateFinished = useCallback((): boolean => {
            return stateTime > stateDuration;
        }, [stateTime, stateDuration]);

        // Update loop
        useEffect(() => {
            const update = (delta: number) => {
                setStateTime(prevTime => {
                    const newTime = prevTime + delta;
                    
                    const sprite = spriteRef.current;
                    const scoreText = scoreTextRef.current;
                    const punchCoronaSprite = punchCoronaSpriteRef.current;
                    const container = containerRef.current;
                    const origin = originRef.current;

                    if (state === CounterpartStates.ShowingState) {
                        const newVisibility = Math.min(1.0, Ease.inSine(newTime / stateDuration));
                        setVisibilityFactor(newVisibility);

                        if (newTime > stateDuration) {
                            goToState(CounterpartStates.WaitingState);
                        }
                    } else if (state === CounterpartStates.HidingState || state === CounterpartStates.HidingHitState) {
                        const newVisibility = Math.max(0.0, Ease.outSine(newTime / stateDuration));
                        setVisibilityFactor(newVisibility);

                        if (newTime > stateDuration) {
                            if (scoreText) {
                                scoreText.scale.x = 0;
                                scoreText.scale.y = 0;
                            }
                            goToState(CounterpartStates.HiddenState);
                        }
                    } else if (state === CounterpartStates.WaitingState) {
                        if (newTime > stateDuration) {
                            if (type === CounterpartTypes.EnemyCounterpart) {
                                onHit({ sender: componentRef.current!, hitStatus: HitStatus.CounterpartMissed });
                            }
                            goToState(CounterpartStates.HidingState);
                        }
                    } else if (state === CounterpartStates.HitState) {
                        if (scoreText && scoreText.scale.x < 1.0) {
                            scoreText.scale.x += 0.1;
                            scoreText.scale.y += 0.1;
                        }

                        if (newTime > stateDuration) {
                            if (punchCoronaSprite) {
                                punchCoronaSprite.visible = false;
                            }
                            goToState(CounterpartStates.HidingHitState);
                        }
                    }

                    if (sprite) {
                        sprite.y = origin.y + sprite.height * (1 - visibilityFactor);
                    }

                    if (container) {
                        container.rotation = Math.sin(newTime / 2) / 320;
                    }

                    return newTime;
                });
            };

            ticker.add(update);

            return () => {
                ticker.remove(update);
            };
        }, [ticker, state, stateDuration, visibilityFactor, type, goToState, onHit]);

        // Component ref for imperative methods
        const componentRef = useRef<CounterpartComponent>({
            show,
            setScore,
            setTimeLeft,
            container: containerRef.current
        });

        // Update component ref when methods change
        useEffect(() => {
            componentRef.current = {
                show,
                setScore,
                setTimeLeft,
                container: containerRef.current
            };
        }, [show, setScore, setTimeLeft]);

        // Expose methods through ref
        React.useImperativeHandle(ref, () => componentRef.current);

        return null; // This component doesn't render DOM elements, only PIXI objects
    }
);

Counterpart.displayName = 'Counterpart';

export default Counterpart;