/* ============================================================
   環遊合併 — Prototype (Gossip Harbor–inspired UX)
   Balance knobs (tune here)
   ============================================================ */
const CONFIG = {
  COLS: 7,
  ROWS: 8,
  ENERGY_START: 100,
  ENERGY_MAX: 100,
  ENERGY_REGEN_MS: 120000, // +1 every 2 min (Gossip Harbor–like)
  GENERATOR_COST: 1,
  BOOST_COST: 2,
  LV2_SPAWN_CHANCE: 0.18,
  BOOST_LV3_CHANCE: 0.12, // when boost on: mostly Lv2, rare Lv3
  ORDER_SLOTS: 4,
  START_ITEMS: [{ level: 1 }, { level: 1 }, { level: 1 }, { level: 2 }],
};

/** Customer emoji faces for order cards (original, not GH IP) */
const CUSTOMER_FACES = ["🧑", "👩", "🧔", "👱", "👵", "🧒", "👨‍🦱", "👩‍🦰", "🧓", "🙂"];

const CHAIN = [
  { id: "skateboard", name: "滑板", emoji: "🛹" },
  { id: "bicycle", name: "單車", emoji: "🚲" },
  { id: "e_scooter", name: "電動滑板車", emoji: "🛴" },
  { id: "motorcycle", name: "電單車", emoji: "🏍️" },
  { id: "used_car", name: "二手私家車", emoji: "🚗" },
  { id: "van", name: "廂型車", emoji: "🚐" },
  { id: "coach", name: "長途巴士", emoji: "🚌" },
  { id: "train", name: "列車", emoji: "🚆" },
  { id: "ferry", name: "渡輪", emoji: "⛴️" },
  { id: "airliner", name: "客機", emoji: "✈️" },
];

const LANDMARKS = [
  { id: "home", name: "家鄉紀念碑", emoji: "🗿", cost: 0 },
  { id: "torii", name: "日本鳥居", emoji: "⛩️", cost: 80 },
  { id: "pisa", name: "比薩斜塔", emoji: "🏛️", cost: 200 },
  { id: "bigben", name: "大笨鐘", emoji: "🔔", cost: 400 },
  { id: "liberty", name: "自由女神", emoji: "🗽", cost: 700 },
  { id: "eiffel", name: "埃菲爾鐵塔", emoji: "🗼", cost: 1100 },
];

