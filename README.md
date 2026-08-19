# LocalMarket — AI-Powered Local Services Marketplace

LocalMarket is a full-stack marketplace platform that connects customers with verified local service providers (plumbers, electricians, tutors, cleaners, and more). It features role-based dashboards for customers, providers, and admins, real-time messaging, AI voice search, secure payments, and a full provider-approval workflow.

Built as a production-style MVP in a focused 2-week solo sprint.

---

## ✨ Features

### For Customers
- Browse and search verified local service providers with filters (category, price, rating, location)
- AI voice assistant — search for services using natural speech ("I need a plumber near me")
- Book services with date/time selection, issue description, and photo attachments
- Pay via Cash on Service or online (Stripe test mode)
- Real-time chat with providers (Socket.io)
- Track booking status with a visual progress tracker
- Save favorite providers
- Leave ratings and reviews after completed bookings
- In-app notifications with unread badges
- Searchable Help & Support center with FAQ and ticket submission

### For Service Providers
- Combined registration + provider application flow (with profile photo upload and voice-to-text field filling)
- Applications go through an admin approval workflow before going live
- Manage services, pricing, and availability (weekly schedule + booking preferences)
- Accept, decline, or complete booking requests
- Real-time chat with customers
- Earnings dashboard with charts and transaction history
- Request payouts via JazzCash, Easypaisa, or bank transfer
- Manage profile, reviews, and notification preferences

### For Admins
- Platform-wide analytics dashboard (users, providers, bookings, revenue) with month filtering and CSV export
- Review and approve/reject provider applications
- Manage users, providers, categories, payments, and reviews
- Verify/unverify providers
- Support ticket inbox with resolve workflow
- Platform settings management

---

## 🛠 Tech Stack

**Frontend** — `localmarket-web`
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- TanStack Query (data fetching/caching)
- Zustand (auth state)
- React Hook Form + Zod (form validation)
- Socket.io Client (real-time messaging)
- Recharts (analytics charts)
- Lucide React (icons)
- Sonner (toast notifications)
- Web Speech API (voice recognition)

**Backend** — `localmarket-api`
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- Passport.js (JWT access/refresh tokens, httpOnly cookies)
- Socket.io (WebSocket gateway for real-time chat)
- Multer (file uploads — avatars, provider photos)
- Stripe (payment intents, test mode)
- class-validator / class-transformer (DTO validation)
- bcrypt (password hashing)

**Infrastructure**
- Docker Compose (local PostgreSQL)
- Deployment target: Vercel (frontend) + Railway/Render (backend + DB)

---

## 📁 Project Structure

```
localmarket/
├── localmarket-web/          # Next.js frontend
│   ├── app/                  # App Router pages (public, auth, dashboard, provider-dashboard, admin)
│   ├── components/           # UI primitives, layout, feature components
│   ├── hooks/                 # TanStack Query hooks per domain
│   ├── lib/                  # API client, socket client, utils
│   ├── store/                 # Zustand auth store
│   └── types/                 # Shared TypeScript types
│
└── localmarket-api/          # NestJS backend
    ├── src/
    │   ├── auth/              # Signup, login, JWT strategies, guards
    │   ├── users/              # Customer profile & dashboard summary
    │   ├── providers/          # Provider profiles, matching, applications
    │   ├── categories/         # Service categories
    │   ├── services/           # Provider service listings
    │   ├── bookings/           # Booking lifecycle & status machine
    │   ├── payments/           # Stripe payment intents
    │   ├── messages/           # REST + Socket.io real-time chat
    │   ├── reviews/            # Ratings & reviews
    │   ├── notifications/      # In-app notifications
    │   ├── availability/       # Provider weekly schedule
    │   ├── payouts/            # Provider payout methods & requests
    │   ├── support/            # Help center tickets
    │   ├── admin/               # Admin analytics, moderation, reports
    │   ├── voice/               # Voice transcript → search intent parsing
    │   └── common/             # Guards, decorators, filters, utils
    └── prisma/
        ├── schema.prisma       # Full data model
        └── seed.ts             # Demo data seeder
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (for local PostgreSQL)
- npm

### 1. Clone and install

```bash
git clone <repo-url>
cd localmarket

cd localmarket-api && npm install
cd ../localmarket-web && npm install
```

### 2. Start the database

```bash
cd localmarket-api
docker compose up -d
```

### 3. Configure environment variables

**`localmarket-api/.env`**
```
DATABASE_URL="postgresql://localmarket:localmarket@localhost:5432/localmarket"
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

**`localmarket-web/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Run migrations and seed demo data

```bash
cd localmarket-api
npx prisma migrate dev
npx prisma db seed
```

### 5. Start both servers

```bash
# Terminal 1
cd localmarket-api && npm run start:dev

# Terminal 2
cd localmarket-web && npm run dev
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:3001/api`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | `customer@demo.com` | `password123` |
| Admin | `admin@demo.com` | `password123` |
| Provider | `provider0@demo.com` (through `provider54@demo.com`) | `password123` |

---

## 🗄 Database Schema Highlights

Core entities: `User`, `ProviderProfile`, `Category`, `Service`, `Booking`, `Payment`, `Thread`, `Message`, `Review`, `Notification`, `AvailabilitySlot`, `PayoutMethod`, `Payout`, `SavedProvider`, `SupportTicket`, `Settings`.

Provider profiles carry a `status` (`pending` / `approved` / `rejected`) — new providers are onboarded through an admin review workflow before their role is upgraded and their listings go live.

---

## 🧪 Testing Notes

- Auth is cookie-based (httpOnly access + refresh tokens); Postman requests must retain cookies across calls.
- File uploads (avatars) are stored on local disk under `localmarket-api/uploads/` and served via `/uploads/*`. For production, migrate to S3-compatible object storage (Cloudflare R2 / AWS S3).
- Stripe is configured in **test mode only** — use Stripe test card numbers for online payment testing.
- Voice features require a Chromium-based browser (Chrome/Edge) due to Web Speech API support.

---

## 📌 Known Limitations (MVP Scope)

This is a 2-week MVP build, not a hardened production system. Not yet included:
- Automated test suite (only smoke-level manual testing performed)
- CDN/image optimization pipeline for uploaded media
- Multi-language support
- Full accessibility audit
- Production-grade object storage for file uploads

---

## 📄 License

This project was built for educational/portfolio purposes.
