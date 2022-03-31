import { GameMachine, Player as _Player } from "./defs.ts";

export class Player implements _Player {
  name: string;
  notes: string;
  score = 0;
  won: boolean = false;

  _oldScore: number | null = null;
  _lastChanged: number | null = null;

  constructor(name: string, notes: string) {
    this.name = name;
    this.notes = notes;
  }

  changeScore(delta: number) {
    this._lastChanged = (this._lastChanged ?? 0) + delta;
    this.score = Math.max(this.score + delta, 0);
  }

  beforeSettled(game: GameMachine) {
    this._lastChanged = 0;
    this._oldScore = this.score;
  }

  wins() {
    this.won = true;
  }

  render(): string {
    let text = "";
    if (this.won) {
      text += "〔获胜〕";
    }
    const score = String(this.score).padStart(2, "0");
    if (this._oldScore !== null) {
      const oldScore = String(this._oldScore).padStart(2, "0");
      const delta = (this._lastChanged! >= 0 ? "+" : "") + this._lastChanged;
      text += `${oldScore}${delta}→${score}`;
    } else {
      text += `${score}`;
    }
    text += ` ${this.name} ${this.notes}`;

    return text;
  }
}
