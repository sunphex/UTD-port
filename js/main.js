/* Utkarsh Dixit — portfolio interactions (GSAP + ScrollTrigger) */
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  document.getElementById("year").textContent = new Date().getFullYear();

  if (!hasGsap) {
    // CDN blocked: show the page without motion.
    document.querySelector(".loader")?.remove();
    document.body.classList.remove("is-loading");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion");

  /* ---------------------------------------------------------------- split */
  const heroBig = document.querySelector("[data-split]");
  heroBig.innerHTML = [...heroBig.textContent].map((c) => `<span class="ch">${c}</span>`).join("");

  const headline = document.querySelector("[data-words]");
  const wrapWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.append(part);
          else {
            const s = document.createElement("span");
            s.className = "w";
            s.textContent = part;
            frag.append(s);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    });
  };
  wrapWords(headline);

  /* -------------------------------------------------------------- loader */
  const intro = () => {
    const tl = gsap.timeline();
    tl.from(".hero__big .ch", {
      scaleY: 0, color: "#9a958d", duration: 1.1, ease: "expo.out",
      stagger: { each: 0.07 },
    })
      .from(".nav a", { y: -14, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, "-=0.9")
      .from(".hero__sub", { yPercent: 60, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .from(".hero__words > *, .hero__scroll", { y: 12, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }, "-=0.5")
      .from(".signature, .badge--hero, .hero__based", { opacity: 0, duration: 0.8 }, "-=0.5");
    return tl;
  };

  const loader = document.querySelector(".loader");
  const finishLoading = () => {
    loader.remove();
    document.body.classList.remove("is-loading");
    ScrollTrigger.refresh();
  };

  if (reduceMotion) {
    finishLoading();
  } else {
    const helloText = loader.querySelector("text");
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(helloText, { strokeDashoffset: 0, duration: 1.8, ease: "power1.inOut" })
      .to(helloText, { fill: getComputedStyle(document.documentElement).getPropertyValue("--gold"), duration: 0.4 }, "-=0.3")
      .to(".loader__hello", { opacity: 0, y: -10, duration: 0.35 }, "+=0.25")
      .to(".wipe-line", { scale: 1, duration: 0.45, ease: "power3.inOut" })
      .to(".wipe-bar", { scale: 1, duration: 0.35, ease: "power3.out" }, "-=0.1")
      .to(".wipe-box", { scale: 1, duration: 0.35, ease: "power3.out" }, "-=0.15")
      .to(".wipe-box", { width: "100vw", height: "100vh", duration: 0.7, ease: "expo.inOut" })
      .set(loader, { background: "transparent" })
      .to(".loader__wipe", { opacity: 0, duration: 0.35 })
      .add(intro(), "-=0.35")
      .add(finishLoading, "-=1.4");
  }

  /* -------------------------------------------------------------- cursor */
  if (finePointer) {
    const dot = document.querySelector(".cursor__dot");
    const ring = document.querySelector(".cursor__ring");
    const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const cursorEl = document.querySelector(".cursor");
    addEventListener("pointermove", (e) => { cursorEl.classList.add("is-on"); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.querySelectorAll("a, .service").forEach((el) => {
      el.addEventListener("pointerenter", () => document.querySelector(".cursor").classList.add("is-hover"));
      el.addEventListener("pointerleave", () => document.querySelector(".cursor").classList.remove("is-hover"));
    });
  }

  /* ------------------------------------------------ hero liquid distortion */
  const liquidMap = document.getElementById("liquid-map");
  const liquidNoise = document.getElementById("liquid-noise");
  if (!reduceMotion && finePointer) {
    const hero = document.querySelector(".hero");
    let target = 0, current = 0, lastX = 0, lastY = 0, t = 0, running = false;

    const tick = () => {
      current += (target - current) * 0.12;
      target *= 0.9;
      t += 0.01;
      liquidMap.setAttribute("scale", current.toFixed(2));
      liquidNoise.setAttribute("baseFrequency", `${0.012 + Math.sin(t) * 0.003} ${0.06 + Math.cos(t * 1.3) * 0.01}`);
      if (current > 0.05 || target > 0.05) requestAnimationFrame(tick);
      else { liquidMap.setAttribute("scale", 0); running = false; }
    };

    heroBig.addEventListener("pointermove", (e) => {
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      target = Math.min(70, target + speed * 0.9);
      if (!running) { running = true; requestAnimationFrame(tick); }
    });
    hero.addEventListener("pointerleave", () => (target = 0));
  }

  /* ---------------------------------------------------- about: string */
  const stringSvg = document.querySelector(".string");
  const stringPath = stringSvg.querySelector("path");
  const ctrl = { x: 500, y: 60 };
  const drawString = () => stringPath.setAttribute("d", `M0,60 Q${ctrl.x},${ctrl.y} 1000,60`);
  let grabbed = false;

  stringSvg.addEventListener("pointermove", (e) => {
    const r = stringSvg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 1000;
    const y = ((e.clientY - r.top) / r.height) * 120;
    if (!grabbed && Math.abs(y - 60) > 14) return;
    grabbed = true;
    gsap.killTweensOf(ctrl);
    ctrl.x = x;
    ctrl.y = 60 + (y - 60) * 2; // quadratic control point sits at 2× the curve apex
    drawString();
  });
  stringSvg.addEventListener("pointerleave", () => {
    grabbed = false;
    gsap.to(ctrl, { x: 500, y: 60, duration: 1.6, ease: "elastic.out(1.2, 0.15)", onUpdate: drawString });
  });

  /* ------------------------------------------------- about: word reveal */
  gsap.to(".about__headline .w", {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".about__headline", start: "top 85%", end: "bottom 45%", scrub: true },
  });
  gsap.from(".about__photo", {
    clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: ".about__grid", start: "top 80%" },
  });

  /* ------------------------------------------- expertise: floating logos */
  const field = document.querySelector(".float-field");
  const section = document.querySelector(".expertise");
  const chips = [
    ["Python", "#ffd43b"], ["n8n", "#ff6d5a"], ["GPT-4o", "#e8e8e8"], ["LangChain", "#7fd6b4"],
    ["PyTorch", "#ee4c2c"], ["MCP", "#dcb88f"], ["Hugging Face", "#ffcc4d"], ["Docker", "#5aa9ee"],
    ["FAISS", "#b8a4ff"], ["AWS", "#ff9900"],
  ];
  const bodies = chips.map(([label, bg]) => {
    const el = document.createElement("span");
    el.className = "floaty";
    el.textContent = label;
    el.style.background = bg;
    field.append(el);
    return { el, x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, rot: 0, vr: 0 };
  });

  let fw = 0, fh = 0, mouse = { x: -999, y: -999 }, floatOn = false;
  const layout = () => {
    fw = field.clientWidth; fh = field.clientHeight;
    bodies.forEach((b) => {
      b.w = b.el.offsetWidth; b.h = b.el.offsetHeight;
      if (!b.x && !b.y) {
        b.x = Math.random() * (fw - b.w);
        b.y = Math.random() * (fh - b.h);
        b.vx = (Math.random() - 0.5) * 0.8;
        b.vy = (Math.random() - 0.5) * 0.8;
        b.rot = (Math.random() - 0.5) * 30;
        b.vr = (Math.random() - 0.5) * 0.2;
      }
    });
  };
  const step = () => {
    if (!floatOn) return;
    bodies.forEach((b) => {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      const ddx = cx - mouse.x, ddy = cy - mouse.y;
      const d = Math.hypot(ddx, ddy);
      if (d < 140 && d > 0) {
        const f = (140 - d) / 140;
        b.vx += (ddx / d) * f * 1.4;
        b.vy += (ddy / d) * f * 1.4;
        b.vr += (Math.random() - 0.5) * f * 2;
      }
      b.vx *= 0.97; b.vy *= 0.97; b.vr *= 0.97;
      // keep a gentle drift so they never fully stop
      if (Math.hypot(b.vx, b.vy) < 0.25) { b.vx *= 1.08; b.vy *= 1.08; }
      b.x += b.vx; b.y += b.vy; b.rot += b.vr;
      if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
      if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
      if (b.x > fw - b.w) { b.x = fw - b.w; b.vx = -Math.abs(b.vx); }
      if (b.y > fh - b.h) { b.y = fh - b.h; b.vy = -Math.abs(b.vy); }
      b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`;
    });
    requestAnimationFrame(step);
  };
  layout();
  addEventListener("resize", layout);
  section.addEventListener("pointermove", (e) => {
    const r = field.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  section.addEventListener("pointerleave", () => (mouse = { x: -999, y: -999 }));
  if (!reduceMotion) {
    new IntersectionObserver(([entry]) => {
      const was = floatOn;
      floatOn = entry.isIntersecting;
      if (floatOn && !was) requestAnimationFrame(step);
    }).observe(section);
  } else {
    bodies.forEach((b) => (b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`));
  }

  // services: highlight the row nearest the middle of the viewport
  document.querySelectorAll(".service").forEach((row) => {
    ScrollTrigger.create({
      trigger: row, start: "top 50%", end: "bottom 50%",
      toggleClass: { targets: row, className: "is-active" },
    });
  });

  /* ------------------------------------------------- work: drip heading */
  const drops = document.querySelector(".drip__drops");
  const dripText = document.querySelector(".drip__text");
  if (!reduceMotion) {
    const spawn = () => {
      const w = dripText.offsetWidth, h = dripText.offsetHeight;
      const size = 8 + Math.random() * 16;
      const d = document.createElement("span");
      d.className = "drop";
      Object.assign(d.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${20 + Math.random() * (w - size)}px`, top: `${h * 0.78}px`,
      });
      drops.append(d);
      gsap.fromTo(d, { scale: 0.2 }, {
        scale: 1, duration: 0.6, ease: "power2.out",
        onComplete: () => gsap.to(d, {
          y: 60 + Math.random() * 70, scale: 0.3, duration: 1.2 + Math.random(), ease: "power2.in",
          onComplete: () => d.remove(),
        }),
      });
    };
    let dripTimer;
    ScrollTrigger.create({
      trigger: ".drip", start: "top bottom", end: "bottom top",
      onToggle: ({ isActive }) => {
        clearInterval(dripTimer);
        if (isActive) dripTimer = setInterval(spawn, 260);
      },
    });
    gsap.from(dripText, {
      yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".drip", start: "top 80%" },
    });
  }

  /* --------------------------------------------- work: stacking cards */
  const cards = gsap.utils.toArray(".card");
  cards.forEach((card, i) => card.style.setProperty("--i", i));

  ScrollTrigger.matchMedia({
    "(min-width: 961px)": () => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, {
          scale: 0.94 - (cards.length - i) * 0.006,
          filter: "brightness(0.55)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true },
        });
      });
    },
  });

  cards.forEach((card) => {
    gsap.from(card.querySelectorAll(".flow span"), {
      opacity: 0, y: 14, stagger: 0.08, duration: 0.5, ease: "power2.out",
      scrollTrigger: { trigger: card, start: "top 70%" },
    });
  });

  /* ------------------------------------------------- generic reveals */
  gsap.utils.toArray(".section-title, .expertise__title, .contact__title, .timeline > li, .more li").forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
})();