const ORDER_POOL = [
  { id: "o_paper", title: "送報紙哥出門", needs: [{ level: 1, count: 2 }], difficulty: "easy", reward: 8, poolFrom: 0 },
  { id: "o_market", title: "街坊買菜", needs: [{ level: 2, count: 1 }], difficulty: "easy", reward: 10, poolFrom: 0 },
  { id: "o_school", title: "學生返學", needs: [{ level: 2, count: 2 }], difficulty: "mid", reward: 18, poolFrom: 0 },
  { id: "o_delivery", title: "外賣仔趕單", needs: [{ level: 3, count: 1 }], difficulty: "mid", reward: 22, poolFrom: 0 },
  { id: "o_patrol", title: "夜班巡邏", needs: [{ level: 4, count: 1 }], difficulty: "mid", reward: 28, poolFrom: 0 },
  { id: "o_first_trip", title: "第一次出城影相", needs: [{ level: 4, count: 1 }, { level: 2, count: 1 }], difficulty: "hard", reward: 45, poolFrom: 0 },

  { id: "o_torii_easy1", title: "神社外圍散步", needs: [{ level: 2, count: 2 }], difficulty: "easy", reward: 14, poolFrom: 1 },
  { id: "o_torii_easy2", title: "京都短途", needs: [{ level: 3, count: 1 }], difficulty: "easy", reward: 16, poolFrom: 1 },
  { id: "o_torii_mid1", title: "鳥居打卡團", needs: [{ level: 4, count: 1 }], difficulty: "mid", reward: 32, poolFrom: 1 },
  { id: "o_torii_mid2", title: "載遊客去參拜", needs: [{ level: 5, count: 1 }], difficulty: "mid", reward: 40, poolFrom: 1 },
  { id: "o_torii_hard", title: "全家賞櫻出遊", needs: [{ level: 6, count: 1 }], difficulty: "hard", reward: 70, poolFrom: 1 },

  { id: "o_pisa_easy", title: "斜塔廣場散步", needs: [{ level: 3, count: 2 }], difficulty: "easy", reward: 20, poolFrom: 2 },
  { id: "o_pisa_mid1", title: "義大利公路遊", needs: [{ level: 5, count: 1 }], difficulty: "mid", reward: 45, poolFrom: 2 },
  { id: "o_pisa_mid2", title: "雙車接團", needs: [{ level: 5, count: 2 }], difficulty: "mid", reward: 55, poolFrom: 2 },
  { id: "o_pisa_hard", title: "廂型車載全班同學", needs: [{ level: 6, count: 1 }], difficulty: "hard", reward: 85, poolFrom: 2 },

  { id: "o_london_easy", title: "泰晤士河岸短程", needs: [{ level: 5, count: 1 }], difficulty: "easy", reward: 30, poolFrom: 3 },
  { id: "o_london_mid1", title: "倫敦城際巴士", needs: [{ level: 7, count: 1 }], difficulty: "mid", reward: 70, poolFrom: 3 },
  { id: "o_london_mid2", title: "廂型車 + 電單車接駁", needs: [{ level: 6, count: 1 }, { level: 4, count: 1 }], difficulty: "mid", reward: 65, poolFrom: 3 },
  { id: "o_london_hard", title: "乘列車睇大笨鐘", needs: [{ level: 8, count: 1 }], difficulty: "hard", reward: 110, poolFrom: 3 },

  { id: "o_lib_easy", title: "紐約港短程", needs: [{ level: 6, count: 1 }], difficulty: "easy", reward: 40, poolFrom: 4 },
  { id: "o_lib_mid", title: "跨區長途", needs: [{ level: 7, count: 1 }], difficulty: "mid", reward: 80, poolFrom: 4 },
  { id: "o_lib_hard1", title: "列車直達港口", needs: [{ level: 8, count: 1 }], difficulty: "mid", reward: 100, poolFrom: 4 },
  { id: "o_lib_hard2", title: "渡輪睇女神", needs: [{ level: 9, count: 1 }], difficulty: "hard", reward: 140, poolFrom: 4 },

  { id: "o_eiffel_easy", title: "塞納河畔接駁", needs: [{ level: 7, count: 1 }], difficulty: "easy", reward: 50, poolFrom: 5 },
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
  unlockedLandmark: 0,
  board: /** @type {(null|{ level: number, uid: number })[]} */ ([]),
  orders: /** @type {any[]} */ ([]),
  selectedIndex: null,
  won: false,
  usedOrderIds: new Set(),
  nextUid: 1,
  boostOn: false,
  regenElapsedMs: 0,
  lastTick: Date.now(),
};

function vehicle(level) {
  return CHAIN[level - 1];
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
    if (!cell) continue;
    counts[cell.level] = (counts[cell.level] || 0) + 1;
  }
  return counts;
}

function canFulfill(needs) {
  const counts = countByLevel();
  return needs.every((n) => (counts[n.level] || 0) >= n.count);
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

function faceForOrder(order) {
  if (order._face) return order._face;
  let h = 0;
  for (let i = 0; i < order.id.length; i++) h = (h + order.id.charCodeAt(i) * (i + 1)) % CUSTOMER_FACES.length;
  order._face = CUSTOMER_FACES[h];
  return order._face;
}

function generatorCost() {
  return state.boostOn ? CONFIG.BOOST_COST : CONFIG.GENERATOR_COST;
}

function spawnLevel() {
  if (state.boostOn) {
    return Math.random() < CONFIG.BOOST_LV3_CHANCE ? 3 : 2;
  }
  return Math.random() < CONFIG.LV2_SPAWN_CHANCE ? 2 : 1;
}

/* ============================================================
   Orders
   ============================================================ */
function availablePool() {
  return ORDER_POOL.filter((o) => o.poolFrom <= state.unlockedLandmark);
}

function pickOrder(difficulty, excludeIds) {
  const pool = availablePool().filter((o) => o.difficulty === difficulty && !excludeIds.has(o.id));
  let candidates = pool.filter((o) => !state.usedOrderIds.has(o.id));
  if (!candidates.length) candidates = pool;
  if (!candidates.length) {
    const any = availablePool().filter((o) => o.difficulty === difficulty);
    if (!any.length) return null;
    return { ...any[Math.floor(Math.random() * any.length)] };
  }
  return { ...candidates[Math.floor(Math.random() * candidates.length)] };
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
      const picked = pickOrder(diff, exclude);
      if (!picked) break;
      next.push(picked);
      exclude.add(picked.id);
      kept.push(picked);
    }
  }
  state.orders = next;
}

