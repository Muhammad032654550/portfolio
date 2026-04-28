const sections = document.querySelectorAll("section");
const preloader = document.getElementById("preloader");
const progressBar = document.getElementById("scrollProgress");
const toTopBtn = document.getElementById("toTopBtn");
const tiltCards = document.querySelectorAll(".tilt-card");
const counters = document.querySelectorAll(".counter");
const heroVisual = document.querySelector(".hero-right img");
const orbLeft = document.querySelector(".orb-left");
const orbRight = document.querySelector(".orb-right");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hidePreloader = () => {
  if (!preloader || preloader.classList.contains("hidden")) {
    return;
  }
  preloader.classList.add("hidden");
  window.setTimeout(() => preloader.remove(), 500);
};

document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(hidePreloader, 1600);
});

window.addEventListener("load", hidePreloader, { once: true });

const updateScrollUI = () => {
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (top / height) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (toTopBtn) {
    toTopBtn.classList.toggle("visible", top > 320);
  }
};

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
  },
  { passive: true }
);

updateScrollUI();

if (sections.length > 0 && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (toTopBtn) {
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const isPercent = el.classList.contains("percent");

        if (prefersReducedMotion) {
          el.textContent = isPercent ? `${target}%` : `${target}+`;
          observer.unobserve(el);
          return;
        }

        let current = 0;
        const step = Math.max(1, Math.ceil(target / 45));

        const timer = window.setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            window.clearInterval(timer);
          }
          el.textContent = isPercent ? `${current}%` : `${current}+`;
        }, 24);

        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

if (hasFinePointer && !prefersReducedMotion) {
  tiltCards.forEach((card) => {
    const strong = card.classList.contains("tilt-strong");
    const tiltLimit = strong ? 18 : 12;
    const depth = strong ? -10 : -6;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * tiltLimit;
      const rotateX = (0.5 - y / rect.height) * tiltLimit;

      card.style.transform = `perspective(950px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${depth}px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });

  let mouseTicking = false;
  let mouseX = 0;
  let mouseY = 0;

  const applyParallax = () => {
    const xRatio = mouseX / window.innerWidth - 0.5;
    const yRatio = mouseY / window.innerHeight - 0.5;

    if (heroVisual) {
      heroVisual.style.transform = `translate3d(${xRatio * 10}px, ${yRatio * 10}px, 0)`;
    }

    if (orbLeft) {
      orbLeft.style.transform = `translate3d(${xRatio * -18}px, ${yRatio * -12}px, 0)`;
    }

    if (orbRight) {
      orbRight.style.transform = `translate3d(${xRatio * 18}px, ${yRatio * 14}px, 0)`;
    }

    mouseTicking = false;
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (mouseTicking) {
        return;
      }

      mouseTicking = true;
      window.requestAnimationFrame(applyParallax);
    },
    { passive: true }
  );
}

const navbars = document.querySelectorAll(".navbar");

const resetNavbar = (bar) => {
  const toggle = bar.querySelector(".nav-toggle");
  const icon = toggle ? toggle.querySelector("i") : null;
  bar.classList.remove("open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }
  if (icon) {
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-xmark");
  }
};

navbars.forEach((bar) => {
  const toggle = bar.querySelector(".nav-toggle");
  const menu = bar.querySelector(".nav-menu");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = bar.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));

    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }

    document.body.classList.toggle("menu-open", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      resetNavbar(bar);
      document.body.classList.remove("menu-open");
    });
  });
});

document.addEventListener("click", (event) => {
  navbars.forEach((bar) => {
    if (bar.classList.contains("open") && !bar.contains(event.target)) {
      resetNavbar(bar);
      document.body.classList.remove("menu-open");
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    navbars.forEach((bar) => resetNavbar(bar));
    document.body.classList.remove("menu-open");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navbars.forEach((bar) => resetNavbar(bar));
    document.body.classList.remove("menu-open");
  }
});

const portfolioToggleBtn = document.querySelector(".portfolio-toggle-btn");
const hiddenPortfolioItems = document.querySelectorAll(".portfolio-more");

if (portfolioToggleBtn && hiddenPortfolioItems.length > 0) {
  portfolioToggleBtn.addEventListener("click", () => {
    hiddenPortfolioItems.forEach((item) => item.classList.add("show"));
    portfolioToggleBtn.setAttribute("aria-expanded", "true");
    portfolioToggleBtn.textContent = "All Images Shown";
    portfolioToggleBtn.disabled = true;
    portfolioToggleBtn.classList.add("is-disabled");
  });
}