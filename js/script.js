const ICONS = {
  image: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>',
  video: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="15" height="14" rx="2.5"/><path d="M17 10l5-3v10l-5-3"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>',
  close: '&times;'
};

let ALL_WORKS = [];
const activeSubcat = {};

async function loadWorks() {
  const res = await fetch("data/works.json");
  ALL_WORKS = await res.json();
  buildSections();
  updateStats();
}

function updateStats() {
  const real = ALL_WORKS.filter((w) => !w.placeholder).length;
  document.getElementById("stat-total").textContent = real;
}

function buildSections() {
  const root = document.getElementById("portfolio-sections");
  root.innerHTML = "";

  PORTFOLIO_TAXONOMY.forEach((cat) => {
    activeSubcat[cat.id] = "all";

    const group = document.createElement("div");
    group.className = "category-group";
    group.id = `cat-${cat.id}`;

    group.innerHTML = `
      <div class="category-group-head">
        <div class="category-icon">${ICONS[cat.icon] || ""}</div>
        <div>
          <h3>${cat.label}</h3>
          <p>${cat.subcategories.length} напрямки роботи</p>
        </div>
      </div>
      <div class="subcat-tabs" data-cat="${cat.id}">
        <button class="subcat-tab active" data-sub="all">Усі роботи</button>
        ${cat.subcategories
          .map((s) => `<button class="subcat-tab" data-sub="${s.id}" title="${s.desc}">${s.label}</button>`)
          .join("")}
      </div>
      <div class="work-grid" data-grid="${cat.id}"></div>
    `;

    root.appendChild(group);
  });

  root.querySelectorAll(".subcat-tabs").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".subcat-tab");
      if (!btn) return;
      const catId = tabs.dataset.cat;
      tabs.querySelectorAll(".subcat-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeSubcat[catId] = btn.dataset.sub;
      renderGrid(catId);
    });
  });

  PORTFOLIO_TAXONOMY.forEach((cat) => renderGrid(cat.id));
}

function renderGrid(catId) {
  const grid = document.querySelector(`[data-grid="${catId}"]`);
  const sub = activeSubcat[catId];
  const items = ALL_WORKS.filter(
    (w) => w.category === catId && (sub === "all" || w.subcategory === sub)
  );

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-note">Робіт у цьому розділі поки немає — незабаром з'являться.</p>`;
    return;
  }

  // Cluster items that share a "group" id into a single album card.
  const units = [];
  const groupIndex = new Map();
  items.forEach((item) => {
    if (item.group) {
      if (groupIndex.has(item.group)) {
        groupIndex.get(item.group).items.push(item);
      } else {
        const unit = { isGroup: true, items: [item] };
        groupIndex.set(item.group, unit);
        units.push(unit);
      }
    } else {
      units.push({ isGroup: false, items: [item] });
    }
  });

  grid.innerHTML = units
    .map((unit) => {
      const cover = unit.items[0];
      const taxSub = PORTFOLIO_TAXONOMY.find((c) => c.id === cover.category)
        ?.subcategories.find((s) => s.id === cover.subcategory);
      const thumbSrc = cover.type === "video" ? cover.thumbnail : cover.src;
      const isVideo = cover.type === "video";
      const displayTitle = unit.isGroup ? cover.groupTitle || cover.title : cover.title;

      return `
        <article class="work-card ${cover.placeholder ? "is-placeholder" : ""}" data-group-key="${unit.isGroup ? cover.group : ""}">
          <div class="work-thumb">
            <img src="${thumbSrc}" alt="${displayTitle}" loading="lazy">
            ${isVideo ? `<div class="play-badge"><span>${ICONS.play}</span></div>` : ""}
            ${unit.isGroup && unit.items.length > 1 ? `<span class="stack-badge">${unit.items.length} фото</span>` : ""}
          </div>
          <div class="work-info">
            <h4>${displayTitle}</h4>
            <p>${cover.description || ""}</p>
            <span class="work-tag">${cover.placeholder ? "Приклад" : taxSub?.label || ""}</span>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll(".work-card").forEach((card, i) => {
    card.addEventListener("click", () => openLightbox(units[i].items, 0));
  });
}

let lightboxItems = [];
let lightboxIndex = 0;

function openLightbox(items, index) {
  lightboxItems = items;
  lightboxIndex = index;
  renderLightboxItem();
  document.getElementById("lightbox").classList.add("open");
  document.getElementById("lightbox-prev").style.display = items.length > 1 ? "flex" : "none";
  document.getElementById("lightbox-next").style.display = items.length > 1 ? "flex" : "none";
}

function renderLightboxItem() {
  const item = lightboxItems[lightboxIndex];
  const mediaWrap = document.getElementById("lightbox-media");
  const title = document.getElementById("lightbox-title");
  const desc = document.getElementById("lightbox-desc");

  const showAsVideo = item.type === "video" && !item.placeholder;

  mediaWrap.innerHTML = showAsVideo
    ? `<video src="${item.src}" controls autoplay></video>`
    : `<img src="${item.type === "video" ? item.thumbnail : item.src}" alt="${item.title}">`;

  title.textContent = item.title;
  desc.textContent = item.description || "";
}

function lightboxStep(delta) {
  if (lightboxItems.length < 2) return;
  lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
  renderLightboxItem();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightbox-media").innerHTML = "";
  lightbox.classList.remove("open");
  lightboxItems = [];
  lightboxIndex = 0;
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

document.addEventListener("DOMContentLoaded", () => {
  loadWorks();
  initNav();
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => lightboxStep(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => lightboxStep(1));
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxStep(-1);
    if (e.key === "ArrowRight") lightboxStep(1);
  });
});
