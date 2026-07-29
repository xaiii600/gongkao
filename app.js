/* ==========================================================
 *  上岸自习室 v4 — 精确匹配截图风格
 * ========================================================== */

const STORE_KEY = 'gongkao_workbench_data';

let DB = {
  exams: [], records: {}, plans: {}, reviews: [], errors: [], checkins: {}, papers: [], statsPeriod: 'week',
  studySessions: []
};

// ===================== 每日励志短句 =====================
const MOTTOS = [
  '日拱一卒，功不唐捐 ✨',
  '你刷的每一道题，都在为上岸铺路 🛤️',
  '熬过无人问津的日子，才有诗和远方 🌅',
  '乾坤未定，你我皆是黑马 🐎',
  '星光不问赶路人，时光不负有心人 🌟',
  '没有白走的路，每一步都算数 👣',
  '将来的你，一定会感谢现在拼命的自己 💪',
  '今日的汗水，是明日上岸的底气 📚',
  '行测申论，每天进步一点点就是胜利 🏆',
  '世界上没有白费的努力，也没有碰巧的成功 🎯',
  '坚持比天赋更可怕，今天也要加油 🔥',
  '你所羡慕的上岸，都是有备而来的 🎓',
  '低头是题海，抬头是未来 📖',
  '凡是过往，皆为序章；凡是未来，皆可期待 🌈',
  '你只管努力，剩下的交给时间 ⏳',
  '宝剑锋从磨砺出，梅花香自苦寒来 🌸',
  '与其仰望星空，不如脚踏实地刷题 🪜',
  '考公路上，最大的对手是昨天的自己 🥊',
  '心之所向，素履以往；生如逆旅，一苇以航 ⛵',
  '成功不是将来才有的，而是从决定去做的那一刻开始 🚀',
  '志之所趋，无远弗届；穷山距海，不能限也 ⛰️',
  '每一个认真刷题的夜晚，都在为上岸蓄力 🌙',
  '机会永远留给有准备的人，你就是那个人 🎖️',
  '不积跬步，无以至千里；不积小流，无以成江海 🌊',
  '上岸不是终点，而是新的起点，加油 🏁',
  '那些打不倒你的，终将使你更强大 🦾',
  '人生没有白费的努力，上岸没有偶然的幸运 🍀',
  '今天比昨天多会一道题，就是进步 📈',
  '既然选择了远方，便只顾风雨兼程 🌧️',
  '优秀是一种习惯，坚持是一种品格 💎',
  '你的坚持，终将美好 🌻',
];
function getDailyMotto() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return MOTTOS[seed % MOTTOS.length];
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) DB = { ...DB, ...JSON.parse(raw) };
  } catch(e) { console.warn('Load DB failed', e); }
}
function saveDB() { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }
function todayKey() { return fmtDate(new Date()); }
function fmtDate(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }

// 八大模块配置（匹配截图）
const SUBJECTS = [
  { key: 'yanyu',     name: '言语理解', icon: '📖', desc: '行测占比25%-30%，得分关键模块', color: '#e8d5e8', iconBg: '#d4a5c9' },
  { key: 'luoji',     name: '判断推理', icon: '🧩', desc: '行测占比25%，题型多样、技巧性强', color: '#e8d5e8', iconBg: '#c8a2c8' },
  { key: 'shuliang',  name: '数量关系', icon: '🔢', desc: '行测占比10%-15%，难度大但分值高', color: '#e8d5e8', iconBg: '#b583a7' },
  { key: 'ziliao',    name: '资料分析', icon: '📊', desc: '行测占比15%-20%，得分率最高模块', color: '#e8d5e8', iconBg: '#a07090' },
  { key: 'zhengzhi',  name: '政治理论', icon: '🏛️', desc: '常识核心考查，申论重要素材', color: '#e8d5e8', iconBg: '#d4a5c9' },
  { key: 'changshi',  name: '常识判断', icon: '🌍', desc: '行测占比10%，考查面广需日常积累', color: '#e8d5e8', iconBg: '#c8a2c8' },
  { key: 'shenlun',   name: '申论',     icon: '✍️', desc: '国考省考主观题，分值大需重点练习', color: '#e8d5e8', iconBg: '#b583a7' },
  { key: 'zongying',  name: '综合应用', icon: '🎯', desc: '事业编A/B/C类，综合应用能力', color: '#e8d5e8', iconBg: '#a07090' },
];

// ===================== Tab 切换 =====================
let currentTab = 'home';
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.bottom-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');

  const hero = document.querySelector('.hero-section');
  const main = document.querySelector('.main-content');
  const bottomNav = document.querySelector('.bottom-nav');

  if (tabName === 'home') {
    if (hero) hero.style.display = 'block';
    if (main) main.style.display = 'block';
    if (bottomNav) bottomNav.style.display = 'flex';
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    renderHome();
  } else {
    if (hero) hero.style.display = 'none';
    if (main) main.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'flex';
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('tab-' + tabName);
    if (page) page.classList.add('active');
    if (tabName === 'stats') drawChart();
    if (tabName === 'checkin') renderCalendar();
    if (tabName === 'analysis') renderPapers();
    if (tabName === 'errors') renderErrors();
    if (tabName === 'review') renderReviewFullList();
  }
}

// ===================== 首页渲染 =====================
function renderHome() {
  const now = new Date();
  const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];
  document.getElementById('hero-today-date').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;

  // 每日励志短句
  const mottoEl = document.querySelector('.hero-subtitle');
  if (mottoEl) mottoEl.textContent = getDailyMotto();

  renderHeroExams();

  // Hero 区：学习进度环
  renderHeroProgressRing();

  // Hero 区：迷你统计
  renderHeroMiniStats();

  // 今日数据概览
  let totalCount = 0, totalCorrect = 0;
  Object.values(DB.records).forEach(day => {
    Object.values(day).forEach(r => { totalCount += r.count; totalCorrect += r.correct; });
  });
  const acc = totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;
  document.getElementById('stat-total-count').textContent = totalCount;
  document.getElementById('stat-accuracy').textContent = acc + '%';

  // 连续打卡
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    const ck = DB.checkins[key];
    if (ck && (ck.hours || 0) > 0) streak++;
    else if (i > 0) break;
  }
  document.getElementById('stat-streak').textContent = streak;

  // 今日学习（从计时会话自动汇总）
  const todayTotalSec = getTodayTotalSec();
  const todayHours = (todayTotalSec / 3600);
  document.getElementById('today-study-hours').textContent = todayTotalSec > 0 ? todayHours.toFixed(1) + 'h' : '0h';
  if (todayTotalSec > 0) {
    const todaySessions = DB.studySessions.filter(s => s.date === todayKey());
    const sessionCount = todaySessions.length;
    document.getElementById('today-study-text').textContent = '今日已学习 ' + todayHours.toFixed(1) + ' 小时 · ' + sessionCount + ' 次记录';
  } else {
    document.getElementById('today-study-text').textContent = '还没开始学习哦～点击模块开始计时';
  }

  // 八大学习模块
  renderSubjectModules();

  // 试卷分析总览
  renderPaperOverview();

  // 近7天做题趋势
  drawTrendChart();

  // 本月打卡日历
  renderMiniCalendar();

  // 专注时长分布饼图
  renderFocusPie();

  // 每日复盘
  renderReviews('review-list', 3);

  // 最近错题
  renderRecentErrors();
}

function renderHeroExams() {
  const container = document.getElementById('hero-exam-cards');
  if (!DB.exams.length) {
    container.innerHTML = '<div class="hero-exam-card" onclick="addExam()"><div class="exam-icon">➕</div><div class="exam-name">添加考试</div></div>';
    return;
  }
  const typeIcons = { guokao: '🇨🇳', shengkao: '🏛️', shiye: '🏢', other: '📌' };
  container.innerHTML = DB.exams.map(exam => {
    const diff = dateDiff(exam.date);
    const days = Math.max(0, Math.floor(Math.abs(diff)));
    return `
      <div class="hero-exam-card" onclick="editExam('${exam.id}')">
        <div class="exam-icon">${typeIcons[exam.type] || '📌'}</div>
        <div class="exam-name">${esc(exam.name)}</div>
        <div class="exam-days">${days}<span>天</span></div>
        <div class="exam-detail">${esc(exam.name)}</div>
      </div>`;
  }).join('');
}

// ===================== Hero 区：环形进度条 =====================
function renderHeroProgressRing() {
  const canvas = document.getElementById('hero-progress-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const todaySec = getTodayTotalSec();
  const targetSec = 8 * 3600; // 目标 8 小时
  const pct = Math.min(todaySec / targetSec, 1);
  const cx = W / 2, cy = H / 2, radius = 56, lineWidth = 8;

  // 背景环
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,.15)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  if (pct > 0) {
    // 进度弧
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // 更新中心文字
  const hoursEl = document.getElementById('hp-hours');
  if (hoursEl) {
    const h = Math.floor(todaySec / 3600);
    const m = Math.floor((todaySec % 3600) / 60);
    hoursEl.textContent = h > 0 ? h + 'h' + m + 'm' : m + 'm';
  }
}

// ===================== Hero 区：迷你统计 =====================
function renderHeroMiniStats() {
  // 连续打卡
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    const ck = DB.checkins[key];
    if (ck && (ck.hours || 0) > 0) streak++;
    else if (i > 0) break;
  }
  document.getElementById('hms-streak').textContent = streak + ' 天';

  // 本周累计
  const weekSec = getWeekTotalSec();
  const weekH = Math.floor(weekSec / 3600);
  const weekM = Math.floor((weekSec % 3600) / 60);
  document.getElementById('hms-week-hours').textContent = weekH > 0 ? weekH + 'h' + weekM + 'm' : weekM + 'm';
}

function getWeekTotalSec() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=周日
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周一为起始
  const monday = new Date(now); monday.setDate(now.getDate() - mondayOffset);
  let total = 0;
  for (let i = 0; i <= mondayOffset; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const key = fmtDate(d);
    const sessions = DB.studySessions.filter(s => s.date === key);
    total += sessions.reduce((sum, s) => sum + s.durationSec, 0);
  }
  return total;
}

// ===================== 快捷计时选择 =====================
function showQuickTimer() {
  // 弹出模块选择，让用户选择要计时的模块
  const options = SUBJECTS.map(s => `
    <button class="module-action-btn timer-action" onclick="closeModal();openTimerModal('${s.key}')" style="text-align:left;width:100%;">
      <span class="action-icon">${s.icon}</span>
      <span class="action-label">${s.name}</span>
    </button>
  `).join('');
  showModal(`
    <h3>⏱️ 开始计时学习</h3>
    <p style="color:#999;font-size:13px;margin-bottom:14px;">选择要学习的模块</p>
    <div style="display:flex;flex-direction:column;gap:8px;">${options}</div>
    <div class="modal-btns" style="margin-top:12px;">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
    </div>
  `);
}

// ===================== 计时器系统 =====================
let timerState = {
  subject: null, mode: 'countup', targetSec: 0, elapsedSec: 0,
  running: false, startTime: null, intervalId: null, pausedRemaining: 0
};

function getTodayStudySec(subject) {
  const today = todayKey();
  return DB.studySessions
    .filter(s => s.date === today && (!subject || s.subject === subject))
    .reduce((sum, s) => sum + s.durationSec, 0);
}

function getTodayTotalSec() { return getTodayStudySec(null); }

function openTimerModal(subjectKey) {
  const s = SUBJECTS.find(x => x.key === subjectKey);
  if (!s) return;
  timerState = {
    subject: subjectKey, mode: 'countup', targetSec: 0, elapsedSec: 0,
    running: false, startTime: null, intervalId: null, pausedRemaining: 0
  };
  document.getElementById('timer-subject-name').textContent = s.icon + ' ' + s.name;
  document.getElementById('timer-display').textContent = '00:00:00';
  document.getElementById('timer-countdown-presets').classList.add('hidden');
  document.getElementById('timer-progress-bar').classList.add('hidden');
  document.querySelectorAll('.timer-mode-btn').forEach(b => { b.classList.toggle('active', b.dataset.mode === 'countup'); });
  document.getElementById('timer-btn-start').classList.remove('hidden');
  document.getElementById('timer-btn-pause').classList.add('hidden');
  document.getElementById('timer-btn-resume').classList.add('hidden');
  document.getElementById('timer-minimize-btn').style.display = 'none';
  document.getElementById('timer-modal').classList.remove('hidden');
  renderSubjectModules();
}

function closeTimerModal() {
  if (timerState.running) {
    if (!confirm('计时器还在运行中，确定关闭吗？关闭后计时数据将丢失。')) return;
    clearInterval(timerState.intervalId);
    timerState.running = false;
  }
  document.getElementById('timer-modal').classList.add('hidden');
  document.getElementById('timer-mini-float').classList.add('hidden');
  renderSubjectModules();
}

