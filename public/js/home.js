async function renderHome() {
  const app = document.getElementById("app");

  let listings = [];
  let filteredListings = [];

  // Fetch listings
  try {
    listings = await ListingAPI.getAll();
    filteredListings = listings.filter(l => l.status === "approved");
  } catch (error) {
    console.error("Error fetching listings:", error);
    showMessage("Error loading listings", "error");
  }

  const minRent = Math.min(...filteredListings.map(l => l.rent || 0));
  const maxRent = Math.max(...filteredListings.map(l => l.rent || 0));

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          ${getCurrentUser() ? `
            <span>${getCurrentUser().name}</span>
            ${getCurrentUser().role === "owner" ? `
              <a href="#" onclick="router.navigate('/owner-dashboard'); return false">My Listings</a>
            ` : ""}
            ${getCurrentUser().role === "admin" ? `
              <a href="#" onclick="router.navigate('/admin'); return false">Admin Panel</a>
            ` : ""}
            <button onclick="handleLogout()">Logout</button>
          ` : `
            <a href="#" onclick="router.navigate('/owner-login'); return false">Owner Login</a>
            <a href="#" onclick="router.navigate('/admin-login'); return false">Admin Login</a>
          `}
        </div>
      </nav>
    </header>

    <div class="home-container container">
      <div class="search-section">
        <div class="search-box">
          <h3>Search Rooms</h3>
          <div class="filter-group">
            <label>Keywords (name, amenities)</label>
            <input type="text" id="searchKeywords" placeholder="E.g., furnished, wifi, kitchen...">
          </div>
          <button class="btn btn-primary" onclick="handleSearch()">Search</button>
          <button class="btn btn-secondary" onclick="resetFilters()" style="margin-top: 10px;">Clear Filters</button>
        </div>

        <div class="search-box">
          <h3>Filter by Price</h3>
          <div class="filter-group">
            <label>Minimum Rent</label>
            <input type="number" id="minRent" value="${minRent}" min="0">
          </div>
          <div class="filter-group">
            <label>Maximum Rent</label>
            <input type="number" id="maxRent" value="${maxRent}" min="0">
          </div>
          <button class="btn btn-primary" onclick="handlePriceFilter()">Apply Filter</button>
        </div>
      </div>

      <div class="listings-section">
        <h2>Available Rooms</h2>
        <div class="listings-grid" id="listingsGrid">
          ${filteredListings.length === 0 ? `
            <div class="empty-state" style="grid-column: 1/-1">
              <h3>No rooms available</h3>
              <p>Check back later for new listings</p>
            </div>
          ` : filteredListings.map(listing => `
            <div class="listing-card" onclick="router.navigate('/room/${listing._id}')">
              <div class="listing-image">
                ${listing.images && listing.images.length > 0 
                  ? `<img src="${listing.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room">`
                  : "Room Image"}
              </div>
              <div class="listing-content">
                <div class="listing-title">${listing.title}</div>
                <div class="listing-location">📍 ${listing.location}</div>
                <div class="listing-rent">₹${listing.rent}/month</div>
                <div class="listing-amenities">
                  ${(listing.amenities || []).slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join("")}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  window.handleSearch = function() {
    const keyword = document.getElementById("searchKeywords").value.toLowerCase();
    const grid = document.getElementById("listingsGrid");

    const filtered = filteredListings.filter(listing => {
      const titleMatch = listing.title.toLowerCase().includes(keyword);
      const locationMatch = listing.location.toLowerCase().includes(keyword);
      const amenitiesMatch = (listing.amenities || []).some(a => a.toLowerCase().includes(keyword));
      return titleMatch || locationMatch || amenitiesMatch;
    });

    grid.innerHTML = filtered.length === 0 ? `
      <div class="empty-state" style="grid-column: 1/-1">
        <h3>No rooms found</h3>
        <p>Try different search terms</p>
      </div>
    ` : filtered.map(listing => `
      <div class="listing-card" onclick="router.navigate('/room/${listing._id}')">
        <div class="listing-image">
          ${listing.images && listing.images.length > 0 
            ? `<img src="${listing.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room">`
            : "Room Image"}
        </div>
        <div class="listing-content">
          <div class="listing-title">${listing.title}</div>
          <div class="listing-location">📍 ${listing.location}</div>
          <div class="listing-rent">₹${listing.rent}/month</div>
          <div class="listing-amenities">
            ${(listing.amenities || []).slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
  };

  window.handlePriceFilter = function() {
    const minRent = parseFloat(document.getElementById("minRent").value) || 0;
    const maxRent = parseFloat(document.getElementById("maxRent").value) || Infinity;
    const grid = document.getElementById("listingsGrid");

    const filtered = filteredListings.filter(listing => {
      return listing.rent >= minRent && listing.rent <= maxRent;
    });

    grid.innerHTML = filtered.length === 0 ? `
      <div class="empty-state" style="grid-column: 1/-1">
        <h3>No rooms in this price range</h3>
      </div>
    ` : filtered.map(listing => `
      <div class="listing-card" onclick="router.navigate('/room/${listing._id}')">
        <div class="listing-image">
          ${listing.images && listing.images.length > 0 
            ? `<img src="${listing.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room">`
            : "Room Image"}
        </div>
        <div class="listing-content">
          <div class="listing-title">${listing.title}</div>
          <div class="listing-location">📍 ${listing.location}</div>
          <div class="listing-rent">₹${listing.rent}/month</div>
          <div class="listing-amenities">
            ${(listing.amenities || []).slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
  };

  window.resetFilters = function() {
    document.getElementById("searchKeywords").value = "";
    document.getElementById("minRent").value = minRent;
    document.getElementById("maxRent").value = maxRent;
    const grid = document.getElementById("listingsGrid");
    grid.innerHTML = filteredListings.map(listing => `
      <div class="listing-card" onclick="router.navigate('/room/${listing._id}')">
        <div class="listing-image">
          ${listing.images && listing.images.length > 0 
            ? `<img src="${listing.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room">`
            : "Room Image"}
        </div>
        <div class="listing-content">
          <div class="listing-title">${listing.title}</div>
          <div class="listing-location">📍 ${listing.location}</div>
          <div class="listing-rent">₹${listing.rent}/month</div>
          <div class="listing-amenities">
            ${(listing.amenities || []).slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
  };

  window.handleLogout = function() {
    logout();
    router.navigate("/");
  };
}
