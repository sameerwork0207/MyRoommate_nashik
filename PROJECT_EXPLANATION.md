# MyRoommate Project - Complete Explanation

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Why This Stack](#why-this-stack)
3. [Architecture Overview](#architecture-overview)
4. [Folder Structure](#folder-structure)
5. [Control Flow](#control-flow)
6. [Data Flow](#data-flow)
7. [File-by-File Explanation](#file-by-file-explanation)
8. [Complete Code Documentation](#complete-code-documentation)

---

## Technology Stack

### Frontend Stack
- **HTML5** - Semantic markup and structure
- **CSS3** - Styling with flexbox and grid layouts, black & white theme
- **Vanilla JavaScript (ES6+)** - No frameworks, pure DOM manipulation
- **Client-side Router** - Custom SPA (Single Page Application) router

### Backend Stack
- **Node.js** - JavaScript runtime environment
- **Express.js v5** - Web framework and HTTP server
- **MongoDB Atlas** - Cloud database for data persistence
- **Mongoose v9** - ODM (Object Data Modeling) for MongoDB
- **JWT (jsonwebtoken v9)** - Token-based authentication
- **bcryptjs v2** - Password hashing and encryption
- **CORS v2** - Cross-Origin Resource Sharing

### Development Tools
- **npm** - Package manager
- **nodemon v3** - Auto-restart server on file changes
- **dotenv v17** - Environment variable management

---

## Why This Stack

### Why Frontend (Vanilla JS + Custom SPA)?
1. **No Build Process Required** - Code runs directly in browser, no webpack/babel needed
2. **Learning-Friendly** - Students can understand every line without framework abstractions
3. **Lightweight** - No framework overhead, minimal JavaScript (only ~1000 lines)
4. **Complete Control** - Full visibility into routing, state management, API calls
5. **Perfect for Portfolio** - Shows core web development skills

### Why Node.js + Express?
1. **Single Language** - JavaScript on both frontend and backend (full-stack JS)
2. **Easy to Learn** - Gentle learning curve for beginners
3. **Great for APIs** - Express makes REST API development intuitive
4. **Async/Await** - Modern, readable asynchronous code
5. **npm Ecosystem** - Thousands of useful packages

### Why MongoDB?
1. **Flexible Schema** - No rigid table structure, evolves with your data
2. **NoSQL** - JSON-like documents match JavaScript objects naturally
3. **Cloud Hosted (Atlas)** - No server setup needed, free tier available
4. **Fast Development** - Quick prototyping and changes
5. **Scalable** - Grows with your application

### Why JWT + bcryptjs?
1. **Stateless Authentication** - No session storage needed on server
2. **Mobile-Friendly** - Works great with mobile apps and SPAs
3. **Secure** - bcryptjs salts and hashes passwords, impossible to reverse
4. **Industry Standard** - Used by most modern web applications

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Single Page Application (SPA)                     │ │
│  │  - Home Page (Search, Filter, Listings)           │ │
│  │  - Room Detail Page (Inquiry Form)                │ │
│  │  - Owner Dashboard (Add Listings, Manage)         │ │
│  │  - Admin Dashboard (Lead Management)              │ │
│  │  - Auth Pages (Owner Login/Signup, Admin Login)   │ │
│  └────────────────────────────────────────────────────┘ │
│  Client-Side Router (No Page Reloads)                  │
│  Local Storage (Token, User Data)                      │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP REST API
┌─────────────────────────────────────────────────────────┐
│              SERVER (Express.js on Node.js)             │
│  ┌────────────────────────────────────────────────────┐ │
│  │  API Routes:                                       │ │
│  │  - /api/auth (Signup, Login, Admin Login)         │ │
│  │  - /api/listings (CRUD: Create, Read, Update)     │ │
│  │  - /api/leads (CRUD: Create, Read, Update Status) │ │
│  └────────────────────────────────────────────────────┘ │
│  Middleware:                                            │
│  │  - CORS (Cross-Origin Requests)                    │ │
│  │  - JSON Parser (Request Bodies)                    │ │
│  │  - Static File Server (HTML, CSS, JS)             │ │
│  │  - Auth Verification (JWT Tokens)                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↕ Database Queries
┌─────────────────────────────────────────────────────────┐
│         DATABASE (MongoDB Atlas Cloud)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Collections:                                      │ │
│  │  - Users (Owners & Students)                       │ │
│  │  - Listings (Room Listings)                        │ │
│  │  - Leads (Inquiries)                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
myroommate/
│
├── server/                    # Backend code
│   ├── server.js             # Main server entry point
│   ├── middleware/           # Authentication middleware
│   │   └── auth.js           # JWT verification functions
│   ├── models/               # Database schemas (Mongoose)
│   │   ├── User.js           # User schema (owners & students)
│   │   ├── Listing.js        # Room listing schema
│   │   └── Lead.js           # Inquiry lead schema
│   ├── controllers/          # Business logic
│   │   ├── authController.js # Authentication logic
│   │   ├── listingController.js # Listing CRUD operations
│   │   └── leadController.js # Lead CRUD operations
│   └── routes/               # API endpoints
│       ├── authRoutes.js     # Auth endpoints
│       ├── listingRoutes.js  # Listing endpoints
│       └── leadRoutes.js     # Lead endpoints
│
├── public/                    # Frontend code (served to browser)
│   ├── index.html            # Single HTML file (SPA entry point)
│   ├── css/                  # Styling
│   │   └── style.css         # All CSS (1000+ lines, black & white theme)
│   └── js/                   # JavaScript files
│       ├── router.js         # Client-side SPA router
│       ├── api.js            # API service layer & auth functions
│       ├── app.js            # Route registration & initialization
│       ├── home.js           # Home page with search & filters
│       ├── room-detail.js    # Room detail & inquiry form
│       ├── admin-dashboard.js # Admin lead management
│       └── owner-auth.js     # Owner auth & dashboard
│
├── .env                       # Environment variables
├── package.json              # Project dependencies
├── node_modules/             # Installed packages
│
└── [Documentation files]      # README, guides, etc.
```

### Folder Purposes

#### **server/** - Backend Logic
- Handles all HTTP requests and responses
- Manages database operations
- Enforces authentication and authorization
- Validates all inputs
- Returns JSON responses to frontend

#### **server/models/** - Database Schemas
- Defines the shape of data in MongoDB
- Sets validation rules
- Establishes relationships between collections
- Uses Mongoose for type safety

#### **server/controllers/** - Business Logic
- Contains the actual logic for each operation
- Interacts with database models
- Performs calculations and transformations
- Error handling and validation

#### **server/routes/** - URL Mappings
- Maps HTTP endpoints to controller functions
- Groups related endpoints
- Applies middleware (like authentication)

#### **server/middleware/** - Request Processing
- Runs before routes are executed
- JWT verification for protected routes
- CORS handling, JSON parsing, etc.

#### **public/** - Frontend (Single Page App)
- Everything served to the browser
- No server-side rendering
- Client handles all routing and rendering
- Makes API calls to server

#### **public/js/router.js** - SPA Router
- Handles client-side navigation
- No page reloads, smooth transitions
- Manages browser history with `pushState`

#### **public/js/api.js** - API & Auth
- Centralized API call function
- All API methods (Auth, Listings, Leads)
- Manages tokens and user data in localStorage

---

## Control Flow

### 1. Application Startup

```
Browser loads http://localhost:5000
        ↓
Express server serves public/index.html
        ↓
HTML loads CSS and all JS files in order:
- router.js (creates Router instance)
- api.js (defines API functions)
- home.js (defines renderHome function)
- room-detail.js (defines renderRoomDetail function)
- admin-dashboard.js (defines renderAdminDashboard function)
- owner-auth.js (defines owner/admin auth functions)
- app.js (registers all routes with router)
        ↓
DOMContentLoaded event fires
        ↓
router.start() is called
        ↓
Current URL is matched to a route
        ↓
Corresponding handler function is executed
        ↓
Handler renders HTML into <div id="app"></div>
```

### 2. Page Navigation Flow

```
User clicks a link/button
        ↓
JavaScript handler calls router.navigate('/page-path')
        ↓
router.navigate() calls window.history.pushState()
        ↓
pushState triggers 'popstate' event listener
        ↓
handleNavigation() is called
        ↓
Current URL pathname is extracted
        ↓
getRoute(path) finds matching route handler
        ↓
Handler function is executed
        ↓
Handler renders HTML into #app (replacing old content)
        ↓
New page is visible to user (NO RELOAD)
```

### 3. User Authentication Flow

```
User enters email & password
        ↓
User clicks "Login"
        ↓
handleOwnerLogin() is called
        ↓
AuthAPI.login(email, password) makes HTTP POST
        ↓
Server receives /api/auth/login request
        ↓
authController.login():
  - Finds user by email
  - Compares password with bcryptjs.compare()
  - Creates JWT token with user data
  - Returns token & user info
        ↓
Frontend receives response
        ↓
setAuthToken(token) stores token in localStorage
        ↓
setCurrentUser(user) stores user in localStorage
        ↓
router.navigate('/owner-dashboard')
        ↓
Dashboard checks: if (!user || user.role !== "owner") redirect
        ↓
Dashboard renders with user data
```

### 4. Listing Creation Flow

```
Owner enters room details (title, location, rent, amenities, images)
        ↓
Owner clicks "Add Listing"
        ↓
submitNewListing() is called
        ↓
Collects form data (split comma-separated values)
        ↓
Calls ListingAPI.create({title, location, rent, amenities, images, ownerId, status: "approved"})
        ↓
HTTP POST request to /api/listings
        ↓
Server receives listing data
        ↓
listingController.createListing():
  - Validates required fields
  - Creates new Listing document in MongoDB
  - Returns created listing with _id
        ↓
Frontend receives success response
        ↓
showMessage("Room listing added successfully!")
        ↓
setTimeout(() => renderOwnerDashboard(), 1500)
        ↓
renderOwnerDashboard fetches all listings again
        ↓
New listing appears in dashboard
```

### 5. Lead (Inquiry) Submission Flow

```
Student fills inquiry form (name, phone) on room detail page
        ↓
Student clicks "Send Inquiry"
        ↓
submitInquiry() is called
        ↓
Validates name and phone (min 10 digits)
        ↓
Calls LeadAPI.create(name, phone, listingId)
        ↓
HTTP POST request to /api/leads
        ↓
Server receives lead data
        ↓
leadController.createLead():
  - Validates required fields
  - Creates new Lead document in MongoDB
  - Returns created lead
        ↓
Frontend receives success response
        ↓
showMessage("Inquiry sent successfully!")
        ↓
setTimeout(() => router.navigate("/"), 2000)
        ↓
Returns to home page
        ↓
Admin can now see this lead in /admin dashboard
```

---

## Data Flow

### Complete Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
│  User Actions (click, type, submit)                          │
│           ↓                                                  │
│  Event Handlers in JS Functions                             │
│           ↓                                                  │
│  Collect Form Data / Prepare Request Body                   │
│           ↓                                                  │
│  Call API Methods (AuthAPI, ListingAPI, LeadAPI)            │
└──────────────────────────────────────────────────────────────┘
                      ↓ HTTP Request
    Content-Type: application/json
    Authorization: Bearer [JWT_TOKEN]
    Body: { data as JSON }
                      ↓
┌──────────────────────────────────────────────────────────────┐
│                Backend (Express.js)                          │
│  Request arrives at /api/endpoint                            │
│           ↓                                                  │
│  CORS Middleware (allows origin)                            │
│           ↓                                                  │
│  JSON Parser Middleware (parses body)                       │
│           ↓                                                  │
│  Auth Middleware (verifies JWT if needed)                   │
│           ↓                                                  │
│  Route Handler (authRoutes, listingRoutes, leadRoutes)      │
│           ↓                                                  │
│  Controller Function (business logic)                       │
│           ↓                                                  │
│  Validate Input Data                                        │
│           ↓                                                  │
│  Interact with Database (Mongoose models)                   │
└──────────────────────────────────────────────────────────────┘
                      ↓ Database Operation
┌──────────────────────────────────────────────────────────────┐
│              MongoDB (Cloud Database)                        │
│  Find, Create, Update, or Delete Document                   │
│           ↓                                                  │
│  Return Document(s) or Confirmation                         │
└──────────────────────────────────────────────────────────────┘
                      ↓ Database Response
┌──────────────────────────────────────────────────────────────┐
│                Backend (Express.js)                          │
│  Receive Result from Database                               │
│           ↓                                                  │
│  Format Response (JSON)                                     │
│           ↓                                                  │
│  Send HTTP Response (200, 201, 400, 401, 404, 500)         │
│           ↓                                                  │
│  Response Headers: Content-Type: application/json           │
│  Response Body: { data or error message }                   │
└──────────────────────────────────────────────────────────────┘
                      ↓ HTTP Response
┌──────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
│  Receive Response                                            │
│           ↓                                                  │
│  Check response.ok status                                   │
│           ↓                                                  │
│  If Success: Parse data, update state                       │
│  If Error: Parse error message, show alert                 │
│           ↓                                                  │
│  Re-render DOM with new data                               │
│  or navigate to different page                              │
└──────────────────────────────────────────────────────────────┘
```

### Specific Data Models

#### User Document (MongoDB)
```json
{
  "_id": ObjectId("..."),
  "name": "John Property",
  "email": "john@example.com",
  "password": "$2a$10$hashed...",  // bcryptjs hashed
  "phone": "+91-9876543210",
  "role": "owner",  // "student", "owner", or "admin"
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

#### Listing Document (MongoDB)
```json
{
  "_id": ObjectId("..."),
  "title": "Cozy Studio in City Center",
  "rent": 12000,
  "location": "Mumbai Central",
  "amenities": ["WiFi", "AC", "Furnished"],
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "status": "approved",  // "pending", "approved", "rejected"
  "ownerId": ObjectId("..."),  // Reference to User
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

#### Lead Document (MongoDB)
```json
{
  "_id": ObjectId("..."),
  "name": "Raj Kumar",
  "phone": "+91-9876543210",
  "listingId": ObjectId("..."),  // Reference to Listing
  "status": "New",  // "New", "Contacted", "Visit Scheduled", "Converted", "Dropped"
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

### API Request/Response Examples

#### Signup Request
```json
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Property",
  "email": "john@example.com",
  "password": "secure123",
  "phone": "+91-9876543210",
  "role": "owner"
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f7a1b2c3d4e5f6g7h8i9j0",
    "name": "John Property",
    "email": "john@example.com",
    "role": "owner",
    "phone": "+91-9876543210"
  }
}
```

#### Create Listing Request
```json
POST /api/listings
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Cozy Studio in City Center",
  "rent": 12000,
  "location": "Mumbai Central",
  "amenities": ["WiFi", "AC", "Furnished"],
  "images": ["https://example.com/image1.jpg"],
  "ownerId": "64f7a1b2c3d4e5f6g7h8i9j0",
  "status": "approved"
}

Response (201 Created):
{
  "_id": "65a2f1b2c3d4e5f6g7h8i9j1",
  "title": "Cozy Studio in City Center",
  "rent": 12000,
  "location": "Mumbai Central",
  "amenities": ["WiFi", "AC", "Furnished"],
  "images": ["https://example.com/image1.jpg"],
  "status": "approved",
  "ownerId": "64f7a1b2c3d4e5f6g7h8i9j0",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## File-by-File Explanation

### Backend Files

#### 1. **server/server.js**
**Purpose:** Main server entry point and Express app setup

**What it does:**
- Initializes Express application
- Connects to MongoDB using Mongoose
- Sets up middleware (CORS, JSON parser, static file server)
- Registers all API routes
- Handles SPA routing (serves index.html for all unknown routes)
- Starts server on port 5000

**Key Code:**
```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// ... imports

const app = express();
app.use(cors());  // Allow requests from frontend
app.use(express.json());  // Parse JSON request bodies
app.use(express.static(path.join(__dirname, "../public")));  // Serve static files

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/leads", leadRoutes);

// SPA Fallback - serves index.html for all unknown routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => process.exit(1));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### 2. **server/models/User.js**
**Purpose:** Define the User collection schema in MongoDB

**What it does:**
- Defines the structure of user documents
- Sets validation rules (required fields, unique email)
- Auto-generates timestamps (createdAt, updatedAt)

**Schema Fields:**
- `name`: User's full name
- `email`: Unique email (username), lowercase
- `password`: Hashed password from bcryptjs
- `phone`: Phone number
- `role`: Enum ["student", "owner", "admin"]

#### 3. **server/models/Listing.js**
**Purpose:** Define the Listing (room) collection schema

**Schema Fields:**
- `title`: Room title
- `rent`: Monthly rent in rupees
- `location`: Room location
- `amenities`: Array of amenities (WiFi, AC, etc.)
- `images`: Array of image URLs
- `status`: Enum ["pending", "approved", "rejected"]
- `ownerId`: Reference to User document (who owns this room)

#### 4. **server/models/Lead.js**
**Purpose:** Define the Lead (inquiry) collection schema

**Schema Fields:**
- `name`: Student's name
- `phone`: Student's phone number
- `listingId`: Reference to Listing (which room they inquired about)
- `status`: Enum ["New", "Contacted", "Visit Scheduled", "Converted", "Dropped"]

#### 5. **server/middleware/auth.js**
**Purpose:** Middleware functions to verify JWT tokens

**Functions:**
- `verifyToken()`: Checks if token exists and is valid
- `verifyAdmin()`: Checks if user has admin role
- `verifyOwner()`: Checks if user has owner or admin role

**How it works:**
```javascript
export const verifyToken = (req, res, next) => {
  // Extract token from "Authorization: Bearer [token]" header
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ error: "No token" });
  
  try {
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user data to request object
    req.user = decoded;
    next();  // Continue to next middleware/route
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

#### 6. **server/controllers/authController.js**
**Purpose:** Handle all authentication logic

**Functions:**

1. **signup()**
   - Validates input (name, email, password required)
   - Checks if email already exists
   - Hashes password using bcryptjs
   - Creates user in MongoDB
   - Generates JWT token
   - Returns token + user data

2. **login()**
   - Validates input (email, password)
   - Finds user by email
   - Compares provided password with hashed password
   - Generates JWT token
   - Returns token + user data

3. **adminLogin()**
   - Validates against hardcoded admin credentials from .env
   - Creates special admin JWT token
   - Returns token + admin user data

#### 7. **server/controllers/listingController.js**
**Purpose:** Handle all room listing operations

**Functions:**

1. **createListing()**
   - Validates required fields (title, rent, location)
   - Creates new Listing document
   - Returns created listing

2. **getListings()**
   - Fetches all listings from MongoDB
   - Sorts by createdAt descending (newest first)
   - Returns array of listings

3. **getListingById(id)**
   - Validates that ID is valid MongoDB ObjectId
   - Finds listing by ID
   - Returns single listing or 404 error

4. **updateListing(id, data)**
   - Validates ID format
   - Updates listing with new data
   - Returns updated listing

5. **deleteListing(id)**
   - Validates ID format
   - Deletes listing from database
   - Returns success message

#### 8. **server/controllers/leadController.js**
**Purpose:** Handle all lead (inquiry) operations

**Functions:**

1. **createLead()**
   - Validates required fields (name, phone, listingId)
   - Creates new Lead document
   - Returns created lead

2. **getLeads()**
   - Fetches all leads from MongoDB
   - Populates listingId reference (includes listing details)
   - Sorts by createdAt descending
   - Returns array of leads with listing info

3. **updateLeadStatus(id, status)**
   - Validates status is one of allowed statuses
   - Updates lead status
   - Returns updated lead

4. **deleteLead(id)**
   - Validates ID format
   - Deletes lead from database
   - Returns success message

#### 9. **server/routes/authRoutes.js**
**Purpose:** Define authentication API endpoints

```javascript
POST /api/auth/signup      → authController.signup
POST /api/auth/login       → authController.login
POST /api/auth/admin-login → authController.adminLogin
```

#### 10. **server/routes/listingRoutes.js**
**Purpose:** Define listing API endpoints

```javascript
POST   /api/listings       → createListing
GET    /api/listings       → getListings
GET    /api/listings/:id   → getListingById
PATCH  /api/listings/:id   → updateListing
DELETE /api/listings/:id   → deleteListing
```

#### 11. **server/routes/leadRoutes.js**
**Purpose:** Define lead API endpoints

```javascript
POST   /api/leads       → createLead
GET    /api/leads       → getLeads
PATCH  /api/leads/:id   → updateLeadStatus
DELETE /api/leads/:id   → deleteLead
```

### Frontend Files

#### 1. **public/index.html**
**Purpose:** Single HTML file that serves the entire SPA

**What it does:**
- Creates empty `<div id="app"></div>` where content is injected
- Loads all CSS and JavaScript files in order
- No other HTML content (all generated by JavaScript)

#### 2. **public/css/style.css**
**Purpose:** All styling for the entire website (1000+ lines)

**Key Classes:**
- `.container`: Max-width wrapper (1200px)
- `.btn, .btn-primary, .btn-secondary, .btn-danger`: Buttons
- `.header, .nav-links`: Navigation styling
- `.listing-card`: Individual room listing cards
- `.search-box`: Search and filter sections
- `.auth-form`: Login/signup form styling
- `.admin-container`: Admin dashboard styling
- `.status-badge`: Status indicator colors

**Theme:** Black and white with grayscale elements

#### 3. **public/js/router.js**
**Purpose:** Client-side SPA router (no page reloads)

**How it works:**

```javascript
class Router {
  register(path, handler)     // Register route with handler function
  navigate(path, state)       // Navigate to path using pushState
  handleNavigation()          // Match current URL to route and render
  getRoute(path)              // Find matching route for path
  start()                     // Initialize router (call once on load)
}
```
UUUUU
**Example:**
```javascript
router.register("/", renderHome);
router.navigate("/room/123");  // Changes URL without reload
```

#### 4. **public/js/api.js**
**Purpose:** Centralized API client and authentication functions

**API Helper Function:**
```javascript
async function apiCall(endpoint, method = "GET", body = null) {
  // Automatically adds JWT token from localStorage to headers
  // Handles JSON serialization
  // Throws errors on non-200 responses
}
```

**API Objects:**
```javascript
AuthAPI.signup(name, email, password, phone, role)
AuthAPI.login(email, password)
AuthAPI.adminLogin(username, password)

ListingAPI.getAll()
ListingAPI.getById(id)
ListingAPI.create(data)
ListingAPI.update(id, data)
ListingAPI.delete(id)

LeadAPI.getAll()
LeadAPI.create(name, phone, listingId)
LeadAPI.updateStatus(id, status)
LeadAPI.delete(id)
```

**Auth Functions:**
```javascript
setAuthToken(token)          // Save JWT to localStorage
getAuthToken()               // Retrieve JWT from localStorage
setCurrentUser(user)         // Save user data to localStorage
getCurrentUser()             // Retrieve user data from localStorage
logout()                     // Clear token and user from localStorage
isLoggedIn()                 // Check if user has token
```

#### 5. **public/js/home.js**
**Purpose:** Home page with room listings, search, and price filter

**What it renders:**
- Navigation header with login links
- Search section (keyword search, price range filter)
- Available rooms grid with cards
- Each card shows: image, title, location, rent, amenities

**Functions:**
```javascript
renderHome()           // Main render function
handleSearch()         // Filter by keyword
handlePriceFilter()    // Filter by rent range
resetFilters()         // Show all listings
```

**Features:**
- Fetches all approved listings from API
- Filters listings client-side (no server queries)
- Images display from listing.images array
- Clicking card navigates to room detail page

#### 6. **public/js/room-detail.js**
**Purpose:** Individual room detail page with inquiry form

**What it renders:**
- Full room details (title, location, rent, amenities)
- Room images (first as large image, others as thumbnails)
- Inquiry form (name, phone)
- Back button to home

**Functions:**
```javascript
renderRoomDetail()     // Main render function
submitInquiry()        // Submit inquiry/lead
```

**Features:**
- Extracts room ID from URL path
- Fetches room details from API
- Form validation (name required, phone min 10 digits)
- Creates lead in database on submit

#### 7. **public/js/admin-dashboard.js**
**Purpose:** Admin dashboard to manage leads

**What it renders:**
- Table of all inquiries/leads
- Lead details: name, phone, room, status
- Status badge with color coding
- Dropdown to change lead status
- Delete button for each lead
- Statistics (total, new, contacted)

**Functions:**
```javascript
renderAdminDashboard()     // Main render function
updateLeadStatus()         // Change lead status
deleteLead()              // Delete lead
```

**Features:**
- Checks if user is admin
- Fetches all leads from API with listing details
- Status colors: green (New), blue (Contacted), etc.
- Auto-refreshes after status change

#### 8. **public/js/owner-auth.js**
**Purpose:** Owner authentication and dashboard

**Renders Four Pages:**

1. **Owner Login** (renderOwnerLogin)
   - Email & password form
   - Calls API login
   - Stores token and navigates to dashboard

2. **Owner Signup** (renderOwnerSignup)
   - Name, email, phone, password form
   - Validation (password min 6 chars)
   - Calls API signup with role="owner"
   - Stores token and navigates to dashboard

3. **Admin Login** (renderAdminLogin)
   - Username & password form
   - Calls API adminLogin
   - Stores token and navigates to admin dashboard

4. **Owner Dashboard** (renderOwnerDashboard)
   - Shows owner's listings
   - Form to add new room
   - Delete button for each listing

**Add Listing Form:**
- Title, location, rent, amenities, images
- Images: comma-separated URLs (up to 3)
- Status auto-set to "approved" for immediate visibility
- Calls API create
- Auto-refreshes after success

#### 9. **public/js/app.js**
**Purpose:** Route registration and app initialization

**What it does:**
```javascript
// Register all routes with their handler functions
router.register("/", renderHome);
router.register("/home", renderHome);
router.register("/room/:id", renderRoomDetail);
router.register("/admin", renderAdminDashboard);
router.register("/admin-login", renderAdminLogin);
router.register("/owner-login", renderOwnerLogin);
router.register("/owner-signup", renderOwnerSignup);
router.register("/owner-dashboard", renderOwnerDashboard);

// Start router when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  router.start();
});
```

---

## Complete Code Documentation

### Backend Complete Code

#### server/server.js
```javascript
// Server entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// test route to check server is alive
app.get("/api", (req, res) => {
  res.send("API running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/leads", leadRoutes);

// Serve frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// connect DB
if (!MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### server/models/User.js
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  role: {
    type: String,
    enum: ["student", "owner", "admin"],
    default: "student"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
```

#### server/models/Listing.js
```javascript
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    rent: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    amenities: [String],
    images: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Listing", listingSchema);
```

#### server/models/Lead.js
```javascript
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit Scheduled", "Converted", "Dropped"],
      default: "New"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Lead", leadSchema);
```

#### server/middleware/auth.js
```javascript
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const verifyOwner = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "owner" && decoded.role !== "admin") {
      return res.status(403).json({ error: "Owner access required" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
```

#### server/controllers/authController.js
```javascript
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "student"
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { id: "admin", email: "admin@myroommate.com", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: "admin",
          name: "Admin",
          email: "admin@myroommate.com",
          role: "admin"
        }
      });
    }

    res.status(401).json({ error: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### server/controllers/listingController.js
```javascript
import mongoose from "mongoose";
import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
  try {
    const { title, rent, location, amenities, images, status, ownerId } = req.body;

    if (!title || rent === undefined || !location) {
      return res.status(400).json({
        error: "title, rent, and location are required"
      });
    }

    const listing = await Listing.create({
      title,
      rent,
      location,
      amenities: amenities || [],
      images: images || [],
      status,
      ownerId
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### server/controllers/leadController.js
```javascript
import Lead from "../models/Lead.js";
import mongoose from "mongoose";

const allowedStatuses = ["New", "Contacted", "Visit Scheduled", "Converted", "Dropped"];

export const createLead = async (req, res) => {
  try {
    const { name, phone, listingId, status } = req.body;

    if (!name || !phone || !listingId) {
      return res.status(400).json({
        error: "name, phone, and listingId are required"
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      listingId,
      status
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("listingId");

    if (!updatedLead) {
      return res.status(404).json({
        error: "Lead not found"
      });
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid lead id"
      });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        error: "Lead not found"
      });
    }

    res.json({
      message: "Lead deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### server/routes/authRoutes.js
```javascript
import express from "express";
import { signup, login, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);

export default router;
```

#### server/routes/listingRoutes.js
```javascript
import express from "express";
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
```

#### server/routes/leadRoutes.js
```javascript
import express from "express";
import { createLead, getLeads, updateLeadStatus, deleteLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/", createLead);
router.get("/", getLeads);
router.patch("/:id", updateLeadStatus);
router.delete("/:id", deleteLead);

export default router;
```

### Frontend Complete Code (Already shown above in File-by-File section)

### Environment Configuration

#### .env
```
PORT=5000
MONGO_URI=mongodb+srv://myroommate_admin:MyRoommatePass@myroommate-dev.hgwkaji.mongodb.net/myroommate?retryWrites=true&w=majority&appName=myroommate-dev
JWT_SECRET=my-super-long-random-secret-value
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Package Configuration

#### package.json
```json
{
  "name": "myroommate",
  "version": "1.0.0",
  "description": "Room rental marketplace for students and property owners",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^9.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## Summary

This project demonstrates a complete **full-stack web application** using modern JavaScript:

**Frontend**: Pure vanilla JavaScript with client-side routing creates a smooth, responsive SPA experience without framework complexity.

**Backend**: Node.js + Express provides a lightweight REST API that's easy to understand and maintain.

**Database**: MongoDB Atlas offers flexible, document-based storage perfect for prototypes and learning.

**Authentication**: JWT tokens provide stateless, scalable authentication suitable for both web and mobile clients.

**Security**: Password hashing with bcryptjs ensures user data is protected, and JWT secrets provide token security.

The architecture separates concerns clearly:
- **Routes** define endpoints
- **Controllers** contain business logic
- **Models** define data structure
- **Middleware** handles cross-cutting concerns

This makes the code maintainable, testable, and easy to extend with new features.