function switchTimerMode(mode) {
  if (timerState.running) { alert('请先结束当前计时'); return; }
  timerState.mode = mode;
  document.querySelectorAll('.timer-mode-btn').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); });
  document.getElementById('timer-countdown-presets').classList.toggle('hidden', mode !== 'countdown');
  document.getElementById('timer-progress-bar').classList.add('hidden');
  if (mode === 'countdown') {
    document.getElementById('timer-display').textContent = '00:00';
    timerState.targetSec = 0;
  } else {
    document.getElementById('timer-display').textContent = '00:00:00';
  }
}

function setCountdown(min) { timerState.targetSec = min * 60; updateTimerDisplay(); }
function setCountdownCustom() {
  const min = parseInt(document.getElementById('timer-custom-min').value) || 30;
  setCountdown(Math.min(Math.max(min, 1), 180));
}

function startTimer() {
  if (timerState.running) return;
  if (timerState.mode === 'countdown' && timerState.targetSec <= 0) {
    alert('请先设置倒计时时长'); return;
  }
  timerState.running = true;
  timerState.startTime = Date.now();
  document.getElementById('timer-btn-start').classList.add('hidden');
  document.getElementById('timer-btn-pause').classList.remove('hidden');
  document.getElementById('timer-btn-resume').classList.add('hidden');
  document.getElementById('timer-minimize-btn').style.display = 'block';
  if (timerState.mode === 'countdown') {
    document.getElementById('timer-progress-bar').classList.remove('hidden');
  }
  timerState.intervalId = setInterval(updateTimerTick, 1000);
  renderSubjectModules();
}

function pauseTimer() {
  if (!timerState.running) return;
  clearInterval(timerState.intervalId);
  timerState.running = false;
  timerState.elapsedSec += Math.floor((Date.now() - timerState.startTime) / 1000);
  timerState.pausedRemaining = timerState.mode === 'countdown' ? (timerState.targetSec - timerState.elapsedSec) : timerState.elapsedSec;
  document.getElementById('timer-btn-pause').classList.add('hidden');
  document.getElementById('timer-btn-resume').classList.remove('hidden');
  renderSubjectModules();
}

function resumeTimer() {
  if (timerState.running) return;
  timerState.running = true;
  timerState.startTime = Date.now();
  document.getElementById('timer-btn-resume').classList.add('hidden');
  document.getElementById('timer-btn-pause').classList.remove('hidden');
  timerState.intervalId = setInterval(updateTimerTick, 1000);
  renderSubjectModules();
}

function stopTimer() {
  if (!timerState.running && !timerState.pausedRemaining) { closeTimerModal(); return; }
  clearInterval(timerState.intervalId);
  if (timerState.running) {
    timerState.elapsedSec += Math.floor((Date.now() - timerState.startTime) / 1000);
    timerState.running = false;
  }
  const durationSec = timerState.elapsedSec;
  const durStr = formatDuration(durationSec);
  document.getElementById('timer-record-duration').textContent = '本次学习 ' + durStr;
  document.getElementById('timer-rec-count').value = '0';
  document.getElementById('timer-rec-correct').value = '0';
  document.getElementById('timer-record-modal').classList.remove('hidden');
  document.getElementById('timer-modal').classList.add('hidden');
  document.getElementById('timer-mini-float').classList.add('hidden');
  renderSubjectModules();
}

function confirmTimerRecord() {
  const count = parseInt(document.getElementById('timer-rec-count').value) || 0;
  const correct = parseInt(document.getElementById('timer-rec-correct').value) || 0;
  const durationSec = timerState.elapsedSec;
  const subject = timerState.subject;
  const today = todayKey();
  DB.studySessions.push({ id: Date.now().toString(), subject, date: today, durationSec, count, correct });
  if (!DB.records[today]) DB.records[today] = {};
  if (!DB.records[today][subject]) DB.records[today][subject] = { count: 0, correct: 0, timeMin: 0 };
  DB.records[today][subject].count += count;
  DB.records[today][subject].correct += correct;
  DB.records[today][subject].timeMin += Math.round(durationSec / 60);
  saveDB();
  document.getElementById('timer-record-modal').classList.add('hidden');
  timerState.elapsedSec = 0;
  renderSubjectModules();
  renderHome();
}

function skipTimerRecord() {
  const durationSec = timerState.elapsedSec;
  const subject = timerState.subject;
  const today = todayKey();
  DB.studySessions.push({ id: Date.now().toString(), subject, date: today, durationSec, count: 0, correct: 0 });
  saveDB();
  document.getElementById('timer-record-modal').classList.add('hidden');
  timerState.elapsedSec = 0;
  renderSubjectModules();
  renderHome();
}

function updateTimerTick() {
  if (!timerState.running) return;
  timerState.elapsedSec = Math.floor((Date.now() - timerState.startTime) / 1000) + (timerState.pausedRemaining || 0);
  if (timerState.mode === 'countdown') {
    const remaining = timerState.targetSec - timerState.elapsedSec;
    if (remaining <= 0) {
      timerState.elapsedSec = timerState.targetSec;
      updateTimerDisplay();
      stopTimer();
      return;
    }
  }
  updateTimerDisplay();
  updateTimerMini();
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;
  if (timerState.mode === 'countdown') {
    const remaining = timerState.targetSec - timerState.elapsedSec;
    display.textContent = formatDuration(Math.max(0, remaining));
    const bar = document.getElementById('timer-progress-fill');
    if (bar) bar.style.width = Math.max(0, (remaining / timerState.targetSec) * 100) + '%';
  } else {
    display.textContent = formatDuration(timerState.elapsedSec);
  }
}

function updateTimerMini() {
  const float = document.getElementById('timer-mini-float');
  if (!float || float.classList.contains('hidden')) return;
  if (timerState.mode === 'countdown') {
    document.getElementById('timer-mini-display').textContent = formatShortDuration(Math.max(0, timerState.targetSec - timerState.elapsedSec));
  } else {
    document.getElementById('timer-mini-display').textContent = formatShortDuration(timerState.elapsedSec);
  }
  const s = SUBJECTS.find(x => x.key === timerState.subject);
  document.getElementById('timer-mini-subject').textContent = s ? s.icon : '📖';
}

function minimizeTimer() {
  document.getElementById('timer-modal').classList.add('hidden');
  document.getElementById('timer-mini-float').classList.remove('hidden');
  updateTimerMini();
}

function restoreTimerModal() {
  document.getElementById('timer-mini-float').classList.add('hidden');
  document.getElementById('timer-modal').classList.remove('hidden');
  const s = SUBJECTS.find(x => x.key === timerState.subject);
  if (s) document.getElementById('timer-subject-name').textContent = s.icon + ' ' + s.name;
  updateTimerDisplay();
  if (timerState.mode === 'countdown') {
    document.getElementById('timer-progress-bar').classList.remove('hidden');
  }
  if (timerState.running) {
    document.getElementById('timer-btn-start').classList.add('hidden');
    document.getElementById('timer-btn-pause').classList.remove('hidden');
    document.getElementById('timer-btn-resume').classList.add('hidden');
    document.getElementById('timer-minimize-btn').style.display = 'block';
  }
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function formatShortDuration(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

// ===================== 专注时长分布饼图 =====================
let focusPeriod = 'day';

function switchFocusPeriod(period) {
  focusPeriod = period;
  document.querySelectorAll('.focus-period-btn').forEach(b => b.classList.toggle('active', b.dataset.focus === period));
  renderFocusPie();
}

function getFocusData(period) {
  const now = new Date();
  let startDate, endDate = fmtDate(now);
  if (period === 'day') {
    startDate = endDate;
  } else if (period === 'week') {
    const d = new Date(now); d.setDate(d.getDate() - 6);
    startDate = fmtDate(d);
  } else {
    const d = new Date(now); d.setMonth(d.getMonth() - 1);
    startDate = fmtDate(d);
  }
  const data = {};
  SUBJECTS.forEach(s => data[s.key] = 0);
  DB.studySessions.forEach(s => {
    if (s.date >= startDate && s.date <= endDate) {
      if (data[s.subject] !== undefined) data[s.subject] += s.durationSec;
    }
  });
  return data;
}

function formatTimeHM(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  if (h > 0 && m > 0) return h + '小时' + m + '分';
  if (h > 0) return h + '小时';
  return m + '分钟';
}

function renderFocusPie() {
  const canvas = document.getElementById('focus-pie-chart');
  const emptyDiv = document.getElementById('focus-pie-empty');
  const summaryDiv = document.getElementById('focus-pie-summary');
  const legendDiv = document.getElementById('focus-pie-legend');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const data = getFocusData(focusPeriod);
  const entries = Object.entries(data).filter(([k, v]) => v > 0);
  const totalSec = entries.reduce((sum, [k, v]) => sum + v, 0);

  if (totalSec === 0) {
    canvas.style.display = 'none';
    emptyDiv.classList.remove('hidden');
    summaryDiv.innerHTML = '';
    legendDiv.innerHTML = '';
    return;
  }
  canvas.style.display = 'block';
  emptyDiv.classList.add('hidden');

  // 饼图颜色（与模块iconBg一致或相近）
  const colors = {
    yanyu: '#d4a5c9', luoji: '#c8a2c8', shuliang: '#b583a7', ziliao: '#a07090',
    zhengzhi: '#d4a5c9', changshi: '#c8a2c8', shenlun: '#b583a7', zongying: '#a07090'
  };

  const cx = W / 2, cy = H / 2, radius = Math.min(cx, cy) - 20;
  let startAngle = -Math.PI / 2;

  entries.forEach(([key, sec]) => {
    const sliceAngle = (sec / totalSec) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[key] || '#9b6bb0';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += sliceAngle;
  });

  // 中心白色圆（甜甜圈效果）
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // 中心文字：总时长
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#9b6bb0'; ctx.font = 'bold 22px sans-serif';
  const totalH = Math.floor(totalSec / 3600), totalM = Math.floor((totalSec % 3600) / 60);
  if (totalH > 0) {
    ctx.fillText(totalH + 'h', cx, cy - 8);
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#999';
    ctx.fillText(totalM + 'min', cx, cy + 12);
  } else {
    ctx.fillText(totalM + 'min', cx, cy);
  }

  // 总计和日均
  let dayCount = 1;
  if (focusPeriod === 'week') dayCount = 7;
  if (focusPeriod === 'month') {
    const uniqueDays = new Set(DB.studySessions.filter(s => s.date >= Object.keys(data).length ? '' : '').map(s => s.date)).size;
    dayCount = Math.max(1, uniqueDays);
  }
  const avgSec = totalSec / dayCount;
  summaryDiv.innerHTML = '总计 <span>' + formatTimeHM(totalSec) + '</span> · 日均 <span>' + formatTimeHM(avgSec) + '</span>';

  // 图例
  const subjMap = {};
  SUBJECTS.forEach(s => subjMap[s.key] = s);
  legendDiv.innerHTML = entries
    .sort((a, b) => b[1] - a[1])
    .map(([key, sec]) => {
      const s = subjMap[key];
      const pct = ((sec / totalSec) * 100).toFixed(1);
      return '<div class="focus-legend-item"><span class="focus-legend-dot" style="background:' + (colors[key] || '#9b6bb0') + '"></span><div class="focus-legend-info"><div class="focus-legend-name">' + (s ? s.icon + ' ' + s.name : key) + '</div><div class="focus-legend-time">' + formatTimeHM(sec) + '</div></div><span class="focus-legend-pct">' + pct + '%</span></div>';
    }).join('');
}

// 模块卡片点击：弹出选择菜单
function onModuleClick(subjectKey) {
  if (timerState.running && timerState.subject === subjectKey) {
    restoreTimerModal();
    return;
  }
  showModuleActionSheet(subjectKey);
}

function showModuleActionSheet(subjectKey) {
  const s = SUBJECTS.find(x => x.key === subjectKey);
  if (!s) return;
  showModal(`
    <h3>${s.icon} ${s.name}</h3>
    <p style="color:#999;font-size:13px;margin-bottom:16px;">请选择操作方式</p>
    <div class="module-action-btns">
      <button class="module-action-btn timer-action" onclick="closeModal();openTimerModal('${subjectKey}')">
        <span class="action-icon">⏱️</span>
        <span class="action-label">计时学习</span>
        <span class="action-desc">正计时/倒计时，精准记录学习时长</span>
      </button>
      <button class="module-action-btn record-action" onclick="closeModal();showRecordModal('${subjectKey}')">
        <span class="action-icon">📝</span>
        <span class="action-label">快速记录</span>
        <span class="action-desc">直接录入做题数，无需计时</span>
      </button>
    </div>
    <div class="modal-btns" style="margin-top:12px;">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
    </div>
  `);
}

function renderSubjectModules() {
  const container = document.getElementById('subject-modules');
  const today = todayKey();
  const isTiming = timerState.running && timerState.subject;
  container.innerHTML = SUBJECTS.map(s => {
    let totalCount = 0, totalCorrect = 0;
    Object.values(DB.records).forEach(day => {
      const r = day[s.key];
      if (r) { totalCount += r.count; totalCorrect += r.correct; }
    });
    const acc = totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;
    const todaySec = getTodayStudySec(s.key);
    const todayMin = Math.round(todaySec / 60);
    const timingActive = isTiming && timerState.subject === s.key;
    return `
      <div class="module-card-row ${timingActive ? 'timing-active' : ''}" onclick="onModuleClick('${s.key}')">
        <div class="mod-icon-box" style="background:${s.iconBg}30;">${s.icon}</div>
        <div class="mod-info">
          <div class="mod-name-row">
            <span class="mod-name">${s.name}</span>
            ${timingActive ? '<span class="mod-timing-badge"><span class="mod-timing-dot"></span>计时中</span>' : ''}
          </div>
          <div class="mod-stats">
            已刷 <span>${totalCount}</span> 题 · 今日 <span>${todayMin}分</span>
            ${acc > 0 ? ' · 正确率 <span>' + acc + '%</span>' : ''}
          </div>
          <div class="mod-progress"><div class="mod-progress-fill" style="width:${acc}%;background:${s.iconBg}"></div></div>
        </div>
        <div class="mod-actions" onclick="event.stopPropagation();">
          <button class="mod-action-btn timer-btn-mini" onclick="onModuleClick('${s.key}')" title="计时学习">⏱️</button>
          <button class="mod-action-btn record-btn-mini" onclick="showRecordModal('${s.key}')" title="快速录入">✍️</button>
        </div>
      </div>`;
  }).join('');
}

function renderPaperOverview() {
  const xingcePapers = DB.papers.filter(p => p.type === 'xingce');
  const shenlunPapers = DB.papers.filter(p => p.type === 'shenlun');
  const zongyingPapers = DB.papers.filter(p => p.type === 'zongying');

  document.getElementById('paper-total-count').textContent = DB.papers.length;

  const calcAvg = (papers) => {
    if (!papers.length) return '--';
    const avg = papers.reduce((sum, p) => sum + (p.total > 0 ? (p.correct / p.total) * 100 : 0), 0) / papers.length;
    return Math.round(avg) + '%';
  };

  document.getElementById('paper-xingce-avg').textContent = calcAvg(xingcePapers);
  document.getElementById('paper-shenlun-avg').textContent = calcAvg(shenlunPapers);
  document.getElementById('paper-zongying-avg').textContent = calcAvg(zongyingPapers);

  // 最近模考
  const recentExam = document.getElementById('paper-recent-exam');
  if (!recentExam) return;
  const sorted = [...DB.papers].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  if (latest) {
    const typeLabel = { xingce: '行测', shenlun: '申论', zongying: '综应' }[latest.type] || latest.type;
    recentExam.innerHTML = `
      <div class="pre-icon">📋</div>
      <div class="pre-info">
        <div class="pre-name">${esc(latest.name || typeLabel + '模考')}</div>
        <div class="pre-date">📅 ${latest.date}</div>
      </div>
      <div class="pre-score">${latest.total > 0 ? Math.round((latest.correct / latest.total) * 100) + '%' : '--'}</div>`;
  } else {
    recentExam.innerHTML = '<div class="pre-empty">暂无模考记录，去录入试卷吧 📋</div>';
  }
}

function drawTrendChart() {
  const canvas = document.getElementById('trend-chart');
  const emptyDiv = document.getElementById('trend-empty');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // 近7天做题数
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    let count = 0;
    if (DB.records[key]) {
      Object.values(DB.records[key]).forEach(r => count += r.count);
    }
    data.push(count);
  }

  if (data.every(v => v === 0)) {
    canvas.style.display = 'none';
    emptyDiv.classList.remove('hidden');
    return;
  }

  canvas.style.display = 'block';
  emptyDiv.classList.add('hidden');

  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    labels.push((d.getMonth()+1) + '/' + d.getDate());
  }
  drawLineChart(ctx, W, H, labels, data, '#9b6bb0', 'rgba(155,107,176,0.12)');
}

