/* ============================================
   Data
   Replace the src URLs with your own images —
   just keep the category values matching the
   filter buttons in index.html (mountain, ocean,
   forest, desert).
   ============================================ */
const imageData = [
  { src: "Nanga Parbat.png", category: "mountain", title: "Nanga Parbat", tag: "Mountain",
    desc: "Nanga Parbat is the ninth-highest mountain on Earth, known for its massive vertical relief and its local name Diamer." },
  { src: "K2.png", category: "mountain", title: "K2", tag: "Mountain",
    desc: "K2 is the second-highest peak on Earth and part of the Karakoram range, regarded as one of the most technically demanding climbs in the world." },
  { src: "Tirich Mir.png", category: "mountain", title: "Tirich Mir", tag: "Mountain",
    desc: "Tirich Mir is the highest peak in the Hindu Kush range, rising above the Chitral valley in northern Pakistan." },
  { src: "Saif-ul-Malook.png", category: "lake", title: "Saif-ul-Malook", tag: "Lake",
    desc: "Lake Saif-ul-Malook sits at the northern end of the Kaghan Valley, fed by glacial meltwater from the surrounding peaks." },
  { src: "Attabad.png", category: "lake", title: "Attabad", tag: "Lake",
    desc: "Attabad Lake formed in 2010 after a landslide dammed the Hunza River, submerging part of the valley beneath its turquoise water." },
  { src: "Satpara.png", category: "lake", title: "Satpara", tag: "Lake",
    desc: "Satpara Lake lies near Skardu, held by a natural moraine dam and now also feeding a reservoir built along its outlet." },
  { src: "Hunza.png", category: "valley", title: "Hunza", tag: "Valley",
    desc: "Hunza Valley is known for its terraced orchards, old mountain villages, and views of Rakaposhi framing the horizon." },
  { src: "Swat.png", category: "valley", title: "Swat", tag: "Valley",
    desc: "Swat Valley is fed by the Swat River and is often called the Switzerland of Pakistan for its forested slopes and river meadows." },
  { src: "Neelum.png", category: "valley", title: "Neelum", tag: "Valley",
    desc: "Neelum Valley runs alongside the Neelum River in Azad Kashmir, bordered by pine forests and steep mountain walls." },
  { src: "Thar.png", category: "desert", title: "Thar", tag: "Desert",
    desc: "The Thar Desert stretches across southeastern Pakistan and northwestern India, one of the most densely populated deserts on Earth." },
  { src: "Cholistan.png", category: "desert", title: "Cholistan", tag: "Desert",
    desc: "Cholistan Desert extends into Punjab province, dotted with old forts and seasonal grazing lands used by its nomadic communities." },
  { src: "Thal.png", category: "desert", title: "Thal", tag: "Desert",
    desc: "Thal Desert lies between the Indus and Jhelum rivers in Punjab, characterized by shifting sand ridges and sparse vegetation." },
];

const gallery = document.getElementById("gallery");
const filterBtns = document.querySelectorAll(".filter-btn");

/* ============================================
   Render gallery items
   ============================================ */
function renderGallery() {
  gallery.innerHTML = "";
  imageData.forEach((item, index) => {
    const fig = document.createElement("figure");
    fig.className = "item";
    fig.dataset.category = item.category;
    fig.dataset.index = index;
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", `Open ${item.title}`);

    fig.innerHTML = `
      <span class="index-mark">No. ${String(index + 1).padStart(2, "0")}</span>
      <img src="${item.src}" alt="${item.title}" loading="lazy" />
      <figcaption class="label">
        <span class="tag">${item.tag}</span>
        <span class="title">${item.title}</span>
      </figcaption>
    `;

    fig.addEventListener("click", () => openLightbox(index));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });

    gallery.appendChild(fig);
  });
}

/* ============================================
   Filtering
   ============================================ */
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    document.querySelectorAll(".item").forEach((el) => {
      const match = filter === "all" || el.dataset.category === filter;
      el.classList.toggle("is-hidden", !match);
    });
  });
});

/* ============================================
   Lightbox
   ============================================ */
const lightbox = document.getElementById("lightbox");
const lbImgWrap = document.getElementById("lbImgWrap");
const lbImage = document.getElementById("lbImage");
const lbTag = document.getElementById("lbTag");
const lbTitle = document.getElementById("lbTitle");
const lbCount = document.getElementById("lbCount");
const lbDesc = document.getElementById("lbDesc");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const lbBackdrop = document.getElementById("lightboxBackdrop");

let currentIndex = 0;

function visibleIndices() {
  // Respects the active filter: navigation only moves through
  // images currently shown in the grid.
  return Array.from(document.querySelectorAll(".item"))
    .filter((el) => !el.classList.contains("is-hidden"))
    .map((el) => Number(el.dataset.index));
}

function openLightbox(index) {
  currentIndex = index;
  updateLightboxContent();
  lbImgWrap.classList.remove("show-caption");
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightboxContent() {
  const item = imageData[currentIndex];
  const order = visibleIndices();
  const position = order.indexOf(currentIndex) + 1;

  lbImage.src = item.src;
  lbImage.alt = item.title;
  lbTag.textContent = item.tag;
  lbTitle.textContent = item.title;
  lbCount.textContent = `${position || 1} / ${order.length}`;
  lbDesc.textContent = item.desc || "";
}

function step(direction) {
  const order = visibleIndices();
  if (order.length === 0) return;
  const pos = order.indexOf(currentIndex);
  const nextPos = (pos + direction + order.length) % order.length;
  currentIndex = order[nextPos];
  updateLightboxContent();
  lbImgWrap.classList.remove("show-caption");
}

/* Tap the image to reveal the caption on touch devices (no hover there) */
lbImage.addEventListener("click", (e) => {
  e.stopPropagation();
  lbImgWrap.classList.toggle("show-caption");
});

lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => step(-1));
lbNext.addEventListener("click", () => step(1));

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* Basic swipe support for touch devices */
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
lightbox.addEventListener("touchend", (e) => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 50) step(delta > 0 ? -1 : 1);
});

renderGallery();
