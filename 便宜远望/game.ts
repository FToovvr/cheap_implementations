import { Addon, GameMachine as _GameMachine, Place, Player } from "./defs.ts";

export type Step = PlayerChoices;
export type PlayerChoices = Map<string, Player[]>;

export class GameMachine implements _GameMachine {
  rulesDescriptions = [
    "暗中选择要去的地方",
    "同时公布，结算效果",
  ];

  winConditionDescription: string[] = [];

  players: Map<string, Player>;
  addons: Addon[];
  places: Map<string, Place>;

  steps: Step[] = [];
  errorState: string | null = null;

  constructor(args: {
    players: Map<string, Player>;
    addons: Addon[];
    places: Map<string, Place>;
  }) {
    // this.players = new Map(
    //   args.players.map((
    //     player,
    //   ) => [player.name, new Player(player.name, player.notes)]),
    // );
    this.players = args.players;

    this.addons = args.addons;
    this.places = args.places;

    this.addons.forEach((addon) => addon.init?.(this));
    this.places.forEach((place) => place.init?.(this));
  }

  addWinConditionDescription(desc: string) {
    this.winConditionDescription.push(desc);
  }

  addRuleDescription(desc: string) {
    this.rulesDescriptions.push(desc);
  }

  step(step: Step) {
    if (this.errorState) {
      console.error("之前存在错误，本回合行动将忽略！");
      return;
    }

    this.steps.push(step);
    const all: (Addon | Place | Player)[] = [
      ...this.addons,
      ...this.places.values(),
      ...this.players.values(),
    ];

    // beforeSettled: 准备阶段
    all.forEach((x) => x.beforeSettled?.(this, step));

    // visit: 处理前往地区到效果
    const allVisitors = new Set<Player>();
    const visitedPlaces = new Set<string>();
    for (const [placeName, visitors] of step.entries()) {
      const place = this.places.get(placeName);
      if (!place) {
        this.errorState = `地点「${placeName}」不存在！`;
        console.error(this.errorState);
        return;
      }
      if (visitors.length === 0) {
        continue;
      }
      visitedPlaces.add(placeName);
      for (const visitor of visitors) {
        if (allVisitors.has(visitor)) {
          this.errorState = `玩家 ${visitor.name} 一回合行动了两次！`;
          console.error(this.errorState);
        }
        allVisitors.add(visitor);
      }
      // console.log({ place, visitors });
      place.visit(visitors);
    }
    if (this.steps.length === 0) {
      // 第零回合无人行动
      if (allVisitors.size !== 0) {
        this.errorState = `？？第零回合怎么有 ${allVisitors.size} 个人行动了？`;
        console.error(this.errorState);
      }
    } else {
      for (const [placeName, place] of this.places.entries()) {
        if (!visitedPlaces.has(placeName)) {
          place.visit(null);
        }
      }

      if (allVisitors.size !== 6) {
        this.errorState = `行动人数不匹配：行动人数 ${allVisitors.size} ≠ 6！`;
        console.error(this.errorState);
        return;
      }
    }

    // onSettle: 处理其他效果
    all.forEach((x) => x.onSettle?.(this));

    // afterSettled: 为下回合做准备
    all.forEach((x) => x.afterSettled?.(this));
  }

  render(): string {
    const turn = this.steps.length;
    let text = `# 便宜版离群远望 回合 ${turn}` + "\n\n";

    if (this.errorState) {
      text += "错误：" + this.errorState;
      return text;
    }

    text += this.renderHead() + "\n\n";
    const currentChoices = turn === 0 ? undefined : this.steps[turn - 1];
    text += this.renderPlaces(currentChoices) + "\n\n";
    text += this.renderPlayers();

    return text;
  }

  renderHead(): string {
    const headItems = [];
    headItems.push("规则：" + this.rulesDescriptions.join("；") + "。");
    headItems.push(
      "胜利条件（满足其一）：" + this.winConditionDescription.join("；") + "。",
    );
    for (const addon of this.addons) {
      if (addon.extraDescriptions) {
        for (const desc of addon.extraDescriptions) {
          headItems.push("+特殊规则：" + desc);
        }
      }
    }

    return headItems.join("\n");
  }

  /**
   * @param playerChoices Place -> Player
   */
  renderPlaces(playerChoices: PlayerChoices | undefined) {
    let placeTexts = [];
    for (const [name, place] of this.places.entries()) {
      let placeText = "";
      placeText += `「${name}」【${
        (playerChoices?.get(name) ?? []).map((player) => player.name).join("")
      }】` + "\n";
      placeText += place.description;

      placeTexts.push(placeText);
    }

    return placeTexts.join("\n\n");
  }

  renderPlayers() {
    return [...this.players.values()]
      .map((player) => player.render()).join("\n");
  }
}
