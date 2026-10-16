/* ============================================================
   環遊合併 — Prototype (Travel Town / Gossip Harbor layout DNA)
   P0: customer row + bubbles above heads
   P1: wood board dominates vertical space
   P2: compact icon-chip HUD + energy countdown
   P3: fly-to-customer submit + bubble ready check + reward pop
   P4: collapsed detail strip; gen/boost floating dock
   P5: glossy CSS tiles + original SVG vehicle/customer assets
   P6: four-band vertical ratios
   + Multi-generator + order pacing (easy/mid/hard + timed bonus)
   + Landmark decoration meta: spend 旅費 unlock/upgrade before→after scene
   ============================================================ */
const CONFIG = {
  COLS: 7,
  ROWS: 8,
  ENERGY_START: 100,
  ENERGY_MAX: 100,
  ENERGY_REGEN_MS: 120000,
  GENERATOR_COST: 1,
  BOOST_COST: 2,
  ORDER_SLOTS: 4,
  START_ITEMS: [{ level: 1 }, { level: 1 }, { level: 1 }, { level: 2 }],
  FLY_MS: 480,
  BONUS_DURATION_MS: 180000,
  BONUS_MULT: 1.5,
  ALMOST_THRESHOLD: 0.6,
};

const CUSTOMER_ASSETS = [
  "assets/customers/c1.svg",
  "assets/customers/c2.svg",
  "assets/customers/c3.svg",
  "assets/customers/c4.svg",
  "assets/customers/c5.svg",
  "assets/customers/c6.svg",
];

const CHAIN = [
  { id: "skateboard", name: "滑板", emoji: "🛹", icon: "assets/vehicles/lv1_skateboard.svg" },
  { id: "bicycle", name: "單車", emoji: "🚲", icon: "assets/vehicles/lv2_bicycle.svg" },
  { id: "e_scooter", name: "電動滑板車", emoji: "🛴", icon: "assets/vehicles/lv3_e_scooter.svg" },
  { id: "motorcycle", name: "電單車", emoji: "🏍️", icon: "assets/vehicles/lv4_motorcycle.svg" },
  { id: "used_car", name: "二手私家車", emoji: "🚗", icon: "assets/vehicles/lv5_used_car.svg" },
  { id: "van", name: "廂型車", emoji: "🚐", icon: "assets/vehicles/lv6_van.svg" },
  { id: "coach", name: "長途巴士", emoji: "🚌", icon: "assets/vehicles/lv7_coach.svg" },
  { id: "train", name: "列車", emoji: "🚆", icon: "assets/vehicles/lv8_train.svg" },
  { id: "ferry", name: "渡輪", emoji: "⛴️", icon: "assets/vehicles/lv9_ferry.svg" },
  { id: "airliner", name: "客機", emoji: "✈️", icon: "assets/vehicles/lv10_airliner.svg" },
];

const LANDMARKS = [
  {
    id: "home",
    name: "家鄉紀念碑",
    emoji: "🗿",
    unlockCost: 0,
    decorCost: 25,
    before: "assets/landmarks/home_before.svg",
    after: "assets/landmarks/home_after.svg",
  },
  {
    id: "torii",
    name: "日本鳥居",
    emoji: "⛩️",
    unlockCost: 80,
    decorCost: 40,
    before: "assets/landmarks/torii_before.svg",
    after: "assets/landmarks/torii_after.svg",
  },
  {
    id: "pisa",
    name: "比薩斜塔",
    emoji: "🏛️",
    unlockCost: 200,
    decorCost: 80,
    before: "assets/landmarks/pisa_before.svg",
    after: "assets/landmarks/pisa_after.svg",
  },
  {
    id: "bigben",
    name: "大笨鐘",
    emoji: "🔔",
    unlockCost: 400,
    decorCost: 140,
    before: "assets/landmarks/bigben_before.svg",
    after: "assets/landmarks/bigben_after.svg",
  },
  {
    id: "liberty",
    name: "自由女神",
    emoji: "🗽",
    unlockCost: 700,
    decorCost: 220,
    before: "assets/landmarks/liberty_before.svg",
    after: "assets/landmarks/liberty_after.svg",
  },
  {
    id: "eiffel",
    name: "埃菲爾鐵塔",
    emoji: "🗼",
    unlockCost: 1100,
    decorCost: 300,
    before: "assets/landmarks/eiffel_before.svg",
    after: "assets/landmarks/eiffel_after.svg",
  },
];

/** Multi-generator defs — board tiles + dock; unlock by landmark */
const GENERATORS = [
  {
    id: "parts",
    name: "零件堆",
    icon: "assets/generator.svg",
    unlockLandmark: 0,
    boardSlot: 49, // row7 col0
    spawnTable: [
      [1, 72],
      [2, 28],
    ],
    boostTable: [
      [2, 68],
      [3, 32],
    ],
  },
  {
    id: "garage",
    name: "修車鋪",
    icon: "assets/generator_garage.svg",
    unlockLandmark: 0, // 開局就有（同零件堆唔同掉落表）
    boardSlot: 50, // row7 col1
    spawnTable: [
      [2, 48],
      [3, 36],
      [4, 16],
    ],
    boostTable: [
      [3, 48],
      [4, 36],
      [5, 16],
    ],
  },
  {
    id: "luggage",
    name: "行李倉",
    icon: "assets/generator_luggage.svg",
    unlockLandmark: 3, // 大笨鐘
    boardSlot: 51, // row7 col2
    spawnTable: [
      [4, 42],
      [5, 36],
      [6, 22],
    ],
    boostTable: [
      [5, 42],
      [6, 36],
      [7, 22],
    ],
  },
];

