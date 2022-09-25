import { GameMachine, Step } from "../game.ts";
import { Player } from "../index.ts";

import { 不得连续远方, 积分胜利 } from "../addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城 } from "../places.ts";

export function createBaseGame(players: Map<string, Player>) {
  return new GameMachine({
    players,
    addons: [
      new 积分胜利({ minWinScore: 20, minGap: 5 }),
      new 不得连续远方(),
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
  const pl = {
    wu: new Player("阑", "5pl"),
    eku: new Player("寄", "EKu"),
    oco: new Player("冲", "oco"),
    x1l: new Player("莽", "x1L"),
    pfp: new Player("乐", "PFP"),
    k7r: new Player("伞", "K7R"),
  };

  const gm = createBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    // 1
    new Map(Object.entries({
      试炼宝藏: [pl.eku, pl.k7r],
      沃土之森: [pl.pfp, pl.wu],
      平安小镇: [pl.x1l, pl.oco],
      远方之城: [],
    })),
    // 2
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [pl.oco],
      平安小镇: [pl.pfp, pl.x1l, pl.eku, pl.wu, pl.k7r],
      远方之城: [],
    })),
    // 3
    new Map(Object.entries({
      试炼宝藏: [pl.x1l, pl.k7r, pl.eku, pl.wu],
      沃土之森: [],
      平安小镇: [pl.pfp, pl.oco],
      远方之城: [],
    })),
    // 4
    new Map(Object.entries({
      试炼宝藏: [pl.eku],
      沃土之森: [pl.x1l, pl.pfp, pl.wu, pl.k7r],
      平安小镇: [pl.oco],
      远方之城: [],
    })),
    // 5
    new Map(Object.entries({
      试炼宝藏: [pl.eku, pl.k7r],
      沃土之森: [pl.pfp, pl.wu],
      平安小镇: [],
      远方之城: [pl.oco, pl.x1l],
    })),
    // 6
    new Map(Object.entries({
      试炼宝藏: [pl.eku],
      沃土之森: [pl.oco, pl.k7r],
      平安小镇: [pl.x1l, pl.pfp, pl.wu],
      远方之城: [],
    })),
    // 7
    new Map(Object.entries({
      试炼宝藏: [pl.oco, pl.eku],
      沃土之森: [pl.k7r],
      平安小镇: [pl.x1l, pl.wu],
      远方之城: [pl.pfp],
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
