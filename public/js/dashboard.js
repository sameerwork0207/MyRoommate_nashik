// --- Logout Logic ---
document.querySelector('a[href="#"][style*="color: #ef4444"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const res = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        const data = await res.json();
        const { user, visitRequests } = data;

        // Render Profile
        document.querySelector('.profile-details h1').textContent = user.name || user.email;
        document.querySelector('.profile-details p').innerHTML = `<i class="fas fa-phone-alt"></i> ${user.phone}`;
        
        // Render Stats
        document.querySelector('[data-target="12"]').textContent = user.savedProperties.length;
        document.querySelector('[data-target="3"]').textContent = visitRequests.length;
        // Mock remaining stats
        document.querySelector('[data-target="5"]').textContent = "0";
        document.querySelector('[data-target="28"]').textContent = "0";

        // Render Saved Properties
        const propertyGrid = document.querySelector('.property-grid');
        propertyGrid.innerHTML = ''; // Clear dummies
        if (user.savedProperties && user.savedProperties.length > 0) {
            user.savedProperties.forEach(prop => {
                const card = document.createElement('div');
                card.className = 'property-card';
                card.innerHTML = `
                    <div class="pc-img-wrapper">
                        ${prop.isPremium ? '<span class="badge-verified" style="background: rgba(252, 180, 38, 0.9); color: #fff;"><i class="fas fa-star"></i> Premium</span>' : '<span class="badge-verified"><i class="fas fa-shield-check"></i> Verified</span>'}
                        <button class="btn-wishlist" style="color: #ef4444;" onclick="saveProperty('${prop._id}')"><i class="fas fa-heart"></i></button>
                        <img src="${prop.images && prop.images[0] ? prop.images[0] : 'https://via.placeholder.com/600'}" alt="${prop.title}">
                    </div>
                    <div class="pc-content">
                        <div class="pc-price">₹${prop.rent}<span>/mo</span></div>
                        <h3 class="pc-title">${prop.title}</h3>
                        <p class="pc-loc"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                        <div class="pc-actions">
                            <button class="btn-view" onclick="window.location.href='/property-detail.html?id=${prop._id}'">Details</button>
                            <a href="https://wa.me/${prop.managerInfo ? prop.managerInfo.phone : ''}" target="_blank" class="btn-wa"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                `;
                propertyGrid.appendChild(card);
            });
        } else {
            propertyGrid.innerHTML = '<p>No saved properties yet.</p>';
        }

        // Render Visit Requests
        const visitList = document.querySelector('.visit-list');
        visitList.innerHTML = '';
        if (visitRequests && visitRequests.length > 0) {
            visitRequests.forEach(visit => {
                const badgeClass = visit.status === 'Approved' || visit.status === 'Visit Scheduled' ? 'approved' : 'pending';
                const card = document.createElement('div');
                card.className = 'visit-card';
                card.innerHTML = `
                    <img src="${visit.listingId && visit.listingId.images ? visit.listingId.images[0] : 'https://via.placeholder.com/150'}" class="vc-img">
                    <div class="vc-info">
                        <h4 class="vc-title">${visit.listingId ? visit.listingId.title : 'General Visit Request'}</h4>
                        <p class="vc-time"><i class="far fa-calendar-alt"></i> ${new Date(visit.scheduledVisit).toLocaleDateString()}</p>
                        <span class="status-badge ${badgeClass}">${visit.status}</span>
                    </div>
                `;
                visitList.appendChild(card);
            });
        } else {
            visitList.innerHTML = '<p>No visit requests yet.</p>';
        }

        // Render Preferences
        if (user.preferences) {
            const prefs = document.querySelectorAll('.pref-card p');
            if(prefs.length >= 4) {
                prefs[0].textContent = `₹${user.preferences.budgetMin || 0} - ₹${user.preferences.budgetMax || 10000}`;
                prefs[1].textContent = user.preferences.food || 'Any';
                prefs[2].textContent = user.preferences.sleep || 'Any';
                prefs[3].textContent = user.preferences.smoking || 'Any';
            }
        }

    } catch (err) {
        console.error('Failed to load user data:', err);
    }
});

document.getElementById('prefForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const body = {
        budgetMin: document.getElementById('prefBudgetMin').value,
        budgetMax: document.getElementById('prefBudgetMax').value,
        food: document.getElementById('prefFood').value,
        sleep: document.getElementById('prefSleep').value,
        smoking: document.getElementById('prefSmoke').value
    };

    try {
        await fetch('/api/users/preferences', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        
        alert('Preferences updated successfully!');
        window.location.reload();
    } catch (error) {
        alert('Failed to update preferences.');
    }
});

window.saveProperty = async (propertyId) => {
    const token = localStorage.getItem('token');
    await fetch('/api/users/save-property', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId })
    });
    window.location.reload();
};