function renderMiniCalendar() {
  const container = document.getElementById('mini-calendar');
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = fmtDate(now);

  const weekdays = '日一二三四五六';
  let html = '';
  weekdays.split('').forEach(w => {
    html += `<div class="cal-weekday">${w}</div>`;
  });
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day" style="visibility:hidden"></div>';
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const ck = DB.checkins[dateStr];
    const hours = ck ? (ck.hours || 0) : 0;
    const isToday = dateStr === todayStr;
    const cls = hours > 0 ? 'checked' : '';
    const todayCls = isToday ? 'today' : '';
    html += `<div class="cal-day ${cls} ${todayCls}" onclick="switchTab('checkin')">
      <span>${d}</span>${hours > 0 ? `<span class="cal-hours">${hours}h</span>` : ''}
    </div>`;
  }
  container.innerHTML = html;
}

// ===================== 倒计时 =====================
function addExam() {
  showModal(`
    <h3>添加考试</h3>
    <label>考试名称</label>
    <input id="exam-name" placeholder="例：2026年国考" autofocus>
    <label>考试类型</label>
    <select id="exam-type">
      <option value="guokao">国考</option>
      <option value="shengkao">省考</option>
      <option value="shiye">事业编</option>
      <option value="other">其他</option>
    </select>
    <label>考试日期</label>
    <input id="exam-date" type="date">
    <div class="modal-btns">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmAddExam()">添加</button>
    </div>
  `);
}
function confirmAddExam() {
  const name = val('exam-name');
  const type = val('exam-type');
  const date = val('exam-date');
  if (!name || !date) { alert('请填写名称和日期'); return; }
  DB.exams.push({ id: Date.now().toString(), name, type, date });
  saveDB(); renderHeroExams(); closeModal();
}

function editExam(id) {
  const exam = DB.exams.find(e => e.id === id);
  if (!exam) return;
  showModal(`
    <h3>编辑考试</h3>
    <label>考试名称</label>
    <input id="exam-name" value="${esc(exam.name)}" autofocus>
    <label>考试类型</label>
    <select id="exam-type">
      <option value="guokao" ${exam.type==='guokao'?'selected':''}>国考</option>
      <option value="shengkao" ${exam.type==='shengkao'?'selected':''}>省考</option>
      <option value="shiye" ${exam.type==='shiye'?'selected':''}>事业编</option>
      <option value="other" ${exam.type==='other'?'selected':''}>其他</option>
    </select>
    <label>考试日期</label>
    <input id="exam-date" type="date" value="${exam.date}">
    <div class="modal-btns">
      <button class="btn-secondary" onclick="deleteExam('${exam.id}')" style="background:#fde8e8;color:#c62828;">🗑️ 删除</button>
      <button class="btn-primary" onclick="confirmEditExam('${exam.id}')">保存</button>
    </div>
  `);
}

function confirmEditExam(id) {
  const exam = DB.exams.find(e => e.id === id);
  if (!exam) return;
  exam.name = val('exam-name');
  exam.type = val('exam-type');
  exam.date = val('exam-date');
  if (!exam.name || !exam.date) { alert('请填写名称和日期'); return; }
  saveDB(); renderHeroExams(); closeModal();
}

function deleteExam(id) {
  if (!confirm('确定删除这个考试吗？')) return;
  DB.exams = DB.exams.filter(e => e.id !== id);
  saveDB(); renderHeroExams(); closeModal();
}
function dateDiff(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return (target - now) / (1000 * 60 * 60 * 24);
}

// ===================== 学习板块弹窗 =====================
function showRecordModal(preselectSubject) {
  let options = SUBJECTS.map(s => `<option value="${s.key}" ${s.key === preselectSubject ? 'selected' : ''}>${s.icon} ${s.name}</option>`).join('');
  showModal(`
    <h3>📊 记录本次刷题</h3>
    <label>选择板块</label>
    <select id="rec-subject">${options}</select>
    <div class="form-row">
      <div><label>做题数目</label><input id="rec-count" type="number" min="0" value="0"></div>
      <div><label>正确数目</label><input id="rec-correct" type="number" min="0" value="0"></div>
    </div>
    <label>本次做题时间（分钟）</label>
    <input id="rec-time" type="number" min="0" value="0" placeholder="例如：45">
    <div class="modal-btns">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmRecord()">保存</button>
    </div>
  `);
}
function confirmRecord() {
  const subject = val('rec-subject');
  const count = parseInt(val('rec-count')) || 0;
  const correct = parseInt(val('rec-correct')) || 0;
  const timeMin = parseInt(val('rec-time')) || 0;
  if (correct > count) { alert('正确数不能超过做题数'); return; }
  const today = todayKey();
  if (!DB.records[today]) DB.records[today] = {};
  DB.records[today][subject] = { count, correct, timeMin };
  saveDB(); renderSubjectModules(); renderHome(); closeModal();
}

