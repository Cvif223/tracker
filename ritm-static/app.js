const KEY = "ritm-habits-v1";
const COLORS = [
  ["sage", "Шалфей"],
  ["terracotta", "Терракота"],
  ["slate", "Сланец"],
  ["forest", "Лес"],
  ["clay", "Глина"],
  ["ocean", "Океан"],
  ["stone", "Камень"],
  ["ink", "Чернила"],
];
const DOW = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const MONTHS_NOM = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
];
const WEEKDAYS = [
  "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота",
];
const CHECK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const PLUS_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const MORE_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>';
const CHEV_L =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const CHEV_R =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
const X_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

const SEED = [
  { id: "seed-move", name: "Утренняя зарядка", note: "10 минут, без телефона", color: "sage", rate: 0.82 },
  { id: "seed-read", name: "Чтение 20 минут", note: "Бумага или книга, не лента", color: "terracotta", rate: 0.7 },
  { id: "seed-water", name: "Вода", note: "Восемь стаканов за день", color: "ocean", rate: 0.88 },
  { id: "seed-sit", name: "Медитация", note: "Пять спокойных минут", color: "slate", rate: 0.54 },
  { id: "seed-sleep", name: "Без экрана перед сном", note: "Последний час — без телефона", color: "ink", rate: 0.61 },
];

