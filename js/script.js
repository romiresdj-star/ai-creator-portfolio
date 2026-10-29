const ICONS = {
  image: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>',
  video: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="15" height="14" rx="2.5"/><path d="M17 10l5-3v10l-5-3"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>',
  close: '&times;'
};

let ALL_WORKS = [];
const activeSubcat = {};
let currentLanguage = "uk";
const UK_UI = {};

function uiText(key) {
  return currentLanguage === "en" ? EN_UI[key] : UK_UI[key];
}

function categoryText(category, field) {
  return currentLanguage === "en" ? EN_TAXONOMY[category.id][0] : category[field];
}

function subcategoryText(category, subcategory, field) {
  if (currentLanguage !== "en") return subcategory[field];
  const translation = EN_TAXONOMY[category.id][1][subcategory.id];
  return translation[field === "label" ? 0 : 1];
}

function updateContactLinks() {
  const message = currentLanguage === "en"
    ? "Hello! I'd like to commission a project. What's the best way to get started?"
    : "Привіт! Хочу замовити роботу. З чого краще почати?";
  document.querySelectorAll('a[href^="https://t.me/"], a[href^="https://wa.me/"]').forEach((link) => {
    link.href = link.href.split("?")[0] + "?text=" + encodeURIComponent(message);
  });
}

function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "uk";
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "en" ? EN_UI.pageTitle : UK_UI.pageTitle;
  document.querySelector('meta[name="description"]').content =
    currentLanguage === "en" ? EN_UI.pageDescription : UK_UI.pageDescription;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = uiText(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = uiText(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", uiText(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = uiText(element.dataset.i18nTitle);
  });
  document.querySelectorAll(".language-btn").forEach((button) => {
    const selected = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateContactLinks();
  if (ALL_WORKS.length) buildSections();
  if (lightboxItems.length) updateLightboxText();
  try { localStorage.setItem("portfolio-language", currentLanguage); } catch (_) {}
}

function initLanguage() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    UK_UI[element.dataset.i18n] = element.textContent;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    UK_UI[element.dataset.i18nHtml] = element.innerHTML;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    UK_UI[element.dataset.i18nAria] = element.getAttribute("aria-label");
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    UK_UI[element.dataset.i18nTitle] = element.title;
  });
  UK_UI.pageTitle = document.title;
  UK_UI.pageDescription = document.querySelector('meta[name="description"]').content;
  try {
    if (localStorage.getItem("portfolio-language") === "en") setLanguage("en");
  } catch (_) {}
  document.querySelectorAll(".language-btn").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
}

async function loadWorks() {
  try {
    const res = await fetch("data/works.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ALL_WORKS = await res.json();
    buildSections();
    updateStats();
  } catch (error) {
    document.getElementById("portfolio-sections").textContent = uiText("loadError") ||
      "Не вдалося завантажити портфоліо. Спробуйте пізніше.";
    console.error("Portfolio load failed:", error);
  }
}

function updateStats() {
  const real = ALL_WORKS.filter((w) => !w.placeholder).length;
  document.getElementById("stat-total").textContent = real;
  document.getElementById("stat-directions").textContent =
    PORTFOLIO_TAXONOMY.reduce((count, category) => count + category.subcategories.length, 0);
}

function buildSections() {
  const root = document.getElementById("portfolio-sections");
  root.innerHTML = "";

  PORTFOLIO_TAXONOMY.forEach((cat) => {
    activeSubcat[cat.id] ||= "all";

    const group = document.createElement("div");
    group.className = "category-group";
    group.id = `cat-${cat.id}`;

    group.innerHTML = `
      <div class="category-group-head">
        <div class="category-icon">${ICONS[cat.icon] || ""}</div>
        <div>
          <h3>${categoryText(cat, "label")}</h3>
          <p>${cat.subcategories.length} ${currentLanguage === "en"
            ? (cat.subcategories.length === 1 ? EN_UI.directionSingular : EN_UI.directionPlural)
            : (cat.subcategories.length === 1 ? "напрямок" : cat.subcategories.length < 5 ? "напрямки" : "напрямків") + " роботи"}</p>
        </div>
      </div>
      <div class="subcat-tabs" data-cat="${cat.id}">
        <button class="subcat-tab ${activeSubcat[cat.id] === "all" ? "active" : ""}" data-sub="all">${currentLanguage === "en" ? EN_UI.allWork : "Усі роботи"}</button>
        ${cat.subcategories
          .map((s) => `<button class="subcat-tab ${activeSubcat[cat.id] === s.id ? "active" : ""}" data-sub="${s.id}" title="${subcategoryText(cat, s, "desc")}">${subcategoryText(cat, s, "label")}</button>`)
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
  if (catId === "video") items.reverse();

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-note">${currentLanguage === "en" ? EN_UI.empty : "Робіт у цьому розділі поки немає — незабаром з'являться."}</p>`;
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
      const displayTitle = unit.isGroup
        ? workText(cover, "groupTitle", currentLanguage) || workText(cover, "title", currentLanguage)
        : workText(cover, "title", currentLanguage);

      return `
        <article class="work-card ${cover.placeholder ? "is-placeholder" : ""}" data-group-key="${unit.isGroup ? cover.group : ""}">
          <div class="work-thumb">
            <img src="${thumbSrc}" alt="${displayTitle}" loading="lazy">
            ${isVideo ? `<div class="play-badge"><span>${ICONS.play}</span></div>` : ""}
            ${unit.isGroup && unit.items.length > 1 ? `<span class="stack-badge">${unit.items.length} ${currentLanguage === "en" ? EN_UI.photos : "фото"}</span>` : ""}
          </div>
          <div class="work-info">
            <h4>${displayTitle}</h4>
            <p>${workText(cover, "description", currentLanguage)}</p>
            <span class="work-tag">${cover.placeholder ? (currentLanguage === "en" ? EN_UI.example : "Приклад") : taxSub ? subcategoryText(PORTFOLIO_TAXONOMY.find((c) => c.id === cover.category), taxSub, "label") : ""}</span>
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
    : `<img src="${item.type === "video" ? item.thumbnail : item.src}" alt="${workText(item, "title", currentLanguage)}">`;

  updateLightboxText();
}

function updateLightboxText() {
  const item = lightboxItems[lightboxIndex];
  document.getElementById("lightbox-title").textContent = workText(item, "title", currentLanguage);
  document.getElementById("lightbox-desc").textContent = workText(item, "description", currentLanguage);
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
  initLanguage();
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
