import { creatBaseGame, Player } from "../index.ts";

function main() {
  const pl = {
    g6t: new Player("悦", "g6t"),
    dze: new Player("虫", "dze"),
    wu: new Player("无", "5pl"),
    si: new Player("4", "4nx"),
    x1l: new Player("赌", "x1L"),
    k7r: new Player("镧", "K7R"),
  };

  const gm = creatBaseGame(new Map(Object.entries(pl)));

  // 1
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [pl.x1l],
      沃土之森: [pl.g6t, pl.wu, pl.si, pl.dze],
      平安小镇: [pl.k7r],
      远方之城: [],
    })),
  );

  // 2
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [pl.g6t],
      沃土之森: [pl.k7r],
      平安小镇: [pl.x1l, pl.si, pl.wu, pl.dze],
      远方之城: [],
    })),
  );

  // 3
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [],
      沃土之森: [pl.si, pl.wu, pl.x1l, pl.dze],
      平安小镇: [pl.g6t, pl.k7r],
      远方之城: [],
    })),
  );

  // 4
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [pl.dze, pl.wu],
      沃土之森: [pl.g6t, pl.k7r],
      平安小镇: [],
      远方之城: [pl.si, pl.x1l],
    })),
  );

  // 5
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [pl.si, pl.x1l],
      沃土之森: [],
      平安小镇: [pl.wu, pl.dze],
      远方之城: [pl.k7r, pl.g6t],
    })),
  );

  // 6
  gm.step(
    new Map(Object.entries({
      试炼宝藏: [pl.wu],
      沃土之森: [pl.g6t, pl.dze],
      平安小镇: [pl.si, pl.x1l],
      远方之城: [pl.k7r],
    })),
  );

  console.log(gm.render());
}

main();
