document.addEventListener("DOMContentLoaded", () => {
  let count = localStorage.getItem("reviewCount");

  if (!count) {
    count = 0;
  }

  count++;
  localStorage.setItem("reviewCount", count);

  document.getElementById("reviewCount").textContent = count;
});