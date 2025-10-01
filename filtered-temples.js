const temples = [
    {
      templeName: "Oquirrh Mountain Utah Temple",
      location: "South Jordan, Utah, United States",
      dedicated: "2009-08-21",
      area: 60000,
      imageLocal: "images/oquirrh.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/oquirrh-mountain-utah-temple/oquirrh-mountain-utah-temple-36169.jpg"
    },
    {
      templeName: "Layton Utah Temple",
      location: "Layton, Utah, United States",
      dedicated: "2024-06-16",
      area: 94000,
      imageLocal: "images/layton.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/layton-utah-temple/layton-utah-temple-38583.jpg"
    },
    {
      templeName: "Washington D.C. Temple",
      location: "Kensington, Maryland, United States",
      dedicated: "1974-11-19",
      area: 156558,
      imageLocal: "images/washington.jpeg",
      imageRemote: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
      templeName: "Manhattan New York Temple",
      location: "New York, New York, United States",
      dedicated: "2004-06-13",
      area: 20630,
      imageLocal: "images/newYork.jpg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/manhattan-new-york-temple/manhattan-new-york-temple-21353.jpg"
    },
    {
      templeName: "Los Angeles California Temple",
      location: "Los Angeles, California, United States",
      dedicated: "1956-03-11",
      area: 190614,
      imageLocal: "images/la.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/los-angeles-california-temple/los-angeles-california-temple-22513.jpg"
    },
    {
      templeName: "Salt Lake Temple",
      location: "Salt Lake City, Utah, United States",
      dedicated: "1893-04-06",
      area: 382207,
      imageLocal: "images/saltLake.jpg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/salt-lake-temple/salt-lake-temple-37934.jpg"
    },
    {
      templeName: "Taylorsville Utah Temple",
      location: "Taylorsville, Utah, United States",
      dedicated: "2024-06-02",
      area: 70460,
      imageLocal: "images/taylorsville.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/taylorsville-utah-temple/taylorsville-utah-temple-41462.jpg"
    },
    {
      templeName: "Red Cliffs Utah Temple",
      location: "Washington County, Utah, United States",
      dedicated: "2024-03-24",
      area: 96277,
      imageLocal: "images/redCliffs.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/red-cliffs-utah-temple/red-cliffs-utah-temple-40345.jpg"
    },
    {
      templeName: "Rome Italy Temple",
      location: "Rome, Italy",
      dedicated: "2019-03-10",
      area: 41010,
      imageLocal: "images/rome.jpeg",
      imageRemote: "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-2190002.jpg"
    }
  ];
  
  const placeholder = "https://via.placeholder.com/400x250?text=Image+not+available";
  const cardsContainer = document.getElementById("temple-cards");
  const navLinks = document.querySelectorAll("nav a");
  
  function createImageElement(t) {
    const img = document.createElement("img");
    img.alt = t.templeName;
    img.loading = "lazy";
    // Prefer local image (faster & avoids hotlink issues), fall back to remote
    img.src = t.imageLocal || t.imageRemote || placeholder;
  
    img.onerror = function() {
      console.warn("Image failed to load:", this.src, " — temple:", t.templeName);
      // If we tried local first and it failed, try remote
      if (this.src === t.imageLocal && t.imageRemote) {
        this.src = t.imageRemote;
        return;
      }
      // If we tried remote (or remote failed too), show placeholder
      if (this.src !== placeholder) {
        this.src = placeholder;
      }
      this.onerror = null; // avoid infinite loop
    };
    return img;
  }
  
  function displayTemples(list) {
    cardsContainer.innerHTML = "";
    list.forEach(t => {
      const card = document.createElement("section");
      card.classList.add("temple-card");
  
      const title = document.createElement("h2");
      title.textContent = t.templeName;
  
      const location = document.createElement("p");
      location.innerHTML = `<strong>Location:</strong> ${t.location}`;
  
      const dedicated = document.createElement("p");
      dedicated.innerHTML = `<strong>Dedicated:</strong> ${new Date(t.dedicated).toDateString()}`;
  
      const area = document.createElement("p");
      area.innerHTML = `<strong>Area:</strong> ${t.area > 0 ? t.area.toLocaleString() + " sq ft" : "Unknown"}`;
  
      const img = createImageElement(t);
  
      card.appendChild(title);
      card.appendChild(location);
      card.appendChild(dedicated);
      card.appendChild(area);
      card.appendChild(img);
  
      cardsContainer.appendChild(card);
    });
  }
  
  function filterTemples(criteria) {
    let filtered;
    switch(criteria) {
      case "old":
        filtered = temples.filter(t => new Date(t.dedicated).getFullYear() < 1900);
        break;
      case "new":
        filtered = temples.filter(t => new Date(t.dedicated).getFullYear() > 2000);
        break;
      case "large":
        filtered = temples.filter(t => t.area > 90000);
        break;
      case "small":
        filtered = temples.filter(t => t.area > 0 && t.area < 10000);
        break;
      default:
        filtered = temples;
    }
    displayTemples(filtered);
  }
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.target.id;
      let criteria = null;
      if (id === "nav-old") criteria = "old";
      else if (id === "nav-new") criteria = "new";
      else if (id === "nav-large") criteria = "large";
      else if (id === "nav-small") criteria = "small";
      else criteria = "all";
      filterTemples(criteria);
    });
  });
  
  // initial load
  displayTemples(temples);
  
  // footer year & last modified
  const yearEl = document.getElementById("currentyear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  const lastModEl = document.getElementById("lastModified");
  if (lastModEl) lastModEl.textContent = `Last Modified: ${document.lastModified}`;