// ===================== 每日计划 =====================
function addPlanItem() {
  showModal(`
    <h3>添加计划</h3>
    <label>计划内容</label>
    <textarea id="plan-text" placeholder="例：完成言语理解50题" autofocus></textarea>
    <div class="modal-btns">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmAddPlan()">添加</button>
    </div>
  `);
}
function confirmAddPlan() {
  const text = val('plan-text');
  if (!text.trim()) { alert('请输入计划内容'); return; }
  const today = todayKey();
  if (!DB.plans[today]) DB.plans[today] = [];
  DB.plans[today].push({ id: Date.now().toString(), text: text.trim(), done: false });
  saveDB(); renderPlans(); closeModal();
}
function togglePlan(id) {
  const today = todayKey();
  const plans = DB.plans[today] || [];
  const item = plans.find(p => p.id === id);
  if (item) { item.done = !item.done; saveDB(); renderPlans(); }
}
function deletePlan(id) {
  const today = todayKey();
  if (DB.plans[today]) { DB.plans[today] = DB.plans[today].filter(p => p.id !== id); saveDB(); renderPlans(); }
}
function renderPlans() {
  const list = document.getElementById('plan-list');
  const emptyDiv = document.getElementById('plan-empty');
  const today = todayKey();
  const plans = DB.plans[today] || [];
  if (!plans.length) {
    list.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  emptyDiv.classList.add('hidden');
  list.innerHTML = plans.map(p => `
    <div class="plan-item ${p.done ? 'done' : ''}">
      <div class="plan-checkbox ${p.done ? 'checked' : ''}" onclick="togglePlan('${p.id}')">${p.done ? '✓' : ''}</div>
      <span class="plan-text">${esc(p.text)}</span>
      <button class="plan-delete" onclick="deletePlan('${p.id}')">×</button>
    </div>
  `).join('');
}

// ===================== 每日复盘（重构版） =====================
let reviewPeriod = 'week';
let errorImportSelected = {};

function switchReviewPeriod(period) {
  reviewPeriod = period;
  document.querySelectorAll('.review-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.period === period));
  renderReviewFullList();
}

// === 添加复盘（带模板） ===
function addReviewItem() {
  showModal(`
    <h3>🔄 添加每日复盘</h3>
    <p style="color:#888;font-size:13px;margin-bottom:10px;">选择复盘模板，快速搭建框架</p>
    <div class="review-template-btns">
      <button class="review-template-btn" onclick="applyTemplate('xingce')">
        <span class="template-icon">📊</span>行测刷题复盘
      </button>
      <button class="review-template-btn" onclick="applyTemplate('shenlun')">
        <span class="template-icon">✍️</span>申论答题复盘
      </button>
      <button class="review-template-btn" onclick="applyTemplate('blank')">
        <span class="template-icon">📝</span>空白模板
      </button>
    </div>
    <div id="rev-template-area"></div>
    <div class="modal-btns" style="margin-top:12px;">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmReviewItem()">保存</button>
    </div>
  `);
}

function applyTemplate(type) {
  let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
  let html = '';
  html += `<label>日期</label><input id="rev-date" type="date" value="${todayKey()}">`;
  html += `<label>所属模块</label><select id="rev-subject">${options}</select>`;

  if (type === 'xingce') {
    html += `<label>📊 刷题概况</label><textarea id="rev-overview" placeholder="今日刷题量、正确率、用时..." rows="2"></textarea>`;
    html += `<label>⚠️ 薄弱模块</label><textarea id="rev-weakness" placeholder="哪些模块失分较多？..." rows="2"></textarea>`;
    html += `<label>❌ 错题汇总</label><textarea id="rev-errors" placeholder="典型错题及错误原因..." rows="2"></textarea>`;
    html += `<label>💡 错因总结</label><textarea id="rev-reason" placeholder="知识盲区、审题、计算等问题总结..." rows="2"></textarea>`;
    html += `<label>📅 明日计划</label><textarea id="rev-plan" placeholder="明天重点攻克哪些模块..." rows="2"></textarea>`;
  } else if (type === 'shenlun') {
    html += `<label>✍️ 答题概况</label><textarea id="rev-overview" placeholder="今日练习了什么题型..." rows="2"></textarea>`;
    html += `<label>📝 参考答案要点</label><textarea id="rev-answer" placeholder="参考答案的关键要点..." rows="2"></textarea>`;
    html += `<label>🔄 自我批改</label><textarea id="rev-selfcheck" placeholder="与参考答案的差距..." rows="2"></textarea>`;
    html += `<label>💡 改进方向</label><textarea id="rev-improvement" placeholder="论点、结构、表达等改进..." rows="2"></textarea>`;
    html += `<label>📅 明日计划</label><textarea id="rev-plan" placeholder="明天重点练习..." rows="2"></textarea>`;
  } else {
    html += `<label>📝 自由记录</label><textarea id="rev-content" placeholder="记录今日学习心得、问题、反思..." rows="4"></textarea>`;
  }

  html += `<label>🖼️ 图片（选填）</label>
    <div style="display:flex;gap:6px;">
      <button class="review-empty-btn outline" style="flex:1;font-size:12px;" onclick="captureReviewPhotoInModal()">📷 拍照</button>
      <button class="review-empty-btn outline" style="flex:1;font-size:12px;" onclick="openGalleryForReview()">🖼️ 相册</button>
    </div>
    <div id="rev-photo-preview" style="margin-top:8px;"></div>`;

  html += `<button class="review-empty-btn outline" style="width:100%;margin-top:10px;font-size:13px;" onclick="importErrorsToReviewInModal()">📥 从错题库导入错题</button>
    <div id="rev-imported-errors" style="margin-top:6px;font-size:12px;color:#888;"></div>`;

  html += `<label style="margin-top:10px;">自由笔记区</label><textarea id="rev-knowledge" placeholder="其他补充..." rows="2"></textarea>`;

  document.getElementById('rev-template-area').innerHTML = html;
  window._reviewTemplateType = type;
  window._reviewImportedErrors = [];
}

function openGalleryForReview() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (ev) => {
    const file = ev.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      compressImage(reader.result, 800, (compressed) => {
        window._reviewTempPhoto = compressed;
        document.getElementById('rev-photo-preview').innerHTML = `<img src="${compressed}" style="max-width:100%;border-radius:10px;">`;
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function captureReviewPhotoInModal() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = (ev) => {
    const file = ev.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      compressImage(reader.result, 800, (compressed) => {
        window._reviewTempPhoto = compressed;
        document.getElementById('rev-photo-preview').innerHTML = `<img src="${compressed}" style="max-width:100%;border-radius:10px;">`;
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function importErrorsToReviewInModal() {
  if (!DB.errors.length) { alert('暂无错题记录，请先去错题页面录入'); return; }
  errorImportSelected = {};
  let html = DB.errors.map(e => {
    const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
    const summary = (e.type === 'text' ? e.content : (e.type === 'photo' ? '[图片题]' : '[语音题]')).substring(0, 30);
    return `<label style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:#faf5fc;margin-bottom:4px;cursor:pointer;">
      <input type="checkbox" data-error-id="${e.id}" onchange="toggleErrorImport('${e.id}')">
      <span style="font-size:12px;color:#555;flex:1;">${esc(summary)}</span>
      <span style="font-size:11px;color:#aaa;">${subjName(e.subject)} · ${e.date}</span>
    </label>`;
  }).join('');
  showModal(`
    <h3>📥 从错题导入复盘</h3>
    <p style="font-size:13px;color:#888;margin-bottom:10px;">勾选要导入的错题</p>
    <div style="max-height:300px;overflow-y:auto;margin-bottom:12px;">${html}</div>
    <div class="modal-btns">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmErrorImportInModal()">导入选中</button>
    </div>
  `);
}

function toggleErrorImport(id) {
  if (errorImportSelected[id]) delete errorImportSelected[id];
  else errorImportSelected[id] = true;
}

function confirmErrorImportInModal() {
  window._reviewImportedErrors = Object.keys(errorImportSelected);
  const preview = document.getElementById('rev-imported-errors');
  if (preview) preview.innerHTML = '✅ 已选中 ' + window._reviewImportedErrors.length + ' 道错题';
  closeModal();
}

// === 从错题页面批量导入复盘 ===
function importErrorsToReview() {
  if (!DB.errors.length) { alert('暂无错题记录，请先去错题页面录入'); return; }
  errorImportSelected = {};
  let html = DB.errors.map(e => {
    const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
    const summary = (e.type === 'text' ? e.content : (e.type === 'photo' ? '[图片题]' : '[语音题]')).substring(0, 30);
    return `<label style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:#faf5fc;margin-bottom:4px;cursor:pointer;">
      <input type="checkbox" data-error-id="${e.id}" onchange="toggleErrorImport('${e.id}')">
      <span style="font-size:12px;color:#555;flex:1;">${esc(summary)}</span>
      <span style="font-size:11px;color:#aaa;">${subjName(e.subject)} · ${e.date}</span>
    </label>`;
  }).join('');
  document.getElementById('error-import-list').innerHTML = html;
  document.getElementById('error-import-modal').classList.remove('hidden');
}

function closeErrorImportModal() {
  document.getElementById('error-import-modal').classList.add('hidden');
}

function confirmImportErrors() {
  const ids = Object.keys(errorImportSelected);
  if (!ids.length) { alert('请至少选择一道错题'); return; }
  const errors = DB.errors.filter(e => errorImportSelected[e.id]);
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  let content = '【从错题导入】\n\n';
  content += '刷题概况：本次导入 ' + ids.length + ' 道错题\n\n';
  content += '错题汇总：\n';
  errors.forEach((e, i) => {
    content += (i + 1) + '. [' + subjName(e.subject) + '] ' + (e.type === 'text' ? e.content.substring(0, 50) : '(图片题)') + '\n';
  });
  content += '\n自由笔记区：\n';
  DB.reviews.unshift({
    id: Date.now().toString(), date: todayKey(), subject: 'zongying', type: 'batch',
    content: content, linkedErrors: ids, archived: false
  });
  saveDB(); closeErrorImportModal(); renderReviews('review-list', 3); renderReviewFullList();
  alert('已导入 ' + ids.length + ' 道错题到复盘！');
}

// === 保存复盘 ===
function confirmReviewItem() {
  const date = val('rev-date') || todayKey();
  const subject = val('rev-subject') || 'yanyu';
  const type = window._reviewTemplateType || 'blank';
  const linkedErrors = window._reviewImportedErrors || [];

  let content = '';
  if (type === 'xingce') {
    const overview = val('rev-overview') || '';
    const weakness = val('rev-weakness') || '';
    const errors = val('rev-errors') || '';
    const reason = val('rev-reason') || '';
    const plan = val('rev-plan') || '';
    content = `【行测刷题复盘】\n\n📊 刷题概况：${overview}\n\n⚠️ 薄弱模块：${weakness}\n\n❌ 错题汇总：${errors}\n\n💡 错因总结：${reason}\n\n📅 明日计划：${plan}`;
  } else if (type === 'shenlun') {
    const overview = val('rev-overview') || '';
    const answer = val('rev-answer') || '';
    const selfcheck = val('rev-selfcheck') || '';
    const improvement = val('rev-improvement') || '';
    const plan = val('rev-plan') || '';
    content = `【申论答题复盘】\n\n✍️ 答题概况：${overview}\n\n📝 参考答案要点：${answer}\n\n🔄 自我批改：${selfcheck}\n\n💡 改进方向：${improvement}\n\n📅 明日计划：${plan}`;
  } else {
    content = val('rev-content') || '';
  }
  const knowledge = val('rev-knowledge') || '';
  if (knowledge) content += '\n\n📝 自由笔记：' + knowledge;

  if (!content.trim() && !window._reviewTempPhoto && !linkedErrors.length) {
    alert('请至少填写一项内容');
    return;
  }

  DB.reviews.unshift({
    id: Date.now().toString(), date, subject, type,
    content: content.trim(),
    photoData: window._reviewTempPhoto || '',
    linkedErrors, archived: false
  });
  saveDB(); renderReviews('review-list', 3); renderReviewFullList(); closeModal();
  window._reviewTempPhoto = '';
  window._reviewImportedErrors = [];
}

// === 删除/归档 ===
function deleteReview(id) {
  if (!confirm('确定删除这条复盘吗？')) return;
  DB.reviews = DB.reviews.filter(r => r.id !== id);
  saveDB(); renderReviews('review-list', 3); renderReviewFullList();
}

function toggleArchiveReview(id) {
  const r = DB.reviews.find(x => x.id === id);
  if (r) { r.archived = !r.archived; saveDB(); renderReviewFullList(); }
}

// === 查看详情 ===
function viewReviewDetail(id) {
  const r = DB.reviews.find(x => x.id === id);
  if (!r) return;
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  let body = `<h3>🔄 复盘详情</h3>`;
  body += `<div style="display:flex;gap:6px;margin-bottom:10px;">
    <span class="review-subject-tag" style="font-size:12px;">${subjName(r.subject)}</span>
    <span style="font-size:12px;color:#aaa;">📅 ${r.date}</span>
    ${r.archived ? '<span style="font-size:12px;color:#888;">📁 已归档</span>' : ''}
  </div>`;
  if (r.photoData) body += `<img class="detail-image" src="${r.photoData}" style="margin-bottom:10px;">`;
  body += `<div class="detail-section"><div>${esc(r.content || '暂无内容').replace(/\n/g, '<br>')}</div></div>`;
  if (r.linkedErrors && r.linkedErrors.length) {
    body += `<div class="detail-section"><strong>📎 关联错题（${r.linkedErrors.length}道）</strong>`;
    r.linkedErrors.forEach(eid => {
      const e = DB.errors.find(x => x.id === eid);
      if (e) {
        const subjName2 = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
        const summary = (e.type === 'text' ? e.content : '[图片题]').substring(0, 25);
        body += `<div class="linked-error" onclick="closeModal();switchTab('errors');setTimeout(()=>viewErrorDetail('${e.id}'),300);"><span>${esc(summary)}</span><span class="link-arrow">→</span></div>`;
      }
    });
    body += `</div>`;
  }
  body += `<div class="modal-btns">
    <button class="btn-primary" onclick="closeModal();syncReviewToCheckin('${r.id}')">✅ 同步打卡</button>
    <button class="btn-secondary" onclick="exportReviewText('${r.id}')">📤 导出文本</button>
  </div>`;
  showModal(`<div class="review-detail-content">${body}</div>`);
}

// === 同步打卡 ===
function syncReviewToCheckin(id) {
  const r = DB.reviews.find(x => x.id === id);
  if (!r) return;
  DB.checkins[r.date] = (DB.checkins[r.date] || 0) + 0.5;
  saveDB();
  alert('已为 ' + r.date + ' 同步打卡 +0.5小时！');
}

// === 导出复盘 ===
function exportReviewText(id) {
  const r = DB.reviews.find(x => x.id === id);
  if (!r) return;
  const text = `复盘日期：${r.date}\n${r.content || ''}\n关联错题：${(r.linkedErrors||[]).length}道`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = '复盘_' + r.date + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// === 渲染首页复盘预览 ===
function renderReviews(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let items = limit ? DB.reviews.slice(0, limit) : DB.reviews;
  const emptyDiv = document.getElementById('review-empty');
  if (!items.length) {
    container.innerHTML = '';
    if (emptyDiv) emptyDiv.classList.remove('hidden');
    return;
  }
  if (emptyDiv) emptyDiv.classList.add('hidden');
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  container.innerHTML = items.map(r => {
    const summary = (r.content || '').substring(0, 80) + (r.content && r.content.length > 80 ? '...' : '');
    return `
      <div class="review-card-new" onclick="switchTab('review');setTimeout(()=>viewReviewDetail('${r.id}'),300);">
        <div class="review-card-tags">
          <span class="review-subject-tag">${subjName(r.subject)}</span>
          ${r.linkedErrors && r.linkedErrors.length ? `<span class="review-error-count">📎 ${r.linkedErrors.length}道错题</span>` : ''}
        </div>
        <div class="review-summary">${esc(summary) || '暂无摘要'}</div>
        <div class="review-meta"><span>📅 ${r.date}</span>${r.archived ? '<span>📁 已归档</span>' : ''}</div>
      </div>`;
  }).join('');
}

// === 渲染复盘完整列表 ===
function renderReviewFullList() {
  const container = document.getElementById('review-full-list');
  const emptyState = document.getElementById('review-empty-state');
  if (!container) return;

  let items = [...DB.reviews];
  const searchTerm = (document.getElementById('review-search')?.value || '').trim().toLowerCase();
  if (searchTerm) {
    items = items.filter(r => (r.content || '').toLowerCase().includes(searchTerm));
  }

  // 按周期筛选
  const now = new Date();
  if (reviewPeriod === 'week') {
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 6);
    items = items.filter(r => r.date >= fmtDate(weekAgo));
  } else if (reviewPeriod === 'month') {
    const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
    items = items.filter(r => r.date >= fmtDate(monthAgo));
  }

  if (!items.length) {
    emptyState.style.display = 'flex';
    container.innerHTML = '';
    return;
  }
  emptyState.style.display = 'none';

  // 按日期分组
  const groups = {};
  items.forEach(r => {
    if (!groups[r.date]) groups[r.date] = [];
    groups[r.date].push(r);
  });
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };

  container.innerHTML = sortedDates.map(date => {
    const dayReviews = groups[date];
    const cards = dayReviews.map(r => {
      const summary = (r.content || '').substring(0, 100) + (r.content && r.content.length > 100 ? '...' : '');
      return `
        <div class="review-card-new ${r.archived ? 'archived' : ''}" onclick="viewReviewDetail('${r.id}')">
          <div class="review-card-tags">
            <span class="review-subject-tag">${subjName(r.subject)}</span>
            ${r.linkedErrors && r.linkedErrors.length ? `<span class="review-error-count" onclick="event.stopPropagation();showLinkedErrors('${r.id}')">📎 ${r.linkedErrors.length}道错题</span>` : ''}
            ${r.archived ? '<span style="font-size:11px;color:#888;">📁 已归档</span>' : ''}
          </div>
          <div class="review-summary">${esc(summary) || '暂无内容'}</div>
          <div class="review-meta"><span>📅 ${r.date}</span></div>
          <div class="review-actions" onclick="event.stopPropagation();">
            <button onclick="viewReviewDetail('${r.id}')">查看详情</button>
            <button onclick="toggleArchiveReview('${r.id}')">${r.archived ? '取消归档' : '归档'}</button>
            <button onclick="deleteReview('${r.id}')" style="color:#e74c3c;">删除</button>
          </div>
        </div>`;
    }).join('');
    const dayLabel = date === todayKey() ? '今天' : date;
    return `<div class="review-group"><div class="review-group-header">📅 ${dayLabel}（${dayReviews.length}条）</div>${cards}</div>`;
  }).join('');
}

function showLinkedErrors(reviewId) {
  const r = DB.reviews.find(x => x.id === reviewId);
  if (!r || !r.linkedErrors || !r.linkedErrors.length) return;
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  let list = r.linkedErrors.map(eid => {
    const e = DB.errors.find(x => x.id === eid);
    if (!e) return '';
    const summary = (e.type === 'text' ? e.content : '[图片题]').substring(0, 30);
    return `<div class="linked-error" onclick="closeModal();switchTab('errors');setTimeout(()=>viewErrorDetail('${e.id}'),300);"><span>${esc(summary)}</span><span style="font-size:11px;color:#aaa;">${subjName(e.subject)}</span><span class="link-arrow">→</span></div>`;
  }).join('');
  showModal(`<h3>📎 关联错题</h3><div style="margin-top:8px;">${list}</div><div class="modal-btns" style="margin-top:10px;"><button class="btn-secondary" onclick="closeModal()">关闭</button></div>`);
}

// === 语音辅助（保留） ===
function startReviewFieldVoice(field) {
  if (!navigator.mediaRecorder) { alert('当前浏览器不支持录音'); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const rec = new MediaRecorder(stream); const chunks = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        recognizeSpeech((text) => {
          const el = document.getElementById('rev-' + field);
          if (el) el.value = (el.value ? el.value + '\n' : '') + text;
        });
      };
      reader.readAsDataURL(blob);
    };
    rec.start();
    document.getElementById('voice-indicator').classList.remove('hidden');
    setTimeout(() => {
      if (rec.state !== 'inactive') rec.stop();
      document.getElementById('voice-indicator').classList.add('hidden');
    }, 3000);
  }).catch(() => alert('无法访问麦克风'));
}

// ===================== 错题记录（重构版） =====================
const ERROR_REASONS = [
  { key: 'knowledge-gap', label: '知识点盲区' },
  { key: 'exam-misread', label: '审题失误' },
  { key: 'careless', label: '计算粗心' },
  { key: 'timeout', label: '做题超时' },
  { key: 'trap', label: '掉入陷阱' },
  { key: 'other', label: '其他' },
];
let errorFilterType = 'all';
let errorFilterReason = 'all';
let errorBatchMode = false;
let errorSelected = {};

// === 录入 ===
function addErrorText() {
  let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
  let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
  showModal(`
    <h3>✍️ 手动录入错题</h3>
    <label>所属模块</label><select id="err-subject">${options}</select>
    <label>题干内容</label><textarea id="err-content" placeholder="输入或粘贴题干..." autofocus rows="3"></textarea>
    <label>正确答案</label><textarea id="err-right-answer" placeholder="正确答案..." rows="2"></textarea>
    <label>你的错误答案（选填）</label><textarea id="err-wrong-answer" placeholder="你当时选的错误答案..." rows="2"></textarea>
    <label>错因</label><select id="err-reason">${reasonOptions}</select>
    <label>错题反思（选填）</label><textarea id="err-note" placeholder="解题思路、易错点..." rows="2"></textarea>
    <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmAddError('text')">保存</button></div>
  `);
}

function addErrorReason() {
  let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
  let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
  showModal(`
    <h3>📝 记录错因</h3>
    <label>所属模块</label><select id="err-subject">${options}</select>
    <label>错因</label><select id="err-reason">${reasonOptions}</select>
    <label>错题反思</label><textarea id="err-content" placeholder="记录解题思路与反思..." autofocus rows="4"></textarea>
    <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmAddError('reason')">保存</button></div>
  `);
}

function confirmAddError(type) {
  const subject = val('err-subject');
  const content = val('err-content');
  const reason = val('err-reason') || '';
  const rightAnswer = val('err-right-answer') || '';
  const wrongAnswer = val('err-wrong-answer') || '';
  const note = val('err-note') || '';
  if (type === 'text' && !content) { alert('请输入题干内容'); return; }
  if (type === 'reason' && !content) { alert('请输入错题反思'); return; }
  DB.errors.unshift({
    id: Date.now().toString(), subject, date: todayKey(), type,
    content: type === 'text' ? content : (window._tempPhotoData || content),
    reason, rightAnswer, wrongAnswer, note,
    audioData: type === 'audio' ? (window._tempAudioData || '') : '',
    mastered: false, redoCount: 0, lastRedoResult: ''
  });
  saveDB(); renderErrors(); renderRecentErrors(); closeModal();
  window._tempPhotoData = ''; window._tempAudioData = '';
}

// === 拍照 ===
function capturePhoto() {
  showModal(`
    <h3>📷 拍照录题</h3>
    <p style="color:#888;font-size:13px;margin-bottom:14px;">选择图片来源</p>
    <div class="module-action-btns">
      <button class="module-action-btn timer-action" onclick="closeModal();openCamera()">
        <span class="action-icon">📸</span>
        <span class="action-label">拍摄照片</span>
        <span class="action-desc">直接调用相机拍摄题目</span>
      </button>
      <button class="module-action-btn record-action" onclick="closeModal();openGallery()">
        <span class="action-icon">🖼️</span>
        <span class="action-label">从相册选择</span>
        <span class="action-desc">从手机相册导入截图或照片</span>
      </button>
    </div>
    <div class="modal-btns" style="margin-top:12px;">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
    </div>
  `);
}

function openCamera() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = (ev) => handlePhotoFile(ev.target.files[0]);
  input.click();
}

function openGallery() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (ev) => handlePhotoFile(ev.target.files[0]);
  input.click();
}

function handlePhotoFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    compressImage(reader.result, 800, (compressed) => {
      window._tempPhotoData = compressed;
      let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
      let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
      showModal(`
        <h3>📷 拍照录题</h3>
        <img src="${compressed}" style="max-width:100%;border-radius:10px;margin-bottom:12px;">
        <label>所属模块</label><select id="err-subject">${options}</select>
        <label>正确答案（选填）</label><textarea id="err-right-answer" placeholder="正确答案..." rows="2"></textarea>
        <label>错因</label><select id="err-reason">${reasonOptions}</select>
        <label>备注（选填）</label><textarea id="err-content" placeholder="补充说明..."></textarea>
        <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmPhotoError()">保存</button></div>
      `);
    });
  };
  reader.readAsDataURL(file);
}

