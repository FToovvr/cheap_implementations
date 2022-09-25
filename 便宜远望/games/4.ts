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
    mike: new Player("M", "MiKe"),
    dze: new Player("福", "dze"),
    g6t: new Player("白", "g6t"),
    wu: new Player("陆", "5pl"),
    k7r: new Player("衣", "K7R"),
    bot: new Player("🤖️", "bot"),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  const steps: (Step | null)[] = [
    // 1
    // bot: MiKe->试炼, dze->远方, 5pl->宝藏, K7R->森林, 
    new Map(Object.entries({
      试炼宝藏: [pl.dze,pl.k7r],
      沃土之森: [pl.mike,pl.wu],
      平安小镇: [pl.g6t],
      远方之城: [pl.bot],
    })),
    // 2
    // bot: g6t->森林, 5pl->小镇, K7R->森林, MiKe->试炼, dze->试炼
    new Map(Object.entries({
      试炼宝藏: [pl.g6t,pl.wu],
      沃土之森: [],
      平安小镇: [pl.dze,pl.mike,pl.k7r,pl.bot],
      远方之城: [],
    })),
    // 3
    // bot: dze->远方, MiKe->试炼, g6t->试炼, 5pl->试炼, K7R->试炼
    new Map(Object.entries({
      试炼宝藏: [pl.bot],
      沃土之森: [pl.dze,pl.mike,pl.g6t,pl.wu,pl.k7r],
      平安小镇: [],
      远方之城: [],
    })),
    // 4
    // bot: dze->远方, MiKe->试炼, 5pl->小镇, g6t->试炼, K7R->试炼
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [pl.mike,pl.wu,pl.g6t,pl.k7r],
      平安小镇: [pl.dze,pl.bot],
      远方之城: [],
    })),
    // 5
    // bot: dze->远方, g6t->森林, 5pl->森林, MiKe->试炼, K7R->试炼
    new Map(Object.entries({
      试炼宝藏: [pl.g6t],
      沃土之森: [pl.dze,pl.k7r],
      平安小镇: [pl.wu,pl.mike],
      远方之城: [pl.bot],
    })),
    // 6
    // bot: MiKe->试炼, dze->远方, 5pl->森林, g6t->试炼, K7R->远方
    new Map(Object.entries({
      试炼宝藏: [pl.wu,pl.k7r],
      沃土之森: [pl.mike],
      平安小镇: [pl.dze,pl.g6t],
      远方之城: [pl.bot],
    })),
    // 7
    // bot: MiKe->远方, dze->远方, g6t->试炼, 5pl->森林, K7R->试炼
    new Map(Object.entries({
      试炼宝藏: [pl.mike,pl.bot],
      沃土之森: [pl.g6t,pl.dze],
      平安小镇: [pl.wu,pl.k7r],
      远方之城: [],
    })),
    // 8
    // bot: MiKe->试炼, dze->远方, 5pl->远方, g6t->远方, K7R->远方
    new Map(Object.entries({
      试炼宝藏: [pl.dze,pl.g6t,pl.k7r],
      沃土之森: [pl.wu],
      平安小镇: [],
      远方之城: [pl.mike,pl.bot],
    })),
    // 9
    // bot: dze->远方, g6t->试炼, 其他都远方
    new Map(Object.entries({
      试炼宝藏: [pl.mike],
      沃土之森: [],
      平安小镇: [pl.dze,pl.k7r,pl.wu],
      远方之城: [pl.g6t,pl.bot],
    })),
    // 10
    // 全部投试炼
    new Map(Object.entries({
      试炼宝藏: [pl.dze,pl.bot],
      沃土之森: [pl.k7r,pl.g6t],
      平安小镇: [],
      远方之城: [pl.wu,pl.mike],
    })),
    null,
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
