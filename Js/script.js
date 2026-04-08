// GSAP Timeline & Scroll Trigger
let tl = gsap.timeline();
gsap.registerPlugin(ScrollTrigger);

const onPress = (el, handler) => {
  if (!el) return;
  el.addEventListener("click", handler);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler(e);
    }
  });
};

const debounce = (fn, wait = 150) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const lenisAnimation = () => {
  let lenis;
  let rafFn;

  const initLenis = () => {
    if (window.innerWidth > 1024 && !lenis) {
      lenis = new Lenis({ duration: 2 });

      lenis.on("scroll", ScrollTrigger.update);

      rafFn = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);
    }
  };

  const destroyLenis = () => {
    if (lenis) {
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      lenis = null;
    }
  };

  initLenis();

  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 1024) {
        initLenis();
      } else {
        destroyLenis();
      }
    }, 200),
    { passive: true },
  );
};

const heroImagesAnimation = () => {
  const images = document.querySelectorAll(".hero-img");
  const nextBtn = document.getElementById("nextBtn");
  const count = document.getElementById("count");

  let current = 0;
  let isAnimating = false;

  function updateCounter(index) {
    count.textContent = String(index + 1).padStart(2, "0");
  }

  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    const next = (current + 1) % images.length;

    const currentImg = images[current];
    const nextImg = images[next];

    // reset next image above
    nextImg.style.transition = "none";
    nextImg.style.transform = "translateY(-100%)";
    nextImg.classList.add("active");
    nextImg.style.zIndex = "3";

    // force repaint
    nextImg.offsetHeight;

    // Animation down smoothly
    nextImg.style.transition = "transform 0.5s ease-in-out";
    nextImg.style.transform = "translateY(0)";

    setTimeout(() => {
      currentImg.classList.remove("active");
      currentImg.style.transform = "translateY(-100%)";
      currentImg.style.zIndex = "1";

      nextImg.style.zIndex = "2";

      current = next;
      updateCounter(current);

      isAnimating = false;
    }, 800);
  });
};

const mobileNavBarAnimation = () => {
  const ham = document.querySelector(".ham");
  const closeBtn = document.querySelector(".close");
  const nav = document.querySelector(".nav-links");

  function isMobile() {
    return window.innerWidth <= 1023;
  }

  function openNav() {
    if (!isMobile()) return;

    gsap.to(nav, {
      y: "0%",
      duration: 0.4,
      ease: "power2.out",
    });

    ham.style.display = "none";
    closeBtn.style.display = "flex";
  }

  function closeNav() {
    if (!isMobile()) return;

    gsap.to(nav, {
      y: "-150%",
      duration: 0.4,
      ease: "power2.in",
    });

    ham.style.display = "flex";
    closeBtn.style.display = "none";
  }

  ham.addEventListener("click", openNav);
  closeBtn.addEventListener("click", closeNav);

  document.addEventListener("click", (e) => {
    if (!isMobile()) return;

    const clickedInsideNav = nav.contains(e.target);
    const clickedHam = ham.contains(e.target);
    const clickedClose = closeBtn.contains(e.target);

    if (!clickedInsideNav && !clickedHam && !clickedClose) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      nav.style.transform = "";
      ham.style.display = "";
      closeBtn.style.display = "";
    }
  });
};

lenisAnimation();

heroImagesAnimation();

mobileNavBarAnimation();
