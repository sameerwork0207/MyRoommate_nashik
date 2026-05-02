async function renderOwnerLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          <a href="#" onclick="router.navigate('/'); return false">Home</a>
        </div>
      </nav>
    </header>

    <div class="auth-container">
      <div class="auth-form">
        <h2>Owner Login</h2>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="loginEmail" placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="loginPassword" placeholder="Enter your password">
        </div>
        <button class="btn btn-primary" onclick="handleOwnerLogin()" style="width: 100%;">Login</button>
        <div class="auth-links">
          Don't have an account? <a href="#" onclick="router.navigate('/owner-signup'); return false">Sign Up Here</a>
        </div>
      </div>
    </div>
  `;

  window.handleOwnerLogin = async function() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await AuthAPI.login(email, password);
      setAuthToken(response.token);
      setCurrentUser(response.user);
      showMessage("Login successful!", "success");
      setTimeout(() => router.navigate("/owner-dashboard"), 1500);
    } catch (error) {
      showMessage("Login failed: " + error.message, "error");
    }
  };
}

async function renderOwnerSignup() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          <a href="#" onclick="router.navigate('/'); return false">Home</a>
        </div>
      </nav>
    </header>

    <div class="auth-container">
      <div class="auth-form">
        <h2>Owner Sign Up</h2>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="signupName" placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="signupEmail" placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="signupPhone" placeholder="Enter your phone">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="signupPassword" placeholder="Create a password">
        </div>
        <button class="btn btn-primary" onclick="handleOwnerSignup()" style="width: 100%;">Sign Up</button>
        <div class="auth-links">
          Already have an account? <a href="#" onclick="router.navigate('/owner-login'); return false">Login Here</a>
        </div>
      </div>
    </div>
  `;

  window.handleOwnerSignup = async function() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("signupPhone").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !phone || !password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters", "error");
      return;
    }

    try {
      const response = await AuthAPI.signup(name, email, password, phone, "owner");
      setAuthToken(response.token);
      setCurrentUser(response.user);
      showMessage("Sign up successful!", "success");
      setTimeout(() => router.navigate("/owner-dashboard"), 1500);
    } catch (error) {
      showMessage("Sign up failed: " + error.message, "error");
    }
  };
}

