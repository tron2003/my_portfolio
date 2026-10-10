// Sumi and washi: draws the ink scene and fills in content from content.js.
(function () {
  const { rng, svgEl: el, esc, parallax, contactForm, copyEmail, year, reduceMotion } = window.Zen;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const S = window.SITE;

  // Ink-wash mountain band: soft gradient, optionally blurred for distance.
  function mountains(svg, w, h, { base, amp, opacity, blur, seed, peak }) {
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const defs = el("defs", {}, svg);
    const id = svg.id;
    const g = el("linearGradient", { id: id + "g", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#1d1c1a", "stop-opacity": opacity }, g);
    el("stop", { offset: 0.45, "stop-color": "#1d1c1a", "stop-opacity": opacity * 0.25 }, g);
    el("stop", { offset: 0.85, "stop-color": "#1d1c1a", "stop-opacity": 0 }, g);
    if (blur) {
      const f = el("filter", { id: id + "b", x: "-10%", y: "-50%", width: "120%", height: "200%" }, defs);
      el("feGaussianBlur", { stdDeviation: blur }, f);
    }
    const r = rng(seed);
    const ph = r() * 6;
    const by = h * base;
    let d = `M0 ${h + 200} L0 ${by}`;
    for (let x = 0; x <= w; x += Math.max(8, w / 120)) {
      let y = by - amp * h * (0.6 * Math.sin((x / w) * 5.8 + ph) + 0.4 * Math.sin((x / w) * 15.8 + ph * 2));
      if (peak) {
        const [px, pw, ph2] = peak;
        const t = (x / w - px) / pw;
        if (t > -1 && t < 1) y -= Math.cos((t * Math.PI) / 2) * h * ph2;
      }
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += ` L${w} ${h + 200} Z`;
    el("path", { d, fill: `url(#${id}g)`, filter: blur ? `url(#${id}b)` : "" }, svg);
  }

  function drawHero() {
    const hero = document.querySelector(".hero");
    const w = hero.clientWidth, h = hero.clientHeight;
    const portrait = w < 760;
    mountains(document.getElementById("m-far"), w, h, { base: 0.8, amp: 0.05, opacity: 0.18, blur: 10, seed: 3, peak: [0.78, 0.18, 0.13] });
    mountains(document.getElementById("m-mid"), w, h, { base: 0.86, amp: 0.045, opacity: 0.3, blur: 4, seed: 5 });
    mountains(document.getElementById("m-near"), w, h, { base: 0.93, amp: 0.035, opacity: 0.55, blur: 0, seed: 9 });
    const R = portrait ? Math.min(w * 0.36, h * 0.2) : Math.min(w, h) * 0.27;
    const cx = portrait ? w * 0.5 : w * 0.62;
    const cy = portrait ? h * 0.7 : h * 0.47;
    // The finished circle fills almost the whole video frame.
    const size = (2 * R) / 0.98;
    Object.assign(document.getElementById("enso-wrap").style, { left: cx - size / 2 + "px", top: cy - size / 2 + "px", width: size + "px", height: size + "px" });
  }
  drawHero();
  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(drawHero, 150);
  });

  // Name: split into letters so they can rise in one after another.
  let n = 0;
  document.querySelectorAll("h1 .line").forEach((line) => {
    line.setAttribute("aria-hidden", "true");
    line.innerHTML = [...line.textContent].map((c) => `<span class="ch" style="--i:${n++}">${c}</span>`).join("");
  });

  // Content
  document.querySelectorAll("[data-text]").forEach((n) => (n.textContent = S[n.dataset.text]));
  document.getElementById("mailto").href = `mailto:${S.email}`;
  document.getElementById("gh").href = S.github;
  document.getElementById("li").href = S.linkedin;
  document.getElementById("works").innerHTML = S.projects
    .map((p) => `<article class="work"><h3>${esc(p.name)}<span>${esc(p.year)}</span></h3><p>${esc(p.desc)}</p><p class="tags">${esc(p.tags.join(", "))}</p><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">View code on GitHub</a></article>`)
    .join("");
  document.getElementById("jobs").innerHTML = S.jobs
    .map((j) => `<div class="job"><div class="date">${esc(j.date)}</div><h3>${esc(j.title)}</h3><div class="org">${esc(j.org)}</div><ul>${j.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`)
    .join("");
  document.getElementById("skill-list").innerHTML = S.skills.map((s) => `<div><h3>${esc(s.group)}</h3><p>${esc(s.items)}</p></div>`).join("");
  const e = S.education;
  document.getElementById("learning-body").innerHTML = `
    <div class="degree"><h3>${esc(e.degree)}</h3><p class="muted">${esc(e.school)}, ${esc(e.place)} · ${esc(e.date)} · CGPA ${esc(e.cgpa)}</p></div>
    <div><h3>Certifications</h3><ul>${S.certifications.map((c) => `<li><span>${esc(c.name)} <span class="muted">(${esc(c.by)})</span></span><span class="muted">${esc(c.date)}</span></li>`).join("")}</ul></div>
    <div><h3>Achievements</h3><ul>${S.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`;

  contactForm(document.getElementById("form"), document.getElementById("status"));
  copyEmail(document.getElementById("copy"), document.getElementById("mail"));
  year();

  // ---------- Ensō video ----------
  // On load the brush circle grows from a single point, turning, and settles
  // at full size; then the seal is stamped. As you scroll away, the clip
  // scrubs backwards and the circle turns and shrinks into the distance.
  const video = document.getElementById("enso-video");
  const seal = document.querySelector(".seal-stamp");
  const hero = document.querySelector(".hero");
  let introDone = reduceMotion;
  let duration = 8;
  const seek = (t) => {
    if (video.readyState >= 1 && Math.abs(video.currentTime - t) > 0.004) video.currentTime = t;
  };
  function intro() {
    duration = video.duration || duration;
    if (reduceMotion) {
      seek(duration - 0.05);
      seal.classList.add("on");
      return;
    }
    const start = performance.now(), length = 2600;
    const step = (now) => {
      const p = Math.min(1, (now - start) / length);
      const eased = 1 - Math.pow(1 - p, 2.4);
      seek((duration - 0.05) * eased);
      if (p < 1) requestAnimationFrame(step);
      else {
        introDone = true;
        seal.classList.add("on");
        onScrollVideo();
      }
    };
    requestAnimationFrame(step);
  }
  function onScrollVideo() {
    if (!introDone) return;
    const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.85)));
    seek((duration - 0.05) * (1 - p * 0.9));
    seal.style.opacity = String(Math.max(0, 1 - p * 3));
  }
  video.pause();
  // Load the clip into memory first so it can be scrubbed frame by frame on
  // any host (some servers don't allow seeking within a streamed file).
  const type = video.canPlayType('video/webm; codecs="vp9"') ? "enso.webm" : "enso.mp4";
  fetch(type)
    .then((r) => (r.ok ? r.blob() : Promise.reject()))
    .then((blob) => {
      video.addEventListener("loadedmetadata", intro, { once: true });
      video.src = URL.createObjectURL(blob);
      video.load();
    })
    .catch(() => {
      if (video.readyState >= 1) intro();
      else video.addEventListener("loadedmetadata", intro, { once: true });
    });
  // If the video can't load, the poster (the full circle) stays in place.
  video.addEventListener("error", () => seal.classList.add("on"), true);

  // ---------- Reading progress ----------
  const bar = document.getElementById("progress");

  // ---------- Sections settle in as they arrive ----------
  const revealables = document.querySelectorAll(".chapter .label, .chapter .bio, .big, .mail, .mail-actions, .form, .work, .job, .skills > div, .learning > div, .tree-box");
  revealables.forEach((node) => node.classList.add("reveal"));
  document.querySelectorAll(".works, .jobs, .skills, .learning").forEach((list) =>
    [...list.children].forEach((c, i) => c.style.setProperty("--d", `${Math.min(i, 4) * 0.08}s`)),
  );
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    revealables.forEach((node) => io.observe(node));
  } else revealables.forEach((node) => node.classList.add("in"));

  // ---------- Ink-drop cursor ----------
  if (fine && !reduceMotion) {
    const cursor = document.getElementById("cursor");
    let x = -100, y = -100, cx = x, cy = y;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      cursor.classList.add("on");
      cursor.classList.toggle("big", !!e.target.closest("a, button, input, textarea, .work"));
    });
    document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
    const follow = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  // Parallax: mountains drift at different depths; the ensō recedes as you scroll.
  const intro2 = document.querySelector(".intro");
  parallax((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
    const vh = window.innerHeight;
    if (y > vh * 1.5) return;
    onScrollVideo();
    intro2.style.opacity = String(Math.max(0, 1 - y / (vh * 0.8)));
  });
  if (reduceMotion) bar.parentElement.style.display = "none";
})();
