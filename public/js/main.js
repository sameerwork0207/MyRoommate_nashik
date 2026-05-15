// API Base URL
const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api';

// --- Card Templates ---
function createPropertyCard(listing) {
    const isPremium = listing.isPremium;
    const premiumBadge = isPremium 
        ? `<span class="badge-verified premium-badge"><i class="fas fa-star"></i> Premium Stays</span>`
        : `<span class="badge-verified"><i class="fas fa-shield-check"></i> Verified</span>`;
    
    // Fallback image if none provided
    const imageUrl = (listing.images && listing.images.length > 0) ? listing.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    let amenitiesHtml = '';
    if (listing.amenities && listing.amenities.length > 0) {
        // Show up to 3 amenities on the card
        amenitiesHtml = listing.amenities.slice(0, 3).map(amenity => 
            `<span class="amenity-chip"><i class="fas fa-check-circle"></i> ${amenity}</span>`
        ).join('');
    } else {
        // Fallbacks based on furnishing etc.
        amenitiesHtml = `<span class="amenity-chip"><i class="fas fa-couch"></i> ${listing.furnished || 'Furnished'}</span>`;
    }

    return `
    <div class="card" onclick="window.location.href='/property-detail.html?id=${listing._id}'" style="cursor: pointer;">
        <div class="card-img-wrapper">
            ${premiumBadge}
            <img src="${imageUrl}" alt="${listing.title}">
            <button class="btn-wishlist" onclick="event.stopPropagation();"><i class="far fa-heart"></i></button>
        </div>
        <div class="card-body">
            <div class="card-price">₹${listing.rent}<span>/mo</span></div>
            <h3 class="card-title">${listing.title}</h3>
            <p class="card-location"><i class="fas fa-map-marker-alt"></i> ${listing.location}, ${listing.city}</p>
            <div class="amenities">
                ${amenitiesHtml}
            </div>
        </div>
    </div>
    `;
}