const ORDER_POOL = [
  // Home — easy session-completable; mid/hard overlap on Lv2–4
  { id: "o_paper", title: "送報紙哥出門", needs: [{ level: 1, count: 2 }], difficulty: "easy", reward: 8, poolFrom: 0 },
  { id: "o_market", title: "街坊買菜", needs: [{ level: 2, count: 1 }], difficulty: "easy", reward: 10, poolFrom: 0 },
  { id: "o_errand", title: "街口幫襯", needs: [{ level: 1, count: 1 }, { level: 2, count: 1 }], difficulty: "easy", reward: 12, poolFrom: 0 },
  { id: "o_school", title: "學生返學", needs: [{ level: 2, count: 2 }], difficulty: "mid", reward: 18, poolFrom: 0 },
  { id: "o_delivery", title: "外賣仔趕單", needs: [{ level: 3, count: 1 }], difficulty: "mid", reward: 22, poolFrom: 0 },
  { id: "o_patrol", title: "夜班巡邏", needs: [{ level: 4, count: 1 }], difficulty: "mid", reward: 28, poolFrom: 0 },
  { id: "o_first_trip", title: "第一次出城影相", needs: [{ level: 4, count: 1 }, { level: 2, count: 1 }], difficulty: "hard", reward: 45, poolFrom: 0 },

  { id: "o_torii_easy1", title: "神社外圍散步", needs: [{ level: 2, count: 2 }], difficulty: "easy", reward: 14, poolFrom: 1 },
  { id: "o_torii_easy2", title: "京都短途", needs: [{ level: 3, count: 1 }], difficulty: "easy", reward: 16, poolFrom: 1 },
  { id: "o_torii_easy3", title: "鳥居腳下接客", needs: [{ level: 2, count: 1 }, { level: 3, count: 1 }], difficulty: "easy", reward: 18, poolFrom: 1 },
  { id: "o_torii_mid1", title: "鳥居打卡團", needs: [{ level: 4, count: 1 }], difficulty: "mid", reward: 32, poolFrom: 1 },
  { id: "o_torii_mid2", title: "載遊客去參拜", needs: [{ level: 5, count: 1 }], difficulty: "mid", reward: 40, poolFrom: 1 },
  { id: "o_torii_mid3", title: "電單車接駁團", needs: [{ level: 4, count: 1 }, { level: 3, count: 1 }], difficulty: "mid", reward: 36, poolFrom: 1 },
  { id: "o_torii_hard", title: "全家賞櫻出遊", needs: [{ level: 6, count: 1 }], difficulty: "hard", reward: 70, poolFrom: 1 },

  { id: "o_pisa_easy", title: "斜塔廣場散步", needs: [{ level: 3, count: 2 }], difficulty: "easy", reward: 20, poolFrom: 2 },
  { id: "o_pisa_easy2", title: "托斯卡尼短程", needs: [{ level: 4, count: 1 }], difficulty: "easy", reward: 24, poolFrom: 2 },
  { id: "o_pisa_mid1", title: "義大利公路遊", needs: [{ level: 5, count: 1 }], difficulty: "mid", reward: 45, poolFrom: 2 },
  { id: "o_pisa_mid2", title: "雙車接團", needs: [{ level: 5, count: 2 }], difficulty: "mid", reward: 55, poolFrom: 2 },
  { id: "o_pisa_mid3", title: "電單車+私家車", needs: [{ level: 4, count: 1 }, { level: 5, count: 1 }], difficulty: "mid", reward: 50, poolFrom: 2 },
  { id: "o_pisa_hard", title: "廂型車載全班同學", needs: [{ level: 6, count: 1 }], difficulty: "hard", reward: 85, poolFrom: 2 },

  { id: "o_london_easy", title: "泰晤士河岸短程", needs: [{ level: 5, count: 1 }], difficulty: "easy", reward: 30, poolFrom: 3 },
  { id: "o_london_easy2", title: "城區接駁", needs: [{ level: 4, count: 2 }], difficulty: "easy", reward: 28, poolFrom: 3 },
  { id: "o_london_mid1", title: "倫敦城際巴士", needs: [{ level: 7, count: 1 }], difficulty: "mid", reward: 70, poolFrom: 3 },
  { id: "o_london_mid2", title: "廂型車 + 電單車接駁", needs: [{ level: 6, count: 1 }, { level: 4, count: 1 }], difficulty: "mid", reward: 65, poolFrom: 3 },
  { id: "o_london_hard", title: "乘列車睇大笨鐘", needs: [{ level: 8, count: 1 }], difficulty: "hard", reward: 110, poolFrom: 3 },

  { id: "o_lib_easy", title: "紐約港短程", needs: [{ level: 6, count: 1 }], difficulty: "easy", reward: 40, poolFrom: 4 },
  { id: "o_lib_easy2", title: "曼哈頓接客", needs: [{ level: 5, count: 2 }], difficulty: "easy", reward: 42, poolFrom: 4 },
  { id: "o_lib_mid", title: "跨區長途", needs: [{ level: 7, count: 1 }], difficulty: "mid", reward: 80, poolFrom: 4 },
  { id: "o_lib_hard1", title: "列車直達港口", needs: [{ level: 8, count: 1 }], difficulty: "mid", reward: 100, poolFrom: 4 },
  { id: "o_lib_hard2", title: "渡輪睇女神", needs: [{ level: 9, count: 1 }], difficulty: "hard", reward: 140, poolFrom: 4 },

  { id: "o_eiffel_easy", title: "塞納河畔接駁", needs: [{ level: 7, count: 1 }], difficulty: "easy", reward: 50, poolFrom: 5 },
  { id: "o_eiffel_easy2", title: "鐵塔腳下短程", needs: [{ level: 6, count: 2 }], difficulty: "easy", reward: 52, poolFrom: 5 },
  { id: "o_eiffel_mid", title: "巴黎城際列車", needs: [{ level: 8, count: 1 }], difficulty: "mid", reward: 95, poolFrom: 5 },
  { id: "o_eiffel_hard", title: "渡輪再到市區", needs: [{ level: 9, count: 1 }], difficulty: "mid", reward: 120, poolFrom: 5 },
  {
    id: "o_eiffel_finale",
    title: "鐵塔首航",
    needs: [{ level: 10, count: 1 }],
    difficulty: "hard",
    reward: 160,
    poolFrom: 5,
    isFinale: true,
  },
];

const state = {
  energy: CONFIG.ENERGY_START,
  travel: 0,
  gems: 0,
  unlockedLandmark: 0,
  /** Per-landmark decoration stage: 0 locked, 1 unlocked (before/灰), 2 renovated (after/亮) */
  decorLevels: [1, 0, 0, 0, 0, 0],
  board: /** @type {(null|{ level?: number, genId?: string, uid: number })[]} */ ([]),
  orders: /** @type {any[]} */ ([]),
  selectedIndex: null,
  won: false,
  usedOrderIds: new Set(),
  nextUid: 1,
  boostOn: false,
  regenElapsedMs: 0,
  lastTick: Date.now(),
  claiming: false,
  /** Timed bonus on one order */
  bonusOrderInst: null,
  bonusEndsAt: 0,
  placedGenerators: /** @type {Set<string>} */ (new Set()),
};

function vehicle(level) {
  return CHAIN[level - 1];
}

function generatorById(id) {
  return GENERATORS.find((g) => g.id === id);
}

function unlockedGenerators() {
  return GENERATORS.filter((g) => g.unlockLandmark <= state.unlockedLandmark);
}

function isGeneratorCell(cell) {
  return !!(cell && cell.genId);
}

function isItemCell(cell) {
  return !!(cell && cell.level && !cell.genId);
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove("show");
  }, 2200);
}

