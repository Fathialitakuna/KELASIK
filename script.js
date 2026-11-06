// ---------- MARQUEE ----------
(() => {
  const track = document.querySelector('.strip-track');
  if (!track) return;

  const SPEED = 60; // px per detik
  const base = track.querySelector('.strip-group').innerHTML;
  let builtFor = 0;

  function buildMarquee() {
    const group = document.createElement('div');
    group.className = 'strip-group';
    group.innerHTML = base;
    track.replaceChildren(group);

    if (!group.offsetWidth) return;

    // ulangi isi sampai grup selebar layar atau lebih
    let guard = 0;
    while (group.offsetWidth < window.innerWidth && guard++ < 50) {
      group.insertAdjacentHTML('beforeend', base);
    }

    
    track.appendChild(group.cloneNode(true));

    track.style.animationDuration = (group.offsetWidth / SPEED) + 's';
    builtFor = window.innerWidth;
  }

  document.fonts.ready.then(buildMarquee);

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (window.innerWidth > builtFor) buildMarquee();
    }, 200);
  });
})();

// ---------- TYPING JUDUL ----------
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  new TypeIt("#typed-title", {
    speed: reduceMotion ? 0 : 70,
    cursor: !reduceMotion,
    waitUntilVisible: true,
  })
    .type("Welcome to<br>Our Portofolio<br><span class='outline'>Website.</span>")
    .go();
});

// ---------- FAN CARDS ----------
(() => {
  const cards = [...document.querySelectorAll('.fan-card')];
  if (!cards.length) return;

  const N = cards.length;
  const HALF = Math.floor(N / 2);
  let center = HALF;   // kartu yang sedang di tengah

  // posisi relatif kartu terhadap tengah, dibungkus ke rentang -HALF..HALF
  const wrap = (v) => (((v + HALF) % N) + N) % N - HALF;

  function render() {
    cards.forEach((c, idx) => {
      const i = wrap(idx - center);
      const old = parseFloat(c.style.getPropertyValue('--i'));

      // kartu yang "melompat" dari ujung ke ujung tidak boleh terbang melintas
      if (Math.abs(i - old) > 1) {
        c.style.transition = 'none';
        c.style.setProperty('--i', i);
        c.offsetWidth; // paksa reflow
        c.style.transition = '';
      } else {
        c.style.setProperty('--i', i);
      }
      c.style.zIndex = 10 - Math.abs(i);
    });
  }

  document.querySelector('.fan-btn.next')?.addEventListener('click', () => { center = (center + 1) % N; render(); });
  document.querySelector('.fan-btn.prev')?.addEventListener('click', () => { center = (center - 1 + N) % N; render(); });

  // klik kartu di samping = jadikan kartu tengah
  cards.forEach((c, idx) => c.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    center = idx;
    render();
  }));

  render();
})();

(() => {
  const cards = [...document.querySelectorAll(".fan-card")];
  const panel = document.querySelector(".team-info");
  if (!cards.length || !panel) return;

 // sesuai urutan kartu
  const team = [
  { name: "Zidane", role: "UI/UX Designer", bio: "Game 24/7.", skills: ["Figma", "Prototyping"] },
  { name: "Aulia",  role: "UI/UX Designer", bio: " suka K-Pop, Drakor ",  skills: ["Figma", "Prototyping"] },
  { name: "Rifqi",  role: "Web Developer",  bio: "Rifqi lagi bobo.",  skills: ["HTML", "CSS", "JS"] },
  { name: "Razip",  role: "Web Developer",  bio: "suka ngulik music",  skills: ["HTML", "CSS", "JS"] },
  { name: "Thia",   role: "Web Developer",  bio: "reading, writing, drawing, coding.",   skills: ["HTML", "CSS", "JS"] },
];

  const $ = (id) => document.getElementById(id);
  let last = -1;

  function render() {
    const i = cards.findIndex((c) => c.style.getPropertyValue("--i").trim() === "0");
    if (i < 0 || i === last || !team[i]) return;
    last = i;
    const m = team[i];
    $("ti-num").textContent = String(i + 1).padStart(2, "0");
    $("ti-name").textContent = m.name;
    $("ti-role").textContent = m.role;
    $("ti-bio").textContent = m.bio;
    $("ti-chips").innerHTML = m.skills.map((s) => `<span>${s}</span>`).join("");
    panel.classList.remove("swap");
    void panel.offsetWidth;          // restart animasi
    panel.classList.add("swap");
  }

  const obs = new MutationObserver(render);
  cards.forEach((c) => obs.observe(c, { attributes: true, attributeFilter: ["style"] }));
  render();
})();