function pad(n) { return String(n).padStart(2, "0"); }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fromISO(iso) { const [y, m, day] = iso.split("-").map(Number); return new Date(y, m - 1, day); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}
function todayISO() { return toISO(new Date()); }
function addDaysISO(iso, n) { return toISO(addDays(fromISO(iso), n)); }
function isFuture(d) { return toISO(d) > todayISO(); }
function isToday(d) { return toISO(d) === todayISO(); }
function weekDays(anchor) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function monthGrid(anchor) {
  const start = startOfWeek(startOfMonth(anchor));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
function daysInMonth(anchor) {
  const start = startOfMonth(anchor);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  return Array.from({ length: end }, (_, i) => new Date(anchor.getFullYear(), anchor.getMonth(), i + 1));
}
function lastNDays(n, end = new Date()) {
  const last = fromISO(toISO(end));
  return Array.from({ length: n }, (_, i) => addDays(last, i - n + 1));
}
function formatLong(d) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
function formatMonthTitle(d) {
  return `${MONTHS_NOM[d.getMonth()]} ${d.getFullYear()}`;
}
function formatWeekRange(days) {
  const a = days[0], b = days[6];
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MONTHS[b.getMonth()]}`;
  return `${a.getDate()} ${MONTHS[a.getMonth()].slice(0, 3)} – ${b.getDate()} ${MONTHS[b.getMonth()].slice(0, 3)}`;
}
function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return "Тихая ночь";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function createSeed() {
  const today = todayISO();
  const days = lastNDays(70);
  const createdAt = addDaysISO(today, -70);
  const habits = SEED.map((s) => ({ id: s.id, name: s.name, note: s.note, color: s.color, createdAt }));
  const completions = {};
  for (const s of SEED) {
    const map = {};
    for (const day of days) {
      const iso = toISO(day);
      if (iso >= today) continue;
      if ((hash(`${s.id}:${iso}`) % 10000) / 10000 < s.rate) map[iso] = true;
    }
    completions[s.id] = map;
  }
  for (const id of ["seed-water", "seed-move"]) completions[id][today] = true;
  for (let i = 1; i <= 6; i++) completions["seed-move"][addDaysISO(today, -i)] = true;
  return { habits, completions, hasSeeded: true };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createSeed();
    const parsed = JSON.parse(raw);
    const state = parsed.state || parsed;
    if (state && state.hasSeeded) {
      return {
        habits: state.habits || [],
        completions: state.completions || {},
        hasSeeded: true,
      };
    }
  } catch (_) { /* ignore */ }
  return createSeed();
}

function save() {
  localStorage.setItem(KEY, JSON.stringify({
    state: { habits: state.habits, completions: state.completions, hasSeeded: true },
    version: 0,
  }));
}

function isDone(id, iso) { return Boolean(state.completions[id]?.[iso]); }
function currentStreak(id) {
  const map = state.completions[id] || {};
  const today = todayISO();
  let cursor = map[today] ? today : addDaysISO(today, -1);
  let n = 0;
  while (map[cursor]) { n++; cursor = addDaysISO(cursor, -1); }
  return n;
}
function longestStreak(id) {
  const dates = Object.keys(state.completions[id] || {}).sort();
  if (!dates.length) return 0;
  let best = 1, run = 1;
  for (let i = 1; i < dates.length; i++) {
    if (addDaysISO(dates[i - 1], 1) === dates[i]) { run++; if (run > best) best = run; }
    else run = 1;
  }
  return best;
}
function countIn(id, days) {
  return days.reduce((s, d) => s + (isDone(id, toISO(d)) ? 1 : 0), 0);
}
function dayCount(iso) {
  return state.habits.reduce((s, h) => s + (isDone(h.id, iso) ? 1 : 0), 0);
}
function last30(id) {
  const days = lastNDays(30);
  const done = countIn(id, days);
  return { done, total: days.length, rate: done / days.length };
}
function heatmapDays() {
  const end = fromISO(todayISO());
  const start = startOfWeek(addDays(end, -(16 * 7 - 1)));
  const out = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) out.push(new Date(d));
  return out;
}
function line(done, total) {
  if (!total) return "Добавьте первую привычку — и начните серию.";
  if (!done) return "Сегодня ещё впереди.";
  if (done === total) return "День закрыт. Ритм держится.";
  if (done / total >= 0.6) return "Хороший ритм. Ещё немного.";
  return "Тихий старт. Продолжайте.";
}

const state = load();
save();

const ui = {
  view: "today",
  weekAnchor: new Date(),
  monthAnchor: startOfMonth(new Date()),
  selected: new Date(),
  form: null,
  detail: null,
  confirm: null,
  menu: null,
  toast: "",
};

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toggle(id, iso) {
  if (iso > todayISO()) return;
  const map = { ...(state.completions[id] || {}) };
  if (map[iso]) delete map[iso]; else map[iso] = true;
  state.completions = { ...state.completions, [id]: map };
  save();
  render();
}

function addHabit({ name, note, color }) {
  const id = uid();
  state.habits = [...state.habits, { id, name, note, color, createdAt: new Date().toISOString() }];
  state.completions = { ...state.completions, [id]: {} };
  save();
}

function updateHabit(id, { name, note, color }) {
  state.habits = state.habits.map((h) => (h.id === id ? { ...h, name, note, color } : h));
  save();
}

function deleteHabit(id) {
  state.habits = state.habits.filter((h) => h.id !== id);
  const next = { ...state.completions };
  delete next[id];
  state.completions = next;
  save();
}

function toast(msg) {
  ui.toast = msg;
  render();
  setTimeout(() => { if (ui.toast === msg) { ui.toast = ""; render(); } }, 1800);
}

function checkBtn(color, on, label, size, disabled, habitId, iso) {
  return `<button type="button" class="check ${size || ""} ${on ? "on c-" + color : ""}" aria-pressed="${on}" aria-label="${esc(label)}" data-habit="${habitId}" data-iso="${iso}" ${disabled ? "disabled" : ""}>${CHECK_SVG}</button>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c]));
}

function empty() {
  return `<div class="empty"><h2>Пока тихо</h2><p>Добавьте первую привычку. Каждый день — одна отметка, и серия начнёт расти.</p></div>`;
}

