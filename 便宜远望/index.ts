import { GameMachine } from "./game.ts";
import { Player } from "./player.ts";
export { Player } from "./player.ts";

import { 不得连续, 积分胜利 } from "./addons.ts";
import { 平安小镇, 沃土之森, 试炼宝藏, 远方之城 } from "./places.ts";

export function creatBaseGame(players: Map<string, Player>) {
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
    a: new Player("a", ""),
    b: new Player("b", ""),
    c: new Player("c", ""),
    d: new Player("d", ""),
    e: new Player("e", ""),
    f: new Player("f", ""),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  gm.step(
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [],
      平安小镇: [],
      远方之城: [],
    })),
  );
}

// main();
