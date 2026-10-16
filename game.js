/* ============================================================
   環遊合併 — Prototype (Travel Town / Gossip Harbor layout DNA)
   P0: customer row + bubbles above heads
   P1: wood board dominates vertical space
   P2: compact icon-chip HUD + energy countdown
   P3: fly-to-customer submit + bubble ready check + reward pop
   P4: collapsed detail strip; gen/boost floating dock
   P5: glossy CSS tiles + original SVG vehicle/customer assets
   ============================================================ */
const CONFIG = {
  COLS: 7,
  ROWS: 8,
  ENERGY_START: 100,
  ENERGY_MAX: 100,
  ENERGY_REGEN_MS: 120000,
  GENERATOR_COST: 1,
  BOOST_COST: 2,
  LV2_SPAWN_CHANCE: 0.18,
  BOOST_LV3_CHANCE: 0.12,
  ORDER_SLOTS: 4,
  START_ITEMS: [{ level: 1 }, { level: 1 }, { level: 1 }, { level: 2 }],
  FLY_MS: 480,
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
  gems: 0,
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
  claiming: false,
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

function showRewardPop(reward) {
  const el = document.getElementById("reward-pop");
  el.textContent = `✈️ +${reward} 旅費！`;
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
    if (!cell) continue;
    counts[cell.level] = (counts[cell.level] || 0) + 1;
  }
  return counts;
}

function canFulfill(needs) {
  const counts = countByLevel();
  return needs.every((n) => (counts[n.level] || 0) >= n.count);
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

/** Collect board indices that will be consumed for this order. */
function pickConsumedIndices(needs) {
  const indices = [];
  const used = new Set();
  for (const need of needs) {
    let left = need.count;
    for (let i = 0; i < state.board.length && left > 0; i++) {
      if (used.has(i)) continue;
      if (state.board[i] && state.board[i].level === need.level) {
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
 * Returns a Promise that resolves when animation finishes.
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
      const level = state.board[idx] ? state.board[idx].level : 1;
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

      // Hide source item during flight
      cellEl.style.opacity = "0";
    }

    if (!flyers.length) {
      resolve();
      return;
    }

    // Force layout then animate
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

  // Flash bubble check before fly
  if (customerEl) {
    customerEl.classList.add("ready");
  }

  if (customerEl && consumed.length) {
    await animateFlyToCustomer(consumed, customerEl);
  }

  // Clear consumed board items
  for (const i of consumed) {
    state.board[i] = null;
  }

  state.travel += order.reward;
  state.usedOrderIds.add(order.id);
  showToast(`訂單完成！+${order.reward} 旅費 ✈️`);
  showRewardPop(order.reward);

  const wasFinale = order.isFinale;
  state.orders.splice(oi, 1);
  checkLandmarkUnlocks();
  refillOrders();
  ensureOrderInstances();

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
    showToast(state.boostOn ? "渦輪要 2⚡！能量唔夠" : "能量唔夠！等再生或者撳 ⊕");
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
  document.getElementById("boost-hint").textContent = state.boostOn ? "x2" : "x1";
  updateGenCostBadge();
  renderResources();
  showToast(state.boostOn ? "🚀 渦輪開啟！零件堆耗 2⚡" : "渦輪關閉");
}

function updateGenCostBadge() {
  const badge = document.getElementById("gen-cost-badge");
  if (state.boostOn) {
    badge.textContent = "⚡2";
  } else {
    badge.textContent = "⚡1";
  }
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
    el.classList.add("is-full");
  } else {
    const left = CONFIG.ENERGY_REGEN_MS - state.regenElapsedMs;
    el.textContent = formatRegen(left);
    el.classList.remove("is-full");
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
    div.title = `${lm.name}${i === 0 ? "（出發）" : " · " + lm.cost + "✈️"}`;
    div.innerHTML = `
      <div class="stamp">${lm.emoji}</div>
      <div class="lm-name">${lm.name}</div>
      <div class="lm-cost">${i === 0 ? "出發" : lm.cost + "✈️"}</div>
    `;
    root.appendChild(div);
  });
}

/** P0 + P3: customers with bubbles; green check when completable */
function renderOrders() {
  ensureOrderInstances();
  const root = document.getElementById("orders");
  root.innerHTML = "";
  const diffLabel = { easy: "易", mid: "中", hard: "難" };
  const counts = countByLevel();

  for (const order of state.orders) {
    const ready = canFulfill(order.needs);
    const cust = document.createElement("div");
    cust.className = "customer" + (ready ? " ready" : "");
    cust.dataset.inst = order._inst;
    cust.title = order.title + (order.isFinale ? " 🏆" : "");

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

    cust.innerHTML = `
      <span class="customer-diff ${order.difficulty}">${diffLabel[order.difficulty]}</span>
      <div class="bubble">
        <span class="bubble-ready-check" aria-hidden="true">✓</span>
        ${bubbleItems.join("")}
      </div>
      <div class="customer-face"><img src="${face}" alt="" draggable="false" /></div>
      <div class="customer-reward">✈️${order.reward}</div>
    `;

    cust.addEventListener("click", () => {
      if (state.claiming) return;
      if (canFulfill(order.needs)) {
        claimOrder(order._inst);
      } else {
        showToast(`${order.title}：仲差載具`);
        state.selectedIndex = null;
        document.querySelectorAll(".cell.selected").forEach((c) => c.classList.remove("selected"));
        // Orders stay in bubbles — briefly expand detail as hint only
        expandDetail(
          null,
          `<strong>${order.title}</strong><br/>需要：` +
            order.needs.map((n) => `${vehicle(n.level).name}×${n.count}`).join("、")
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

function expandDetail(levelOrNull, html) {
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
  const item = state.board[state.selectedIndex];
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
    if (item) {
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
      if (state.claiming) return;
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
  document.getElementById("energy-text").textContent = String(state.energy);
  document.getElementById("travel-text").textContent = String(state.travel);
  const gemsEl = document.getElementById("gems-text");
  if (gemsEl) gemsEl.textContent = String(state.gems);
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
  document.getElementById("btn-energy-debug").addEventListener("click", (e) => {
    e.stopPropagation();
    state.energy = Math.min(CONFIG.ENERGY_MAX, state.energy + 10);
    renderResources();
    updateEnergyTimerUI();
    showToast("+10 能量 ⚡");
  });
  document.getElementById("btn-travel-plus").addEventListener("click", (e) => {
    e.stopPropagation();
    showToast("商店未實裝");
  });
  document.getElementById("btn-gems-plus").addEventListener("click", (e) => {
    e.stopPropagation();
    showToast("商店未實裝");
  });
  document.getElementById("btn-shop").addEventListener("click", () => {
    showToast("商店未實裝");
  });
  document.getElementById("btn-win-close").addEventListener("click", () => {
    document.getElementById("win-overlay").hidden = true;
  });

  setInterval(tickEnergy, 250);
}

init();
