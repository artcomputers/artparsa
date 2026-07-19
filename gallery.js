/* =========================================================
   ArtParsa — gallery.js  (shared by every page)

   THE ONLY PART YOU NEED TO TOUCH IS THE "SECTIONS" LIST BELOW.

   Each section is its own page:
     index.html  → home
     art.html    → Art
     photos.html → Photos
     ai.html     → AI Images

   For each section you set:
     id     – matches the page (art.html uses id "art", etc.)
     title  – the heading shown on the page and in the menu
     folder – where the images live
     prefix – the start of each file name
     ext    – the file extension (jpg, png, webp ...)
     count  – how many tiles to show

   With the defaults below, the pages expect files named:
       images/art/art-01.jpg ... art-30.jpg
       images/photos/photo-01.jpg ... photo-30.jpg
       images/ai/ai-01.jpg ... ai-30.jpg

   Just drop images with those names into the folders and they
   appear automatically — no code editing needed.

   Want custom names or captions? See the note further down.
   ========================================================= */

const SECTIONS = [
  { id: "art",    title: "Art",       folder: "images/art",    prefix: "art",   ext: "jpg", count: 30 },
  { id: "photos", title: "Photos",    folder: "images/photos", prefix: "photo", ext: "jpg", count: 30 },
  { id: "ai",     title: "AI Images", folder: "images/ai",     prefix: "ai",    ext: "jpg", count: 30 },
];

/* ----- OPTIONAL: custom file names + captions ---------------
   Give a section an "images" array to list files by hand (different
   names, or captions that show on hover and in the viewer). When
   present it is used instead of prefix/count:

   {
     id: "art", title: "Art", folder: "images/art",
     images: [
       "sunset.jpg",                                  // simple file name
       { src: "portrait.png", title: "Self, 2024" },  // file name + caption
     ]
   }
------------------------------------------------------------- */


/* =========================================================
   Below here is the engine. You don't need to change it.
   ========================================================= */

const pad = (n) => String(n).padStart(2, "0");

function imageList(section) {
  if (Array.isArray(section.images) && section.images.length) {
    return section.images.map((item) => {
      const obj = typeof item === "string" ? { src: item, title: "" } : item;
      const src = obj.src.includes("/") ? obj.src : `${section.folder}/${obj.src}`;
      return { src, title: obj.title || "" };
    });
  }
  return Array.from({ length: section.count || 0 }, (_, i) => ({
    src: `${section.folder}/${section.prefix}-${pad(i + 1)}.${section.ext}`,
    title: "",
  }));
}

function buildSection(section, index) {
  const images = imageList(section);

  const el = document.createElement("section");
  el.className = "section";

  el.innerHTML = `
    <div class="section-head">
      <span class="section-index">${pad(index + 1)}</span>
      <h1 class="section-title">${section.title}</h1>
      <span class="section-count">${images.length} ${images.length === 1 ? "image" : "images"}</span>
    </div>
    <div class="grid"></div>
  `;

  const grid = el.querySelector(".grid");

  images.forEach((img, i) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", `${section.title} ${i + 1}`);

    const number = document.createElement("span");
    number.className = "tile-placeholder";
    number.textContent = pad(i + 1);
    tile.appendChild(number);

    const picture = document.createElement("img");
    picture.loading = "lazy";
    picture.alt = img.title || `${section.title} ${i + 1}`;

    // Mark the tile as ready once the image actually loads.
    const reveal = () => {
      if (tile.classList.contains("has-image")) return;
      tile.classList.add("has-image");
      if (img.title) {
        tile.classList.add("has-caption");
        const cap = document.createElement("span");
        cap.className = "tile-caption";
        cap.textContent = img.title;
        tile.appendChild(cap);
      }
      tile.dataset.full = img.src;
      tile.dataset.caption = img.title || "";
    };

    picture.addEventListener("load", reveal);
    // If the file isn't there, leave the numbered placeholder in place.
    picture.addEventListener("error", () => {});

    // Put the image in the tile BEFORE setting src, then load it.
    // (Setting src after the element is in the page lets lazy-loading
    //  and the load event work reliably.)
    tile.appendChild(picture);
    picture.src = img.src;

    // Handle images that were already cached and finished instantly.
    if (picture.complete && picture.naturalWidth > 0) reveal();

    grid.appendChild(tile);
  });

  return el;
}

