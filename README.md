# e-CAPH — Enhancing Communities Action for Peace and Better Health Initiative

A modern, responsive, and production-ready nonprofit organization website with a custom admin CMS for **Enhancing Communities Action for Peace and Better Health Initiative (e-CAPH)**.

Built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL, Auth, Storage)**, **React Hook Form**, **Zod**, **Framer Motion**, **Lucide React**, **Recharts**, **Resend**, and **Vercel**.

---

## 🌟 Key Features

### 1. Public Nonprofit Website
- **Editorial Hero**: High-impact, documentary-style hero with credibility metrics and dual actions (*Explore Our Impact* & *Partner With Us*).
- **Public Navigation**: Sticky header with logo, desktop dropdown menus, command search, responsive mobile drawer, and active route highlighting.
- **14 Homepage Sections**: Announcement bar, Hero, Impact stats counter, About e-CAPH, 6 Programme Areas, Featured impact story, Flagship initiatives, Implementation approach (Engage → Design → Deliver → Learn), Impact dashboard preview, Latest stories, Partners, Newsletter, and Final CTA.
- **17 Public Routes**:
  - `/` — Homepage
  - `/about` — About Us, Mission, Vision, Thematic Focus Areas & Technical Approaches
  - `/programmes` — Programme Areas Directory (6 areas)
  - `/programmes/[slug]` — Dynamic Programme Area Detail
  - `/projects` — Projects Directory (15 community-driven initiatives)
  - `/projects/[slug]` — Dynamic Project Detail (Objectives, Activities, Results, Locations)
  - `/impact` — Dynamic Impact Page with statistics & Recharts data visualizer
  - `/team` — Team Directory & Leadership
  - `/stories` — Stories, News, Articles & Reports
  - `/stories/[slug]` — Dynamic Story Detail View
  - `/media` — Media Hub (Photos, Publications, Audio Logs)
  - `/opportunities` — Careers, Fellowships & Volunteer Listings (Auto-closing deadlines)
  - `/opportunities/[slug]` — Opportunity Detail & Application Guide
  - `/contact` — Contact & Partnership Form with React Hook Form + Zod + Resend
  - `/privacy` — Privacy Policy & Safeguarding Commitments
  - `/terms` — Terms of Service
  - `/search` — Real-Time Search across all site content
  - `404` — Custom Not Found Page

### 2. Secure Custom Admin CMS Dashboard
- **Executive Overview Dashboard (`/admin`)**: Summary cards, activity feed, recent contact messages, content-status pie chart, project-status bar chart, quick actions, and upcoming deadlines.
- **17 Admin CMS Modules**:
  - `/admin/programmes` — Programmes CRUD
  - `/admin/projects` — Projects CRUD
  - `/admin/posts` — Posts & Stories CRUD
  - `/admin/team` — Team Members CRUD
  - `/admin/opportunities` — Opportunities CRUD
  - `/admin/events` — Events Calendar CRUD
  - `/admin/gallery` — Photo Galleries CRUD
  - `/admin/partners` — Partners & Donors CRUD
  - `/admin/testimonials` — Testimonials CRUD
  - `/admin/impact` — Impact Statistics CMS
  - `/admin/messages` — Contact Messages Inbox & Management
  - `/admin/subscribers` — Newsletter Subscribers List & Export
  - `/admin/media` — Media Assets Library (Supabase Storage)
  - `/admin/users` — User Accounts & Role-Based Permissions (RBAC)
  - `/admin/homepage` — Homepage CMS Content Editor
  - `/admin/settings` — Global Site Settings

### 3. Database Architecture (21 Tables + RLS)
Normalized PostgreSQL database schema with complete Row-Level Security policies:
- `profiles`, `roles`, `user_roles`
- `programmes`, `projects`, `project_images`
- `categories`, `posts`
- `team_members`, `opportunities`, `events`
- `galleries`, `gallery_images`, `partners`, `testimonials`
- `impact_statistics`, `contact_messages`, `newsletter_subscribers`
- `media_assets`, `homepage_sections`, `site_settings`, `activity_logs`

