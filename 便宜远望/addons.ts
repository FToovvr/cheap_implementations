import { Addon, GameMachine, Place, Player } from "./defs.ts";
import { Step } from "./game.ts";

export class 积分胜利 implements Addon {
  minWinScore: number;
  minGap: number;

  constructor(args: { minWinScore?: number; minGap?: number } = {}) {
    args = {
      ...{ minWinScore: 20, minGap: 5 },
      ...args,
    };

    this.minWinScore = args.minWinScore!;
    this.minGap = args.minGap!;
  }

  init(game: GameMachine): void {
    const desc = `第一名分数≥${this.minWinScore}分，且超出第二名至少${this.minGap}分`;
    game.addWinConditionDescription(desc);
  }

  onSettle(game: GameMachine) {
    const players = [...game.players.values()];
    // 倒序
    players.sort((a, b) => b.score - a.score);
    if (
      players[0].score >= this.minWinScore &&
      players[0].score - players[1].score >= this.minGap
    ) {
      players[0].wins();
    }
  }
}

export class 不得连续 implements Addon {
  allowOnce: boolean;

  lastStep: Step | null = null;
  alreadyAllowed: Set<Player> = new Set();
  allowedInThisTurn: Set<Player> | null = null;

  constructor(args: { allowOnce?: boolean } = {}) {
    args = {
      ...{ allowOnce: false },
      ...args,
    };
    this.allowOnce = args.allowOnce!;
  }

  get extraDescriptions() {
    const _set = new Set(this.alreadyAllowed);
    let _thisTurnText = "";
    if (this.allowedInThisTurn) {
      for (const _thisTurn of this.allowedInThisTurn.values()) {
        _set.delete(_thisTurn);
        _thisTurnText += `【${_thisTurn.name}】`;
      }
    }

    const text = [..._set.values()].map((x) => x.name).join("") + _thisTurnText;

    return [`仅一次可以待在同一地区（已使用：${text}）`];
  }

  init(game: GameMachine) {
    game.addRuleDescription("不得连续去同一地区");
  }

  beforeSettled(game: GameMachine, step: Step) {
    const lastStep = this.lastStep;
    this.lastStep = step;
    if (!lastStep) {
      return;
    }
    this.allowedInThisTurn = null;

    const last = new Map<Player, string>();
    const now = new Map<Player, string>();

    for (const { x, y } of [{ x: last, y: lastStep }, { x: now, y: step }]) {
      for (const [place, players] of y.entries()) {
        for (const player of players) {
          x.set(player, place);
        }
      }
    }

    for (const [_, player] of game.players) {
      if (last.get(player) === now.get(player)) {
        if (this.alreadyAllowed.has(player)) {
          game.errorState = `玩家 ${player.name} 第二次滞留原处！`;
          console.error(game.errorState);
          return;
        } else if (!this.allowOnce) {
          game.errorState = `玩家 ${player.name} 滞留原处！`;
          console.error(game.errorState);
          return;
        }
        this.alreadyAllowed.add(player);
        if (!this.allowedInThisTurn) {
          this.allowedInThisTurn = new Set();
        }
        this.allowedInThisTurn.add(player);
      }
    }
  }
}
