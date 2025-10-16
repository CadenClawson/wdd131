const courses = [
    {
      id: "c1",
      name: "Riverside Park DGC",
      city: "Springfield",
      difficulty: "moderate",
      img: "images/course1.jpg",
      description: "Tree-lined 18 hole course with tight fairways."
    },
    {
      id: "c2",
      name: "Pine Ridge",
      city: "Greenville",
      difficulty: "hard",
      img: "images/course2.jpg",
      description: "Hilly terrain and elevation changes; for experienced players."
    },
    {
      id: "c3",
      name: "Meadow Glen",
      city: "Riverton",
      difficulty: "easy",
      img: "images/course3.jpg",
      description: "Beginner-friendly, open fields and short holes."
    }
  ];
  
  const $ = (sel) => document.querySelector(sel);
  
  function setYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll("#year, #year2, #year3, #year4").forEach(el => {
      if (el) el.textContent = year;
    });
  }
  
  function setupNavToggle() {
    const toggle = $("#nav-toggle");
    const navList = $("#nav-list");
    if (!toggle || !navList) return;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("show");
    });
  }
  
  function renderFeatured() {
    const grid = $("#featured-grid");
    if (!grid) return;
    const featured = courses.slice(0, 2);
    grid.innerHTML = featured.map(c => {
      return `
        <article class="card" data-id="${c.id}">
          <img class="lazy" data-src="${c.img}" alt="${c.name} photo" />
          <h3>${c.name}</h3>
          <p>${c.city} · ${c.difficulty}</p>
          <p>${c.description}</p>
          <p><button class="fav-btn" data-id="${c.id}">Add to favorites</button></p>
        </article>`;
    }).join("");
  }
  
  function setupCoursesPage() {
    const list = $("#courses-list");
    const search = $("#search");
    const difficulty = $("#difficulty");
    if (!list || !search || !difficulty) return;
  
    function renderList(items) {
      list.innerHTML = items.map(c => {
        return `
          <article class="card" aria-labelledby="title-${c.id}">
            <img class="lazy" data-src="${c.img}" alt="${c.name} photo" />
            <h3 id="title-${c.id}">${c.name}</h3>
            <p>${c.city} · ${c.difficulty}</p>
            <p>${c.description}</p>
            <p><button class="fav-btn" data-id="${c.id}">Add to favorites</button></p>
          </article>`;
      }).join("");
      attachFavButtons();
    }
  
    function filterAndRender() {
      const q = search.value.trim().toLowerCase();
      const diff = difficulty.value;
      let filtered = courses.filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
        const matchesDiff = diff === "all" ? true : c.difficulty === diff;
        if (!matchesQuery) return false;
        return matchesDiff;
      });
      renderList(filtered);
    }
  
    filterAndRender();
  
    search.addEventListener("input", filterAndRender);
    difficulty.addEventListener("change", filterAndRender);
  }
  
  function getFavorites() {
    const raw = localStorage.getItem("dgc_favorites");
    return raw ? JSON.parse(raw) : [];
  }
  function saveFavorites(arr) {
    localStorage.setItem("dgc_favorites", JSON.stringify(arr));
  }
  function toggleFavorite(id) {
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) {
      favs.push(id);
      saveFavorites(favs);
      return true;
    } else {
      favs.splice(idx, 1);
      saveFavorites(favs);
      return false;
    }
  }
  function attachFavButtons() {
    document.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const added = toggleFavorite(id);
        btn.textContent = added ? "Saved to favorites" : "Add to favorites";
        btn.disabled = true;
        setTimeout(()=> btn.disabled = false, 700);
      });
    });
  }
  
  function setupContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    const messagesList = $("#messages-list");
    const clearBtn = $("#clear-messages");
  
    function renderMessages() {
      const raw = localStorage.getItem("dgc_messages");
      const messages = raw ? JSON.parse(raw) : [];
      if (!messages.length) {
        messagesList.innerHTML = "<p>No saved messages.</p>";
        return;
      }
      messagesList.innerHTML = messages.map((m, i) => `
        <div class="card" aria-label="Saved message ${i+1}">
          <strong>${m.name}</strong> (<em>${m.email}</em>)<br/>
          <p>${m.message}</p>
          <small>${new Date(m.time).toLocaleString()}</small>
        </div>
      `).join("");
    }
  
    function addMessage(obj) {
      const raw = localStorage.getItem("dgc_messages");
      const messages = raw ? JSON.parse(raw) : [];
      messages.unshift(obj); 
      localStorage.setItem("dgc_messages", JSON.stringify(messages));
      renderMessages();
    }
  
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
  
      if (name.length < 2) {
        alert("Please enter a full name (at least 2 characters).");
        return;
      }
      if (!email.includes("@") || email.length < 5) {
        alert("Please enter a valid email address.");
        return;
      }
      if (message.length < 5) {
        alert("Please enter a longer message.");
        return;
      }
  
      const msgObj = { name, email, message, time: Date.now() };
      addMessage(msgObj);
  
      form.reset();
      alert("Message saved locally. (This demo uses localStorage.)");
    });
  
    clearBtn?.addEventListener("click", () => {
      if (confirm("Clear all saved messages?")) {
        localStorage.removeItem("dgc_messages");
        renderMessages();
      }
    });
  
    renderMessages();
  }
  
  function setupLazyLoading() {
    const lazyImages = document.querySelectorAll("img.lazy");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      }, {rootMargin: "100px"});
      lazyImages.forEach(img => io.observe(img));
    } else {
      lazyImages.forEach(img => img.src = img.dataset.src);
    }
  }
  
  function init() {
    setYear();
    setupNavToggle();
    renderFeatured();
    setupCoursesPage();
    setupContactForm();
    setupLazyLoading();
    attachFavButtons();
  }
  
  const tips = [
    "Practice your putts every session — it's where games are won.",
    "Keep your wrist flat to prevent unwanted disc fade.",
    "Film your throws to analyze your form and balance.",
    "Warm up your shoulder and core to avoid injuries.",
    "Play with better players — you'll learn faster!"
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    const tipButton = document.getElementById("tipButton");
    const randomTip = document.getElementById("randomTip");
  
    const lastTip = localStorage.getItem("lastTip");
    if (lastTip) {
      randomTip.textContent = lastTip;
    }
  
    tipButton.addEventListener("click", () => {
      const random = Math.floor(Math.random() * tips.length);
      const tip = tips[random];
      randomTip.textContent = tip;
      localStorage.setItem("lastTip", tip);
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const discs = [
      { id: "driverPath", disc: document.querySelector(".driver-disc") },
      { id: "midrangePath", disc: document.querySelector(".midrange-disc") },
      { id: "putterPath", disc: document.querySelector(".putter-disc") },
    ];
  
    // Animation duration in milliseconds
    const duration = 4000;
  
    // Function that animates one disc along its path
    function animateDisc(path, disc) {
      const pathLength = path.getTotalLength();
      let startTime = null;
  
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        const point = path.getPointAtLength(progress * pathLength);
  
        disc.setAttribute("cx", point.x);
        disc.setAttribute("cy", point.y);
  
        if (elapsed < duration) {
          requestAnimationFrame(step);
        }
      }
  
      requestAnimationFrame(step);
    }
  
    // Function that triggers all animations at once
    function startAllAnimations() {
      discs.forEach(({ id, disc }) => {
        const path = document.getElementById(id);
        animateDisc(path, disc);
  
        // Restart line draw animation (CSS keyframes)
        path.style.animation = "none";
        path.offsetHeight; // triggers reflow to reset animation
        path.style.animation = "drawPath 2.5s ease-in-out forwards";
      });
    }
  
    // Start immediately
    startAllAnimations();
  
    // Restart animations every 6 seconds
    setInterval(startAllAnimations, 6000);
  });
  

  document.addEventListener("DOMContentLoaded", init);
  