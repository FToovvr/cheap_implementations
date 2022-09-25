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

    return [`已有过滞留：${text}`];
  }

  init(game: GameMachine) {
    if (this.allowOnce) {
      game.addRuleDescription("整局游戏期间，仅一次允许滞留同一地区");
    } else {
      game.addRuleDescription("不得连续去同一地区");
    }
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

export class 不得连续远方 implements Addon {
  lastStep: Step | null = null;

  init(game: GameMachine) {
    game.addRuleDescription("不得连续去远方之城地区");
  }

  beforeSettled(game: GameMachine, step: Step) {
    const lastStep = this.lastStep;
    this.lastStep = step;
    if (!lastStep) {
      return;
    }

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
      if (last.get(player) === now.get(player) && now.get(player) === "远方之城") {
        game.errorState = `玩家 ${player.name} 滞留远方之城！`;
        console.error(game.errorState);
        return;
      }
    }
  }
}

// TODO: 尚未测试！
export class 连续惩罚 implements Addon {
  stayTimes: Map<Player, { place: Place; count: number }> = new Map();

  penalties: { player: Player; score: number; alreadyStays: number }[] = [];
  message: string = "";

  init(game: GameMachine) {
    game.addRuleDescription("滞留惩罚：一次：-1；两次：-2；两次以上：-3；有能力支付惩罚才可行动");
  }

  get extraDescriptions() {
    return ["本轮滞留惩罚：" + this.message];
  }

  beforeSettled(game: GameMachine, step: Step) {
    this.penalties = [];

    for (const [place, players] of step.entries()) {
      for (const player of players) {
        const lastPlace = this.stayTimes.get(player);
        const _place = game.places.get(place);
        if (!_place) {
          game.errorState = `${place} 没有对应地点？`;
          return;
        }
        if (lastPlace?.place !== _place) {
          this.stayTimes.set(player, { place: _place, count: 1 });
        } else {
          if (lastPlace.count === 1) {
            this.penalties.push({
              player,
              score: 1,
              alreadyStays: lastPlace.count,
            });
          } else if (lastPlace.count === 2) {
            this.penalties.push({
              player,
              score: 2,
              alreadyStays: lastPlace.count,
            });
          } else {
            this.penalties.push({
              player,
              score: 3,
              alreadyStays: lastPlace.count,
            });
          }

          const now = { ...lastPlace, count: lastPlace.count + 1 };
          this.stayTimes.set(player, now);
        }
      }
    }

    const _message = [];
    this.message = "";
    for (const penalty of this.penalties) {
      _message.push(
        `『${penalty.player.name}』滞留${penalty.alreadyStays}次：-${penalty.score}`,
      );
      if (penalty.player.score < penalty.score) {
        game.errorState =
          `${penalty.player.name} 无法支付惩罚！（${penalty.player.score} < ${penalty.score}）`;
        return;
      }
    }
    this.message = _message.join("；");
  }

  afterSettled(game: GameMachine) {
    for (const penalty of this.penalties) {
      penalty.player.changeScore(-penalty.score);
    }
  }
}