function showRewardPop(reward, bonus) {
  const el = document.getElementById("reward-pop");
  el.textContent = bonus ? `✈️ +${reward} 旅費！限時加成！` : `✈️ +${reward} 旅費！`;
  el.hidden = false;
  el.classList.add("show");
  clearTimeout(showRewardPop._t);
  showRewardPop._t = setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => {
      el.hidden = true;
    }, 250);
  }, 900);
}

function emptyCells() {
  const out = [];
  for (let i = 0; i < state.board.length; i++) {
    if (!state.board[i]) out.push(i);
  }
  return out;
}

function countByLevel() {
  const counts = {};
  for (const cell of state.board) {
    if (!isItemCell(cell)) continue;
    counts[cell.level] = (counts[cell.level] || 0) + 1;
  }
  return counts;
}

function canFulfill(needs) {
  const counts = countByLevel();
  return needs.every((n) => (counts[n.level] || 0) >= n.count);
}

/** 0–1 progress toward fulfilling needs */
function orderProgress(needs) {
  const counts = countByLevel();
  let needTotal = 0;
  let have = 0;
  for (const n of needs) {
    needTotal += n.count;
    have += Math.min(n.count, counts[n.level] || 0);
  }
  return needTotal ? have / needTotal : 0;
}

/** Levels currently needed by any active order (for green checkmarks). */
function neededLevels() {
  const set = new Set();
  for (const order of state.orders) {
    for (const n of order.needs) set.add(n.level);
  }
  return set;
}

function placeItem(level, preferIndex) {
  if (preferIndex != null && !state.board[preferIndex]) {
    state.board[preferIndex] = { level, uid: state.nextUid++ };
    return preferIndex;
  }
  const empties = emptyCells();
  if (!empties.length) return -1;
  const idx = empties[Math.floor(Math.random() * empties.length)];
  state.board[idx] = { level, uid: state.nextUid++ };
  return idx;
}

function placeGeneratorOnBoard(gen) {
  if (state.placedGenerators.has(gen.id)) return;
  let slot = gen.boardSlot;
  // If slot occupied by item, move item elsewhere
  if (state.board[slot] && isItemCell(state.board[slot])) {
    const item = state.board[slot];
    state.board[slot] = null;
    const empties = emptyCells().filter((i) => i !== slot);
    if (empties.length) {
      const dest = empties[Math.floor(Math.random() * empties.length)];
      state.board[dest] = item;
    }
  } else if (state.board[slot] && isGeneratorCell(state.board[slot])) {
    // find nearest empty in bottom rows
    const empties = emptyCells();
    if (!empties.length) return;
    slot = empties[empties.length - 1];
  }
  state.board[slot] = { genId: gen.id, uid: state.nextUid++ };
  state.placedGenerators.add(gen.id);
}

function syncGeneratorsToBoard() {
  for (const gen of unlockedGenerators()) {
    placeGeneratorOnBoard(gen);
  }
}

function faceForOrder(order) {
  if (order._face) return order._face;
  let h = 0;
  for (let i = 0; i < order.id.length; i++) h = (h + order.id.charCodeAt(i) * (i + 1)) % CUSTOMER_ASSETS.length;
  order._face = CUSTOMER_ASSETS[h];
  return order._face;
}

function vehicleIconHtml(level, className) {
  const v = vehicle(level);
  const cls = className ? ` class="${className}"` : "";
  return `<img${cls} src="${v.icon}" alt="${v.name}" draggable="false" />`;
}

function generatorCost() {
  return state.boostOn ? CONFIG.BOOST_COST : CONFIG.GENERATOR_COST;
}

function pickFromTable(table) {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [level, weight] of table) {
    r -= weight;
    if (r <= 0) return level;
  }
  return table[table.length - 1][0];
}

function spawnLevelFor(gen) {
  const table = state.boostOn ? gen.boostTable : gen.spawnTable;
  return pickFromTable(table);
}

/** Highest level currently spawnable (for easy-order bias) */
function maxComfortLevel() {
  let max = 1;
  for (const g of unlockedGenerators()) {
    const table = state.boostOn ? g.boostTable : g.spawnTable;
    for (const [lv] of table) max = Math.max(max, lv);
  }
  // one merge up from max spawn is still "session-reachable"
  return Math.min(CHAIN.length, max + 1);
}

/* ============================================================
   Orders + pacing
   ============================================================ */
function availablePool() {
  return ORDER_POOL.filter((o) => o.poolFrom <= state.unlockedLandmark);
}

function orderMaxLevel(order) {
  return Math.max(...order.needs.map((n) => n.level));
}

function sharedLevelScore(order, againstOrders) {
  const needSet = new Set();
  for (const o of againstOrders) {
    for (const n of o.needs) needSet.add(n.level);
  }
  if (!needSet.size) return 0;
  let score = 0;
  for (const n of order.needs) {
    if (needSet.has(n.level)) score += 2;
    // adjacent levels also help pacing ("就差少少" conceptual overlap)
    if (needSet.has(n.level - 1) || needSet.has(n.level + 1)) score += 1;
  }
  return score;
}

function pickOrder(difficulty, excludeIds, preferOverlapWith) {
  const pool = availablePool().filter((o) => o.difficulty === difficulty && !excludeIds.has(o.id));
  let candidates = pool.filter((o) => !state.usedOrderIds.has(o.id));
  if (!candidates.length) candidates = pool.slice();
  if (!candidates.length) {
    const any = availablePool().filter((o) => o.difficulty === difficulty);
    if (!any.length) return null;
    return { ...any[Math.floor(Math.random() * any.length)] };
  }

  const comfort = maxComfortLevel();

  // Score candidates: easy prefers session-reachable; mid/hard prefer overlap
  const scored = candidates.map((o) => {
    let score = Math.random() * 0.5;
    if (difficulty === "easy") {
      const maxLv = orderMaxLevel(o);
      if (maxLv <= comfort) score += 5;
      else if (maxLv <= comfort + 1) score += 2;
      else score -= 3;
      // Prefer low total count for "one session"
      const totalNeed = o.needs.reduce((s, n) => s + n.count, 0);
      score += Math.max(0, 3 - totalNeed);
    } else if (difficulty === "mid") {
      score += sharedLevelScore(o, preferOverlapWith || []) * 1.5;
      const maxLv = orderMaxLevel(o);
      if (maxLv <= comfort + 2) score += 1;
    } else {
      // hard: long goal — prefer higher levels but still some overlap
      score += sharedLevelScore(o, preferOverlapWith || []);
      score += orderMaxLevel(o) * 0.15;
    }
    return { o, score };
  });
  scored.sort((a, b) => b.score - a.score);
  // Soft-max: pick from top 3
  const top = scored.slice(0, Math.min(3, scored.length));
  const pick = top[Math.floor(Math.random() * top.length)].o;
  return { ...pick };
}

