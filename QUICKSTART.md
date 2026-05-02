# Quick Start Guide - MyRoommate

## ⚡ 30-Second Setup

1. **Start the server**
   ```bash
   cd d:\FInal_My_Roommate\myroommate
   npm run dev
   ```

2. **Open in browser**
   - Go to: `http://localhost:5000`
   - You'll see the home page with room listings

3. **Done!** ✅ The website is live

---

## 🎯 Quick Test Flows

### Test 1: Student Inquiry (No Login Required)
1. On home page, scroll down to see room listings
2. Click any room card
3. Enter Name: "John"
4. Enter Phone: "9876543210"
5. Click "Send Inquiry"
6. ✅ See success message

### Test 2: Admin Dashboard
1. Click "Admin" link in header
2. Login: `admin` / `admin123`
3. ✅ See all inquiries/leads
4. Change lead status using dropdown
5. Delete leads with Delete button

### Test 3: Owner Panel
1. Click "Owner Login"
2. Click "Sign Up Here"
3. Fill form:
   - Name: "Your Name"
   - Email: "you@example.com"
   - Phone: "9800000000"
   - Password: "pass123"
4. ✅ Login successful
5. Click "+ Add New Room"
6. Fill details:
   - Title: "2BHK Apartment"
   - Location: "Downtown"
   - Rent: "15000"
   - Amenities: "WiFi, AC, Furnished"
7. Click "Add Listing" ✅

### Test 4: Search Functionality
1. On home page, type "WiFi" in search box
2. Click "Search"
3. ✅ Shows only rooms with WiFi
4. Click "Clear Filters" to reset

---

## 🔑 Default Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Test Owner (Create one)
- Use the signup form
- Any email can be used (must be unique)

---

## 📊 Pre-loaded Data

The database comes with sample listings already loaded:
- Cozy Studio in City Center - ₹12000
- Spacious 2BHK - ₹25000
- Budget PG near University - ₹6000
- Shared Flat in Tech Park - ₹9500
- Boys PG near Metro - ₹8500

And some sample leads already in the system.

---

## 📱 Website Pages

| Page | URL | Who Can Access |
|------|-----|---|
| Home | `/` | Everyone |
| Room Details | `/room/:id` | Everyone |
| Admin Login | `/admin-login` | Everyone |
| Admin Dashboard | `/admin` | Admin only |
| Owner Login | `/owner-login` | Everyone |
| Owner Signup | `/owner-signup` | Everyone |
| Owner Dashboard | `/owner-dashboard` | Owner only |

---

## 🔄 Complete User Journey

```
Student:
  Homepage → Search/Filter → Click Room → Send Inquiry → Done
  (No login needed!)

Owner:
  Home → Owner Login → Sign Up → Add Room → View Dashboard → Manage Listings

Admin:
  Home → Admin Login → View All Leads → Change Status/Delete
```

---

## 🛠️ Useful Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install missing packages
npm install
```

---

## ✨ Features Summary

| Feature | Status | Where |
|---------|--------|-------|
| Room Search | ✅ | Home Page - Keywords |
| Price Filter | ✅ | Home Page - Price Range |
| Room Details | ✅ | Click on any room |
| Lead Inquiry | ✅ | Room details page |
| Admin Dashboard | ✅ | `/admin` |
| Lead Status Management | ✅ | Admin Dashboard |
| Owner Signup | ✅ | `/owner-signup` |
| Add Listings | ✅ | Owner Dashboard |
| View Listings | ✅ | Owner Dashboard |
| Delete Listings | ✅ | Owner Dashboard |
| Authentication | ✅ | JWT-based |

---

## 🎨 Styling

- Modern purple gradient header (#667eea → #764ba2)
- Clean white card-based design
- Responsive grid layout
- Mobile-friendly (tested)
- Status badges with color coding
- Smooth animations and transitions

---

## 📞 Still Need Help?

1. **Check terminal** for error messages
2. **Verify MongoDB** connection (should see "DB connected")
3. **Clear browser cache** if pages aren't updating
4. **Check network tab** in DevTools for failed requests

---

## ✅ Ready to Use!

Your MyRoommate website is fully functional and ready to use. Start by:
1. Running `npm run dev`
2. Opening `http://localhost:5000`
3. Testing the flows above

Enjoy! 🎉