/* "Continue to" links shown at the foot of a section page */
function buildMore(currentId, container) {
  const others = SECTIONS.filter((s) => s.id !== currentId);
  if (!others.length) return;

  const more = document.createElement("nav");
  more.className = "more";
  more.setAttribute("aria-label", "Other sections");
  more.innerHTML = `<span class="more-label">More</span>`;

  others.forEach((s) => {
    const a = document.createElement("a");
    a.className = "more-link";
    a.href = `${s.id}.html`;
    a.innerHTML = `<span>${s.title}</span><span class="more-arrow" aria-hidden="true">&rarr;</span>`;
    more.appendChild(a);
  });

  container.appendChild(more);
}

/* Home page: an index of the three sections */
function buildHome(container) {
  SECTIONS.forEach((s, i) => {
    const count = imageList(s).length;
    const a = document.createElement("a");
    a.className = "index-row";
    a.href = `${s.id}.html`;
    a.innerHTML = `
      <span class="index-num">${pad(i + 1)}</span>
      <span class="index-title">${s.title}</span>
      <span class="index-count">${count} images</span>
      <span class="index-arrow" aria-hidden="true">&rarr;</span>
    `;
    container.appendChild(a);
  });
}

/* ---------- wire up the current page ---------- */
const mount = document.getElementById("mount");
if (mount) {
  const id = mount.dataset.section;
  const index = SECTIONS.findIndex((s) => s.id === id);
  if (index > -1) {
    mount.appendChild(buildSection(SECTIONS[index], index));
    buildMore(id, mount);
  }
}

const home = document.getElementById("home");
if (home) buildHome(home);

/* highlight the menu link for the current page */
const page = document.body.dataset.page;
document.querySelectorAll(".nav a").forEach((a) => {
  a.classList.toggle("is-active", a.dataset.link === page);
});

/* ---------- branding: tab icon + small corner logo ---------- */
/* Your logo image. Put a file with this name next to index.html.
   To use a different logo later, just replace that file (or change
   this name). Square images look best. */
const LOGO_FILE = "logo.jpg";

(function brand() {
  // browser tab icon (favicon)
  if (!document.querySelector('link[rel="icon"][data-brand]')) {
    const fav = document.createElement("link");
    fav.rel = "icon";
    fav.href = LOGO_FILE;
    fav.setAttribute("data-brand", "");
    document.head.appendChild(fav);
  }
  // logo in the corner, next to the ArtParsa name
  const wordmark = document.querySelector(".wordmark");
  if (wordmark && !wordmark.querySelector(".brandmark")) {
    const logo = document.createElement("img");
    logo.className = "brandmark";
    logo.src = LOGO_FILE;
    logo.alt = "";
    logo.setAttribute("aria-hidden", "true");
    wordmark.prepend(logo);
  }
})();

/* ---------- lightbox (full-size viewer) ---------- */
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let groupTiles = [];
  let pointer = 0;

  const showCurrent = () => {
    const tile = groupTiles[pointer];
    lbImage.src = tile.dataset.full;
    lbImage.alt = tile.dataset.caption || "";
    lbCaption.textContent = tile.dataset.caption || "";
  };

  const openAt = (tile) => {
    const grid = tile.closest(".grid");
    groupTiles = Array.from(grid.querySelectorAll(".tile.has-image"));
    pointer = groupTiles.indexOf(tile);
    if (pointer < 0) return;
    showCurrent();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lbImage.src = "";
    document.body.style.overflow = "";
  };

  const step = (dir) => {
    if (!groupTiles.length) return;
    pointer = (pointer + dir + groupTiles.length) % groupTiles.length;
    showCurrent();
  };

  document.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile.has-image");
    if (tile) openAt(tile);
  });
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => step(-1));
  lbNext.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

/* ---------- animated moiré background (all pages) ---------- */
/* Loads p5.js, then background.js, which draws the chromatic
   wave-lines behind the page. Strength is set by --fx-opacity
   in styles.css. To disable the background entirely, delete or
   comment out this block. */
(function loadBackground() {
  if (document.getElementById("bgfx-loader")) return;
  const p5s = document.createElement("script");
  p5s.id = "bgfx-loader";
  p5s.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js";
  p5s.onload = () => {
    const bg = document.createElement("script");
    bg.src = "background.js";
    document.body.appendChild(bg);
  };
  document.body.appendChild(p5s);
})();
