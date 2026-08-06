// =======================
// MATRIX BACKGROUND
// =======================

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "0123456789";
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * canvas.height;
}

function draw() {
  ctx.fillStyle = "rgba(10, 18, 48, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00eaff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    drops[i] += 0.3;

    if (drops[i] * fontSize > canvas.height) {
      drops[i] = 0;
    }
  }
}

setInterval(draw, 50);


// =======================
// NEWS RENDER
// =======================

async function loadNews() {

  const container = document.getElementById("news");

  container.innerHTML = "Завантаження...";

  try {

    const res = await fetch("/api/update-news");
    const data = await res.json();

    container.innerHTML = "";

    data.forEach(n => {

      // 🔥 LABEL
      let label;

      if (n.top === "main") {
        label = "🔥 ГОЛОВНА ";
      }
      else if (n.top === "top") {
        label = "⭐ TOP 3 ";
      }
      else {
        label = "NEW ";
      }

      // 🧱 CARD
      const card = document.createElement("div");
      card.className = "news-card";

      card.innerHTML = `
        <div class="news-badge">
          ${label}${n.badge}
        </div>

        <div class="news-title">
          ${n.title}
        </div>

        <div class="news-short">
          ${n.short}
        </div>

        <div class="news-meta">
          ${n.date} | Україна
        </div>
      `;

      // 🔗 КЛІК
      card.onclick = () => {
        window.open(n.source, "_blank");
      };

      container.appendChild(card);

    });

  } catch (e) {

    container.innerHTML = "❌ Помилка завантаження новин";

  }

}


// =======================
// INIT
// =======================

loadNews();