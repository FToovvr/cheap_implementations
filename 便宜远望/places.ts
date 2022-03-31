import { Place, Player } from "./defs.ts";
import { GameMachine } from "./game.ts";

export class 试炼宝藏 implements Place {
  score = 5;

  get description() {
    return `一人：+${this.score}；超过一人：无收益`;
  }

  visit(visitors: Player[] | null): void {
    if (!visitors) {
      return;
    }
    if (visitors.length == 1) {
      visitors[0].changeScore(5);
    }
  }
}

export class 沃土之森 implements Place {
  get description() {
    let desc = `平分物产，余数保留\n`;
    if (this._oldProducts !== null) {
      const n = this._oldProducts + this.increasedProductsPerTurn -
        this.accumulatedProducts;
      desc +=
        `当前物产=${this._oldProducts}-${n}+${this.increasedProductsPerTurn}=${this.accumulatedProducts}`;
    } else {
      desc += `当前物产=${this.accumulatedProducts}`;
    }
    desc += `（+${this.increasedProductsPerTurn}/回合）`;
    return desc;
  }

  accumulatedProducts = 6;
  increasedProductsPerTurn = 3;

  _oldProducts: number | null = null;

  visit(visitors: Player[] | null): void {
    this._oldProducts = this.accumulatedProducts;
    if (!visitors) {
      return;
    }
    const scorePerVisitor = Math.floor(
      this.accumulatedProducts / visitors.length,
    );
    this.accumulatedProducts -= scorePerVisitor * visitors.length;
    visitors.forEach((visitor) => visitor.changeScore(scorePerVisitor));
  }

  afterSettled(game: GameMachine) {
    this.accumulatedProducts += this.increasedProductsPerTurn;
  }
}

interface ScoreItem {
  description: string;
  score: number;
  isPlural: boolean;
}
interface ScoreTable {
  common: { [key: number]: ScoreItem };
  default: ScoreItem;
}

export class 平安小镇 implements Place {
  get description() {
    return [...Object.values(this.scoreTable.common), this.scoreTable.default]
      .map((item) =>
        `${item.description}：${item.isPlural ? "各" : ""}+${item.score}`
      )
      .join("；");
  }

  scoreTable: ScoreTable = {
    common: {
      1: { description: "一人", score: 3, isPlural: false },
      2: { description: "两人", score: 2, isPlural: true },
    },
    default: { description: "超过两人", score: 1, isPlural: true },
  };

  visit(visitors: Player[] | null): void {
    if (!visitors) {
      return;
    }
    let score: number | undefined = this.scoreTable.common[visitors.length]
      ?.score;
    if (!score) {
      score = this.scoreTable.default.score;
    }
    visitors.forEach((visitor) => visitor.changeScore(score!));
  }
}

export class 远方之城 implements Place {
  get description() {
    return `一人，且分数≥${this.minWinScore}：获胜；超过一人：各-${this.penalty}`;
  }

  minWinScore = 10;
  penalty = 3;

  constructor(
    args: { minWinScore?: number; penalty?: number } = {},
  ) {
    args = {
      ...{ minWinScore: 10, penalty: 3 },
      ...args,
    };
    this.minWinScore = args.minWinScore!;
    this.penalty = args.penalty!;
  }

  init(game: GameMachine) {
    game.addWinConditionDescription("满足远方之城条件");
  }
  visit(visitors: Player[] | null): void {
    if (!visitors) {
      return;
    }
    if (visitors.length === 1) {
      if (visitors[0].score >= this.minWinScore) {
        visitors[0].wins();
      }
      return;
    }
    visitors.forEach((visitor) => visitor.changeScore(-this.penalty));
  }
}
