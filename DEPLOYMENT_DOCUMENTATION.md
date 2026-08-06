# e-CAPH Website & CMS — Deployment & Setup Guide

This guide provides step-by-step instructions for deploying the e-CAPH application to production on **Vercel** and **Supabase**.

---

## 📋 Prerequisites

1. **Supabase Account**: [https://supabase.com](https://supabase.com)
2. **Vercel Account**: [https://vercel.com](https://vercel.com)
3. **Resend Account** (Optional for email notifications): [https://resend.com](https://resend.com)
4. **Git Repository**: GitHub / GitLab repository containing the source code.

---

## Step 1: Set Up Supabase PostgreSQL Database

1. Log into your Supabase Dashboard and click **New Project**.
2. Set Project Name to `e-caph-system`, enter a strong database password, and select a region (e.g., Europe/West or Africa/West).
3. Once the database is provisioned, navigate to **SQL Editor** in the left sidebar.
4. Open the SQL migration files from the repository:
   - Copy content of `supabase/migrations/001_schema.sql` → Paste into SQL Editor → Click **Run**.
   - Copy content of `supabase/migrations/002_rls_policies.sql` → Paste into SQL Editor → Click **Run**.
   - Copy content of `supabase/migrations/003_seed.sql` → Paste into SQL Editor → Click **Run**.
5. Navigate to **Project Settings > API**:
   - Copy **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - Copy **anon / public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Copy **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`)

---

## Step 2: Set Up Admin Credentials

1. In Supabase Dashboard, navigate to **Authentication > Users**.
2. Click **Add User > Create User**.
3. Enter your administrative email (e.g., `admin@e-caph.org`) and a secure password.
4. Once the user is created, copy their `User UID`.
5. Go to **SQL Editor** and run the following snippet to grant `super_admin` permissions:

```sql
INSERT INTO public.user_roles (user_id, role_id)
SELECT
  'YOUR_USER_UID_HERE'::uuid,
  id
FROM public.roles
WHERE name = 'super_admin';
```

---

## Step 3: Set Up Supabase Storage Buckets

1. Navigate to **Storage > Buckets** in the Supabase Dashboard.
2. Create a bucket named `public-images` and toggle **Public Bucket** to ON.
3. Create a bucket named `documents` and toggle **Public Bucket** to OFF.

---

## Step 4: Deploy to Vercel

1. Log into your Vercel Dashboard and click **Add New > Project**.
2. Import your Git repository (`e-caph-website`).
3. Set Framework Preset to **Next.js**.
4. Set Root Directory to `./` (or `e-caph-website` if inside a subfolder).
5. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` |
| `NEXT_PUBLIC_SITE_URL` | `https://e-caph.org` (or Vercel production URL) |
| `RESEND_API_KEY` | `re_your_api_key` |
| `RESEND_FROM_EMAIL` | `noreply@e-caph.org` |

6. Click **Deploy**. Vercel will build the Next.js 15 App Router application and generate a live SSL URL.

---

## Step 5: Post-Deployment Verification

1. Access the public domain (e.g., `https://your-domain.vercel.app`).
2. Test homepage rendering, responsive navigation, and impact counter.
3. Visit `/contact` and submit a test inquiry to verify DB storage.
4. Visit `/admin` and log in with your admin credentials.