function confirmPhotoError() {
  const subject = val('err-subject');
  const rightAnswer = val('err-right-answer') || '';
  const reason = val('err-reason') || '';
  const note = val('err-content') || '';
  if (!window._tempPhotoData) { alert('拍照数据丢失'); return; }
  DB.errors.unshift({
    id: Date.now().toString(), subject, date: todayKey(), type: 'photo',
    content: window._tempPhotoData, reason, rightAnswer, note,
    mastered: false, redoCount: 0, lastRedoResult: ''
  });
  saveDB(); renderErrors(); renderRecentErrors(); closeModal();
  window._tempPhotoData = '';
}

function compressImage(dataURL, maxSize, cb) {
  const img = new Image();
  img.onload = () => {
    let w = img.width, h = img.height;
    if (w > maxSize) { h = h * (maxSize / w); w = maxSize; }
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    cb(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.src = dataURL;
}

// === 筛选 ===
function filterErrors(type) {
  errorFilterType = type;
  document.querySelectorAll('.error-filter-chip[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === type));
  renderErrors();
}

function filterErrorReason(reason) {
  errorFilterReason = reason;
  document.querySelectorAll('.error-filter-chip[data-reason]').forEach(b => b.classList.toggle('active', b.dataset.reason === reason));
  renderErrors();
}

// === 删除 ===
function deleteError(id) {
  if (!confirm('确定删除这道错题吗？')) return;
  DB.errors = DB.errors.filter(e => e.id !== id);
  saveDB(); renderErrors(); renderRecentErrors();
}

// === 掌握标记 ===
function toggleMastered(id) {
  const e = DB.errors.find(x => x.id === id);
  if (e) { e.mastered = !e.mastered; saveDB(); renderErrors(); renderRecentErrors(); }
}

// === 重做标记 ===
function markRedoResult(id, result) {
  const e = DB.errors.find(x => x.id === id);
  if (e) { e.redoCount++; e.lastRedoResult = result; saveDB(); renderErrors(); renderRecentErrors(); }
}

// === 批量操作 ===
function enterBatchMode() {
  errorBatchMode = true; errorSelected = {};
  renderErrors();
  document.getElementById('error-batch-bar').classList.remove('hidden');
}

function exitBatchMode() {
  errorBatchMode = false; errorSelected = {};
  renderErrors();
  document.getElementById('error-batch-bar').classList.add('hidden');
}

function toggleBatchSelect(id) {
  if (errorSelected[id]) delete errorSelected[id];
  else errorSelected[id] = true;
  renderErrors();
}

function batchDeleteErrors() {
  const ids = Object.keys(errorSelected);
  if (!ids.length) { alert('请先选择错题'); return; }
  if (!confirm('确定删除选中的 ' + ids.length + ' 道错题吗？')) return;
  DB.errors = DB.errors.filter(e => !errorSelected[e.id]);
  saveDB(); exitBatchMode(); renderErrors(); renderRecentErrors();
}

function batchExportErrors() {
  const ids = Object.keys(errorSelected);
  if (!ids.length) { alert('请先选择错题'); return; }
  const selected = DB.errors.filter(e => errorSelected[e.id]);
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const reasonName = (k) => { const r = ERROR_REASONS.find(x=>x.key===k); return r ? r.label : k; };
  let text = selected.map((e, i) => {
    return `【${i+1}】${subjName(e.subject)} · ${e.date}\n题干：${e.content || '(图片题)'}\n正确答案：${e.rightAnswer || '未填写'}\n错因：${reasonName(e.reason) || '未标注'}\n反思：${e.note || '无'}\n---`;
  }).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = '错题导出_' + todayKey() + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// === 详情页 ===
function viewErrorDetail(id) {
  const e = DB.errors.find(x => x.id === id);
  if (!e) return;
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const reasonName = (k) => { const r = ERROR_REASONS.find(x=>x.key===k); return r ? r.label : k; };
  let body = `
    <h3>❌ ${subjName(e.subject)}错题详情</h3>
    <div style="margin-bottom:8px;display:flex;gap:6px;">
      <span class="error-module-tag" style="font-size:12px;">${subjName(e.subject)}</span>
      ${e.reason ? `<span class="error-reason-tag" style="font-size:12px;">${reasonName(e.reason)}</span>` : ''}
    </div>`;
  if (e.type === 'photo') {
    body += `<img class="detail-image" src="${e.content}" alt="错题照片">`;
    if (e.note) body += `<div class="detail-field"><strong>备注</strong><div>${esc(e.note)}</div></div>`;
  } else if (e.type === 'audio') {
    body += `<audio controls src="${e.audioData}" style="width:100%;margin-bottom:8px;"></audio>`;
    if (e.content) body += `<div class="detail-field"><strong>备注</strong><div>${esc(e.content)}</div></div>`;
  } else {
    body += `<div class="detail-field"><strong>📝 题干</strong><div>${esc(e.content)}</div></div>`;
  }
  if (e.rightAnswer) body += `<div class="detail-field"><strong>✅ 正确答案</strong><div class="right-answer">${esc(e.rightAnswer)}</div></div>`;
  if (e.wrongAnswer) body += `<div class="detail-field"><strong>❌ 你的错误答案</strong><div class="wrong-answer">${esc(e.wrongAnswer)}</div></div>`;
  if (e.note && e.type !== 'photo') body += `<div class="detail-field"><strong>💡 错题反思</strong><div>${esc(e.note)}</div></div>`;
  body += `<div style="display:flex;gap:8px;margin-top:8px;font-size:12px;color:#aaa;"><span>📅 ${e.date}</span>${e.redoCount > 0 ? '<span>🔄 已重做 ' + e.redoCount + ' 次 · ' + e.lastRedoResult + '</span>' : ''}</div>`;
  body += `<div class="modal-btns" style="margin-top:14px;">
    <button class="btn-primary" onclick="addErrorToReview('${e.id}')">📥 加入今日复盘</button>
  </div>`;
  document.getElementById('error-detail-inner').innerHTML = body;
  document.getElementById('error-detail-modal').classList.remove('hidden');
}

function closeErrorDetail() {
  document.getElementById('error-detail-modal').classList.add('hidden');
}

function addErrorToReview(errorId) {
  const e = DB.errors.find(x => x.id === errorId);
  if (!e) return;
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const reasonName = (k) => { const r = ERROR_REASONS.find(x=>x.key===k); return r ? r.label : k; };
  const questionText = e.type === 'text' ? e.content : (e.note || '(图片/语音错题)');
  DB.reviews.unshift({
    id: Date.now().toString(), date: todayKey(), subject: e.subject, type: 'batch',
    content: `【从错题导入】\n\n错题：${questionText}\n正确答案：${e.rightAnswer || '无'}\n错因：${reasonName(e.reason) || '无'}\n反思：${e.note || '无'}`,
    linkedErrors: [errorId], archived: false
  });
  saveDB(); closeErrorDetail();
  alert('已加入今日复盘！');
  renderReviews('review-list', 3); renderReviewFullList();
}

// === 渲染 ===
function renderErrors() {
  const list = document.getElementById('error-list');
  const emptyState = document.getElementById('error-empty-state');
  const filterBar = document.getElementById('error-filter-bar');

  let errors = [...DB.errors];
  // 筛选类型
  if (errorFilterType !== 'all') {
    errors = errors.filter(e => {
      const s = SUBJECTS.find(x => x.key === e.subject);
      if (!s) return false;
      if (errorFilterType === 'xingce') return ['yanyu','luoji','shuliang','ziliao','changshi','zhengzhi'].includes(s.key);
      if (errorFilterType === 'shenlun') return s.key === 'shenlun';
      return false;
    });
  }
  // 筛选错因
  if (errorFilterReason === 'not-reviewed') {
    errors = errors.filter(e => e.redoCount === 0);
  } else if (errorFilterReason !== 'all') {
    errors = errors.filter(e => e.reason === errorFilterReason);
  }

  if (!errors.length && DB.errors.length === 0) {
    emptyState.style.display = 'flex';
    filterBar.classList.add('hidden');
    list.innerHTML = '';
    if (errorBatchMode) exitBatchMode();
    return;
  }
  emptyState.style.display = 'none';
  filterBar.classList.remove('hidden');

  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const reasonName = (k) => { const r = ERROR_REASONS.find(x=>x.key===k); return r ? r.label : k; };

  if (!errors.length) {
    list.innerHTML = '<div style="text-align:center;padding:30px;color:#bbb;font-size:14px;">没有符合条件的错题</div>';
    return;
  }

  list.innerHTML = errors.map(e => {
    const qText = e.type === 'text' ? e.content : (e.type === 'photo' ? '[图片题]' : '[语音题]');
    const summary = qText.length > 35 ? qText.substring(0, 35) + '...' : qText;
    const selected = errorBatchMode && errorSelected[e.id];
    const masteredCls = e.mastered ? ' mastered' : '';
    return `
      <div class="error-card-new${masteredCls}" onclick="${errorBatchMode ? '' : 'viewErrorDetail(\'' + e.id + '\')'}">
        ${errorBatchMode ? `<div class="error-batch-check${selected ? ' checked' : ''}" onclick="event.stopPropagation();toggleBatchSelect('${e.id}')">${selected ? '✓' : ''}</div>` : ''}
        <div class="error-tags">
          <span class="error-module-tag">${subjName(e.subject)}</span>
          ${e.reason ? `<span class="error-reason-tag">${reasonName(e.reason)}</span>` : ''}
          ${e.mastered ? '<span style="font-size:11px;color:#2e7d32;font-weight:600;">✅ 已掌握</span>' : ''}
        </div>
        <div class="error-question">${esc(summary)}</div>
        <div class="error-meta">
          <span class="error-meta-date">📅 ${e.date}</span>
          <span class="error-meta-redo">${e.redoCount > 0 ? '🔄 已重做' + e.redoCount + '次 · ' + e.lastRedoResult : '未二刷'}</span>
        </div>
        <div class="error-actions" onclick="event.stopPropagation();">
          <button onclick="viewErrorDetail('${e.id}')">查看原题</button>
          <button onclick="showRedoDialog('${e.id}')">立即重做</button>
          <button class="error-action-mastered" onclick="toggleMastered('${e.id}')">${e.mastered ? '恢复' : '已掌握'}</button>
          <button onclick="deleteError('${e.id}')" style="color:#e74c3c;">移出</button>
        </div>
      </div>`;
  }).join('');

  // 批量模式入口
  if (!errorBatchMode && errors.length > 0) {
    list.innerHTML += `<div style="text-align:center;margin-top:10px;"><button onclick="enterBatchMode()" style="background:none;border:1px dashed #ccc;border-radius:10px;padding:8px 20px;font-size:13px;color:#999;cursor:pointer;">📋 批量管理</button></div>`;
  }
}

function showRedoDialog(id) {
  showModal(`
    <h3>🔄 重做结果</h3>
    <p style="color:#888;font-size:13px;margin-bottom:12px;">重做完这道题了吗？记录结果吧</p>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn-confirm" style="width:100%;" onclick="closeModal();markRedoResult('${id}','答对了')">✅ 这次答对了</button>
      <button style="width:100%;padding:12px;font-size:15px;font-weight:600;border:none;border-radius:12px;cursor:pointer;background:#fde8e8;color:#c62828;" onclick="closeModal();markRedoResult('${id}','还是错了')">❌ 还是做错了</button>
    </div>
    <div class="modal-btns" style="margin-top:10px;"><button class="btn-secondary" onclick="closeModal()">取消</button></div>
  `);
}

function renderRecentErrors() {
  const container = document.getElementById('recent-errors');
  if (!container) return;
  const recent = DB.errors.slice(0, 3);
  if (!recent.length) {
    container.innerHTML = '<div class="empty-state">暂无错题</div>'; return;
  }
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const reasonName = (k) => { const r = ERROR_REASONS.find(x=>x.key===k); return r ? r.label : k; };
  container.innerHTML = recent.map(e => {
    const qText = e.type === 'text' ? e.content : (e.type === 'photo' ? '[图片题]' : '[语音题]');
    const summary = qText.length > 35 ? qText.substring(0, 35) + '...' : qText;
    return `
      <div class="error-card-new" onclick="switchTab('errors');setTimeout(()=>viewErrorDetail('${e.id}'),300);">
        <div class="error-tags">
          <span class="error-module-tag">${subjName(e.subject)}</span>
          ${e.reason ? `<span class="error-reason-tag">${reasonName(e.reason)}</span>` : ''}
        </div>
        <div class="error-question">${esc(summary)}</div>
        <div class="error-meta">
          <span class="error-meta-date">📅 ${e.date}</span>
          <span class="error-meta-redo">${e.redoCount > 0 ? '已重做' + e.redoCount + '次' : '未二刷'}</span>
        </div>
      </div>`;
  }).join('');
}

// === 微信式语音条 ===
let voiceBarStream = null, voiceBarRecorder = null, voiceBarChunks = [], voiceBarStartY = 0, voiceBarCancelled = false;
function startVoiceBar() {
  if (!navigator.mediaRecorder) { alert('当前浏览器不支持录音'); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    voiceBarStream = stream;
    voiceBarRecorder = new MediaRecorder(stream);
    voiceBarChunks = []; voiceBarCancelled = false; voiceBarStartY = 0;
    voiceBarRecorder.ondataavailable = (e) => voiceBarChunks.push(e.data);
    voiceBarRecorder.start();
    document.getElementById('voice-bar-overlay').classList.remove('hidden');
    document.getElementById('voice-bar-text').textContent = '正在录音...';
    document.getElementById('voice-bar-text').style.color = '#333';
    document.getElementById('voice-bar-overlay').addEventListener('pointermove', onVoiceBarMove);
    document.getElementById('voice-bar-overlay').addEventListener('pointerup', onVoiceBarUp);
  }).catch(() => alert('无法访问麦克风'));
}
function onVoiceBarMove(e) {
  if (!voiceBarStartY) voiceBarStartY = e.clientY;
  if (voiceBarStartY - e.clientY > 80) {
    voiceBarCancelled = true;
    document.getElementById('voice-bar-text').textContent = '松开取消';
    document.getElementById('voice-bar-text').style.color = '#e74c3c';
  } else {
    voiceBarCancelled = false;
    document.getElementById('voice-bar-text').textContent = '正在录音...';
    document.getElementById('voice-bar-text').style.color = '#333';
  }
}
function onVoiceBarUp() { stopVoiceBar(); }
function stopVoiceBar() {
  document.getElementById('voice-bar-overlay').classList.add('hidden');
  document.getElementById('voice-bar-overlay').removeEventListener('pointermove', onVoiceBarMove);
  document.getElementById('voice-bar-overlay').removeEventListener('pointerup', onVoiceBarUp);
  document.getElementById('voice-bar-text').style.color = '#333';
  if (voiceBarRecorder && voiceBarRecorder.state !== 'inactive') {
    voiceBarRecorder.onstop = () => {
      if (voiceBarStream) voiceBarStream.getTracks().forEach(t => t.stop());
      voiceBarStream = null;
      if (voiceBarCancelled) return;
      const blob = new Blob(voiceBarChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        window._tempAudioData = reader.result;
        let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
        let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
        showModal(`
          <h3>🎙️ 语音错题</h3>
          <audio controls src="${reader.result}" style="width:100%;margin-bottom:12px;"></audio>
          <label>所属模块</label><select id="err-subject">${options}</select>
          <label>错因</label><select id="err-reason">${reasonOptions}</select>
          <label>备注（选填）</label><textarea id="err-content" placeholder="补充..."></textarea>
          <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmAudioError()">保存</button></div>
        `);
      };
      reader.readAsDataURL(blob);
    };
    voiceBarRecorder.stop();
  }
}
function confirmAudioError() {
  const subject = val('err-subject');
  const reason = val('err-reason') || '';
  const note = val('err-content') || '';
  if (!window._tempAudioData) { alert('录音数据丢失'); return; }
  DB.errors.unshift({
    id: Date.now().toString(), subject, date: todayKey(), type: 'audio',
    content: note, reason, audioData: window._tempAudioData,
    mastered: false, redoCount: 0, lastRedoResult: ''
  });
  saveDB(); renderErrors(); renderRecentErrors(); closeModal();
  window._tempAudioData = '';
}

// === 旧版语音输入 ===
let mediaRecorder = null, audioChunks = [];
function startVoiceInput(mode) {
  if (!navigator.mediaRecorder) { alert('当前浏览器不支持录音'); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream); audioChunks = [];
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        if (mode === 'audio') {
          window._tempAudioData = reader.result;
          let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
          let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
          showModal(`
            <h3>🎙️ 语音错题</h3>
            <audio controls src="${reader.result}" style="width:100%;margin-bottom:12px;"></audio>
            <label>所属模块</label><select id="err-subject">${options}</select>
            <label>错因</label><select id="err-reason">${reasonOptions}</select>
            <label>备注（选填）</label><textarea id="err-content" placeholder="补充..."></textarea>
            <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmAudioError()">保存</button></div>
          `);
        } else {
          recognizeSpeech((text) => {
            let options = SUBJECTS.map(s => `<option value="${s.key}">${s.icon} ${s.name}</option>`).join('');
            let reasonOptions = ERROR_REASONS.map(r => `<option value="${r.key}">${r.label}</option>`).join('');
            showModal(`
              <h3>🎤 语音转文字录入</h3>
              <label>所属模块</label><select id="err-subject">${options}</select>
              <label>识别内容（可编辑）</label><textarea id="err-content" autofocus>${esc(text)}</textarea>
              <label>错因</label><select id="err-reason">${reasonOptions}</select>
              <div class="modal-btns"><button class="btn-secondary" onclick="closeModal()">取消</button><button class="btn-primary" onclick="confirmAddError('text')">保存</button></div>
            `);
          });
        }
      };
      reader.readAsDataURL(blob);
    };
    mediaRecorder.start();
    document.getElementById('voice-indicator').classList.remove('hidden');
  }).catch(() => alert('无法访问麦克风'));
}
function stopVoiceRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  document.getElementById('voice-indicator').classList.add('hidden');
}
function recognizeSpeech(cb) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { cb(''); alert('浏览器不支持语音识别'); return; }
  const rec = new SR();
  rec.lang = 'zh-CN'; rec.continuous = false; rec.interimResults = false;
  rec.onresult = (e) => { cb(e.results[0][0].transcript); };
  rec.onerror = () => { cb(''); alert('语音识别失败'); };
  rec.start();
}

