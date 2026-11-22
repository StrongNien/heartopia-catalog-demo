const items = [
  { id: 'rose', name: '晨露玫瑰', category: '花朵', emoji: '🌹', season: '春・夏', place: '庭院花圃', rarity: '★☆☆', color: '#f5e8e2', description: '清晨帶著露珠的玫瑰，花香淡淡的，常讓路過的人停下腳步。' },
  { id: 'tulip', name: '奶油鬱金香', category: '花朵', emoji: '🌷', season: '春', place: '山坡花田', rarity: '★★☆', color: '#f4eddf', description: '柔柔的奶油色花瓣，據說收到它的人會有好心情。' },
  { id: 'sunflower', name: '向日葵', category: '花朵', emoji: '🌻', season: '夏', place: '陽光草地', rarity: '★☆☆', color: '#f5f0d9', description: '總是朝著太陽的方向綻放，是小鎮夏日最明亮的風景。' },
  { id: 'bluebell', name: '藍風鈴', category: '花朵', emoji: '🪻', season: '春・秋', place: '林間小徑', rarity: '★★☆', color: '#e8e9f2', description: '微風吹過時輕輕搖曳，像是在和森林打招呼。' },
  { id: 'carp', name: '彩虹小鯉', category: '魚類', emoji: '🐠', season: '夏・秋', place: '湖泊', rarity: '★★★', color: '#e3edf0', description: '鱗片在水面下閃閃發亮，是湖邊居民最愛談起的魚。' },
  { id: 'goldfish', name: '橘橘金魚', category: '魚類', emoji: '🐟', season: '四季', place: '池塘', rarity: '★☆☆', color: '#f3e8df', description: '在池塘裡悠游的小金魚，午後常能看見牠們探出水面。' },
  { id: 'butterfly', name: '檸檬蝶', category: '昆蟲', emoji: '🦋', season: '春・夏', place: '花田', rarity: '★☆☆', color: '#f0efdc', description: '翅膀像灑上檸檬糖霜，喜歡在花叢間輕快飛舞。' },
  { id: 'ladybug', name: '紅點點瓢蟲', category: '昆蟲', emoji: '🐞', season: '春・夏', place: '菜園', rarity: '★☆☆', color: '#f3e5e0', description: '小小的紅色訪客，常停在葉片上曬太陽。' },
  { id: 'moth', name: '月光飛蛾', category: '昆蟲', emoji: '蛾', season: '夏・秋', place: '路燈旁', rarity: '★★☆', color: '#e9e9e0', description: '夜晚才出現的安靜旅人，總在暖色燈光附近盤旋。' },
  { id: 'strawberry', name: '草莓', category: '食材', emoji: '🍓', season: '春', place: '自家菜園', rarity: '★☆☆', color: '#f4e7e2', description: '酸酸甜甜的當季果實，剛摘下來最好吃。' },
  { id: 'peach', name: '蜜桃', category: '食材', emoji: '🍑', season: '夏', place: '果樹園', rarity: '★☆☆', color: '#f3e7df', description: '熟成時香氣滿滿，切開後是柔軟多汁的夏日滋味。' },
  { id: 'mushroom', name: '森林香菇', category: '食材', emoji: '🍄', season: '秋', place: '樹林深處', rarity: '★★☆', color: '#eae9df', description: '雨後在樹根旁悄悄冒出，帶著濃濃的森林香氣。' }
];

const grid = document.querySelector('#catalog-grid');
const searchInput = document.querySelector('#search-input');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const favoritesToggle = document.querySelector('#favorites-toggle');
const dialog = document.querySelector('#item-dialog');
const dialogContent = document.querySelector('#dialog-content');
const favoriteKey = 'heartopia-demo-favorites';
let activeCategory = '全部';
let favoritesOnly = false;
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(favoriteKey) || '[]'));
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
  } catch {
    // 收藏仍會在目前頁面工作；瀏覽器封鎖儲存時不影響其他功能。
  }
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchesQuery = `${item.name} ${item.category} ${item.place} ${item.season}`.toLocaleLowerCase().includes(query);
    const matchesFavorite = !favoritesOnly || favorites.has(item.id);
    return matchesCategory && matchesQuery && matchesFavorite;
  });

  grid.innerHTML = filtered.map((item) => `
    <article class="item-card" data-item-id="${item.id}" tabindex="0" role="button" aria-label="查看${item.name}詳細資料">
      <div class="item-art" style="--card-bg:${item.color}">
        <span class="item-category">${item.category}</span>
        <button class="favorite-button ${favorites.has(item.id) ? 'is-favorite' : ''}" type="button" aria-label="${favorites.has(item.id) ? '取消收藏' : '加入收藏'}：${item.name}" aria-pressed="${favorites.has(item.id)}">${favorites.has(item.id) ? '♥' : '♡'}</button>
        <span class="item-emoji" aria-hidden="true">${item.emoji}</span>
      </div>
      <div class="item-info"><div class="item-title-row"><span class="item-title">${item.name}</span><span class="item-season">${item.season}</span></div><div class="item-meta"><span>${item.place}</span><span class="item-rarity">${item.rarity}</span></div></div>
    </article>`).join('');

  resultCount.textContent = `顯示 ${filtered.length} 件收藏`;
  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
}

function openDetails(item) {
  dialogContent.innerHTML = `<div class="dialog-art" style="--card-bg:${item.color}" aria-hidden="true">${item.emoji}</div><div class="dialog-details"><span class="item-category">${item.category}</span><h2 id="dialog-title">${item.name}</h2><p>${item.description}</p><span class="dialog-tag">季節・${item.season}</span><span class="dialog-tag">地點・${item.place}</span><span class="dialog-tag">稀有度・${item.rarity}</span></div>`;
  dialog.showModal();
}

document.querySelector('.category-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll('.category-button').forEach((categoryButton) => {
    categoryButton.classList.toggle('active', categoryButton === button);
  });
  render();
});

searchInput.addEventListener('input', render);
favoritesToggle.addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  favoritesToggle.setAttribute('aria-pressed', String(favoritesOnly));
  favoritesToggle.innerHTML = `<span aria-hidden="true">${favoritesOnly ? '♥' : '♡'}</span> ${favoritesOnly ? '顯示全部收藏' : '只看我的收藏'}`;
  render();
});

grid.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('.favorite-button');
  const card = event.target.closest('[data-item-id]');
  if (!card) return;
  const item = items.find((entry) => entry.id === card.dataset.itemId);
  if (favoriteButton) {
    if (favorites.has(item.id)) favorites.delete(item.id);
    else favorites.add(item.id);
    saveFavorites();
    render();
    return;
  }
  openDetails(item);
});

grid.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-item-id]')) {
    event.preventDefault();
    openDetails(items.find((item) => item.id === event.target.dataset.itemId));
  }
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector('#reset-filters').addEventListener('click', () => {
  activeCategory = '全部';
  favoritesOnly = false;
  searchInput.value = '';
  favoritesToggle.setAttribute('aria-pressed', 'false');
  favoritesToggle.innerHTML = '<span aria-hidden="true">♡</span> 只看我的收藏';
  document.querySelectorAll('.category-button').forEach((button) => button.classList.toggle('active', button.dataset.category === '全部'));
  render();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
  }
});

render();
