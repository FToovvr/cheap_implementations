import { GameMachine, Step } from "../game.ts";
import { Player } from "../index.ts";

import { 不得连续远方, 积分胜利 } from "../addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城改 } from "../places.ts";

export function creatBaseGame(players: Map<string, Player>) {
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
      "远方之城": new 远方之城改({ minWinScore: 10, penalty: { top: 6, other: 4 } }),
    })),
  });
}

function main() {
  const pl = {
    wu: new Player("无", "5pl"),
    oco: new Player("冲", "oco"),
    dze: new Player("字", "dze"),
    pfp: new Player("草", "PFP"),
    k7r: new Player("顾", "K7R"),
    eku: new Player("寄", "EKu"),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    // 1
    new Map(Object.entries({
      试炼宝藏: [pl.wu],
      沃土之森: [pl.k7r, pl.eku],
      平安小镇: [pl.dze, pl.pfp, pl.oco],
      远方之城: [],
    })),
    // 2
    new Map(Object.entries({
      试炼宝藏: [pl.pfp, pl.wu, pl.k7r],
      沃土之森: [],
      平安小镇: [pl.dze, pl.oco, pl.eku],
      远方之城: [],
    })),
    // 3
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.pfp],
      平安小镇: [pl.oco, pl.eku, pl.dze],
      远方之城: [],
    })),
    // 4
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.eku],
      平安小镇: [pl.oco, pl.pfp, pl.dze],
      远方之城: [],
    })),
    // 5
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.pfp, pl.eku],
      平安小镇: [pl.oco, pl.dze],
      远方之城: [],
    })),
    // 6
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.eku, pl.pfp],
      平安小镇: [pl.oco, pl.dze],
      远方之城: [],
    })),
    // 7
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [],
      平安小镇: [pl.dze, pl.oco],
      远方之城: [pl.pfp, pl.eku],
    })),
    // 8
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.pfp, pl.dze, pl.eku],
      平安小镇: [pl.oco],
      远方之城: [],
    })),
    // 9
    new Map(Object.entries({
      试炼宝藏: [pl.wu, pl.k7r],
      沃土之森: [pl.eku],
      平安小镇: [pl.oco, pl.pfp],
      远方之城: [pl.dze],
    })),
    null,
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
