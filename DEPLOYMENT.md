# 🚀 DEPLOYMENT & SETUP GUIDE

## Complete setup instructions for Swedish Health Tracking App backend

---

## 📋 PREREQUISITES

- Node.js 18+ and npm/bun installed
- Git installed
- A Supabase account (free tier available)

---

## 🗄️ OPTION A: SUPABASE CLOUD (RECOMMENDED FOR BEGINNERS)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (free, no credit card required)
3. Create a new project:
   - Choose a project name: `health-tracker-se`
   - Set a **strong** database password (save it!)
   - Select region closest to your users (e.g., `eu-north-1` for Sweden)
4. Wait 2-3 minutes for project provisioning

### Step 2: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor and click **"Run"**
5. Verify success (should see "Success. No rows returned")
6. Repeat for `supabase/migrations/002_rls_policies.sql`

### Step 3: Get API Credentials

1. In Supabase Dashboard, go to **Settings > API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Replace with your actual values from Step 3
3. **NEVER commit this file to git** (it's already in `.gitignore`)

### Step 5: Install Dependencies

```bash
npm install
# or
bun install
```

### Step 6: Run the App

```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:5173` - you should now have a working backend!

---

## 🐳 OPTION B: SELF-HOSTED SUPABASE (ADVANCED)

For full control and zero vendor lock-in, run Supabase on your own infrastructure.

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- PostgreSQL knowledge recommended

### Step 1: Clone Supabase

```bash
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `POSTGRES_PASSWORD` - Strong database password
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `ANON_KEY` and `SERVICE_ROLE_KEY` - Generate at https://supabase.com/docs/guides/hosting/overview#api-keys

### Step 3: Start Supabase

```bash
docker-compose up -d
```

Wait 2-3 minutes, then verify:
```bash
docker-compose ps
```

All services should show "Up" status.

### Step 4: Access Supabase Studio

1. Open `http://localhost:3000` in your browser
2. Login with the credentials from your `.env` file
3. Run the migrations from `supabase/migrations/` in the SQL Editor

### Step 5: Configure Your App

Create `.env.local` in your project:

```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_env
```

### Step 6: Run Your App

```bash
npm run dev
```

---

## 🔄 DATA MIGRATION & EXPORT

### Export Data from Supabase

**Via Supabase CLI:**
```bash
npx supabase db dump -f backup.sql
```

**Via Dashboard:**
1. Go to Database > Backups
2. Click "Create backup"
3. Download the SQL file

### Migrate to Another PostgreSQL Provider

1. **Prepare target database** (AWS RDS, DigitalOcean, Railway, etc.)
2. **Export schema:**
   ```bash
   pg_dump -h your-supabase-host -U postgres -d postgres --schema-only > schema.sql
   ```
3. **Export data:**
   ```bash
   pg_dump -h your-supabase-host -U postgres -d postgres --data-only > data.sql
   ```
4. **Import to new database:**
   ```bash
   psql -h new-postgres-host -U postgres -d your_db < schema.sql
   psql -h new-postgres-host -U postgres -d your_db < data.sql
   ```
5. **Update connection strings** in your app

### Automated Backups

Add to your `package.json` scripts:
```json
{
  "scripts": {
    "backup": "npx supabase db dump -f backups/$(date +%Y%m%d_%H%M%S).sql"
  }
}
```

Run daily via cron:
```bash
0 2 * * * cd /path/to/project && npm run backup
```

---

## 🧪 TESTING THE BACKEND

### Manual Testing

1. **Create an account:**
   - Click "Sign Up" in your app
   - Enter email and password
   - Check your email for confirmation (if email confirmation enabled)

2. **Verify data persistence:**
   - Add health metrics via the app
   - Check Supabase Dashboard > Table Editor
   - Data should appear in `health_metrics` table

3. **Test RLS policies:**
   - Create a second user account
   - Verify you can't see the first user's data

### Automated Testing (Optional)

Install testing library:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Create `src/hooks/__tests__/useAuth.test.ts`:
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should sign up new user', async () => {
    const { result } = renderHook(() => useAuth());
    
    const { error } = await result.current.signUp(
      'test@example.com',
      'StrongPassword123!'
    );
    
    expect(error).toBeNull();
  });
});
```

---

## 🔐 SECURITY CHECKLIST

- ✅ RLS policies enabled on all tables
- ✅ `.env.local` in `.gitignore`
- ✅ Email confirmation enabled (Supabase > Auth > Settings)
- ✅ Strong password policy configured
- ✅ HTTPS enforced in production
- ✅ Regular backups scheduled
- ✅ Database credentials rotated quarterly

---

## 🐛 TROUBLESHOOTING

### "Missing Supabase environment variables"
- Verify `.env.local` exists in project root
- Check variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env.local`

### "new row violates row-level security policy"
- Verify RLS policies were applied correctly
- Check user is authenticated (`supabase.auth.getUser()`)
- Ensure `user_id` field matches `auth.uid()` in insert

### "JWT expired" errors
- Supabase automatically refreshes tokens
- Check `autoRefreshToken: true` in `src/lib/supabase.ts`
- Clear browser localStorage and re-login

### Docker containers won't start (self-hosted)
- Check available RAM: `docker stats`
- Verify ports 3000, 54321, 54322 are not in use
- Check logs: `docker-compose logs -f supabase`

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Self-Hosting Supabase](https://supabase.com/docs/guides/self-hosting)

---

## 🆘 SUPPORT

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Supabase logs in Dashboard
3. Inspect browser console for errors
4. Search [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)

---

## 📝 LICENSE & DATA OWNERSHIP

- **Your data:** You own all data in your Supabase instance
- **Export freedom:** You can export and migrate at any time
- **Open source:** Supabase is Apache 2.0 licensed
- **No lock-in:** Standard PostgreSQL database (portable)