function viewToday() {
  if (!state.habits.length) return empty();
  return `<ul class="list">${state.habits.map((h) => {
    const on = isDone(h.id, todayISO());
    const streak = currentStreak(h.id);
    return `<li class="card habit-row">
      <span class="stripe c-${h.color}"></span>
      <button type="button" class="habit-name" data-open="${h.id}">
        <p>${esc(h.name)}</p>
        <small>${streak > 0 ? `Серия ${streak} дн` : "Серия ещё не начата"}</small>
      </button>
      ${checkBtn(h.color, on, `Отметить «${h.name}»`, "", false, h.id, todayISO())}
      <div class="menu">
        <button type="button" class="btn btn-ghost btn-icon-sm" data-menu="${h.id}" aria-label="Ещё">${MORE_SVG}</button>
        ${ui.menu === h.id ? `<div class="menu-list">
          <button type="button" data-open="${h.id}">Статистика</button>
          <button type="button" data-edit="${h.id}">Изменить</button>
          <button type="button" class="danger" data-del="${h.id}">Удалить</button>
        </div>` : ""}
      </div>
    </li>`;
  }).join("")}</ul>`;
}

function viewWeek() {
  if (!state.habits.length) return empty();
  const days = weekDays(ui.weekAnchor);
  const isCurrent = days.some((d) => isToday(d));
  return `
    <div class="nav-row">
      <button class="btn btn-ghost btn-icon-sm" data-week="-7" aria-label="Предыдущая неделя">${CHEV_L}</button>
      <div>
        <h2>${formatWeekRange(days)}</h2>
        ${isCurrent ? "" : `<button type="button" data-week-now="1" style="font-size:0.875rem;color:var(--primary)">К этой неделе</button>`}
      </div>
      <button class="btn btn-ghost btn-icon-sm" data-week="7" aria-label="Следующая неделя">${CHEV_R}</button>
    </div>
    <div class="week-head">${days.map((d) => `<div><span>${DOW[(d.getDay() + 6) % 7]}</span><b class="${isToday(d) ? "today" : ""}">${d.getDate()}</b></div>`).join("")}</div>
    <ul class="list">${state.habits.map((h) => {
      const streak = currentStreak(h.id);
      const done = countIn(h.id, days);
      return `<li class="card week-card">
        <button type="button" class="week-card-head" data-open="${h.id}">
          <span class="left"><span class="dot c-${h.color}"></span><span>${esc(h.name)}</span></span>
          <small>${done}/7 · серия ${streak}</small>
        </button>
        <div class="week-grid">${days.map((d) => {
          const iso = toISO(d);
          return `<div>${checkBtn(h.color, isDone(h.id, iso), `${h.name}, ${iso}`, "sm", isFuture(d), h.id, iso)}</div>`;
        }).join("")}</div>
      </li>`;
    }).join("")}</ul>`;
}

