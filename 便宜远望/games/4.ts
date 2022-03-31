import { GameMachine, Step } from "../game.ts";
import { Player } from "../index.ts";

import { 积分胜利, 连续惩罚 } from "../addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城 } from "../places.ts";

export function creatBaseGame(players: Map<string, Player>) {
  return new GameMachine({
    players,
    addons: [
      new 积分胜利({ minWinScore: 20, minGap: 5 }),
      new 连续惩罚(),
    ],
    places: new Map(Object.entries({
      "试炼宝藏": new 试炼宝藏(),
      "沃土之森": new 沃土之森(),
      "平安小镇": new 平安小镇(),
      "远方之城": new 远方之城({ minWinScore: 10, penalty: 5 }),
    })),
  });
}

function main() {
  // 非正式游戏，试验用
  const pl = {
    aaa: new Player("打", "oco"),
    bbb: new Player("来", "墨水"),
    ccc: new Player("P", "PFP"),
    ddd: new Player("ddd", ""),
    eee: new Player("eee", ""),
    fff: new Player("fff", ""),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    // 1
    new Map(Object.entries({
      试炼宝藏: [pl.aaa],
      沃土之森: [pl.bbb, pl.ddd],
      平安小镇: [pl.ccc, pl.eee, pl.fff],
      远方之城: [],
    })),
    // 2
    new Map(Object.entries({
      试炼宝藏: [pl.aaa],
      沃土之森: [pl.bbb, pl.ddd],
      平安小镇: [pl.ccc, pl.eee, pl.fff],
      远方之城: [],
    })),
    // 3
    new Map(Object.entries({
      试炼宝藏: [pl.aaa],
      沃土之森: [pl.bbb, pl.ddd],
      平安小镇: [],
      远方之城: [pl.ccc, pl.eee, pl.fff],
    })),
    null,
    // 4
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 5
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 6
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 7
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 8
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 9
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 10
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
  ];

  for (const step of steps) {
    if (!step) {
      break;
    }
    gm.step(step);
  }

  console.log(gm.render());
}

main();
