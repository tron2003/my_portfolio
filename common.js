// Shared behaviour for every design: parallax, contact form, copy-email button.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Seeded random so generated scenery is identical on every visit.
  function rng(seed) {
    let a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Parallax.
  //   [data-speed]  moves with page scroll: translateY = scrollY × speed
  //                 (use inside the hero; 0 = scrolls normally, 0.5 = half speed)
  //   [data-depth]  moves relative to the viewport centre as it passes:
  //                 translateY = distance-from-centre × depth
  //   onFrame(y)    optional callback for design-specific motion
  function parallax(onFrame) {
    if (reduceMotion) {
      if (onFrame) onFrame(0, true);
      return;
    }
    const speedEls = Array.from(document.querySelectorAll("[data-speed]"));
    const depthEls = Array.from(document.querySelectorAll("[data-depth]"));
    let ticking = false;
    function frame() {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      for (const el of speedEls) {
        if (y > vh * 2.2) continue;
        el.style.transform = `translate3d(0, ${(y * Number(el.dataset.speed)).toFixed(1)}px, 0)`;
      }
      for (const el of depthEls) {
        const host = el.parentElement.getBoundingClientRect();
        if (host.bottom < -200 || host.top > vh + 200) continue;
        const offset = host.top + host.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * Number(el.dataset.depth)).toFixed(1)}px, 0)`;
      }
      if (onFrame) onFrame(y, false);
    }
    function request() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    frame();
  }

  // Contact form: sends through EmailJS when configured in content.js.
  function contactForm(form, statusEl) {
    if (!form) return;
    const cfg = window.SITE.emailjs || {};
    const configured = cfg.serviceId && cfg.templateId && cfg.publicKey;
    const button = form.querySelector("button[type=submit]");
    const say = (text, ok) => {
      statusEl.textContent = text;
      statusEl.dataset.state = ok ? "ok" : "error";
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!configured) {
        say(`The form isn't connected yet. Email me at ${window.SITE.email} instead.`, false);
        return;
      }
      const data = new FormData(form);
      button.disabled = true;
      const label = button.textContent;
      button.textContent = "Sending…";
      try {
        if (!window.emailjs) {
          await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js";
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        await window.emailjs.send(
          cfg.serviceId,
          cfg.templateId,
          { from_name: data.get("name"), from_email: data.get("email"), message: data.get("message"), to_name: window.SITE.name, to_email: window.SITE.email },
          { publicKey: cfg.publicKey },
        );
        form.reset();
        say("Message sent. I'll reply by email.", true);
      } catch {
        say(`Your message didn't send. Check your connection and try again, or email me at ${window.SITE.email}.`, false);
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  }

  // Copy-email button with a fallback that selects the address.
  function copyEmail(button, target) {
    if (!button) return;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.SITE.email);
        button.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        button.textContent = "Selected, press Ctrl+C";
      }
      setTimeout(() => (button.textContent = "Copy email"), 2200);
    });
  }

  function year() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  window.Zen = { reduceMotion, rng, svgEl, esc, parallax, contactForm, copyEmail, year };
})();
