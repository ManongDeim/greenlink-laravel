//Carousel Script
const carousel = document.getElementById("carousel");
  const slides = carousel.querySelectorAll("img");
  const indicators = document.getElementById("indicators");

  let currentSlide = 0;

  // Create indicators
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.style.width = dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.display = "inline-block";
    dot.style.background = i === 0 ? "teal" : "#ccc";
    dot.addEventListener("click", () => goToSlide(i));
    indicators.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
  }

  function updateIndicators() {
    [...indicators.children].forEach((dot, i) => {
      dot.style.background = i === currentSlide ? "teal" : "#ccc";
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  setInterval(nextSlide, 3000); // Auto slide every 3s
  function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(currentSlide);
}