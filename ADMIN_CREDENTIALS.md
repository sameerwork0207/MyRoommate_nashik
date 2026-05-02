# Admin Login Credentials

## Default Admin Account

### Username
```
admin
```

### Password
```
admin123
```

## How to Access Admin Panel

1. Go to website home page: http://localhost:5000
2. Click "Admin" link in top right navigation
3. Enter credentials above
4. You'll access the admin dashboard

## Admin Dashboard Features

- View all lead inquiries from students
- Change lead status (New → Contacted → Visit Scheduled → Converted → Dropped)
- Delete leads
- See statistics (total leads, new leads, contacted leads)
- View student contact information (name, phone)
- See which room they inquired about

## Changing Admin Password

To change admin credentials, edit the `.env` file:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Change the values and restart the server.

---

**Note**: This is the master admin account for the entire platform.
