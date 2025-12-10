import styled from 'styled-components';
import { Stage } from '@pixi/react';

export const GameContainer = styled.div`
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  overflow: hidden;
  background-color: #000;
`;

export const GameStage = styled(Stage)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const GameOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  color: white;
`;

export const GameButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background: #4CAF50;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #45a049;
  }
`; 