function claimOrder(instKey) {
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

  for (const need of order.needs) {
    let left = need.count;
    for (let i = 0; i < state.board.length && left > 0; i++) {
      if (state.board[i] && state.board[i].level === need.level) {
        state.board[i] = null;
        left--;
      }
    }
  }

  state.travel += order.reward;
  state.usedOrderIds.add(order.id);
  showToast(`訂單完成！+${order.reward} 旅費 ✈️`);

  const wasFinale = order.isFinale;
  state.orders.splice(oi, 1);
  checkLandmarkUnlocks();
  refillOrders();
  ensureOrderInstances();

  if (wasFinale && state.unlockedLandmark >= 5) {
    state.won = true;
    document.getElementById("win-overlay").hidden = false;
  }

  render();
}

function ensureOrderInstances() {
  for (const o of state.orders) {
    if (!o._inst) o._inst = o.id + "_" + Math.random().toString(36).slice(2, 8);
  }
}

function checkLandmarkUnlocks() {
  let changed = false;
  while (
    state.unlockedLandmark < LANDMARKS.length - 1 &&
    state.travel >= LANDMARKS[state.unlockedLandmark + 1].cost
  ) {
    state.unlockedLandmark++;
    changed = true;
    const lm = LANDMARKS[state.unlockedLandmark];
    showToast(`護照蓋章！${lm.emoji} ${lm.name}`);
  }
  if (changed) refillOrders();
}

/* ============================================================
   Merge / Generator
   ============================================================ */
function tryMerge(fromIdx, toIdx) {
  if (fromIdx === toIdx) return false;
  const a = state.board[fromIdx];
  const b = state.board[toIdx];
  if (!a || !b) {
    if (a && !b) {
      state.board[toIdx] = a;
      state.board[fromIdx] = null;
      return true;
    }
    return false;
  }
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

function tapGenerator() {
  const cost = generatorCost();
  if (state.energy < cost) {
    showToast(state.boostOn ? "渦輪要 2⚡！能量唔夠" : "能量唔夠！等再生或者撳 +10");
    return;
  }
  if (!emptyCells().length) {
    showToast("棋盤滿晒！先合併或者交訂單騰位。");
    return;
  }
  state.energy -= cost;
  const level = spawnLevel();
  placeItem(level);
  const v = vehicle(level);
  if (state.boostOn) showToast(`渦輪產出 ${v.emoji} ${v.name}`);
  render();
}

function toggleBoost() {
  state.boostOn = !state.boostOn;
  const btn = document.getElementById("btn-boost");
  btn.setAttribute("aria-pressed", state.boostOn ? "true" : "false");
  document.getElementById("boost-hint").textContent = state.boostOn ? "開啟 · 耗 2⚡ 出更高階" : "關閉";
  updateGenCostBadge();
  renderResources();
  showToast(state.boostOn ? "🚀 渦輪開啟！零件堆耗 2⚡" : "渦輪關閉");
}

function updateGenCostBadge() {
  const badge = document.getElementById("gen-cost-badge");
  if (state.boostOn) {
    badge.textContent = "⚡2";
    badge.className = "cost-badge purple";
  } else {
    badge.textContent = "⚡1";
    badge.className = "cost-badge yellow";
  }
}

/* ============================================================
   Energy regen timer
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
    return;
  }

  state.regenElapsedMs += dt;
  while (state.regenElapsedMs >= CONFIG.ENERGY_REGEN_MS && state.energy < CONFIG.ENERGY_MAX) {
    state.regenElapsedMs -= CONFIG.ENERGY_REGEN_MS;
    state.energy += 1;
  }
  if (state.energy >= CONFIG.ENERGY_MAX) state.regenElapsedMs = 0;
  updateEnergyTimerUI();
  renderResources();
}

function updateEnergyTimerUI() {
  const el = document.getElementById("energy-timer");
  if (state.energy >= CONFIG.ENERGY_MAX) {
    el.textContent = "已滿";
  } else {
    const left = CONFIG.ENERGY_REGEN_MS - state.regenElapsedMs;
    el.textContent = `${formatRegen(left)} +1`;
  }
}

/* ============================================================
   Render
   ============================================================ */
function renderLandmarks() {
  const root = document.getElementById("landmarks");
  root.innerHTML = "";
  LANDMARKS.forEach((lm, i) => {
    const div = document.createElement("div");
    div.className = "landmark";
    if (i <= state.unlockedLandmark) div.classList.add("unlocked");
    if (i === state.unlockedLandmark) div.classList.add("current");
    div.innerHTML = `
      <div class="stamp">${lm.emoji}</div>
      <div class="lm-name">${lm.name}</div>
      <div class="lm-cost">${i === 0 ? "出發" : lm.cost + "✈️"}</div>
    `;
    root.appendChild(div);
  });
}

function renderOrders() {
  ensureOrderInstances();
  const root = document.getElementById("orders");
  root.innerHTML = "";
  const diffLabel = { easy: "易", mid: "中", hard: "難" };
  for (const order of state.orders) {
    const ready = canFulfill(order.needs);
    const card = document.createElement("div");
    card.className = `order-card ${order.difficulty}` + (ready ? " ready" : "");
    const face = faceForOrder(order);
    const reqs = order.needs
      .map((n) => {
        const v = vehicle(n.level);
        const have = countByLevel()[n.level] || 0;
        const met = have >= n.count;
        return `<span class="req${met ? " met" : ""}">${v.emoji}×${n.count}</span>`;
      })
      .join("");
    card.innerHTML = `
      <div class="order-top">
        <div class="customer-face">${face}</div>
        <div class="order-meta">
          <div class="title">${order.title}${order.isFinale ? " 🏆" : ""}</div>
          <span class="diff-chip ${order.difficulty}">${diffLabel[order.difficulty]}</span>
        </div>
      </div>
      <div class="order-reqs">${reqs}</div>
      <div class="order-foot">
        <span class="reward-badge">✈️ ${order.reward}</span>
        <button type="button" class="btn-claim" data-inst="${order._inst}" ${ready ? "" : "disabled"}>交單</button>
      </div>
    `;
    root.appendChild(card);
  }
  root.querySelectorAll(".btn-claim").forEach((btn) => {
    btn.addEventListener("click", () => claimOrder(btn.getAttribute("data-inst")));
  });
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  const total = CONFIG.COLS * CONFIG.ROWS;
  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = String(i);
    if (state.selectedIndex === i) cell.classList.add("selected");

    const item = state.board[i];
    if (item) {
      const v = vehicle(item.level);
      const el = document.createElement("div");
      el.className = "item";
      el.draggable = true;
      el.dataset.index = String(i);
      el.title = `${v.name} (Lv${item.level})`;
      el.innerHTML = `<span>${v.emoji}</span><span class="lv">Lv${item.level}</span>`;
      cell.appendChild(el);
    }
    boardEl.appendChild(cell);
  }
  wireBoardEvents(boardEl);
}

