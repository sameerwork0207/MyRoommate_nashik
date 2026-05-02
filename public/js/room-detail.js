async function renderRoomDetail() {
  const app = document.getElementById("app");
  const pathSegments = window.location.pathname.split("/");
  const roomId = pathSegments[pathSegments.length - 1];

  let listing = null;

  try {
    listing = await ListingAPI.getById(roomId);
  } catch (error) {
    app.innerHTML = `
      <header>
        <nav class="container">
          <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        </nav>
      </header>
      <div class="container" style="padding: 40px 0; text-align: center;">
        <h3>Room not found</h3>
        <button class="btn btn-primary" onclick="router.navigate('/')" style="margin-top: 20px;">Back to Home</button>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          ${getCurrentUser() ? `
            <span>${getCurrentUser().name}</span>
            <button onclick="handleLogout()">Logout</button>
          ` : `
            <a href="#" onclick="router.navigate('/owner-login'); return false">Owner Login</a>
          `}
        </div>
      </nav>
    </header>

    <div class="container detail-container" style="padding: 40px 0;">
      <div>
        <div class="detail-image">
          ${listing.images && listing.images.length > 0 
            ? `<img src="${listing.images[0]}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" alt="Room">`
            : "Room Image"}
        </div>
        ${listing.images && listing.images.length > 1 ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 15px;">
            ${listing.images.slice(1).map(img => `
              <img src="${img}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px; cursor: pointer;" alt="Room">
            `).join("")}
          </div>
        ` : ""}
        <div style="margin-top: 20px;">
          <button class="btn btn-secondary" onclick="router.navigate('/')">← Back to Home</button>
        </div>
      </div>

      <div class="detail-info">
        <h2>${listing.title}</h2>
        <p><strong>Location:</strong> ${listing.location}</p>
        <div class="detail-rent">₹${listing.rent}/month</div>

        <div class="detail-amenities">
          <h4>Amenities:</h4>
          <ul>
            ${(listing.amenities || []).length === 0 ? "<li>No amenities listed</li>" : (listing.amenities || []).map(a => `<li>✓ ${a}</li>`).join("")}
          </ul>
        </div>

        <div class="inquiry-form">
          <h3>Send Inquiry</h3>
          <p>Get in touch with the room owner</p>
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" id="inquiryName" placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label>Your Phone Number</label>
            <input type="tel" id="inquiryPhone" placeholder="Enter your phone number">
          </div>
          <button class="btn btn-primary" onclick="submitInquiry('${listing._id}')" style="width: 100%;">Send Inquiry</button>
        </div>
      </div>
    </div>
  `;

  window.submitInquiry = async function(listingId) {
    const name = document.getElementById("inquiryName").value;
    const phone = document.getElementById("inquiryPhone").value;

    if (!name || !phone) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    if (phone.length < 10) {
      showMessage("Please enter a valid phone number", "error");
      return;
    }

    try {
      await LeadAPI.create(name, phone, listingId);
      showMessage("Inquiry sent successfully! We'll contact you soon.", "success");
      setTimeout(() => router.navigate("/"), 2000);
    } catch (error) {
      showMessage("Error sending inquiry: " + error.message, "error");
    }
  };

  window.handleLogout = function() {
    logout();
    router.navigate("/");
  };
}