function viewMonth() {
  if (!state.habits.length) return empty();
  const cells = monthGrid(ui.monthAnchor);
  const inMonth = daysInMonth(ui.monthAnchor);
  const selIso = toISO(ui.selected);
  const futureSel = isFuture(ui.selected);
  const possible = state.habits.length * inMonth.filter((d) => !isFuture(d)).length;
  const totalDone = inMonth.reduce((s, d) => s + dayCount(toISO(d)), 0);
  const rate = possible ? Math.round((totalDone / possible) * 100) : 0;
  return `
    <div class="nav-row">
      <button class="btn btn-ghost btn-icon-sm" data-month="-1" aria-label="Предыдущий месяц">${CHEV_L}</button>
      <div><h2>${formatMonthTitle(ui.monthAnchor)}</h2><p>${rate}% закрыто</p></div>
      <button class="btn btn-ghost btn-icon-sm" data-month="1" aria-label="Следующий месяц">${CHEV_R}</button>
    </div>
    <div class="card cal">
      <div class="cal-grid">
        ${DOW.map((d) => `<p class="cal-dow">${d}</p>`).join("")}
        ${cells.map((d) => {
          const iso = toISO(d);
          const outside = d.getMonth() !== ui.monthAnchor.getMonth();
          const count = dayCount(iso);
          const level = Math.min(4, Math.round((count / Math.max(state.habits.length, 1)) * 4));
          const sel = toISO(d) === selIso;
          const cls = [
            "cal-day",
            outside ? "out" : `h${level}`,
            !outside && sel ? "sel" : "",
            !outside && isFuture(d) ? "future" : "",
          ].filter(Boolean).join(" ");
          return `<button type="button" class="${cls}" data-pick="${iso}" ${outside ? "disabled" : ""}>${d.getDate()}</button>`;
        }).join("")}
      </div>
      <div class="legend"><span>Меньше</span><i class="h0" style="background:var(--surface-2)"></i><i style="background:color-mix(in oklab,var(--habit-sage) 25%,transparent)"></i><i style="background:color-mix(in oklab,var(--habit-sage) 45%,transparent)"></i><i style="background:color-mix(in oklab,var(--habit-sage) 70%,transparent)"></i><i style="background:var(--habit-sage)"></i><span>Больше</span></div>
    </div>
    <section class="day-title">
      <h2>${formatLong(ui.selected)}</h2>
      <p>${futureSel ? "Этот день ещё не наступил." : `${dayCount(selIso)} из ${state.habits.length} привычек`}</p>
    </section>
    <ul class="list" style="margin-top:0.75rem">${state.habits.map((h) => {
      const done = countIn(h.id, inMonth);
      const pct = Math.round((done / inMonth.length) * 100);
      return `<li class="card month-row">
        <span class="dot c-${h.color}"></span>
        <button type="button" class="habit-name" data-open="${h.id}">
          <p>${esc(h.name)}</p>
          <small>${done} дн · ${pct}% за месяц</small>
        </button>
        ${checkBtn(h.color, isDone(h.id, selIso), `${h.name}, ${selIso}`, "sm", futureSel, h.id, selIso)}
      </li>`;
    }).join("")}</ul>`;
}

function dialogForm() {
  if (!ui.form) return "";
  const h = ui.form.habit;
  const name = h?.name || "";
  const note = h?.note || "";
  const color = h?.color || "sage";
  return `<div class="overlay" data-backdrop="form">
    <form class="dialog" id="habit-form">
      <button type="button" class="close" data-close-form="1" aria-label="Закрыть">${X_SVG}</button>
      <div>
        <h2>${h ? "Изменить привычку" : "Новая привычка"}</h2>
        <p class="desc">${h ? "Имя, цвет и короткая заметка. Серия сохранится." : "Короткое имя и цвет — этого достаточно, чтобы начать серию."}</p>
      </div>
      <div class="field"><label for="habit-name">Название</label>
        <input id="habit-name" name="name" maxlength="48" required value="${esc(name)}" placeholder="Например, утренняя зарядка" /></div>
      <div class="field"><label for="habit-note">Заметка</label>
        <input id="habit-note" name="note" maxlength="80" value="${esc(note)}" placeholder="Необязательно" /></div>
      <div class="field"><label>Цвет</label>
        <div class="swatches">${COLORS.map(([id, label]) =>
          `<button type="button" class="swatch c-${id} ${color === id ? "on" : ""}" data-color="${id}" aria-label="${label}" aria-pressed="${color === id}"></button>`
        ).join("")}</div>
        <input type="hidden" name="color" value="${color}" />
      </div>
      <div class="actions">
        <button type="button" class="btn btn-ghost" data-close-form="1">Отмена</button>
        <button type="submit" class="btn btn-primary">${h ? "Сохранить" : "Добавить"}</button>
      </div>
    </form>
  </div>`;
}

