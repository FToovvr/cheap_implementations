import { GameMachine, Step } from "../game.ts";
import { Player } from "../player.ts";

import { 不得连续, 积分胜利 } from "../addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城 } from "../places.ts";

export function createBaseGame(players: Map<string, Player>) {
  return new GameMachine({
    players,
    addons: [
      new 积分胜利({ minWinScore: 20, minGap: 5 }),
      new 不得连续({ allowOnce: true }),
    ],
    places: new Map(Object.entries({
      "试炼宝藏": new 试炼宝藏(),
      "沃土之森": new 沃土之森(),
      "平安小镇": new 平安小镇(),
      "远方之城": new 远方之城({ minWinScore: 10, penalty: 3 }),
    })),
  });
}

function main() {
  const pl = {
    dze: new Player("前", "dze"),
    cus: new Player("喵", "cus"),
    a7m: new Player("汐", "A7m"),
    gui: new Player("干", "龟哥"),
    k7h: new Player("汪", "K7h"),
    bat: new Player("咚", "0Bat"),
  };

  const gm = createBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [pl.a7m, pl.dze, pl.bat, pl.cus],
      平安小镇: [pl.k7h, pl.gui],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.gui, pl.cus],
      沃土之森: [pl.k7h, pl.a7m],
      平安小镇: [pl.dze, pl.bat],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.gui, pl.k7h, pl.a7m],
      沃土之森: [pl.dze, pl.bat],
      平安小镇: [pl.cus],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.cus, pl.bat],
      沃土之森: [pl.gui],
      平安小镇: [pl.k7h, pl.a7m, pl.dze],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.gui, pl.k7h],
      沃土之森: [pl.a7m, pl.dze],
      平安小镇: [pl.bat, pl.cus],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.a7m, pl.bat],
      沃土之森: [pl.gui, pl.k7h, pl.cus],
      平安小镇: [pl.dze],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.gui, pl.k7h, pl.cus],
      沃土之森: [pl.a7m, pl.bat, pl.dze],
      平安小镇: [],
      远方之城: [],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.bat],
      沃土之森: [pl.cus],
      平安小镇: [pl.gui, pl.dze, pl.k7h],
      远方之城: [pl.a7m],
    })),
    new Map(Object.entries({
      试炼宝藏: [pl.gui, pl.cus],
      沃土之森: [pl.k7h, pl.dze],
      平安小镇: [pl.a7m],
      远方之城: [pl.bat],
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
