async function renderAdminDashboard() {
  const app = document.getElementById("app");

  // Check if admin is logged in
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    app.innerHTML = `
      <header>
        <nav class="container">
          <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        </nav>
      </header>
      <div class="container" style="padding: 40px 0; text-align: center;">
        <h3>Unauthorized Access</h3>
        <p>You need to be an admin to access this page.</p>
        <button class="btn btn-primary" onclick="router.navigate('/admin-login')" style="margin-top: 20px;">Go to Admin Login</button>
      </div>
    `;
    return;
  }

  let leads = [];

  try {
    leads = await LeadAPI.getAll();
  } catch (error) {
    console.error("Error fetching leads:", error);
    showMessage("Error loading leads", "error");
  }

  app.innerHTML = `
    <header>
      <nav class="container">
        <div class="logo" onclick="router.navigate('/')"><span class="logo-main">MyRoommate</span><span class="logo-city">Nashik</span></div>
        <div class="nav-links">
          <span>Admin Panel - ${user.name}</span>
          <button onclick="handleLogout()">Logout</button>
        </div>
      </nav>
    </header>

    <div class="admin-container container">
      <div class="admin-header">
        <h2>Lead Enquiries Dashboard</h2>
        <p>Manage all customer inquiries and track their status</p>
        <div style="margin-top: 20px;">
          <strong>Total Leads:</strong> ${leads.length}
          <span style="margin-left: 30px;"><strong>New:</strong> ${leads.filter(l => l.status === "New").length}</span>
          <span style="margin-left: 20px;"><strong>Contacted:</strong> ${leads.filter(l => l.status === "Contacted").length}</span>
        </div>
      </div>

      <div class="leads-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="leadsTableBody">
            ${leads.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">No inquiries yet</td>
              </tr>
            ` : leads.map(lead => `
              <tr>
                <td>${lead.name}</td>
                <td><a href="tel:${lead.phone}">${lead.phone}</a></td>
                <td>${lead.listingId?.title || "N/A"}</td>
                <td><span class="status-badge status-${lead.status.toLowerCase().replace(" ", "-")}">${lead.status}</span></td>
                <td>
                  <div class="action-buttons">
                    <select onchange="updateLeadStatus('${lead._id}', this.value)">
                      <option value="">Change Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Visit Scheduled">Visit Scheduled</option>
                      <option value="Converted">Converted</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                    <button class="btn btn-danger" onclick="deleteLead('${lead._id}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.updateLeadStatus = async function(leadId, status) {
    if (!status) return;

    try {
      await LeadAPI.updateStatus(leadId, status);
      showMessage("Lead status updated", "success");
      renderAdminDashboard();
    } catch (error) {
      showMessage("Error updating status: " + error.message, "error");
    }
  };

  window.deleteLead = async function(leadId) {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await LeadAPI.delete(leadId);
      showMessage("Lead deleted", "success");
      renderAdminDashboard();
    } catch (error) {
      showMessage("Error deleting lead: " + error.message, "error");
    }
  };

  window.handleLogout = function() {
    logout();
    router.navigate("/");
  };
}