function wireBoardEvents(boardEl) {
  boardEl.querySelectorAll(".item").forEach((el) => {
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
      cell.classList.add("drag-over");
    });
    cell.addEventListener("dragleave", () => cell.classList.remove("drag-over"));
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      cell.classList.remove("drag-over");
      const from = Number(e.dataTransfer.getData("text/plain"));
      if (Number.isNaN(from)) return;
      if (tryMerge(from, idx)) {
        state.selectedIndex = null;
        render();
        flashMerge(idx);
      }
    });

    cell.addEventListener("click", () => {
      if (!state.board[idx]) {
        if (state.selectedIndex != null && state.board[state.selectedIndex]) {
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
  document.getElementById("energy-text").textContent = `${state.energy}/${CONFIG.ENERGY_MAX}`;
  document.getElementById("travel-text").textContent = String(state.travel);
  const gen = document.getElementById("generator");
  gen.disabled = state.energy < generatorCost();
  updateGenCostBadge();
}

function render() {
  renderResources();
  updateEnergyTimerUI();
  renderLandmarks();
  renderOrders();
  renderBoard();
}

function initBoard() {
  const total = CONFIG.COLS * CONFIG.ROWS;
  state.board = Array(total).fill(null);
  for (const s of CONFIG.START_ITEMS) {
    placeItem(s.level);
  }
}

function init() {
  initBoard();
  refillOrders();
  ensureOrderInstances();
  render();

  document.getElementById("generator").addEventListener("click", tapGenerator);
  document.getElementById("btn-boost").addEventListener("click", toggleBoost);
  document.getElementById("btn-energy-debug").addEventListener("click", () => {
    state.energy = Math.min(CONFIG.ENERGY_MAX, state.energy + 10);
    renderResources();
    updateEnergyTimerUI();
    showToast("+10 能量 ⚡");
  });
  document.getElementById("btn-win-close").addEventListener("click", () => {
    document.getElementById("win-overlay").hidden = true;
  });

  setInterval(tickEnergy, 250);
}

init();
