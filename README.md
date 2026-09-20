# Madziwa College TP Assessment Platform

A comprehensive web-based application for Teaching Practice (TP) assessment management at Madziwa College. Built with Nuxt 4 (Nitro 2), Vue 3, PrimeVue 4, Tailwind CSS 3, Prisma 6, and MySQL. PDF export via Puppeteer and batch ZIP via JSZip.

## 🚀 Features

- **Comprehensive Assessment Form** - Complete 100-point scoring system with detailed criteria
- **Multi-Level Assessment Support** - ECD, Junior/Primary, Secondary, ISEN, and Materials Development
- **Offline Assessment** - Forms are cached on the device and sync automatically when back online
- **Offline Student Search** - Find students using locally cached data even without network connection
- **Supervisor Auto-fill** - Supervisor details automatically populate from session on every assessment form
- **Supervisor & Student Management** - Automatic creation and updates with district assignment
- **Assessment Tracking** - View, edit, and manage all assessments
- **Admin Dashboard** - Complete admin interface with district-specific statistics
- **PDF Export** - Download individual assessments as PDF reports with detailed breakdowns
- **Batch Download** - Download multiple assessments as ZIP file
- **Advanced Filtering** - Filter by subject, date range, score range, district
- **Real-time Statistics** - Dashboard with assessment statistics by district
- **Responsive Design** - Works on desktop and mobile devices
- **Modern UI** - Built with PrimeVue components
- **Real-time Validation** - Form validation and error handling
- **Search & Filter** - Advanced data table with search capabilities
- **Category Selection** - Dynamic category selection for different assessment types

## 🛠️ Technology Stack

- **Frontend**: Nuxt 4, Vue 3, PrimeVue 4, Vue Router 4
- **Backend**: Nuxt Server API routes (Nitro 2)
- **Database**: MySQL (XAMPP)
- **ORM**: Prisma 6
- **Styling**: Tailwind CSS 3 via @nuxtjs/tailwindcss + PrimeIcons 7
- **HTTP Client**: Axios
- **PDF Generation**: Puppeteer 24
- **ZIP Creation**: JSZip 3
- **Build Tooling**: PostCSS 8 + Autoprefixer 10

## 📋 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- XAMPP (for MySQL database)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/manuhwa/MATCO-WIL.git
cd MATCO-WIL
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

**Start XAMPP:**
- Open XAMPP Control Panel
- Start Apache and MySQL services