// --- Horizontal Card Template (for listings.html) ---
function createHorizontalPropertyCard(listing) {
    const isPremium = listing.isPremium;
    const premiumBadge = isPremium 
        ? `<span class="badge-verified premium-badge" style="background: rgba(252, 180, 38, 0.95); color: #000;"><i class="fas fa-star"></i> Premium Stays</span>`
        : `<span class="badge-verified"><i class="fas fa-shield-check"></i> Verified</span>`;
    
    const imageUrl = (listing.images && listing.images.length > 0) ? listing.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    let chipsHtml = '';
    if (listing.audienceTags && listing.audienceTags.length > 0) {
        chipsHtml += `<span class="chip"><i class="fas fa-user"></i> ${listing.audienceTags[0]}</span>`;
    }
    chipsHtml += `<span class="chip"><i class="fas fa-couch"></i> ${listing.furnished || 'Furnished'}</span>`;

    return `
    <div class="property-card fade-in">
        <div class="card-img-wrapper" onclick="window.location.href='/property-detail.html?id=${listing._id}'" style="cursor:pointer;">
            ${premiumBadge}
            <button class="btn-wishlist" onclick="event.stopPropagation(); this.classList.toggle('active')"><i class="fas fa-heart"></i></button>
            <img src="${imageUrl}" alt="${listing.title}">
        </div>
        <div class="card-content">
            <div>
                <div class="card-header">
                    <h3 class="card-title" onclick="window.location.href='/property-detail.html?id=${listing._id}'" style="cursor:pointer;">${listing.title}</h3>
                    <div class="card-price">
                        <div class="card-price-val">₹${listing.rent}</div>
                        <div class="card-price-sub">per month</div>
                    </div>
                </div>
                <div class="card-location">
                    <i class="fas fa-map-marker-alt"></i> ${listing.location}, ${listing.city}
                </div>
                <div class="card-chips">
                    ${chipsHtml}
                </div>
            </div>
            <div class="card-footer">
                <span class="availability"><i class="fas fa-check-circle"></i> Available Now</span>
                <div class="card-actions">
                    <button class="btn-details" onclick="window.location.href='/property-detail.html?id=${listing._id}'">View Details</button>
                    <button class="btn-whatsapp"><i class="fab fa-whatsapp"></i> Chat</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// --- Fetch & Render Listings ---
async function fetchAndRenderListings() {
    const params = new URLSearchParams(window.location.search);
    const typeFilter = params.get('type');
    const premiumFilter = params.get('isPremium');
    const locationFilter = params.get('location');

    try {
        let url = `${API_URL}/listings`;
        const queryParams = [];
        if (typeFilter) queryParams.push(`type=${typeFilter}`);
        if (premiumFilter) queryParams.push(`isPremium=${premiumFilter}`);
        if (locationFilter) queryParams.push(`location=${locationFilter}`);
        
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const listings = await response.json();

        const recommendedGrid = document.getElementById('recommended-grid');
        const premiumGrid = document.getElementById('premium-grid');
        
        // Only run if we are on a page with these grids (like index.html)
        if (recommendedGrid || premiumGrid) {
            let recommendedHtml = '';
            let premiumHtml = '';
            
            listings.forEach(listing => {
                const cardHtml = createPropertyCard(listing);
                if (listing.isPremium) {
                    premiumHtml += cardHtml;
                } else {
                    recommendedHtml += cardHtml;
                }
            });

            if (recommendedGrid && recommendedHtml) recommendedGrid.innerHTML = recommendedHtml;
            if (premiumGrid && premiumHtml) premiumGrid.innerHTML = premiumHtml;
        }

        // If on the listings.html page
        const actualListingsGrid = document.getElementById('actualListings');
        if (actualListingsGrid) {
            let html = '';
            listings.forEach(listing => {
                html += createHorizontalPropertyCard(listing);
            });
            actualListingsGrid.innerHTML = html || '<p>No listings found.</p>';
            
            // Hide skeleton if present
            const skeletonLoader = document.getElementById('skeletonLoader');
            if (skeletonLoader) skeletonLoader.style.display = 'none';
            actualListingsGrid.style.display = 'flex';
        }

    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// --- Property Detail Page Logic ---
async function fetchAndRenderPropertyDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    try {
        const response = await fetch(`${API_URL}/listings/${id}`);
        if (!response.ok) throw new Error("Property not found");
        const listing = await response.json();

        // Title and Location
        const titleEl = document.querySelector('.property-title');
        if (titleEl) titleEl.textContent = listing.title;
        
        const locEl = document.querySelector('.property-location');
        if (locEl) locEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${listing.location}, ${listing.city}`;

        // Price
        const priceHuge = document.querySelector('.price-huge');
        if (priceHuge) priceHuge.innerHTML = `₹${listing.rent}<span>/month</span>`;
        
        // Description
        const descEl = document.querySelector('.description-text');
        if (descEl) descEl.textContent = listing.description;

        // Quick Info
        const quickInfo = document.querySelector('.quick-info-grid');
        if (quickInfo) {
            let infoHtml = '';
            if (listing.audienceTags && listing.audienceTags.length > 0) {
                infoHtml += `<div class="info-card"><i class="fas fa-users"></i> <span>${listing.audienceTags.join(', ')}</span></div>`;
            }
            if (listing.furnished) {
                infoHtml += `<div class="info-card"><i class="fas fa-couch"></i> <span>${listing.furnished}</span></div>`;
            }
            infoHtml += `<div class="info-card"><i class="fas fa-home"></i> <span>${listing.type || 'PG'}</span></div>`;
            quickInfo.innerHTML = infoHtml;
        }

        // Gallery
        if (listing.images && listing.images.length > 0) {
            const mainImg = document.querySelector('.gallery-main img');
            if (mainImg) mainImg.src = listing.images[0];
            
            const sideGrid = document.querySelector('.gallery-side');
            if (sideGrid && listing.images.length > 1) {
                let sideHtml = '';
                for(let i=1; i<Math.min(listing.images.length, 3); i++) {
                    sideHtml += `
                    <div class="gallery-img-wrapper">
                        <img src="${listing.images[i]}" alt="Room view">
                    </div>`;
                }
                sideGrid.innerHTML = sideHtml;
            }
        }

        // Amenities
        const amenitiesGrid = document.querySelector('.amenities-grid');
        if (amenitiesGrid && listing.amenities) {
            amenitiesGrid.innerHTML = listing.amenities.map(am => 
                `<div class="amenity-item"><i class="fas fa-check-circle"></i> ${am}</div>`
            ).join('');
        }

        // Render Nearby Places
        const nearbyGrid = document.getElementById('nearbyGrid');
        if (nearbyGrid && listing.nearbyPlaces && listing.nearbyPlaces.length > 0) {
            nearbyGrid.innerHTML = '';
            listing.nearbyPlaces.forEach(place => {
                nearbyGrid.innerHTML += `
                    <div class="place-card">
                        <h4>${place.name}</h4>
                        <p><span>Distance: ${place.distance}</span> <span><i class="fas fa-walking"></i> ${place.time}</span></p>
                    </div>
                `;
            });
        }

        // Render House Rules
        const rulesGrid = document.getElementById('rulesGrid');
        if (rulesGrid && listing.rules && listing.rules.length > 0) {
            rulesGrid.innerHTML = '';
            listing.rules.forEach(rule => {
                rulesGrid.innerHTML += `
                    <div class="rule-card">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4>${rule.title}</h4>
                            <p>${rule.description}</p>
                        </div>
                    </div>
                `;
            });
        }

        // --- Lead Form Logic ---
        const leadForm = document.getElementById('leadForm');
        if (leadForm) {
            leadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('leadSubmitBtn');
                const msg = document.getElementById('leadFormMsg');
                
                const data = {
                    listingId: id,
                    name: document.getElementById('leadName').value,
                    phone: document.getElementById('leadPhone').value,
                    college: document.getElementById('leadCollege').value,
                    scheduledVisit: document.getElementById('leadDate').value
                };

                try {
                    btn.textContent = 'Submitting...';
                    btn.disabled = true;
                    
                    const res = await fetch(`${API_URL}/leads`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    if (res.ok) {
                        msg.textContent = 'Visit scheduled successfully! Our team will contact you soon.';
                        msg.style.color = '#10b981';
                        msg.style.display = 'block';
                        leadForm.reset();
                    } else {
                        throw new Error('Failed to submit');
                    }
                } catch (err) {
                    msg.textContent = 'Something went wrong. Please try again.';
                    msg.style.color = 'red';
                    msg.style.display = 'block';
                } finally {
                    btn.textContent = 'Schedule Visit for Free';
                    btn.disabled = false;
                }
            });
        }

    } catch (error) {
        console.error("Error fetching detail:", error);
    }
}

// --- Navbar Logic ---
function initNavbar() {
    const profileBtn = document.querySelector('.fa-user-circle');
    const menuBtn = document.querySelector('.fa-bars');
    const navLinks = document.querySelector('.nav-links');

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.role === 'admin') window.location.href = '/admin.html';
                    else window.location.href = '/dashboard.html';
                } catch (e) {
                    window.location.href = '/login.html';
                }
            } else {
                window.location.href = '/login.html';
            }
        });
    }

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            if (navLinks.classList.contains('mobile-active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid #eee';
                navLinks.style.zIndex = '100';
            } else {
                navLinks.style.display = '';
            }
        });
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    if (document.getElementById('recommended-grid') || document.getElementById('actualListings')) {
        fetchAndRenderListings();
    }
    if (document.querySelector('.property-page')) {
        fetchAndRenderPropertyDetail();
    }
});
