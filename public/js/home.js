async function renderHome() {
  const app = document.getElementById("app");
  const currentUser = getCurrentUser();
  const amenityOptions = [
    "WiFi",
    "AC",
    "Kitchen",
    "Parking",
    "Attached Bathroom",
    "Furnished",
    "Washing Machine",
    "Fridge",
    "Balcony",
    "Lift"
  ];
  const audienceOptions = [
    { value: "boys", label: "For boys" },
    { value: "girls", label: "For girls" },
    { value: "families", label: "For families" },
    { value: "bachelors", label: "For bachelors" },
    { value: "couples", label: "For couples" }
  ];

  let listings = [];
  let approvedListings = [];

  try {
    listings = await ListingAPI.getAll();
    approvedListings = listings.filter((listing) => listing.status === "approved");
  } catch (error) {
    console.error("Error fetching listings:", error);
    showMessage("Error loading listings", "error");
  }

  const rents = approvedListings
    .map((listing) => Number(listing.rent) || 0)
    .filter((rent) => rent >= 0);
  const maxRentValue = rents.length > 0 ? Math.max(...rents) : 25000;
  let activeListings = [...approvedListings];

  function toTitleCase(value) {
    return String(value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  function formatRent(rent) {
    return `Rs ${Number(rent || 0).toLocaleString("en-IN")}/month`;
  }

  function getUserLabel(user) {
    if (!user) {
      return "";
    }

    const name = toTitleCase(user.name);
    if (name) {
      return name;
    }

    return user.role === "admin" ? "Admin" : "Owner";
  }

  function formatAudienceTag(tag) {
    switch (tag) {
      case "boys":
        return "For Boys";
      case "girls":
        return "For Girls";
      case "bachelors":
        return "For Bachelors";
      case "families":
        return "For Families";
      case "couples":
        return "For Couples";
      default:
        return "";
    }
  }

  function getAudienceTags(listing) {
    return (listing.audienceTags || [])
      .map((tag) => formatAudienceTag(tag))
      .filter(Boolean);
  }

  function listingCardMarkup(listing) {
    const amenities = (listing.amenities || []).slice(0, 3);
    const audienceTags = getAudienceTags(listing);

    return `
      <article class="listing-card listing-card-modern" onclick="router.navigate('/room/${listing._id}')">
        <div class="listing-image">
          ${
            listing.images && listing.images.length > 0
              ? `<img src="${listing.images[0]}" alt="${listing.title}" class="listing-image-media">`
              : `<div class="listing-image-fallback">Room Preview</div>`
          }
        </div>
        <div class="listing-content">
          <div class="listing-card-topline">
            <span class="listing-badge">Available</span>
            <span class="listing-rent">${formatRent(listing.rent)}</span>
          </div>
          <h3 class="listing-title">${listing.title}</h3>
          <p class="listing-location">${listing.location}</p>
          ${
            audienceTags.length > 0
              ? `<div class="listing-tags">${audienceTags.map((tag) => `<span class="listing-tag">${tag}</span>`).join("")}</div>`
              : ""
          }
          <div class="listing-amenities">
            ${
              amenities.length > 0
                ? amenities.map((amenity) => `<span class="amenity-tag">${amenity}</span>`).join("")
                : `<span class="amenity-tag">Details on request</span>`
            }
          </div>
          <div class="listing-card-footer">
            <span class="listing-action">View details</span>
          </div>
        </div>
      </article>
    `;
  }

  function matchesAudiencePreference(listing, audience) {
    if (!audience) {
      return true;
    }

    const tags = listing.audienceTags || [];
    if (tags.length === 0) {
      return true;
    }

    return tags.includes(audience);
  }

  function renderListings(items) {
    const grid = document.getElementById("listingsGrid");
    const resultsCount = document.getElementById("resultsCount");

    if (resultsCount) {
      resultsCount.textContent = `${items.length} room${items.length === 1 ? "" : "s"}`;
    }

    grid.innerHTML =
      items.length === 0
        ? `
          <div class="empty-state home-empty-state">
            <h3>No rooms matched this search</h3>
            <p>Try a wider budget or a simpler keyword.</p>
          </div>
        `
        : items.map(listingCardMarkup).join("");
  }

  app.innerHTML = `
    <header class="site-header">
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')">
          <span class="logo-main">MyRoommate</span>
          <span class="logo-city">Nashik</span>
        </div>
        <div class="nav-links">
          ${
            currentUser
              ? `
                <span>${getUserLabel(currentUser)}</span>
                ${
                  currentUser.role === "owner"
                    ? `<a href="#" onclick="router.navigate('/owner-dashboard'); return false">My Listings</a>`
                    : ""
                }
                ${
                  currentUser.role === "admin"
                    ? `<a href="#" onclick="router.navigate('/admin'); return false">Admin Panel</a>`
                    : ""
                }
                <button onclick="handleLogout()">Logout</button>
              `
              : `
                <a href="#" onclick="router.navigate('/owner-login'); return false">Owner Login</a>
                <a href="#" onclick="router.navigate('/admin-login'); return false">Admin Login</a>
              `
          }
        </div>
      </nav>
    </header>

    <main class="home-page">
      <section class="home-hero container">
        <div class="hero-panel">
          <div class="hero-copy">
            <p class="hero-kicker">Room hunting made simple</p>
            <h1>Find a room near you.</h1>
            <div class="hero-stats">
              <div class="hero-stat">
                <span class="hero-stat-value">${approvedListings.length}</span>
                <span class="hero-stat-label">Rooms live</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat-value">Nashik + Pune</span>
                <span class="hero-stat-label">City network</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat-value">100s + 1000s</span>
                <span class="hero-stat-label">Happy users</span>
              </div>
            </div>
          </div>

          <aside class="search-panel">
            <div class="search-panel-head">
              <h2>Search rooms</h2>
            </div>

            <div class="search-top-row">
              <div class="filter-group">
                <label for="searchKeywords">Keyword</label>
                <input type="text" id="searchKeywords" placeholder="furnished, wifi, college road">
              </div>
              <div class="filter-group">
                <label for="amenitySelect">Amenity</label>
                <select id="amenitySelect">
                  <option value="">Select amenity</option>
                  ${amenityOptions.map((option) => `<option value="${option}">${option}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="filter-grid">
              <div class="filter-group">
                <label for="maxRent">Max rent</label>
                <input type="number" id="maxRent" value="${maxRentValue}" min="0">
              </div>
              <div class="filter-group">
                <label for="audienceSelect">Room for</label>
                <select id="audienceSelect">
                  <option value="">Anyone</option>
                  ${audienceOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="search-actions">
              <button class="btn btn-primary" onclick="applyFilters()">Search Now</button>
              <button class="btn btn-secondary" onclick="resetFilters()">Reset</button>
            </div>
          </aside>
        </div>
      </section>

      <section class="container listings-section home-results-section" id="roomsSection">
        <div class="section-heading">
          <div>
            <p class="section-kicker">Available now</p>
            <h2>Rooms you can explore today</h2>
          </div>
          <span class="results-count" id="resultsCount">${approvedListings.length} rooms</span>
        </div>

        <div class="listings-grid" id="listingsGrid">
          ${approvedListings.length === 0 ? `
            <div class="empty-state home-empty-state">
              <h3>No approved rooms yet</h3>
              <p>Once owners publish listings, they will appear here.</p>
            </div>
          ` : approvedListings.map(listingCardMarkup).join("")}
        </div>
      </section>
    </main>
  `;

  function getFilterValues() {
    const keyword = document.getElementById("searchKeywords").value.trim().toLowerCase();
    const maxRent = Number(document.getElementById("maxRent").value) || Number.MAX_SAFE_INTEGER;
    const audience = document.getElementById("audienceSelect").value;

    return { keyword, maxRent, audience };
  }

  window.applyFilters = function () {
    const { keyword, maxRent, audience } = getFilterValues();

    activeListings = approvedListings.filter((listing) => {
      const title = (listing.title || "").toLowerCase();
      const location = (listing.location || "").toLowerCase();
      const amenities = (listing.amenities || []).join(" ").toLowerCase();
      const matchesKeyword =
        keyword === "" ||
        title.includes(keyword) ||
        location.includes(keyword) ||
        amenities.includes(keyword);
      const rent = Number(listing.rent) || 0;
      const matchesRent = rent <= maxRent;
      const matchesAudience = matchesAudiencePreference(listing, audience);

      return matchesKeyword && matchesRent && matchesAudience;
    });

    renderListings(activeListings);
    document.getElementById("roomsSection").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.resetFilters = function () {
    document.getElementById("searchKeywords").value = "";
    document.getElementById("maxRent").value = maxRentValue;
    document.getElementById("audienceSelect").value = "";
    activeListings = [...approvedListings];
    renderListings(activeListings);
  };

  window.handleLogout = function () {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      router.navigate("/");
    }
  };

  const keywordInput = document.getElementById("searchKeywords");
  const maxRentInput = document.getElementById("maxRent");
  const amenitySelect = document.getElementById("amenitySelect");
  const audienceSelect = document.getElementById("audienceSelect");

  function appendAmenityToKeyword(value) {
    if (!value) {
      return;
    }

    const currentValue = keywordInput.value.trim();
    const values = currentValue
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (!values.includes(value.toLowerCase())) {
      keywordInput.value = currentValue ? `${currentValue}, ${value}` : value;
    }
  }

  keywordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      window.applyFilters();
    }
  });

  amenitySelect.addEventListener("change", () => {
    appendAmenityToKeyword(amenitySelect.value);
    amenitySelect.value = "";
    keywordInput.focus();
  });

  maxRentInput.addEventListener("change", () => {
    window.applyFilters();
  });

  audienceSelect.addEventListener("change", () => {
    window.applyFilters();
  });
}