// ===================== 打卡（重构版） =====================
let calendarDate = new Date();
let checkinSelectedDate = null;

// === 日历渲染 ===
function renderCalendar() {
  const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
  const container = document.getElementById('checkin-calendar');
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); const todayStr = fmtDate(today);
  const weekdays = '日一二三四五六';
  let html = `
    <div class="calendar-month-header">
      <button class="calendar-nav-btn" onclick="navMonth(-1)">‹ 上月</button>
      <h3>${year}年${month+1}月</h3>
      <button class="calendar-nav-btn" onclick="navMonth(1)">下月 ›</button>
    </div>
    <div class="calendar-weekdays">${weekdays.split('').map(w=>`<div>${w}</div>`).join('')}</div>
    <div class="calendar-grid">`;
  for (let i = 0; i < firstDay; i++) html += '<div class="calendar-cell-new" style="visibility:hidden"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const hasCheckin = DB.checkins[dateStr] && DB.checkins[dateStr].hours > 0;
    const hasErrors = DB.errors.some(e => e.date === dateStr);
    const hasReviews = DB.reviews.some(r => r.date === dateStr);
    const isToday = dateStr === todayStr;
    const isFuture = new Date(dateStr) > today && !isToday;
    const isSelected = dateStr === checkinSelectedDate;
    let dots = '';
    if (hasErrors) dots += '<span class="cell-dot cell-extra-dot"></span>';
    if (hasReviews) dots += `<span class="cell-dot ${hasErrors ? 'cell-extra-dot2' : 'cell-extra-dot'}"></span>`;
    html += `<div class="calendar-cell-new ${hasCheckin ? 'checked' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''} ${isSelected ? 'selected' : ''}" onclick="selectCalendarDate('${dateStr}')">
      <span>${d}</span>${hasCheckin || hasErrors || hasReviews ? dots : ''}</div>`;
  }
  html += '</div>';
  container.innerHTML = html;
  renderCheckinData();
  renderCheckinStats();
}