function dialogDetail() {
  const h = ui.detail && state.habits.find((x) => x.id === ui.detail);
  if (!h) return "";
  const today = todayISO();
  const streak = currentStreak(h.id);
  const best = longestStreak(h.id);
  const m = last30(h.id);
  const heat = heatmapDays();
  const on = isDone(h.id, today);
  return `<div class="overlay" data-backdrop="detail">
    <div class="dialog">
      <button type="button" class="close" data-close-detail="1" aria-label="Закрыть">${X_SVG}</button>
      <div style="display:flex;gap:0.75rem;align-items:flex-start;padding-right:1.5rem">
        <span class="dot c-${h.color}" style="margin-top:0.45rem"></span>
        <div><h2>${esc(h.name)}</h2><p class="desc">${esc(h.note || "Ежедневная привычка")}</p></div>
      </div>
      <div class="today-box">
        <div><p class="kicker">Сегодня</p><p style="font-family:var(--display);font-size:1.125rem;font-weight:500">${on ? "Отмечено" : "Ещё нет"}</p></div>
        ${checkBtn(h.color, on, `Отметить «${h.name}» сегодня`, "lg", false, h.id, today)}
      </div>
      <div class="stat-grid">
        <div class="stat"><p class="kicker">Серия</p><b>${streak}<small>дн</small></b></div>
        <div class="stat"><p class="kicker">Рекорд</p><b>${best}<small>дн</small></b></div>
        <div class="stat"><p class="kicker">30 дней</p><b>${Math.round(m.rate * 100)}<small>%</small></b></div>
      </div>
      <div>
        <p class="kicker" style="margin-bottom:0.5rem">Последние 16 недель</p>
        <div class="heat">${heat.map((d) => {
          const iso = toISO(d);
          const marked = isDone(h.id, iso);
          return `<button type="button" class="${marked ? "on c-" + h.color : ""}" data-heat="${h.id}:${iso}" ${isFuture(d) ? "disabled" : ""} title="${iso}"></button>`;
        }).join("")}</div>
      </div>
      <div class="actions" style="justify-content:stretch">
        <button type="button" class="btn btn-outline" style="flex:1" data-edit="${h.id}">Изменить</button>
        <button type="button" class="btn btn-ghost" style="color:var(--danger)" data-del="${h.id}">Удалить</button>
      </div>
    </div>
  </div>`;
}

function dialogConfirm() {
  const h = ui.confirm && state.habits.find((x) => x.id === ui.confirm);
  if (!h) return "";
  return `<div class="overlay" data-backdrop="confirm">
    <div class="dialog">
      <h2>Удалить привычку?</h2>
      <p class="desc">«${esc(h.name)}» и вся её серия будут удалены с этого устройства.</p>
      <div class="actions">
        <button type="button" class="btn btn-outline" data-close-confirm="1">Отмена</button>
        <button type="button" class="btn btn-danger" data-confirm-del="${h.id}">Удалить</button>
      </div>
    </div>
  </div>`;
}

function render() {
  const today = todayISO();
  const done = state.habits.filter((h) => isDone(h.id, today)).length;
  const total = state.habits.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const now = new Date();
  const root = document.getElementById("app");
  root.innerHTML = `
    <div class="app">
      <header class="header">
        <div>
          <p class="logo">Ритм</p>
          <p class="sub">${greeting(now)} · ${formatLong(now)}</p>
        </div>
        <button class="btn btn-primary" data-add="1" aria-label="Добавить привычку">${PLUS_SVG}<span class="hide-sm">Привычка</span></button>
      </header>
      <section class="hero">
        <div class="hero-row">
          <div>
            <p class="kicker">Сегодня</p>
            <p class="hero-num">${done}<span> / ${total}</span></p>
          </div>
          <p class="hero-note">${line(done, total)}</p>
        </div>
        <div class="bar"><i style="width:${pct}%"></i></div>
      </section>
      <nav class="tabs" aria-label="Вид">
        ${[["today", "Сегодня"], ["week", "Неделя"], ["month", "Месяц"]].map(([id, label]) =>
          `<button type="button" class="${ui.view === id ? "active" : ""}" data-view="${id}">${label}</button>`
        ).join("")}
      </nav>
      <main class="main">${ui.view === "today" ? viewToday() : ui.view === "week" ? viewWeek() : viewMonth()}</main>
    </div>
    ${dialogForm()}${dialogDetail()}${dialogConfirm()}
    ${ui.toast ? `<div class="toast">${esc(ui.toast)}</div>` : ""}
  `;

  bindForm(root);
}

