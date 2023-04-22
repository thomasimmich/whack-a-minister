import React from 'react';
import { Engine } from 'tick-knock';

export class ECS {
  constructor(public engine: Engine = new Engine()) {}
}
export const ECSContext = React.createContext(new ECS());
