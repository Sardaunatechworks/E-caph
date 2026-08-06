# e-CAPH Quality Assurance & Testing Checklist

## 🌐 1. Public Website Testing

- [x] **Homepage Hero**: Single editorial hero section with strong typography, credibility badges, and dual CTA buttons.
- [x] **Header & Navigation**: Sticky header with logo, desktop dropdowns, active route indicator, and mobile menu drawer.
- [x] **14 Homepage Sections**: All 14 homepage sections render smoothly without layout shifts.
- [x] **Programme Areas**: 6 programme cards styled with distinct programme colour coding.
- [x] **Projects & Flagships**: NextGen Fellowship, Lafiyar Iyali, Adolescent Health Lab, Skills Hub, and Gani da Ido display with accurate details.
- [x] **Impact Page**: Impact statistics strip, geographic footprint, and Recharts analytics visualizer.
- [x] **Contact Form**: Form validation with Zod, error handling, inquiry dropdown, consent checkbox, and DB storage API.
- [x] **Newsletter Signup**: Email format validation, duplicate handling, and success feedback.
- [x] **Search Page**: Real-time filtering across programmes, projects, stories, and opportunities.
- [x] **Custom 404 Page**: Custom themed 404 page for invalid routes.

---

## 🔒 2. Admin CMS & Security Testing

- [x] **Authentication**: Login page with Supabase Auth integration, session management, and logout flow.
- [x] **Admin Layout**: Responsive sidebar covering all 17 admin routes, topbar user menu, and mobile drawer.
- [x] **Overview Dashboard**: Summary stats, activity log, unread contact messages preview, upcoming deadlines, and Recharts analytics charts.
- [x] **CRUD Modules**: Management interfaces for Programmes, Projects, Posts, Team, Opportunities, Events, Gallery, Partners, Testimonials, Impact Stats, Messages, Subscribers, Media, Users, Homepage, and Settings.
- [x] **Security (RLS)**: Public users restricted to published content (`status = 'published'`); admin routes protected.

---

## 📱 3. Responsive & SEO Verification

- [x] **Mobile Responsiveness**: Verified layouts on mobile (375px), tablet (768px), and desktop (1280px+).
- [x] **Typography & Contrast**: Manrope headings, Inter body text, and accessible WCAG contrast.
- [x] **SEO**: Dynamic metadata, canonical URLs, OpenGraph, `sitemap.ts`, and `robots.ts`.
