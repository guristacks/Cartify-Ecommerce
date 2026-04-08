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

  // animate down smoothly
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