function navMonth(dir) { calendarDate.setMonth(calendarDate.getMonth() + dir); renderCalendar(); }

function selectCalendarDate(dateStr) {
  checkinSelectedDate = dateStr;
  renderCalendar();
}

// === 打卡数据渲染 ===
function renderCheckinData() {
  const card = document.getElementById('checkin-data-card');
  const emptyState = document.getElementById('checkin-empty-state');
  const dateStr = checkinSelectedDate || todayKey();

  const ck = DB.checkins[dateStr];
  const hasData = ck && ck.hours > 0;
  const isToday = dateStr === todayKey();

  if (!hasData && isToday && !checkinSelectedDate) {
    card.classList.add('hidden');
    emptyState.style.display = 'flex';
    return;
  }
  emptyState.style.display = 'none';

  // 计算当日数据
  const errors = DB.errors.filter(e => e.date === dateStr);
  const reviews = DB.reviews.filter(r => r.date === dateStr);
  const sessions = DB.studySessions.filter(s => s.date === dateStr);
  const totalSec = sessions.reduce((s, x) => s + x.durationSec, 0);
  const hours = ck ? ck.hours : (totalSec / 3600);
  const questions = ck ? (ck.questions || 0) : sessions.reduce((s, x) => s + x.count, 0);
  const correct = ck ? (ck.correct || 0) : sessions.reduce((s, x) => s + x.correct, 0);
  const acc = questions > 0 ? Math.round((correct / questions) * 100) : 0;

  document.getElementById('checkin-data-date').textContent = '📅 ' + dateStr + (isToday ? '（今天）' : '');
  document.getElementById('cd-hours').textContent = hours.toFixed(1) + 'h';
  document.getElementById('cd-questions').textContent = questions;
  document.getElementById('cd-accuracy').textContent = acc + '%';
  document.getElementById('cd-errors').textContent = errors.length;

  // 模块分布
  const moduleData = {};
  sessions.forEach(s => { if (!moduleData[s.subject]) moduleData[s.subject] = 0; moduleData[s.subject] += s.count; });
  const subjName = (k) => { const s = SUBJECTS.find(x=>x.key===k); return s ? s.name : k; };
  const maxQ = Math.max(...Object.values(moduleData), 1);
  const distHtml = Object.entries(moduleData).map(([k, v]) => {
    return `<div class="mod-dist-item"><span class="mod-dist-name">${subjName(k)}</span><div class="mod-dist-bar"><div class="mod-dist-fill" style="width:${(v/maxQ)*100}%"></div></div><span style="font-size:11px;color:#888;">${v}题</span></div>`;
  }).join('') || '<div style="font-size:12px;color:#bbb;">暂无模块分布数据</div>';
  document.getElementById('checkin-module-dist').innerHTML = distHtml;

  // 笔记
  const note = ck ? (ck.note || '') : '';
  document.getElementById('checkin-note-area').innerHTML = note ? esc(note) : '<span style="color:#bbb;font-size:13px;">暂无笔记，点击编辑添加</span>';

  card.classList.remove('hidden');
}

// === 统计板块 ===
function renderCheckinStats() {
  const section = document.getElementById('checkin-stats-section');
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    const ck = DB.checkins[key];
    if (ck && ck.hours > 0) streak++;
    else if (i > 0) break;
  }
  document.getElementById('cs-streak').textContent = streak + '天';

  let monthDays = 0, monthHours = 0, monthQuestions = 0;
  Object.entries(DB.checkins).forEach(([k, ck]) => {
    const d = new Date(k);
    if (d.getFullYear() === year && d.getMonth() === month && ck.hours > 0) {
      monthDays++; monthHours += ck.hours; monthQuestions += (ck.questions || 0);
    }
  });
  document.getElementById('cs-month-days').textContent = monthDays + '天';
  document.getElementById('cs-month-hours').textContent = monthHours.toFixed(1) + 'h';
  document.getElementById('cs-month-questions').textContent = monthQuestions;

  // 近7天正确率
  drawCheckinAccuracyChart();
  section.classList.remove('hidden');
}

function drawCheckinAccuracyChart() {
  const canvas = document.getElementById('checkin-accuracy-chart');
  const emptyDiv = document.getElementById('checkin-accuracy-empty');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const data = [], labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    labels.push((d.getMonth()+1) + '/' + d.getDate());
    let total = 0, corr = 0;
    const sessions = DB.studySessions.filter(s => s.date === key);
    sessions.forEach(s => { total += s.count; corr += s.correct; });
    data.push(total > 0 ? Math.round((corr / total) * 100) : null);
  }
  if (data.every(v => v === null)) {
    canvas.style.display = 'none'; emptyDiv.classList.remove('hidden'); return;
  }
  canvas.style.display = 'block'; emptyDiv.classList.add('hidden');
  drawLineChart(ctx, W, H, labels, data.map(v => v === null ? 0 : v), '#9b6bb0', 'rgba(155,107,176,0.12)');
}

// === 打卡编辑 ===
function openCheckin(dateStr) {
  checkinSelectedDate = dateStr;
  const ck = DB.checkins[dateStr] || { hours: 2, questions: 0, correct: 0, modules: [], errors: 0, reviewed: 'no', note: '' };

  document.getElementById('checkin-edit-title').textContent = '📅 ' + dateStr;
  document.getElementById('hour-slider').value = ck.hours || 2;
  document.getElementById('hour-display').textContent = parseFloat(ck.hours || 2).toFixed(1);
  document.getElementById('ck-questions').value = ck.questions || 0;
  document.getElementById('ck-correct').value = ck.correct || 0;
  document.getElementById('ck-errors').value = ck.errors || 0;
  document.getElementById('ck-reviewed').value = ck.reviewed || 'no';
  document.getElementById('ck-note').value = ck.note || '';

  // 模块勾选
  let moduleChecks = SUBJECTS.map(s => {
    return `<label><input type="checkbox" value="${s.key}" ${(ck.modules || []).includes(s.key) ? 'checked' : ''}>${s.icon}${s.name}</label>`;
  }).join('');
  document.getElementById('ck-modules').innerHTML = moduleChecks;

  document.getElementById('checkin-edit-modal').classList.remove('hidden');
}

function autoFillCheckin() {
  const dateStr = checkinSelectedDate || todayKey();
  const sessions = DB.studySessions.filter(s => s.date === dateStr);
  const errors = DB.errors.filter(e => e.date === dateStr);
  const reviews = DB.reviews.filter(r => r.date === dateStr);
  const totalSec = sessions.reduce((s, x) => s + x.durationSec, 0);
  const questions = sessions.reduce((s, x) => s + x.count, 0);
  const correct = sessions.reduce((s, x) => s + x.correct, 0);

  document.getElementById('hour-slider').value = Math.round(totalSec / 3600 * 10) / 10 || 2;
  document.getElementById('hour-display').textContent = parseFloat(document.getElementById('hour-slider').value).toFixed(1);
  document.getElementById('ck-questions').value = questions;
  document.getElementById('ck-correct').value = correct;
  document.getElementById('ck-errors').value = errors.length;
  document.getElementById('ck-reviewed').value = reviews.length > 0 ? 'yes' : 'no';

  // 自动勾选有数据的模块
  const activeModules = [...new Set(sessions.map(s => s.subject))];
  document.querySelectorAll('#ck-modules input[type="checkbox"]').forEach(cb => {
    cb.checked = activeModules.includes(cb.value);
  });

  alert('已自动读取今日数据！学习时长 ' + (totalSec / 3600).toFixed(1) + 'h，刷题 ' + questions + ' 道，错题 ' + errors.length + ' 道');
}

function syncTodayToCheckin() {
  autoFillCheckinForDate(todayKey());
}

function autoFillCheckinForDate(dateStr) {
  checkinSelectedDate = dateStr;
  openCheckin(dateStr);
  setTimeout(() => autoFillCheckin(), 100);
}

function closeCheckinModal() { document.getElementById('checkin-edit-modal').classList.add('hidden'); }

function confirmCheckin() {
  const hours = parseFloat(document.getElementById('hour-slider').value);
  const questions = parseInt(document.getElementById('ck-questions').value) || 0;
  const correct = parseInt(document.getElementById('ck-correct').value) || 0;
  const errors = parseInt(document.getElementById('ck-errors').value) || 0;
  const reviewed = document.getElementById('ck-reviewed').value;
  const note = document.getElementById('ck-note').value;
  const modules = [];
  document.querySelectorAll('#ck-modules input[type="checkbox"]:checked').forEach(cb => modules.push(cb.value));

  DB.checkins[checkinSelectedDate] = { hours, questions, correct, modules, errors, reviewed, note };
  saveDB(); renderCalendar(); renderMiniCalendar(); closeCheckinModal();

  if (reviewed === 'no') {
    setTimeout(() => {
      if (confirm('今日复盘还未完成，是否跳转到复盘页面？')) switchTab('review');
    }, 300);
  }
}

document.getElementById('hour-slider').addEventListener('input', (e) => {
  document.getElementById('hour-display').textContent = parseFloat(e.target.value).toFixed(1);
});

// ===================== 学习统计 =====================
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    DB.statsPeriod = btn.dataset.period;
    drawChart();
  });
});
function drawChart() {
  const canvas = document.getElementById('stats-chart');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const period = DB.statsPeriod || 'week';
  let labels = [], data = [];
  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = fmtDate(d);
      labels.push((d.getMonth()+1) + '/' + d.getDate());
      const ck = DB.checkins[key];
      data.push(ck ? (ck.hours || 0) : 0);
    }
  } else if (period === 'month') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push((d.getMonth()+1) + '/' + d.getDate());
      const ck2 = DB.checkins[fmtDate(d)];
      data.push(ck2 ? (ck2.hours || 0) : 0);
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      labels.push((d.getMonth()+1) + '月');
      let total = 0;
      Object.entries(DB.checkins).forEach(([k, ck]) => {
        const dd = new Date(k);
        if (dd.getFullYear() === d.getFullYear() && dd.getMonth() === d.getMonth()) total += (ck.hours || 0);
      });
      data.push(total);
    }
  }
  drawLineChart(ctx, W, H, labels, data, '#9b6bb0', 'rgba(155,107,176,0.12)');
  updateStatsSummary(data, period);
}
function drawLineChart(ctx, W, H, labels, data, color, fillColor) {
  const padL = 45, padR = 15, padT = 20, padB = 35;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...data, 1);
  const niceMax = Math.ceil(maxVal / 2) * 2 || 2;
  ctx.strokeStyle = '#eee'; ctx.lineWidth = 1;
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#999';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    const val = niceMax - (niceMax / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(1) + 'h', padL - 6, y + 3);
  }
  ctx.textAlign = 'center';
  const step = Math.ceil(labels.length / 7);
  labels.forEach((label, i) => {
    if (i % step === 0 || i === labels.length - 1) {
      const x = padL + (chartW / (labels.length - 1 || 1)) * i;
      ctx.fillText(label, x, H - padB + 18);
    }
  });
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = padL + (chartW / (data.length - 1 || 1)) * i;
    const y = padT + chartH - (v / niceMax) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.lineTo(padL, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = fillColor; ctx.fill();
  data.forEach((v, i) => {
    const x = padL + (chartW / (data.length - 1 || 1)) * i;
    const y = padT + chartH - (v / niceMax) * chartH;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  });
}
function updateStatsSummary(data, period) {
  const total = data.reduce((a, b) => a + b, 0);
  const avg = data.length > 0 ? (total / data.length) : 0;
  const max = Math.max(...data);
  const label = period === 'week' ? '本周' : period === 'month' ? '本月' : '全年';
  document.getElementById('stats-summary').innerHTML = `
    <div class="stat-row"><span>${label}总学习时长</span><span>${total.toFixed(1)} 小时</span></div>
    <div class="stat-row"><span>日均学习时长</span><span>${avg.toFixed(1)} 小时</span></div>
    <div class="stat-row"><span>单日最高时长</span><span>${max.toFixed(1)} 小时</span></div>
  `;
}

