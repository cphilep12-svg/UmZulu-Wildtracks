# UmZulu Wildtrack

**African Safari Game Reserve - Full Stack Web Application**

![UmZulu Wildtrack](https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80)

## 🦁 About

UmZulu Wildtrack is a luxury African safari game reserve located in KwaZulu-Natal, South Africa. Founded by Mr Isiphile Simelane, we're an emerging conservation-focused tourism business dedicated to protecting wildlife while offering unforgettable safari experiences.

---

## 🚀 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ modules
- **Google Fonts** - Playfair Display + Poppins
- **Heroicons** - SVG icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Admin Dashboard
- **HTML/CSS/JS** - Custom admin interface
- **JWT Auth** - Secure login
- **REST API** - CRUD operations

---

## 📁 Project Structure

```
umzulu-wildtrack/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Admin authentication
│   │   ├── bookingController.js # Booking CRUD
│   │   ├── messageController.js # Message CRUD
│   │   └── safariController.js  # Safari package CRUD
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── Booking.js           # Booking schema
│   │   ├── Message.js           # Contact message schema
│   │   ├── SafariPackage.js     # Safari package schema
│   │   └── Admin.js             # Admin user schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── bookings.js          # Booking API
│   │   ├── messages.js          # Message API
│   │   └── safaris.js           # Safari package API
│   ├── admin/                   # Admin dashboard
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── css/
│   │   └── js/
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css        # Main stylesheet
│   │   └── js/
│   │       └── main.js          # Frontend scripts
│   ├── pages/
│   │   ├── safari.html
│   │   ├── about.html
│   │   └── contact.html
│   └── index.html               # Home page
├── .gitignore
└── README.md
```

---

## 🛠️ Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd umzulu-wildtrack/backend
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/umzulu-wildtrack
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$... # bcrypt hash of your password
```

Generate password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h))"
```

### 3. Start Development Server

```bash
# Start MongoDB (if local)
mongod

# Start backend server
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/verify` | Verify token |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings (admin) |
| POST | `/api/bookings` | Create booking (public) |
| GET | `/api/bookings/:id` | Get single booking |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get all messages (admin) |
| POST | `/api/messages` | Send contact message (public) |
| GET | `/api/messages/:id` | Get single message |
| PUT | `/api/messages/:id/read` | Mark as read |
| DELETE | `/api/messages/:id` | Delete message |

### Safari Packages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/safaris` | Get all packages (public) |
| POST | `/api/safaris` | Create package (admin) |
| GET | `/api/safaris/:id` | Get single package |
| PUT | `/api/safaris/:id` | Update package (admin) |
| DELETE | `/api/safaris/:id` | Delete package (admin) |

---

## 🎨 Frontend Features

### Design System
- **Colors**: Earth-tone safari palette
  - Primary: `#1A1A1A` (charcoal)
  - Secondary: `#F4F1EA` (warm ivory)
  - Accent: `#D4A03A` (antique gold)
  - Forest: `#2D4A3E` (forest green)

- **Typography**:
  - Headings: Playfair Display
  - Body: Poppins

### Pages
1. **Home** - Hero, highlights, featured safaris
2. **Safari** - Package cards with pricing in Rands
3. **About** - Founder story, conservation mission
4. **Contact** - Form, map, contact details

### Interactive Features
- ✅ Day/Night theme toggle with rotating sun/moon
- ✅ Mobile hamburger menu with animations
- ✅ Scroll fade-in animations (IntersectionObserver)
- ✅ Parallax hero sections
- ✅ Button hover effects
- ✅ Staggered card animations
- ✅ Form validation with error states
- ✅ Toast notifications

---

## 🔐 Admin Dashboard

Access: `http://localhost:5000/admin/login.html`

Default credentials:
- Username: `admin`
- Password: (set in .env)

### Features
- 📊 Dashboard overview with stats
- 📧 View contact messages
- 📅 Manage bookings
- 🦁 Update safari packages & prices
- ✅ Toggle availability

---

## 🚀 Deployment

### Backend (Render)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from `.env`

### MongoDB Atlas

1. Create cluster at [mongodb.com](https://mongodb.com)
2. Create database user
3. Whitelist IP addresses
4. Copy connection string to `MONGODB_URI`

### Frontend (Static Hosting)

Upload `frontend/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Or serve from Express (`app.use(express.static('frontend'))`)

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `JWT_EXPIRE` | Token expiration | No (default: 7d) |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hashed password | Yes |

---

## 🧪 Testing

### API Testing (cURL)

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'

# Get bookings (with token)
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27 76 123 4567",
    "safariPackage": "Big Five Morning Safari",
    "date": "2026-03-15",
    "guests": 2,
    "message": "Looking forward to our safari!"
  }'
```

---

## 📄 License

© 2026 UmZulu Wildtrack. All rights reserved.

---

## 👤 Contact

**UmZulu Wildtrack**
- Founder: Mr Isiphile Simelane
- Phone: +27 76 129 6966
- Address: UmZulu Private Resort, KwaZulu-Natal, South Africa
- Email: info@umzuluwildtrack.co.za

---

## 🙏 Credits

- Images: [Unsplash](https://unsplash.com)
- Icons: [Heroicons](https://heroicons.com)
- Fonts: [Google Fonts](https://fonts.google.com)