function bindForm(root) {
  const form = root.querySelector("#habit-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    const payload = { name, note: String(data.get("note") || "").trim(), color: String(data.get("color") || "sage") };
    if (ui.form?.habit) {
      updateHabit(ui.form.habit.id, payload);
      toast("Привычка обновлена");
    } else {
      addHabit(payload);
      toast("Привычка добавлена");
    }
    ui.form = null;
    render();
  });
  const nameInput = form.querySelector("#habit-name");
  if (nameInput) nameInput.focus();
}

function habitById(id) { return state.habits.find((h) => h.id === id); }

function onClick(e) {
  if (e.target.dataset && e.target.dataset.backdrop) {
    const kind = e.target.dataset.backdrop;
    if (kind === "form") ui.form = null;
    if (kind === "detail") ui.detail = null;
    if (kind === "confirm") ui.confirm = null;
    render();
    return;
  }
  const t = e.target.closest("[data-view],[data-add],[data-open],[data-edit],[data-del],[data-menu],[data-week],[data-week-now],[data-month],[data-pick],[data-color],[data-close-form],[data-close-detail],[data-close-confirm],[data-confirm-del],[data-heat],[data-habit]");
  if (!t) {
    if (ui.menu) { ui.menu = null; render(); }
    return;
  }
  if (t.dataset.view) { ui.view = t.dataset.view; ui.menu = null; render(); return; }
  if (t.dataset.add) { ui.form = { habit: null, color: "sage" }; ui.menu = null; render(); return; }
  if (t.dataset.open) { ui.detail = t.dataset.open; ui.menu = null; render(); return; }
  if (t.dataset.edit) {
    ui.form = { habit: habitById(t.dataset.edit) };
    ui.detail = null;
    ui.menu = null;
    render();
    return;
  }
  if (t.dataset.del) { ui.confirm = t.dataset.del; ui.detail = null; ui.menu = null; render(); return; }
  if (t.dataset.confirmDel) {
    deleteHabit(t.dataset.confirmDel);
    toast("Привычка удалена");
    ui.confirm = null;
    render();
    return;
  }
  if (t.dataset.menu) {
    ui.menu = ui.menu === t.dataset.menu ? null : t.dataset.menu;
    render();
    return;
  }
  if (t.dataset.week) {
    ui.weekAnchor = addDays(ui.weekAnchor, Number(t.dataset.week));
    render();
    return;
  }
  if (t.dataset.weekNow) { ui.weekAnchor = new Date(); render(); return; }
  if (t.dataset.month) {
    const next = addMonths(ui.monthAnchor, Number(t.dataset.month));
    ui.monthAnchor = next;
    const now = new Date();
    ui.selected = next.getMonth() === now.getMonth() && next.getFullYear() === now.getFullYear() ? now : next;
    render();
    return;
  }
  if (t.dataset.pick) { ui.selected = fromISO(t.dataset.pick); render(); return; }
  if (t.dataset.color) {
    const hidden = document.querySelector("input[name=color]");
    if (hidden) hidden.value = t.dataset.color;
    document.querySelectorAll(".swatch").forEach((el) => el.classList.toggle("on", el.dataset.color === t.dataset.color));
    return;
  }
  if (t.dataset.closeForm) { ui.form = null; render(); return; }
  if (t.dataset.closeDetail) { ui.detail = null; render(); return; }
  if (t.dataset.closeConfirm) { ui.confirm = null; render(); return; }
  if (t.dataset.heat) {
    const [id, iso] = t.dataset.heat.split(":");
    toggle(id, iso);
    return;
  }
  if (t.dataset.habit && t.dataset.iso) {
    toggle(t.dataset.habit, t.dataset.iso);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (ui.form || ui.detail || ui.confirm || ui.menu) {
    ui.form = ui.detail = ui.confirm = ui.menu = null;
    render();
  }
});

render();