function refillOrders() {
  const target = [
    { difficulty: "easy", count: 1 },
    { difficulty: "mid", count: 2 },
    { difficulty: "hard", count: 1 },
  ];
  const current = state.orders.slice();
  const byDiff = { easy: [], mid: [], hard: [] };
  for (const o of current) byDiff[o.difficulty].push(o);

  const next = [];
  const exclude = new Set();

  // Fill easy first so mid/hard can overlap with it
  for (const diff of ["easy", "mid", "hard"]) {
    const need = target.find((t) => t.difficulty === diff).count;
    let kept = byDiff[diff].filter((o) => o.poolFrom <= state.unlockedLandmark);
    kept = kept.slice(0, need);
    for (const o of kept) {
      next.push(o);
      exclude.add(o.id);
    }
    while (kept.length < need) {
      if (diff === "hard" && state.unlockedLandmark >= 5 && !state.won && !next.some((x) => x.isFinale)) {
        const finale = ORDER_POOL.find((o) => o.isFinale);
        if (finale && !exclude.has(finale.id)) {
          next.push({ ...finale });
          exclude.add(finale.id);
          kept.push(finale);
          continue;
        }
      }
      const picked = pickOrder(diff, exclude, next);
      if (!picked) break;
      next.push(picked);
      exclude.add(picked.id);
      kept.push(picked);
    }
  }
  state.orders = next;
  ensureOrderInstances();
  maybeAssignTimedBonus();
}

function maybeAssignTimedBonus() {
  // Keep existing bonus if still valid and order still present
  if (state.bonusEndsAt > Date.now() && state.orders.some((o) => o._inst === state.bonusOrderInst)) {
    return;
  }
  state.bonusOrderInst = null;
  state.bonusEndsAt = 0;

  // Prefer a mid order for short limited-time bonus
  const mids = state.orders.filter((o) => o.difficulty === "mid" && !o.isFinale);
  const pool = mids.length ? mids : state.orders.filter((o) => o.difficulty === "easy");
  if (!pool.length) return;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  state.bonusOrderInst = pick._inst;
  state.bonusEndsAt = Date.now() + CONFIG.BONUS_DURATION_MS;
}

function bonusActiveFor(order) {
  return (
    order &&
    order._inst === state.bonusOrderInst &&
    state.bonusEndsAt > Date.now()
  );
}

function bonusTimeLeftMs() {
  return Math.max(0, state.bonusEndsAt - Date.now());
}

/** Collect board indices that will be consumed for this order. */
function pickConsumedIndices(needs) {
  const indices = [];
  const used = new Set();
  for (const need of needs) {
    let left = need.count;
    for (let i = 0; i < state.board.length && left > 0; i++) {
      if (used.has(i)) continue;
      if (isItemCell(state.board[i]) && state.board[i].level === need.level) {
        indices.push(i);
        used.add(i);
        left--;
      }
    }
  }
  return indices;
}

/**
 * P3: animate items flying from board cells into a customer bubble.
 */
