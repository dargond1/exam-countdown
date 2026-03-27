const STORAGE_KEY = 'countdown_custom_items_v1';
const THEME_KEY = 'countdown_theme_v1';

const officialEvents = [
  {
    id: 'exam-cet-set-2026-1',
    title: 'CET-SET 2026 上半年口试',
    note: '全国大学英语四、六级口试',
    datetime: '2026-05-23T09:00:00+08:00',
    category: 'exam',
    source: 'official',
  },
  {
    id: 'exam-cet-2026-1',
    title: 'CET 2026 上半年笔试',
    note: '全国大学英语四、六级笔试',
    datetime: '2026-06-13T09:00:00+08:00',
    category: 'exam',
    source: 'official',
  },
  {
    id: 'exam-ncre-2026-3',
    title: 'NCRE 2026 年 3 月考试',
    note: '全国计算机等级考试',
    datetime: '2026-03-28T09:00:00+08:00',
    category: 'exam',
    source: 'official',
  },
  {
    id: 'exam-ntce-interview-2026-1',
    title: 'NTCE 2026 上半年面试',
    note: '中小学教师资格考试面试',
    datetime: '2026-05-16T09:00:00+08:00',
    category: 'exam',
    source: 'official',
  },
  {
    id: 'exam-ky-2026',
    title: '2026 考研初试',
    note: '全国硕士研究生招生考试初试（用于回顾）',
    datetime: '2025-12-20T08:30:00+08:00',
    category: 'exam',
    source: 'official',
  },
];

const el = {
  nowText: document.querySelector('#now-text'),
  nextName: document.querySelector('#next-name'),
  nextLeft: document.querySelector('#next-left'),
  totalCount: document.querySelector('#total-count'),
  resultCount: document.querySelector('#result-count'),
  eventList: document.querySelector('#event-list'),
  template: document.querySelector('#event-item-template'),
  addForm: document.querySelector('#add-form'),
  searchInput: document.querySelector('#search-input'),
  categoryFilter: document.querySelector('#category-filter'),
  statusFilter: document.querySelector('#status-filter'),
  sortFilter: document.querySelector('#sort-filter'),
  resetCustom: document.querySelector('#reset-custom'),
  themeToggle: document.querySelector('#theme-toggle'),
};

function loadCustomEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCustomEvents(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  }).format(date);
}

function getRemainingParts(dateString) {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diff = target - now;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  return { diff, days, hours, minutes };
}

function countdownText(dateString) {
  const { diff, days, hours, minutes } = getRemainingParts(dateString);
  if (diff >= 0) {
    return `还有 ${days} 天 ${hours} 小时 ${minutes} 分钟`;
  }
  return `已过去 ${days} 天 ${hours} 小时 ${minutes} 分钟`;
}

function getAllEvents() {
  return [...officialEvents, ...loadCustomEvents()];
}

function applyFilters(items) {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const category = el.categoryFilter.value;
  const status = el.statusFilter.value;
  const sort = el.sortFilter.value;

  let filtered = items.filter((item) => {
    const matchesKeyword = !keyword || `${item.title} ${item.note || ''}`.toLowerCase().includes(keyword);
    const matchesCategory = category === 'all' || item.category === category;
    const isUpcoming = new Date(item.datetime).getTime() >= Date.now();
    const matchesStatus =
      status === 'all' ||
      (status === 'upcoming' && isUpcoming) ||
      (status === 'past' && !isUpcoming);
    return matchesKeyword && matchesCategory && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'zh-CN');
    if (sort === 'latest') return new Date(b.datetime) - new Date(a.datetime);
    return new Date(a.datetime) - new Date(b.datetime);
  });

  return filtered;
}

function renderStats(items) {
  el.nowText.textContent = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

  const upcoming = items
    .filter((item) => new Date(item.datetime).getTime() >= Date.now())
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))[0];

  el.totalCount.textContent = String(items.length);
  el.nextName.textContent = upcoming ? upcoming.title : '暂无未结束事件';
  el.nextLeft.textContent = upcoming ? countdownText(upcoming.datetime) : '可以添加新的 DDL';
}

function makeBadge(text, className = '') {
  const span = document.createElement('span');
  span.className = `badge ${className}`.trim();
  span.textContent = text;
  return span;
}

function renderList() {
  const items = getAllEvents();
  const filtered = applyFilters(items);
  renderStats(items);
  el.resultCount.textContent = `${filtered.length} 条结果`;
  el.eventList.innerHTML = '';

  if (!filtered.length) {
    el.eventList.innerHTML = '<div class="card-lite">没有匹配结果，换个筛选条件试试。</div>';
    return;
  }

  filtered.forEach((item) => {
    const node = el.template.content.firstElementChild.cloneNode(true);
    const badges = node.querySelector('.badges');
    const title = node.querySelector('.title');
    const note = node.querySelector('.note');
    const time = node.querySelector('.time');
    const countdown = node.querySelector('.countdown');
    const deleteBtn = node.querySelector('.delete-btn');

    const isUpcoming = new Date(item.datetime).getTime() >= Date.now();
    badges.append(
      makeBadge(item.category === 'exam' ? '考试' : 'DDL'),
      makeBadge(item.source === 'official' ? '官方内置' : '本地自定义', 'gray'),
      makeBadge(isUpcoming ? '未结束' : '已结束', isUpcoming ? '' : 'danger')
    );

    title.textContent = item.title;
    note.textContent = item.note || '无备注';
    time.textContent = `时间：${formatDate(item.datetime)}`;
    countdown.textContent = countdownText(item.datetime);

    if (item.source === 'official') {
      deleteBtn.remove();
    } else {
      deleteBtn.addEventListener('click', () => {
        const next = loadCustomEvents().filter((customItem) => customItem.id !== item.id);
        saveCustomEvents(next);
        renderList();
      });
    }

    el.eventList.appendChild(node);
  });
}

function initForm() {
  el.addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(el.addForm);
    const title = String(formData.get('title') || '').trim();
    const datetimeRaw = String(formData.get('datetime') || '').trim();
    const note = String(formData.get('note') || '').trim();

    if (!title || !datetimeRaw) return;

    const datetime = new Date(datetimeRaw);
    const item = {
      id: `custom-${crypto.randomUUID()}`,
      title,
      datetime: datetime.toISOString(),
      note,
      category: 'ddl',
      source: 'custom',
    };

    const next = [...loadCustomEvents(), item];
    saveCustomEvents(next);
    el.addForm.reset();
    renderList();
  });
}

function initFilters() {
  [el.searchInput, el.categoryFilter, el.statusFilter, el.sortFilter].forEach((target) => {
    target.addEventListener('input', renderList);
    target.addEventListener('change', renderList);
  });

  el.resetCustom.addEventListener('click', () => {
    const ok = window.confirm('确定要清空所有自定义 DDL 吗？此操作无法撤销。');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    renderList();
  });
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') document.body.classList.add('dark');
  el.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

initForm();
initFilters();
initTheme();
renderList();
setInterval(renderList, 1000);
