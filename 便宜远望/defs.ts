import { Step } from "./game.ts";

export interface GameMachine {
  players: Map<string, Player>;
  places: Map<string, Place>;

  errorState: string | null;

  addWinConditionDescription(desc: string): void;
  addRuleDescription(desc: string): void;
}

export interface Place {
  description: string;
  init?(game: GameMachine): void;
  visit(visitors: Player[] | null): void;
  beforeSettled?(game: GameMachine, step: Step): void;
  onSettle?(game: GameMachine): void;
  afterSettled?(game: GameMachine): void;
}

export interface Addon {
  extraDescriptions?: string[];
  init?(game: GameMachine): void;
  beforeSettled?(game: GameMachine, step: Step): void;
  onSettle?(game: GameMachine): void;
  afterSettled?(game: GameMachine): void;
}

export interface Player {
  name: string;
  score: number;
  changeScore(delta: number): void;
  won: boolean;
  render(): string;
  wins(): void;

  init?(game: GameMachine): void;
  beforeSettled?(game: GameMachine, step: Step): void;
  onSettle?(game: GameMachine): void;
  afterSettled?(game: GameMachine): void;
}
