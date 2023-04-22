export interface Class<T> {
  new (...args: any[]): T;
}

export class Facet<T> {
  constructor(public props: T) {}
}

export interface ScoreProps {
  scoreValue: number;
}
export class ScoreFacet extends Facet<ScoreProps> {
  constructor(props: ScoreProps) {
    super(props);
  }
}