// ===================== 试卷分析（重构版） =====================
const PAPER_TYPES = [
  { key: 'guokao', label: '国考真题' },
  { key: 'shengkao', label: '省考真题' },
  { key: 'moni', label: '模拟卷' },
  { key: 'other', label: '其他' },
];

function addPaper() {
  let subScoreInputs = SUBJECTS.map(s => `
    <div class="form-row" style="margin-top:6px;">
      <label style="flex:2;margin-top:0;line-height:36px;">${s.icon} ${s.name}</label>
      <input id="psub-${s.key}" type="number" min="0" value="0" placeholder="正确" style="flex:1;">
      <input id="pmax-${s.key}" type="number" min="0" value="0" placeholder="总题" style="flex:1;">
    </div>`).join('');
  let typeOptions = PAPER_TYPES.map(t => `<option value="${t.key}">${t.label}</option>`).join('');
  showModal(`
    <h3>📋 录入试卷成绩</h3>
    <label>试卷名称</label><input id="paper-name" placeholder="例：2026国考行测模拟卷一" autofocus>
    <label>试卷类型</label><select id="paper-type">${typeOptions}</select>
    <div class="form-row">
      <div><label>正确题数</label><input id="paper-score" type="number" min="0" value="0"></div>
      <div><label>总题数</label><input id="paper-max" type="number" min="0" value="100"></div>
    </div>
    <label>做题日期</label><input id="paper-date" type="date" value="${todayKey()}">
    <label>做题时长（分钟）</label><input id="paper-time" type="number" min="0" value="0">
    <label style="margin-top:12px;">各模块正确率（正确 / 总题）</label>${subScoreInputs}
    <label>错题记录</label><textarea id="paper-mistakes" placeholder="记录本卷错题情况..." rows="2"></textarea>
    <label>遗忘知识点</label><textarea id="paper-notes" placeholder="记录遗忘的知识点..." rows="2"></textarea>
    <div class="modal-btns">
      <button class="btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn-primary" onclick="confirmAddPaper()">保存</button>
    </div>
  `);
}

function confirmAddPaper() {
  const name = val('paper-name'), type = val('paper-type');
  const correct = parseInt(val('paper-score')) || 0, total = parseInt(val('paper-max')) || 100;
  const date = val('paper-date') || todayKey(), timeMin = parseInt(val('paper-time')) || 0;
  const notes = val('paper-notes') || '', mistakes = val('paper-mistakes') || '';
  if (!name) { alert('请填写试卷名称'); return; }
  let subScores = {};
  SUBJECTS.forEach(s => {
    const sv = parseInt(val('psub-' + s.key)) || 0, mv = parseInt(val('pmax-' + s.key)) || 0;
    if (mv > 0) subScores[s.key] = { correct: sv, total: mv };
  });
  DB.papers.push({ id: Date.now().toString(), name, type, date, correct, total, timeMin, subScores, notes, mistakes, redo: false, reviewed: false });
  saveDB(); renderPapers(); renderPaperOverview();
  closeModal();
  // 提示联动
  setTimeout(() => {
    if (mistakes && confirm('试卷已保存！是否将错题导入错题库？')) batchImportPaperErrors(DB.papers[DB.papers.length - 1].id);
    else if (confirm('试卷已保存！是否生成复盘草稿？')) createPaperReview(DB.papers[DB.papers.length - 1].id);
  }, 300);
}

function batchImportPaperErrors(paperId) {
  const p = DB.papers.find(x => x.id === paperId);
  if (!p || !p.mistakes) return;
  const lines = p.mistakes.split('\n').filter(l => l.trim());
  lines.forEach(line => {
    DB.errors.unshift({ id: Date.now().toString() + Math.random(), subject: 'yanyu', date: p.date, type: 'text', content: line, reason: '', mastered: false, redoCount: 0, lastRedoResult: '' });
  });
  saveDB(); alert('已导入 ' + lines.length + ' 道错题！');
}

function createPaperReview(paperId) {
  const p = DB.papers.find(x => x.id === paperId);
  if (!p) return;
  const typeNames = { guokao:'国考真题', shengkao:'省考真题', moni:'模拟卷', other:'其他' };
  const acc = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
  let content = `【试卷复盘】${p.name}\n\n📊 正确率：${p.correct}/${p.total}（${acc}%）\n⏱ 用时：${p.timeMin}分钟\n\n`;
  if (Object.keys(p.subScores).length) {
    content += '模块分析：\n';
    Object.entries(p.subScores).forEach(([k, v]) => {
      const s = SUBJECTS.find(x => x.key === k);
      content += `- ${s ? s.name : k}：${v.correct}/${v.total}\n`;
    });
  }
  content += `\n错题：${p.mistakes || '无'}\n知识点：${p.notes || '无'}`;
  DB.reviews.unshift({ id: Date.now().toString(), date: p.date, subject: 'yanyu', type: 'batch', content, linkedErrors: [], archived: false });
  saveDB(); alert('复盘草稿已生成！');
}

function deletePaper(id) { DB.papers = DB.papers.filter(p => p.id !== id); saveDB(); renderPapers(); renderPaperOverview(); }

function renderPapers() {
  const filter = document.getElementById('paper-type-filter')?.value || 'all';
  let papers = [...DB.papers];
  if (filter !== 'all') {
    if (['guokao', 'shengkao', 'moni', 'other'].includes(filter)) {
      papers = papers.filter(p => p.type === filter);
    } else if (filter === 'xingce') {
      papers = papers.filter(p => p.type === 'guokao' || p.type === 'shengkao' || p.type === 'moni');
    }
  }
  const container = document.getElementById('paper-list');
  const emptyState = document.getElementById('paper-empty-state');
  if (!papers.length) {
    emptyState.style.display = 'flex';
    container.innerHTML = '';
    return;
  }
  emptyState.style.display = 'none';
  const typeNames = { guokao:'国考真题', shengkao:'省考真题', moni:'模拟卷', other:'其他' };
  papers.sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = papers.map(p => {
    const acc = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
    const subBadges = Object.entries(p.subScores || {}).slice(0, 4).map(([k, v]) => {
      const s = SUBJECTS.find(x => x.key === k);
      return `<span class="paper-sub-badge">${s ? s.name : k}: ${v.correct}/${v.total}</span>`;
    }).join('');
    return `
      <div class="paper-card">
        <div class="paper-card-header">
          <h3>${esc(p.name)}</h3>
          <span class="paper-type-tag ${p.type}">${typeNames[p.type] || p.type}</span>
        </div>
        <div class="paper-score">${acc}<span style="font-size:14px;color:#999;">% · ${p.correct}/${p.total}</span></div>
        <div class="paper-meta">
          <span>📅 ${p.date}</span><span>⏱ ${p.timeMin}分钟</span>
          ${p.redo ? '<span>🔄 已二刷</span>' : ''}${p.reviewed ? '<span>✅ 已复盘</span>' : ''}
        </div>
        ${subBadges ? `<div class="paper-sub-scores">${subBadges}</div>` : ''}
        <div class="paper-card-actions">
          <button onclick="viewPaperDetail('${p.id}')">查看详情</button>
          <button onclick="batchImportPaperErrors('${p.id}')">导入错题</button>
          <button onclick="createPaperReview('${p.id}')">生成复盘</button>
          <button onclick="deletePaper('${p.id}')" style="color:#e74c3c;">删除</button>
        </div>
      </div>`;
  }).join('');
}

function viewPaperDetail(id) {
  const p = DB.papers.find(x => x.id === id); if (!p) return;
  const typeNames = { guokao:'国考真题', shengkao:'省考真题', moni:'模拟卷', other:'其他' };
  const acc = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
  let subDetail = Object.entries(p.subScores || {}).map(([k, v]) => {
    const s = SUBJECTS.find(x => x.key === k);
    const subAcc = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
    return `<div class="stat-row"><span>${s ? s.name : k}</span><span>${v.correct}/${v.total} (${subAcc}%)</span></div>`;
  }).join('');
  document.getElementById('paper-detail-inner').innerHTML = `
    <h3>${esc(p.name)} <span class="paper-type-tag ${p.type}">${typeNames[p.type]}</span></h3>
    <div style="text-align:center;font-size:32px;font-weight:800;color:#9b6bb0;margin:12px 0;">${acc}%<span style="font-size:14px;color:#999;"> · ${p.correct}/${p.total}</span></div>
    <div class="stats-summary" style="margin-bottom:12px;">
      <div class="stat-row"><span>做题日期</span><span>${p.date}</span></div>
      <div class="stat-row"><span>做题时长</span><span>${p.timeMin}分钟</span></div>${subDetail}
    </div>
    ${p.mistakes ? `<div style="margin-bottom:8px;"><strong>错题记录：</strong><br>${esc(p.mistakes)}</div>` : ''}
    ${p.notes ? `<div><strong>遗忘知识点：</strong><br>${esc(p.notes)}</div>` : ''}
  `;
  document.getElementById('paper-detail-modal').classList.remove('hidden');
}

function closePaperDetail() { document.getElementById('paper-detail-modal').classList.add('hidden'); }

function toggleAnalysisChart() {
  const area = document.getElementById('analysis-chart-area');
  if (area.classList.contains('hidden')) { area.classList.remove('hidden'); drawAnalysisChart(); }
  else { area.classList.add('hidden'); }
}

function drawAnalysisChart() {
  const canvas = document.getElementById('analysis-chart-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  let papers = [...DB.papers].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!papers.length) { ctx.font = '14px sans-serif'; ctx.fillStyle = '#ccc'; ctx.textAlign = 'center'; ctx.fillText('暂无数据', W / 2, H / 2); return; }
  const labels = papers.map(p => { const d = new Date(p.date); return (d.getMonth() + 1) + '/' + d.getDate(); });
  const data = papers.map(p => p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0);
  const avg = data.length > 0 ? Math.round(data.reduce((a, b) => a + b, 0) / data.length) : 0;
  const max = Math.max(...data, 0), min = Math.min(...data, 100), latest = data[data.length - 1];
  document.getElementById('analysis-summary').innerHTML = `
    <div class="stat-row"><span>最近成绩</span><span>${latest}%</span></div>
    <div class="stat-row"><span>平均正确率</span><span>${avg}%</span></div>
    <div class="stat-row"><span>最高 / 最低</span><span>${max}% / ${min}%</span></div>
    <div class="stat-row"><span>试卷数量</span><span>${data.length} 套</span></div>`;
  drawLineChart(ctx, W, H, labels, data, '#9b6bb0', 'rgba(155,107,176,0.12)');
}

// ===================== 数据备份 =====================
function exportData() {
  const data = JSON.stringify(DB, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `公考小星球备份_${todayKey()}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('数据备份已下载，请保存到手机文件中。');
}
function importData() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.onchange = (ev) => {
    const file = ev.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!confirm(`确认从备份恢复？当前数据将被覆盖。`)) return;
        DB = { ...DB, ...imported };
        saveDB(); initAll();
        alert('数据恢复成功！');
      } catch(e) { alert('文件格式错误'); }
    };
    reader.readAsText(file);
  };
  input.click();
}
function clearAllData() {
  if (!confirm('⚠️ 确认清空所有数据？建议先导出备份。')) return;
  if (!confirm('再次确认：真的要删除所有数据吗？')) return;
  localStorage.removeItem(STORE_KEY);
  DB = { exams:[], records:{}, plans:{}, reviews:[], errors:[], checkins:{}, papers:[], statsPeriod:'week', studySessions:[] };
  initAll(); alert('数据已清空。');
}

// ===================== 工具函数 =====================
function val(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function esc(s) { if(!s) return ''; const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function showModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ===================== 初始化 =====================
function initAll() {
  renderHome();
  renderErrors();
  renderCalendar();
  renderPapers();
  drawChart();
}
loadDB();
initAll();