### 4. Role-Based Access Control (RBAC)
- `super_admin` — Complete system control & user management
- `content_admin` — Full content CRUD
- `editor` — Content editing & draft creation
- `programme_manager` — Assigned programme management
- `media_officer` — Media library & photo gallery management
- `viewer` — Read-only dashboard access

---

## 🎨 Theme & Colour System

Theme variables configured in `src/config/theme.ts`:

- **Primary Green**: `#176B4D`
- **Deep Green**: `#0B3D2E`
- **Impact Lime**: `#B7D84B`
- **Warm Cream**: `#F7F4EB`
- **Soft Mint**: `#E9F5EF`
- **Charcoal**: `#18211D`
- **Muted Text**: `#617069`
- **White**: `#FFFFFF`

### Programme Colour Coding
- **Adolescent & Youth Health**: Teal (`#0D9488`)
- **Maternal & Child Health**: Rose (`#E11D48`)
- **GBV Prevention & Response**: Purple (`#7C3AED`)
- **Peacebuilding & Social Cohesion**: Amber (`#D97706`)
- **Community Engagement**: Blue (`#2563EB`)
- **Digital Innovation**: Emerald (`#059669`)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.x or 20.x
- npm / pnpm / yarn
- Supabase Project (Free tier or higher)

### 1. Installation

```bash
# Clone or navigate to the project directory
cd e-caph-website

# Dependencies are already installed
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_SITE_URL=http://localhost:3000

RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@e-caph.org
```

### 3. Run Database Migrations in Supabase

Run the SQL migration scripts in order inside your Supabase SQL Editor:

1. `supabase/migrations/001_schema.sql` — Tables, indexes, triggers, and auto-functions
2. `supabase/migrations/002_rls_policies.sql` — Row-Level Security policies & storage buckets
3. `supabase/migrations/003_seed.sql` — Seed data (6 programmes, 15 verified projects, homepage sections, roles, settings)

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS portal.

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (website)/         # Public site route group
│   │   ├── page.tsx       # Homepage (14 sections)
│   │   ├── about/
│   │   ├── programmes/
│   │   ├── projects/
│   │   ├── impact/
│   │   ├── team/
│   │   ├── stories/
│   │   ├── media/
│   │   ├── opportunities/
│   │   ├── contact/
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── search/
│   ├── admin/             # Custom Admin Dashboard (17 modules)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── programmes/
│   │   ├── projects/
│   │   ├── posts/
│   │   ├── team/
│   │   ├── opportunities/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── partners/
│   │   ├── testimonials/
│   │   ├── impact/
│   │   ├── messages/
│   │   ├── subscribers/
│   │   ├── media/
│   │   ├── users/
│   │   ├── homepage/
│   │   └── settings/
│   ├── auth/              # Authentication routes
│   │   ├── login/
│   │   └── forgot-password/
│   ├── api/               # Server API route handlers
│   │   ├── contact/
│   │   └── newsletter/
│   ├── layout.tsx         # Root layout with Google Fonts
│   ├── not-found.tsx      # Custom 404 page
│   ├── sitemap.ts         # Dynamic sitemap for SEO
│   └── robots.ts          # Search engine robots.txt
├── components/
│   ├── website/           # Public website components
│   ├── admin/             # Admin CMS components & charts
│   ├── shared/            # Shared UI (Header, Breadcrumbs, EmptyState, Skeletons)
│   └── ui/                # Base UI elements (Button, Card, Input, Badge, Textarea)
├── lib/
│   ├── supabase/          # Supabase browser, server & admin clients
│   ├── validation/        # Zod form validation schemas
│   ├── permissions/       # RBAC role hierarchy helpers
│   └── utilities/         # Slugify, HTML sanitize, date formatting, class merge
├── types/                 # TypeScript entity definitions
└── config/                # Site config, theme colors & programme taxonomy
```

---

## 🛠️ Verification & Build Commands

```bash
# Run TypeScript typecheck
npx tsc --noEmit

# Run ESLint check
npm run lint

# Production build validation
npm run build
```

---

## 📄 License & Credits

Built for **Enhancing Communities Action for Peace and Better Health Initiative (e-CAPH)**.
All rights reserved.
