import { GameMachine, Step } from "../game.ts";
import { Player } from "../index.ts";

import { 不得连续远方, 积分胜利 } from "../addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城 } from "../places.ts";

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
      "远方之城": new 远方之城({ minWinScore: 10, penalty: 5 }),
    })),
  });
}

function main() {
  const pl = { // 第一个字符串是单字昵称，第二个字符串是玩家全称
    aaa: new Player("", ""),
    bbb: new Player("", ""),
    ccc: new Player("", ""),
    ddd: new Player("", ""),
    eee: new Player("", ""),
    fff: new Player("", ""),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    null, // 渲染只会处理到 null 之前的步骤
    // 1
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 2
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
    // 3
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
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