function animateFlyToCustomer(boardIndices, customerEl) {
  return new Promise((resolve) => {
    const layer = document.getElementById("fly-layer");
    const bubble = customerEl.querySelector(".bubble");
    const targetEl = bubble || customerEl;
    const targetRect = targetEl.getBoundingClientRect();
    const tx = targetRect.left + targetRect.width / 2 - 20;
    const ty = targetRect.top + targetRect.height / 2 - 20;

    const flyers = [];
    for (const idx of boardIndices) {
      const cellEl = document.querySelector(`.cell[data-index="${idx}"] .item`);
      if (!cellEl) continue;
      const rect = cellEl.getBoundingClientRect();
      const level = state.board[idx] && state.board[idx].level ? state.board[idx].level : 1;
      const v = vehicle(level);

      const flyer = document.createElement("div");
      flyer.className = "fly-item";
      flyer.innerHTML = `<img src="${v.icon}" alt="" />`;
      flyer.style.left = rect.left + "px";
      flyer.style.top = rect.top + "px";
      flyer.style.width = Math.max(28, rect.width) + "px";
      flyer.style.height = Math.max(28, rect.height) + "px";
      layer.appendChild(flyer);
      flyers.push({ flyer, tx, ty, sx: rect.left, sy: rect.top });

      cellEl.style.opacity = "0";
    }

    if (!flyers.length) {
      resolve();
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const f of flyers) {
          const dx = f.tx - f.sx;
          const dy = f.ty - f.sy;
          f.flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.35)`;
          f.flyer.style.opacity = "0.15";
          f.flyer.classList.add("flying");
        }
      });
    });

    setTimeout(() => {
      for (const f of flyers) f.flyer.remove();
      resolve();
    }, CONFIG.FLY_MS);
  });
}

async function claimOrder(instKey) {
  if (state.claiming) return;

  let order = null;
  let oi = -1;
  for (let i = 0; i < state.orders.length; i++) {
    if (state.orders[i]._inst === instKey) {
      order = state.orders[i];
      oi = i;
      break;
    }
  }
  if (!order || !canFulfill(order.needs)) return;

  state.claiming = true;
  const consumed = pickConsumedIndices(order.needs);
  const customerEl = document.querySelector(`.customer[data-inst="${instKey}"]`);
  const hadBonus = bonusActiveFor(order);

  if (customerEl) {
    customerEl.classList.add("ready");
  }

  if (customerEl && consumed.length) {
    await animateFlyToCustomer(consumed, customerEl);
  }

  for (const i of consumed) {
    state.board[i] = null;
  }

  let reward = order.reward;
  if (hadBonus) {
    reward = Math.round(reward * CONFIG.BONUS_MULT);
    state.bonusOrderInst = null;
    state.bonusEndsAt = 0;
  }

  state.travel += reward;
  state.usedOrderIds.add(order.id);
  showToast(hadBonus ? `限時加成完成！+${reward} 旅費 ✈️` : `訂單完成！+${reward} 旅費 ✈️`);
  showRewardPop(reward, hadBonus);

  const wasFinale = order.isFinale;
  state.orders.splice(oi, 1);
  checkLandmarkUnlocks();
  refillOrders();

  if (wasFinale && state.unlockedLandmark >= 5) {
    state.won = true;
    document.getElementById("win-overlay").hidden = false;
  }

  state.claiming = false;
  render();
}

function ensureOrderInstances() {
  for (const o of state.orders) {
    if (!o._inst) o._inst = o.id + "_" + Math.random().toString(36).slice(2, 8);
  }
}

function nextLandmark() {
  if (state.unlockedLandmark >= LANDMARKS.length - 1) return null;
  return LANDMARKS[state.unlockedLandmark + 1];
}

function canAffordUnlock() {
  const n = nextLandmark();
  return !!(n && state.travel >= n.unlockCost);
}

function canAffordUpgrade() {
  const i = state.unlockedLandmark;
  const lm = LANDMARKS[i];
  return state.decorLevels[i] === 1 && state.travel >= lm.decorCost;
}

/** Soft nudge after earning travel — spend happens in decorate UI */
function checkLandmarkUnlocks() {
  const n = nextLandmark();
  if (n && state.travel >= n.unlockCost) {
    // no auto-unlock; hint only (avoid spam every order)
  }
  if (canAffordUpgrade()) {
    // hint via landmark pip / decorate button state on render
  }
}

function unlockNextLandmark() {
  const n = nextLandmark();
  if (!n) {
    showToast("所有景點都解鎖晒喇！");
    return false;
  }
  if (state.travel < n.unlockCost) {
    showToast(`旅費唔夠解鎖 ${n.name}（要 ${n.unlockCost}✈️）`);
    return false;
  }
  state.travel -= n.unlockCost;
  state.unlockedLandmark++;
  state.decorLevels[state.unlockedLandmark] = 1;
  const lm = LANDMARKS[state.unlockedLandmark];
  showToast(`護照蓋章！${lm.emoji} ${lm.name}（-${n.unlockCost}✈️）`);
  for (const gen of GENERATORS) {
    if (gen.unlockLandmark === state.unlockedLandmark) {
      placeGeneratorOnBoard(gen);
      showToast(`解鎖生產器：${gen.name}！`);
    }
  }
  refillOrders();
  flashSceneUpgrade();
  render();
  updateDecorateModal();
  return true;
}

function upgradeCurrentLandmark() {
  const i = state.unlockedLandmark;
  const lm = LANDMARKS[i];
  if (state.decorLevels[i] >= 2) {
    showToast(`${lm.name} 已經裝修好晒！`);
    return false;
  }
  if (state.decorLevels[i] < 1) {
    showToast("要先解鎖呢個景點");
    return false;
  }
  if (state.travel < lm.decorCost) {
    showToast(`旅費唔夠裝修（要 ${lm.decorCost}✈️）`);
    return false;
  }
  state.travel -= lm.decorCost;
  state.decorLevels[i] = 2;
  showToast(`裝修完成！${lm.emoji} ${lm.name} 亮起（-${lm.decorCost}✈️）`);
  flashSceneUpgrade();
  render();
  updateDecorateModal();
  return true;
}

function flashSceneUpgrade() {
  const scene = document.getElementById("landmark-scene");
  if (!scene) return;
  scene.classList.remove("flash-upgrade");
  void scene.offsetWidth;
  scene.classList.add("flash-upgrade");
}

function renderLandmarkScene() {
  const scene = document.getElementById("landmark-scene");
  if (!scene) return;
  const i = state.unlockedLandmark;
  const lm = LANDMARKS[i];
  const stage = Math.max(1, state.decorLevels[i] || 1);
  scene.dataset.id = lm.id;
  scene.dataset.stage = String(stage);
  const before = document.getElementById("scene-before");
  const after = document.getElementById("scene-after");
  if (before) before.style.backgroundImage = `url("${lm.before}")`;
  if (after) after.style.backgroundImage = `url("${lm.after}")`;
}

/* ============================================================
   Merge / Generator
   ============================================================ */
function tryMerge(fromIdx, toIdx) {
  if (fromIdx === toIdx) return false;
  const a = state.board[fromIdx];
  const b = state.board[toIdx];
  if (isGeneratorCell(a) || isGeneratorCell(b)) return false;
  if (!a || !b) {
    if (isItemCell(a) && !b) {
      state.board[toIdx] = a;
      state.board[fromIdx] = null;
      return true;
    }
    return false;
  }
  if (!isItemCell(a) || !isItemCell(b)) return false;
  if (a.level !== b.level) return false;
  if (a.level >= CHAIN.length) {
    showToast("已經係最高級客機喇！");
    return false;
  }
  const nextLevel = a.level + 1;
  state.board[fromIdx] = null;
  state.board[toIdx] = { level: nextLevel, uid: state.nextUid++ };
  const v = vehicle(nextLevel);
  showToast(`合併成功！${v.emoji} ${v.name}`);
  return true;
}

function tapGenerator(genId) {
  const gen = generatorById(genId);
  if (!gen) return;
  if (gen.unlockLandmark > state.unlockedLandmark) {
    const lm = LANDMARKS[gen.unlockLandmark];
    showToast(`解鎖 ${lm.name} 先開到${gen.name}`);
    return;
  }
  const cost = generatorCost();
  if (state.energy < cost) {
    showToast(state.boostOn ? "渦輪要 2⚡！能量唔夠" : "能量唔夠！等再生或者撳 ⊕");
    return;
  }
  if (!emptyCells().length) {
    showToast("棋盤滿晒！先合併或者交訂單騰位。");
    return;
  }
  state.energy -= cost;
  const level = spawnLevelFor(gen);
  placeItem(level);
  const v = vehicle(level);
  if (state.boostOn) showToast(`${gen.name}（渦輪）→ ${v.emoji} ${v.name}`);
  else showToast(`${gen.name} → ${v.emoji} ${v.name}`);
  render();
}

function toggleBoost() {
  state.boostOn = !state.boostOn;
  renderDock();
  renderResources();
  showToast(state.boostOn ? "🚀 渦輪開啟！生產器耗 2⚡" : "渦輪關閉");
}

/* ============================================================
   Energy regen timer (P2: visible m:ss countdown)
   ============================================================ */
function formatRegen(msLeft) {
  const totalSec = Math.max(0, Math.ceil(msLeft / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function tickEnergy() {
  const now = Date.now();
  const dt = now - state.lastTick;
  state.lastTick = now;

  if (state.energy >= CONFIG.ENERGY_MAX) {
    state.regenElapsedMs = 0;
    updateEnergyTimerUI();
  } else {
    state.regenElapsedMs += dt;
    while (state.regenElapsedMs >= CONFIG.ENERGY_REGEN_MS && state.energy < CONFIG.ENERGY_MAX) {
      state.regenElapsedMs -= CONFIG.ENERGY_REGEN_MS;
      state.energy += 1;
    }
    if (state.energy >= CONFIG.ENERGY_MAX) state.regenElapsedMs = 0;
    updateEnergyTimerUI();
    renderResources();
  }

  // Expire / refresh timed bonus UI
  if (state.bonusOrderInst && state.bonusEndsAt <= now) {
    state.bonusOrderInst = null;
    state.bonusEndsAt = 0;
    maybeAssignTimedBonus();
    renderOrders();
  } else if (state.bonusOrderInst) {
    updateBonusTimers();
  }
}

function updateEnergyTimerUI() {
  const el = document.getElementById("energy-timer");
  if (state.energy >= CONFIG.ENERGY_MAX) {
    el.textContent = "已滿";
    el.classList.add("is-full");
  } else {
    const left = CONFIG.ENERGY_REGEN_MS - state.regenElapsedMs;
    el.textContent = formatRegen(left);
    el.classList.remove("is-full");
  }
}

function updateBonusTimers() {
  const left = bonusTimeLeftMs();
  document.querySelectorAll(".bubble-bonus-timer").forEach((el) => {
    el.textContent = formatRegen(left);
  });
}

/* ============================================================
   Render
   ============================================================ */
function renderLandmarks() {
  const root = document.getElementById("landmarks");
  root.innerHTML = "";
  const next = nextLandmark();
  LANDMARKS.forEach((lm, i) => {
    const div = document.createElement("div");
    div.className = "landmark";
    const stage = state.decorLevels[i] || 0;
    if (stage >= 1) div.classList.add("unlocked");
    if (stage >= 2) div.classList.add("upgraded");
    if (i === state.unlockedLandmark) div.classList.add("current");
    if (next && i === state.unlockedLandmark + 1 && state.travel >= next.unlockCost) {
      div.classList.add("can-unlock");
    }
    if (i === state.unlockedLandmark && canAffordUpgrade()) {
      div.classList.add("can-upgrade");
    }
    const costLabel =
      i === 0
        ? "出發"
        : stage >= 1
          ? stage >= 2
            ? "已裝修"
            : `裝修 ${lm.decorCost}✈️`
          : `解鎖 ${lm.unlockCost}✈️`;
    div.title = `${lm.name} · ${costLabel}`;
    div.innerHTML = `
      <div class="stamp">${lm.emoji}</div>
      <div class="lm-name">${lm.name}</div>
      <div class="lm-cost">${costLabel}</div>
      <span class="decor-pip" aria-hidden="true"></span>
    `;
    div.addEventListener("click", () => openDecorateModal());
    root.appendChild(div);
  });
  renderLandmarkScene();
  const btn = document.getElementById("btn-decorate");
  if (btn) {
    btn.classList.toggle("pulse", canAffordUnlock() || canAffordUpgrade());
  }
}

function renderDock() {
  const dock = document.getElementById("board-dock");
  const cost = generatorCost();
  const gens = unlockedGenerators();
  let html = "";
  for (const gen of gens) {
    const disabled = state.energy < cost ? "disabled" : "";
    html += `
      <button type="button" class="dock-btn gen gen-${gen.id}" data-gen="${gen.id}" title="${gen.name}" ${disabled}>
        <img class="dock-ico" src="${gen.icon}" alt="" width="36" height="36" />
        <span class="cost-pill">⚡${cost}</span>
        <span class="dock-label">${gen.name}</span>
      </button>
    `;
  }
  // Locked preview for next generator
  const nextLocked = GENERATORS.find((g) => g.unlockLandmark > state.unlockedLandmark);
  if (nextLocked) {
    const lm = LANDMARKS[nextLocked.unlockLandmark];
    html += `
      <button type="button" class="dock-btn gen locked" data-gen-locked="${nextLocked.id}" title="解鎖 ${lm.name} 後開${nextLocked.name}">
        <img class="dock-ico" src="${nextLocked.icon}" alt="" width="36" height="36" />
        <span class="cost-pill lock-pill">🔒</span>
        <span class="dock-label">${nextLocked.name}</span>
      </button>
    `;
  }
  html += `
    <button type="button" id="btn-boost" class="dock-btn boost" aria-pressed="${state.boostOn ? "true" : "false"}" title="渦輪：耗雙倍能量，出更高階">
      <img class="dock-ico" src="assets/boost.svg" alt="" width="36" height="36" />
      <span id="boost-hint" class="boost-badge">${state.boostOn ? "x2" : "x1"}</span>
    </button>
  `;
  dock.innerHTML = html;

  dock.querySelectorAll(".dock-btn.gen[data-gen]").forEach((btn) => {
    btn.addEventListener("click", () => tapGenerator(btn.dataset.gen));
  });
  dock.querySelectorAll(".dock-btn.gen.locked").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = generatorById(btn.dataset.genLocked);
      if (g) {
        const lm = LANDMARKS[g.unlockLandmark];
        showToast(`解鎖 ${lm.name} 先開到${g.name}`);
      }
    });
  });
  const boostBtn = document.getElementById("btn-boost");
  if (boostBtn) boostBtn.addEventListener("click", toggleBoost);
}

/** P0 + P3: customers with bubbles; green check when completable; almost + timed bonus */
function renderOrders() {
  ensureOrderInstances();
  const root = document.getElementById("orders");
  root.innerHTML = "";
  const diffLabel = { easy: "易", mid: "中", hard: "難" };
  const counts = countByLevel();

  for (const order of state.orders) {
    const ready = canFulfill(order.needs);
    const progress = orderProgress(order.needs);
    const almost = !ready && progress >= CONFIG.ALMOST_THRESHOLD;
    const bonus = bonusActiveFor(order);

    const cust = document.createElement("div");
    cust.className =
      "customer" + (ready ? " ready" : "") + (almost ? " almost" : "") + (bonus ? " has-bonus" : "");
    cust.dataset.inst = order._inst;
    cust.title =
      order.title +
      (order.isFinale ? " 🏆" : "") +
      (almost ? " · 就差少少！" : "") +
      (bonus ? " · 限時加成中" : "");

    const face = faceForOrder(order);

    const bubbleItems = [];
    for (const n of order.needs) {
      const v = vehicle(n.level);
      const have = counts[n.level] || 0;
      for (let c = 0; c < n.count; c++) {
        const met = have > c;
        bubbleItems.push(
          `<span class="bubble-item${met ? " met" : ""}" title="${v.name}">${vehicleIconHtml(n.level)}</span>`
        );
      }
    }

    const bonusHtml = bonus
      ? `<span class="bubble-bonus"><span class="bubble-bonus-timer">${formatRegen(bonusTimeLeftMs())}</span> +${Math.round((CONFIG.BONUS_MULT - 1) * 100)}%</span>`
      : "";
    const almostHtml = almost ? `<span class="almost-hint">就差少少</span>` : "";

    cust.innerHTML = `
      <span class="customer-diff ${order.difficulty}">${diffLabel[order.difficulty]}</span>
      <div class="bubble">
        <span class="bubble-ready-check" aria-hidden="true">✓</span>
        ${bubbleItems.join("")}
        ${bonusHtml}
      </div>
      <div class="customer-face"><img src="${face}" alt="" draggable="false" /></div>
      <div class="customer-reward">✈️${bonus ? Math.round(order.reward * CONFIG.BONUS_MULT) : order.reward}</div>
      ${almostHtml}
    `;

    cust.addEventListener("click", () => {
      if (state.claiming) return;
      if (canFulfill(order.needs)) {
        claimOrder(order._inst);
      } else {
        const pct = Math.round(orderProgress(order.needs) * 100);
        showToast(
          almost
            ? `${order.title}：就差少少（${pct}%）！`
            : `${order.title}：仲差載具（${pct}%）`
        );
        state.selectedIndex = null;
        document.querySelectorAll(".cell.selected").forEach((c) => c.classList.remove("selected"));
        expandDetail(
          null,
          `<strong>${order.title}</strong>${bonus ? " · <span style='color:#e65100'>限時加成</span>" : ""}<br/>需要：` +
            order.needs.map((n) => `${vehicle(n.level).name}×${n.count}`).join("、") +
            (almost ? `<br/><span style="color:#ef6c00">進度 ${pct}% — 就差少少！</span>` : "")
        );
      }
    });

    root.appendChild(cust);
  }
}

function collapseDetail() {
  const strip = document.getElementById("detail-strip");
  strip.dataset.expanded = "false";
  const thumb = document.getElementById("detail-thumb");
  thumb.hidden = true;
  thumb.innerHTML = "";
  const text = document.getElementById("detail-text");
  text.className = "detail-hint";
  text.textContent = "點選棋盤物件睇詳情";
}

function expandDetail(levelOrNull, html, genIcon) {
  const strip = document.getElementById("detail-strip");
  strip.dataset.expanded = "true";
  const thumb = document.getElementById("detail-thumb");
  const text = document.getElementById("detail-text");
  text.className = "";
  text.innerHTML = html;
  if (levelOrNull != null) {
    const v = vehicle(levelOrNull);
    thumb.hidden = false;
    thumb.className = "detail-thumb item lv-" + levelOrNull;
    thumb.innerHTML = `<img src="${v.icon}" alt="${v.name}" />`;
  } else if (genIcon) {
    thumb.hidden = false;
    thumb.className = "detail-thumb gen-thumb";
    thumb.innerHTML = `<img src="${genIcon}" alt="" />`;
  } else {
    thumb.hidden = true;
    thumb.innerHTML = "";
  }
}

function updateDetailFromSelection() {
  if (state.selectedIndex == null || !state.board[state.selectedIndex]) {
    collapseDetail();
    return;
  }
  const cell = state.board[state.selectedIndex];
  if (isGeneratorCell(cell)) {
    const gen = generatorById(cell.genId);
    const table = state.boostOn ? gen.boostTable : gen.spawnTable;
    const range = table.map(([lv]) => vehicle(lv).name).join("／");
    expandDetail(
      null,
      `<strong>${gen.name}</strong>（生產器）<br/>消耗 ⚡${generatorCost()} 產出：${range}<br/><span style="color:var(--muted);font-weight:600">撳棋盤上嘅${gen.name}或底部掣產出</span>`,
      gen.icon
    );
    return;
  }
  const item = cell;
  const v = vehicle(item.level);
  const next = item.level < CHAIN.length ? vehicle(item.level + 1) : null;
  let html = `<strong>${v.name}</strong>（Lv${item.level}）`;
  if (next) html += `<br/>合併 → ${next.name}`;
  else html += `<br/>已係最高階`;
  html += `<br/><span style="color:var(--muted);font-weight:600">用途：交旅客訂單／繼續進化</span>`;
  expandDetail(item.level, html);
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  const total = CONFIG.COLS * CONFIG.ROWS;
  const needed = neededLevels();

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = String(i);
    if (state.selectedIndex === i) cell.classList.add("selected");

    const item = state.board[i];
    if (isGeneratorCell(item)) {
      const gen = generatorById(item.genId);
      cell.classList.add("has-gen");
      const el = document.createElement("div");
      el.className = "item generator-tile gen-" + gen.id;
      el.dataset.index = String(i);
      el.dataset.gen = gen.id;
      el.title = `${gen.name}（撳一下產出）`;
      el.innerHTML = `<img class="ico" src="${gen.icon}" alt="${gen.name}" draggable="false" /><span class="lv gen-lv">${gen.name}</span>`;
      cell.appendChild(el);
    } else if (isItemCell(item)) {
      const v = vehicle(item.level);
      const el = document.createElement("div");
      el.className = "item lv-" + item.level + (needed.has(item.level) ? " needed" : "");
      el.draggable = true;
      el.dataset.index = String(i);
      el.title = `${v.name} (Lv${item.level})`;
      el.innerHTML = `<img class="ico" src="${v.icon}" alt="${v.name}" draggable="false" /><span class="lv">Lv${item.level}</span>`;
      cell.appendChild(el);
    }
    boardEl.appendChild(cell);
  }
  wireBoardEvents(boardEl);
  updateDetailFromSelection();
}

function wireBoardEvents(boardEl) {
  boardEl.querySelectorAll(".item:not(.generator-tile)").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      const dragFrom = Number(el.dataset.index);
      e.dataTransfer.setData("text/plain", String(dragFrom));
      e.dataTransfer.effectAllowed = "move";
      state.selectedIndex = null;
    });
    el.addEventListener("dragend", () => {
      boardEl.querySelectorAll(".cell").forEach((c) => c.classList.remove("drag-over"));
    });
  });

  boardEl.querySelectorAll(".cell").forEach((cell) => {
    const idx = Number(cell.dataset.index);
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (isGeneratorCell(state.board[idx])) return;
      cell.classList.add("drag-over");
    });
    cell.addEventListener("dragleave", () => cell.classList.remove("drag-over"));
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      cell.classList.remove("drag-over");
      if (isGeneratorCell(state.board[idx])) return;
      const from = Number(e.dataTransfer.getData("text/plain"));
      if (Number.isNaN(from)) return;
      if (tryMerge(from, idx)) {
        state.selectedIndex = null;
        render();
        flashMerge(idx);
      }
    });

    cell.addEventListener("click", () => {
      if (state.claiming) return;
      const boardCell = state.board[idx];

      // Tap generator on board
      if (isGeneratorCell(boardCell)) {
        state.selectedIndex = idx;
        renderBoard();
        tapGenerator(boardCell.genId);
        return;
      }

      if (!boardCell) {
        if (state.selectedIndex != null && isItemCell(state.board[state.selectedIndex])) {
          if (tryMerge(state.selectedIndex, idx)) {
            state.selectedIndex = null;
            render();
            flashMerge(idx);
            return;
          }
        }
        state.selectedIndex = null;
        renderBoard();
        return;
      }
      if (state.selectedIndex == null) {
        state.selectedIndex = idx;
        renderBoard();
        return;
      }
      if (state.selectedIndex === idx) {
        state.selectedIndex = null;
        renderBoard();
        return;
      }
      if (tryMerge(state.selectedIndex, idx)) {
        state.selectedIndex = null;
        render();
        flashMerge(idx);
      } else {
        state.selectedIndex = idx;
        renderBoard();
      }
    });
  });
}

function flashMerge(idx) {
  requestAnimationFrame(() => {
    const el = document.querySelector(`.cell[data-index="${idx}"] .item`);
    if (el) el.classList.add("merging");
  });
}

function renderResources() {
  document.getElementById("energy-text").textContent = String(state.energy);
  document.getElementById("travel-text").textContent = String(state.travel);
  const gemsEl = document.getElementById("gems-text");
  if (gemsEl) gemsEl.textContent = String(state.gems);
  // Refresh dock disable state without full rebuild if possible
  const cost = generatorCost();
  document.querySelectorAll(".dock-btn.gen[data-gen]").forEach((btn) => {
    btn.disabled = state.energy < cost;
    const pill = btn.querySelector(".cost-pill");
    if (pill && !pill.classList.contains("lock-pill")) pill.textContent = `⚡${cost}`;
  });
}

function openDecorateModal() {
  const modal = document.getElementById("decorate-modal");
  if (!modal) return;
  modal.hidden = false;
  updateDecorateModal();
}

function closeDecorateModal() {
  const modal = document.getElementById("decorate-modal");
  if (modal) modal.hidden = true;
}

function updateDecorateModal() {
  const i = state.unlockedLandmark;
  const lm = LANDMARKS[i];
  const stage = state.decorLevels[i] || 1;
  const preview = document.getElementById("decorate-preview");
  if (preview) {
    preview.innerHTML = `
      <div class="scene-layer scene-before" style="background-image:url('${lm.before}');opacity:${stage >= 2 ? 0 : 1}"></div>
      <div class="scene-layer scene-after" style="background-image:url('${lm.after}');opacity:${stage >= 2 ? 1 : 0}"></div>
    `;
  }
  const info = document.getElementById("decorate-info");
  const stageLabel = stage >= 2 ? "已裝修（after 亮燈）" : "未裝修（before 灰調）";
  const next = nextLandmark();
  let nextLine = "已經到最終站埃菲爾鐵塔。";
  if (next) {
    nextLine = `下一站 <strong>${next.emoji} ${next.name}</strong> — 解鎖要 <strong>${next.unlockCost}✈️</strong>`;
  }
  if (info) {
    info.innerHTML = `
      而家景點：<strong>${lm.emoji} ${lm.name}</strong><br/>
      狀態：${stageLabel}<br/>
      裝修費：<strong>${lm.decorCost}✈️</strong>（而家有 ${state.travel}✈️）<br/>
      ${nextLine}
    `;
  }
  const unlockBtn = document.getElementById("btn-unlock-next");
  const upgradeBtn = document.getElementById("btn-upgrade-decor");
  const hint = document.getElementById("decorate-hint");
  if (unlockBtn) {
    if (!next) {
      unlockBtn.disabled = true;
      unlockBtn.textContent = "已全部解鎖";
    } else {
      unlockBtn.disabled = state.travel < next.unlockCost;
      unlockBtn.textContent = `解鎖 ${next.name}（${next.unlockCost}✈️）`;
    }
  }
  if (upgradeBtn) {
    if (stage >= 2) {
      upgradeBtn.disabled = true;
      upgradeBtn.textContent = "已裝修完成";
    } else {
      upgradeBtn.disabled = state.travel < lm.decorCost;
      upgradeBtn.textContent = `裝修亮燈（${lm.decorCost}✈️）`;
    }
  }
  if (hint) {
    if (canAffordUnlock()) hint.textContent = "旅費夠解鎖下一站——撳上面掣花旅費開新景點！";
    else if (canAffordUpgrade()) hint.textContent = "旅費夠裝修——畫面會由灰變靚！";
    else hint.textContent = "交訂單賺旅費，再返嚟裝修／解鎖。";
  }
}

function render() {
  syncGeneratorsToBoard();
  renderResources();
  updateEnergyTimerUI();
  renderLandmarks();
  renderDock();
  renderOrders();
  renderBoard();
}

function initBoard() {
  const total = CONFIG.COLS * CONFIG.ROWS;
  state.board = Array(total).fill(null);
  state.placedGenerators.clear();
  // Place starting items first (avoid generator slots)
  const reserved = new Set(GENERATORS.filter((g) => g.unlockLandmark === 0).map((g) => g.boardSlot));
  for (const s of CONFIG.START_ITEMS) {
    const empties = [];
    for (let i = 0; i < total; i++) {
      if (!state.board[i] && !reserved.has(i)) empties.push(i);
    }
    if (!empties.length) placeItem(s.level);
    else {
      const idx = empties[Math.floor(Math.random() * empties.length)];
      state.board[idx] = { level: s.level, uid: state.nextUid++ };
    }
  }
  syncGeneratorsToBoard();
}

function init() {
  initBoard();
  refillOrders();
  ensureOrderInstances();
  render();

  document.getElementById("btn-energy-debug").addEventListener("click", (e) => {
    e.stopPropagation();
    state.energy = Math.min(CONFIG.ENERGY_MAX, state.energy + 10);
    renderResources();
    updateEnergyTimerUI();
    renderDock();
    showToast("+10 能量 ⚡");
  });
  document.getElementById("btn-travel-plus").addEventListener("click", (e) => {
    e.stopPropagation();
    state.travel += 50;
    renderResources();
    renderLandmarks();
    showToast("+50 旅費（試玩）✈️");
  });
  document.getElementById("btn-gems-plus").addEventListener("click", (e) => {
    e.stopPropagation();
    showToast("商店未實裝");
  });
  document.getElementById("btn-shop").addEventListener("click", () => {
    openDecorateModal();
  });
  document.getElementById("btn-win-close").addEventListener("click", () => {
    document.getElementById("win-overlay").hidden = true;
  });

  const btnDecor = document.getElementById("btn-decorate");
  if (btnDecor) btnDecor.addEventListener("click", openDecorateModal);
  const btnClose = document.getElementById("btn-decorate-close");
  if (btnClose) btnClose.addEventListener("click", closeDecorateModal);
  const btnUnlock = document.getElementById("btn-unlock-next");
  if (btnUnlock) btnUnlock.addEventListener("click", () => unlockNextLandmark());
  const btnUpgrade = document.getElementById("btn-upgrade-decor");
  if (btnUpgrade) btnUpgrade.addEventListener("click", () => upgradeCurrentLandmark());
  const decorModal = document.getElementById("decorate-modal");
  if (decorModal) {
    decorModal.addEventListener("click", (e) => {
      if (e.target === decorModal) closeDecorateModal();
    });
  }

  setInterval(tickEnergy, 250);
}

init();
