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

window.addEventListener("load", () => {
  if (preloader) {
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 500);
  }
});

window.addEventListener("scroll", () => {
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (top / height) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (toTopBtn) {
    toTopBtn.classList.toggle("visible", top > 320);
  }

  sections.forEach((section) => {
    const offset = section.offsetTop - 300;
    const sectionHeight = section.offsetHeight;
    if (top > offset && top < offset + sectionHeight) {
      section.classList.add("show");
    }
  });
});

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
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 45));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
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

if (hasFinePointer) {
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

  window.addEventListener("mousemove", (event) => {
    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    if (heroVisual) {
      heroVisual.style.transform = `translate3d(${xRatio * 10}px, ${yRatio * 10}px, 0)`;
    }

    if (orbLeft) {
      orbLeft.style.transform = `translate3d(${xRatio * -18}px, ${yRatio * -12}px, 0)`;
    }

    if (orbRight) {
      orbRight.style.transform = `translate3d(${xRatio * 18}px, ${yRatio * 14}px, 0)`;
    }
  });
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