**Create Database:**
- Open phpMyAdmin (http://localhost/phpmyadmin)
- Create a new database named `madziwa_tp`

**Configure Environment:**
Create a `.env` file in the project root:
```env
DATABASE_URL="mysql://root:@localhost:3306/madziwa_tp"
```

### 4. Set Up Prisma

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🔐 Admin Access

- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `admin123`

## 📡 Offline Capabilities

The app includes robust offline support for supervisors working in areas with unreliable connectivity:

### Offline Assessments
- Assessment forms are automatically saved to local IndexedDB when created offline
- Queued assessments sync automatically when connection is restored
- Pending count badge shows how many assessments are waiting to sync

### Offline Student Search
- Students are cached locally in IndexedDB when you're online
- Search works even without network using cached data
- Cache syncs automatically when online (on startup and every 60 seconds)
- Respects supervisor district assignments

### Supervisor Auto-fill
- Your supervisor details (name, ID, phone, email) auto-populate on every form
- Fields are pre-filled from your logged-in session
- Falls back to manual entry if offline during form load

**Testing Offline Mode:**
See [TESTING.md](./TESTING.md) for detailed instructions on testing offline features.

## 📁 Project Structure

```
madziwa-tp-platform/
├── assets/
│   └── css/
│       └── main.css              # Main styles with Tailwind
├── components/
│   ├── AssessmentDetailModal.vue # Assessment detail modal
│   └── SelectedCriteriaAssessment.vue # Selected criteria assessment component
├── layouts/
│   └── default.vue              # Main layout with navigation
├── middleware/
│   ├── admin-auth.ts            # Admin authentication middleware
│   ├── supervisor-auth.ts       # Supervisor authentication middleware
│   └── superadmin-auth.ts       # Super admin authentication middleware
├── pages/
│   ├── index.vue                # Home page
│   ├── admin.vue                # Admin dashboard
│   ├── admin-login.vue          # Admin login page
│   ├── supervisor-login.vue     # Supervisor login page
│   ├── assessment/
│   │   ├── index.vue            # Assessment listing
│   │   ├── new.vue              # Create new assessment
│   │   └── edit/[id].vue        # Edit assessment
│   ├── students/
│   │   └── new.vue              # Add new student
│   ├── supervisors/
│   │   └── new.vue              # Add new supervisor
│   └── superadmin/
│       └── index.vue            # Super admin dashboard
├── server/
│   └── api/
│       ├── assessments/
│       │   ├── index.get.ts      # Get all assessments
│       │   ├── index.post.ts     # Create assessment
│       │   ├── [id].get.ts       # Get single assessment
│       │   ├── [id].put.ts       # Update assessment
│       │   ├── [id].delete.ts    # Delete assessment
│       │   ├── [id]/pdf.get.ts   # Generate PDF
│       │   ├── export-csv.get.ts # Export CSV
│       │   ├── export-pdf-all.get.ts # Export all PDFs
│       │   └── export-zip.post.ts # Export ZIP
│       ├── students/
│       │   ├── index.get.ts      # Get all students
│       │   ├── index.post.ts     # Create student
│       │   ├── search.get.ts     # Search students
│       │   └── import-csv.post.ts # Import CSV
│       ├── supervisors/
│       │   ├── index.get.ts      # Get all supervisors
│       │   ├── index.post.ts     # Create supervisor
│       │   └── me.get.ts         # Get current supervisor
│       ├── admins/
│       │   ├── index.get.ts      # Get all admins
│       │   ├── index.post.ts     # Create admin
│       │   └── assign-district.post.ts # Assign district to admin
│       ├── districts/
│       │   ├── index.get.ts      # Get all districts
│       │   └── [id].get.ts       # Get single district
│       └── auth/
│           ├── admin-login.post.ts # Admin login
│           └── supervisor-login.post.ts # Supervisor login
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding
├── scripts/
│   ├── backup-database.js       # Database backup
│   ├── database-maintenance.js  # Database maintenance
│   └── seed-initial-data.js     # Initial data seeding
├── ecosystem.config.cjs         # PM2 production configuration
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.js           # Tailwind CSS config
└── package.json
```

## 🎯 Admin Dashboard Features

### 📊 Statistics Overview
- Total assessments count
- Students in assigned district count
- Supervisors in assigned district count
- Average score percentage
- District-specific data display

### 🔍 Advanced Filtering
- Search by student name, supervisor, subject
- Filter by subject
- Filter by date range (Today, Week, Month, Quarter, Year)
- Filter by score range (Excellent, Very Good, Good, Satisfactory, Needs Improvement)

### 📋 Assessment Management
- View all assessments in a responsive table
- Pagination support
- Bulk selection for batch operations
- Individual assessment actions (View, Edit, Delete, Download PDF)

### 📄 PDF Export
- Individual assessment PDF download
- Professional PDF formatting with college branding
- Complete assessment details including scoring breakdown
- Student and supervisor information

### 📦 ZIP Export
- Batch download multiple selected assessments
- Each assessment as a separate PDF file
- Organized file naming convention
- Automatic ZIP file generation

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient designs
- Interactive elements with hover effects
- Loading states and progress indicators
- Color-coded score indicators

### 🛡️ Security Features
- Admin authentication middleware
- Protected admin routes
- Input validation and sanitization
- Secure file downloads

## 📴 Offline Assessment

Assessments can be completed without a network connection. The app caches pages and form lookups while online, then stores submissions on the device (IndexedDB) if submit happens offline. Queued assessments sync automatically when the connection returns.

- **Page cache**: Assessment and supervisor pages open from cache when offline
- **API cache**: Student search, supervisor profile, and settings are cached for form filling
- **Offline queue**: Submitted assessments are saved locally and synced when back online
- **Installable app**: Supervisors can install the PWA for faster offline access

## 🗄️ Database Schema

### Models

- **Supervisor**: Full name, email, phone, national ID
- **Student**: Full name, sex, candidate number, email, school, class
- **Assessment**: Complete assessment data with 100-point scoring system

### Assessment Categories by Level

#### ECD Assessment (100 points total)
| Category | Max Points |
|----------|------------|
| Preparation and its aspects | 15 |
| Lesson Facilitation and its aspects | 15 |
| Deportment and its aspects | 5 |
| Records Management | 15 |
| Teaching and Learning Environment | 10 |
| Selectable 3 Categories (Research-based Child Study & Community Service/Research & Innovation/Research & Industrialisation) | 30 |
| Remaining 2 Pillars (assessed together out of 10% each taking 5%) | 10 |

#### Junior/Primary Assessment (100 points total)
| Category | Max Points |
|----------|------------|
| Preparation and its aspects | 15 |
| Lesson Facilitation and its aspects | 15 |
| Deportment and its aspects | 5 |
| Records Management | 15 |
| Teaching and Learning Environment | 10 |
| Selectable 3 Categories (Research-based Community Service/Research & Innovation/Research & Industrialisation) | 30 |
| Remaining 2 Pillars (assessed together out of 10% each taking 5%) | 10 |

#### Materials Development Assessment (100 points total)
| Category | Max Points |
|----------|------------|
| Content Quality | 20 |
| Pedagogical Value | 20 |
| Design & Layout | 20 |
| Innovation & Creativity | 20 |
| Education 5.0 Compliance | 20 |

## 🎨 UI Components

The platform uses PrimeVue components for a consistent and professional look:

- **Forms**: InputText, InputNumber, Dropdown, Calendar, Textarea
- **Data Display**: DataTable, Card, Panel
- **Navigation**: Button, Menu
- **Feedback**: Toast, Dialog, ConfirmDialog
- **Layout**: Grid, Divider

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with initial data
```

## 🌐 API Endpoints

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments/:id` - Get single assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment
- `GET /api/assessments/:id/pdf` - Download assessment as PDF
- `POST /api/assessments/export-zip` - Download multiple assessments as ZIP

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/search` - Search students

### Supervisors
- `GET /api/supervisors` - Get all supervisors
- `POST /api/supervisors` - Create supervisor
- `GET /api/supervisors/me` - Get current supervisor

### Admins
- `GET /api/admins` - Get all admins
- `POST /api/admins` - Create admin
- `POST /api/admins/assign-district` - Assign district to admin

### Districts
- `GET /api/districts` - Get all districts
- `GET /api/districts/:id` - Get single district

## 📱 Responsive Design

The platform is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features

- Input validation on both client and server
- SQL injection protection via Prisma
- XSS protection
- CSRF protection
- Authentication middleware for protected routes

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run preview
```

### PM2 Production Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Environment Variables

For production, set these environment variables:

```env
DATABASE_URL="mysql://username:password@host:port/database"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- **Phone**: +263 772 145 972
- **Email**: madziwatc@gmail.com
- **College**: Madziwa College

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Madziwa College for the Teaching Practice assessment requirements
- PrimeVue team for the excellent UI components
- Nuxt.js team for the amazing framework
- Prisma team for the modern database toolkit

---

**Built with ❤️ for Madziwa College Teaching Practice Assessment**