async function renderAdminLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          <a href="#" onclick="router.navigate('/'); return false">Home</a>
        </div>
      </nav>
    </header>

    <div class="auth-container">
      <div class="auth-form">
        <h2>Admin Login</h2>
        <div class="form-group">
          <label>Admin Username</label>
          <input type="text" id="adminUsername" placeholder="Enter admin username">
        </div>
        <div class="form-group">
          <label>Admin Password</label>
          <input type="password" id="adminPassword" placeholder="Enter admin password">
        </div>
        <button class="btn btn-primary" onclick="handleAdminLogin()" style="width: 100%;">Admin Login</button>
      </div>
    </div>
  `;

  window.handleAdminLogin = async function() {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    if (!username || !password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await AuthAPI.adminLogin(username, password);
      setAuthToken(response.token);
      setCurrentUser(response.user);
      showMessage("Admin login successful!", "success");
      setTimeout(() => router.navigate("/admin"), 1500);
    } catch (error) {
      showMessage("Admin login failed: " + error.message, "error");
    }
  };
}

async function renderOwnerDashboard() {
  const app = document.getElementById("app");

  // Check if owner is logged in
  const user = getCurrentUser();
  if (!user || (user.role !== "owner" && user.role !== "admin")) {
    app.innerHTML = `
      <header>
        <nav class="container">
          <div class="logo" onclick="router.navigate('/')">MyRoommate</div>
        </nav>
      </header>
      <div class="container" style="padding: 40px 0; text-align: center;">
        <h3>Unauthorized Access</h3>
        <p>You need to be an owner to access this page.</p>
        <button class="btn btn-primary" onclick="router.navigate('/owner-login')" style="margin-top: 20px;">Go to Owner Login</button>
      </div>
    `;
    return;
  }

  let listings = [];

  try {
    const allListings = await ListingAPI.getAll();
    listings = allListings.filter(l => l.ownerId === user.id);
  } catch (error) {
    console.error("Error fetching listings:", error);
    showMessage("Error loading listings", "error");
  }

  let showAddForm = false;

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          <span>${user.name}</span>
          <a href="#" onclick="router.navigate('/'); return false">Home</a>
          <button onclick="handleLogout()">Logout</button>
        </div>
      </nav>
    </header>

    <div class="admin-container container">
      <div class="admin-header">
        <h2>My Listings</h2>
        <button class="btn btn-primary" onclick="toggleAddForm()" style="margin-top: 15px;">+ Add New Room</button>
      </div>

      <div id="addFormContainer" style="display: none; background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h3>Add New Room Listing</h3>
        <div class="form-group">
          <label>Room Title</label>
          <input type="text" id="roomTitle" placeholder="E.g., Cozy 2BHK with WiFi">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" id="roomLocation" placeholder="E.g., Downtown, Near Metro">
        </div>
        <div class="form-group">
          <label>Monthly Rent (₹)</label>
          <input type="number" id="roomRent" placeholder="E.g., 15000">
        </div>
        <div class="form-group">
          <label>Amenities (comma separated)</label>
          <input type="text" id="roomAmenities" placeholder="E.g., WiFi, AC, Kitchen, Parking">
        </div>
        <div class="form-group">
          <label>Room Image URLs (comma separated, up to 3 images)</label>
          <input type="text" id="roomImages" placeholder="E.g., https://example.com/image1.jpg, https://example.com/image2.jpg">
          <small style="color: #666; margin-top: 5px;">Paste direct image URLs. Images will be displayed on room detail page.</small>
        </div>
        <button class="btn btn-primary" onclick="submitNewListing()" style="width: 100%;">Add Listing</button>
      </div>

      <div class="listings-section">
        <h3>Your Rooms</h3>
        ${listings.length === 0 ? `
          <div class="empty-state">
            <h3>No listings yet</h3>
            <p>Add your first room listing to get started</p>
          </div>
        ` : `
          <div class="listings-grid">
            ${listings.map(listing => `
              <div class="listing-card">
                <div class="listing-image">Room Image</div>
                <div class="listing-content">
                  <div class="listing-title">${listing.title}</div>
                  <div class="listing-location">📍 ${listing.location}</div>
                  <div class="listing-rent">₹${listing.rent}/month</div>
                  <div class="listing-amenities">
                    ${(listing.amenities || []).slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join("")}
                  </div>
                  <p style="margin-top: 10px; font-size: 12px;">
                    Status: <strong>${listing.status}</strong>
                  </p>
                  <button class="btn btn-danger" onclick="deleteListing('${listing._id}')" style="width: 100%; margin-top: 10px;">Delete</button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;

  window.toggleAddForm = function() {
    const form = document.getElementById("addFormContainer");
    form.style.display = form.style.display === "none" ? "block" : "none";
  };

  window.submitNewListing = async function() {
    const title = document.getElementById("roomTitle").value;
    const location = document.getElementById("roomLocation").value;
    const rent = parseFloat(document.getElementById("roomRent").value);
    const amenitiesStr = document.getElementById("roomAmenities").value;
    const imagesStr = document.getElementById("roomImages").value;
    const amenities = amenitiesStr.split(",").map(a => a.trim()).filter(a => a);
    const images = imagesStr.split(",").map(i => i.trim()).filter(i => i);

    if (!title || !location || !rent) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    try {
      await ListingAPI.create({
        title,
        location,
        rent,
        amenities,
        images,
        ownerId: user.id,
        status: "approved"
      });
      showMessage("Room listing added successfully!", "success");
      setTimeout(() => renderOwnerDashboard(), 1500);
    } catch (error) {
      showMessage("Error adding listing: " + error.message, "error");
    }
  };

  window.deleteListing = async function(listingId) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await ListingAPI.delete(listingId);
      showMessage("Listing deleted", "success");
      renderOwnerDashboard();
    } catch (error) {
      showMessage("Error deleting listing: " + error.message, "error");
    }
  };

  window.handleLogout = function() {
    logout();
    router.navigate("/");
  };
}
