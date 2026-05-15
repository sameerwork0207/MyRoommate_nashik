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
        // Fetch Stats
        const statsRes = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.status === 401 || statsRes.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }
        const stats = await statsRes.json();
        
        // Render Stats
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card">
                <div class="stat-header"><span>Total Properties</span> <i class="fas fa-building"></i></div>
                <div class="stat-value">${stats.totalProperties}</div>
                <div class="stat-trend trend-up"><i class="fas fa-arrow-up"></i> Live count</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span>Active Leads</span> <i class="fas fa-user-friends"></i></div>
                <div class="stat-value">${stats.activeLeads}</div>
                <div class="stat-trend trend-up"><i class="fas fa-arrow-up"></i> Live count</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span>Premium Listings</span> <i class="fas fa-crown" style="color: var(--primary);"></i></div>
                <div class="stat-value">${stats.premiumListings}</div>
                <div class="stat-trend" style="color: var(--text-muted);">Active</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span>Visit Requests</span> <i class="fas fa-calendar-alt"></i></div>
                <div class="stat-value">${stats.visitRequests}</div>
                <div class="stat-trend trend-down"><i class="fas fa-exclamation-circle"></i> Pending approval</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span>Monthly Visitors</span> <i class="fas fa-chart-line"></i></div>
                <div class="stat-value">${stats.monthlyVisitors}</div>
                <div class="stat-trend trend-up"><i class="fas fa-arrow-up"></i> Demo stats</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span>WhatsApp Inq.</span> <i class="fab fa-whatsapp" style="color: #25D366;"></i></div>
                <div class="stat-value">${stats.whatsappInquiries}</div>
                <div class="stat-trend trend-up"><i class="fas fa-arrow-up"></i> Demo stats</div>
            </div>
        `;

        // Fetch Properties
        const propsRes = await fetch('/api/admin/properties', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const properties = await propsRes.json();
        const tbody = document.querySelector('#propertiesTable tbody');
        tbody.innerHTML = ''; // Clear skeletons
        
        properties.forEach(prop => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="prop-cell">
                        <img src="${prop.images && prop.images[0] ? prop.images[0] : 'https://via.placeholder.com/100'}" class="prop-img">
                        <div class="prop-info">
                            <h4>${prop.title}</h4>
                            <p>${prop.location}</p>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600;">₹${prop.rent}</td>
                <td><span class="status-badge badge-verified">${prop.status}</span></td>
                <td><span class="${prop.isPremium ? 'status-badge badge-premium' : ''}">${prop.isPremium ? '<i class="fas fa-crown"></i> Premium' : 'Standard'}</span></td>
                <td><button onclick='editProperty(${JSON.stringify(prop)})' class="btn-ghost"><i class="fas fa-edit"></i></button></td>
            `;
            tbody.appendChild(tr);
        });

        // Fetch Leads
        const leadsRes = await fetch('/api/admin/leads', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const leads = await leadsRes.json();
        const leadsList = document.getElementById('leadsList');
        leadsList.innerHTML = '';
        
        leads.forEach(lead => {
            const div = document.createElement('div');
            div.className = 'lead-item';
            div.innerHTML = `
                <div class="lead-top">
                    <div>
                        <div class="lead-name">${lead.name} (${lead.phone})</div>
                        <div class="lead-source"><span class="status-badge badge-new" style="padding: 2px 6px; font-size: 0.65rem;">${lead.status}</span> Date: ${new Date(lead.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="lead-target">${lead.listingId ? lead.listingId.title : 'Direct Contact'}</div>
                <div class="lead-actions">
                    <a href="https://wa.me/${lead.phone}" target="_blank" class="btn-small wa" style="text-decoration:none; display:inline-flex; align-items:center; gap:4px;"><i class="fab fa-whatsapp"></i> Chat</a>
                    <button class="btn-small" onclick="updateLeadStatus('${lead._id}', 'Contacted')">Mark Contacted</button>
                </div>
            `;
            leadsList.appendChild(div);
        });

    } catch (err) {
        console.error('Failed to load admin data:', err);
    }
});

// Modal Logic
window.openModal = () => {
    document.getElementById('propertyModal').style.display = 'flex';
    document.getElementById('propertyForm').reset();
    document.getElementById('propId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Property';
};

window.closeModal = () => {
    document.getElementById('propertyModal').style.display = 'none';
};

window.editProperty = (prop) => {
    document.getElementById('propertyModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Edit Property';
    document.getElementById('propId').value = prop._id;
    document.getElementById('propTitle').value = prop.title;
    document.getElementById('propType').value = prop.type;
    document.getElementById('propRent').value = prop.rent;
    document.getElementById('propLocation').value = prop.location;
    document.getElementById('propDesc').value = prop.description || '';
    document.getElementById('propPremium').checked = prop.isPremium || false;
};

document.getElementById('propertyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('propId').value;
    const body = {
        title: document.getElementById('propTitle').value,
        type: document.getElementById('propType').value,
        rent: document.getElementById('propRent').value,
        location: document.getElementById('propLocation').value,
        description: document.getElementById('propDesc').value,
        isPremium: document.getElementById('propPremium').checked,
        status: 'approved'
    };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/properties/${id}` : '/api/admin/properties';
    const token = localStorage.getItem('token');
    
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
    });
    
    closeModal();
    window.location.reload();
});

window.updateLeadStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
    alert('Lead status updated to ' + status);
    window.location.reload();
};
