# 🔌 INTEGRATION GUIDE

## Integrating Supabase Backend with React Frontend

This guide shows you how to connect the existing React app to the new Supabase backend, replacing localStorage with real database persistence.

---

## 📁 FILE STRUCTURE

Your project now has these new backend files:

```
src/
├── hooks/
│   ├── useAuth.tsx           # Authentication hook
│   ├── useHealthMetrics.ts   # Health metrics CRUD
│   └── useHealthGoals.ts     # Health goals CRUD
├── lib/
│   ├── supabase.ts           # Supabase client config
│   └── database.types.ts     # TypeScript types
supabase/
└── migrations/
    ├── 001_initial_schema.sql    # Database tables
    └── 002_rls_policies.sql      # Security policies
```

---

## 🚦 STEP 1: WRAP APP WITH AUTH PROVIDER

Open `src/main.tsx` and wrap your app with `AuthProvider`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 🔐 STEP 2: CREATE AUTH PAGES

### Create `src/pages/Auth.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/app/today');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password, fullName)
      : await signIn(email, password);

    if (!error) {
      navigate('/app/today');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Skapa konto' : 'Logga in'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="fullName">Namn</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Laddar...' : isSignUp ? 'Skapa konto' : 'Logga in'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Har redan konto? Logga in' : 'Inget konto? Registrera dig'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Add auth route in `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/app/*" element={<ProtectedRoute><MainApp /></ProtectedRoute>} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Create `ProtectedRoute` component:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Laddar...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
```

---

## 📊 STEP 3: MIGRATE HEALTH METRICS PAGE

Replace localStorage logic in `src/pages/HealthMetrics/index.tsx`:

### Before (localStorage):
```typescript
const saveData = (data: Partial<ExtendedHealthMetrics>) => {
  const updated = { ...metricsData, ...data, lastUpdated: new Date().toISOString() };
  setMetricsData(updated);
  setStorageItem('extendedHealthMetrics', updated);
};
```

### After (Supabase):
```typescript
import { useSaveHealthMetric } from '@/hooks/useHealthMetrics';

const HealthMetricsFlow = () => {
  const saveMetric = useSaveHealthMetric();

  const saveData = async (data: Partial<ExtendedHealthMetrics>) => {
    await saveMetric.mutateAsync({
      height: parseFloat(data.height || '0'),
      weight: parseFloat(data.weight || '0'),
      systolic: data.bloodPressure ? parseInt(data.bloodPressure.systolic) : null,
      diastolic: data.bloodPressure ? parseInt(data.bloodPressure.diastolic) : null,
      bp_date: data.bloodPressure?.date || null,
      ldl: data.bloodFats?.ldl ? parseFloat(data.bloodFats.ldl) : null,
      hdl: data.bloodFats?.hdl ? parseFloat(data.bloodFats.hdl) : null,
      triglycerides: data.bloodFats?.triglycerides ? parseFloat(data.bloodFats.triglycerides) : null,
      knows_ldl: data.bloodFats?.knowsLDL || null,
      hba1c: data.bloodGlucose?.hba1c ? parseFloat(data.bloodGlucose.hba1c) : null,
      fasting_glucose: data.bloodGlucose?.fastingGlucose ? parseFloat(data.bloodGlucose.fastingGlucose) : null,
    });
  };
};
```

---

## 📈 STEP 4: DISPLAY DATA FROM SUPABASE

Update `src/pages/Progress.tsx` to fetch from database:

```typescript
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { useHealthGoals } from '@/hooks/useHealthGoals';

export default function Progress() {
  const { data: metrics, isLoading: metricsLoading } = useHealthMetrics();
  const { data: goals } = useHealthGoals();

  if (metricsLoading) {
    return <div>Laddar hälsodata...</div>;
  }

  // Transform database format to chart format
  const chartData = metrics?.map(m => ({
    date: m.measurement_date,
    weight: m.weight,
    systolic: m.systolic,
    diastolic: m.diastolic,
  })) || [];

  return (
    <div>
      <h1>Din hälsoutveckling</h1>
      {/* Render charts with chartData */}
    </div>
  );
}
```

---

## 🎯 STEP 5: MIGRATION CHECKLIST

Replace localStorage calls throughout the app:

### Pages to update:
- [ ] `src/pages/HealthMetrics/index.tsx` - Use `useSaveHealthMetric()`
- [ ] `src/pages/HealthGoals.tsx` - Use `useHealthGoals()` and `useSaveHealthGoals()`
- [ ] `src/pages/Progress.tsx` - Use `useHealthMetrics()`
- [ ] `src/pages/Today.tsx` - Use `useLatestHealthMetric()`
- [ ] `src/pages/Medications.tsx` - Create `useMedications()` hook (similar pattern)

### Find-and-replace patterns:
```typescript
// OLD:
const data = getStorageItem('key', schema);
setStorageItem('key', value, schema);

// NEW:
const { data } = useQuery(...);
const mutation = useMutation(...);
await mutation.mutateAsync(value);
```

---

## 🧪 TESTING THE INTEGRATION

1. **Clear localStorage:**
   ```javascript
   // In browser console:
   localStorage.clear();
   ```

2. **Sign up new user:**
   - Navigate to `/auth`
   - Create account
   - Should redirect to `/app/today`

3. **Add health data:**
   - Complete health metrics flow
   - Check Supabase Dashboard > Table Editor
   - Verify data appears in `health_metrics` table

4. **Test data persistence:**
   - Refresh page
   - Data should load from database
   - Logout and login again - data persists

5. **Test RLS:**
   - Create second user account
   - Verify they can't see first user's data

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "User not authenticated" errors
**Fix:** Ensure all data hooks are used inside components wrapped by `AuthProvider`:

```typescript
// ❌ WRONG:
const { data } = useHealthMetrics(); // Outside AuthProvider

// ✅ CORRECT:
<AuthProvider>
  <YourComponent /> {/* useHealthMetrics() called here */}
</AuthProvider>
```

### Issue: Data not saving
**Fix:** Check browser console for RLS policy errors. Verify `user_id` is set:

```typescript
// Make sure user_id is always included:
const saveMetric = useSaveHealthMetric();
await saveMetric.mutateAsync({
  user_id: user.id, // Hooks handle this automatically
  weight: 75.5,
  // ...
});
```

### Issue: Stale data after mutations
**Fix:** Ensure query invalidation is working:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
  // This refetches the data automatically
}
```

---

## 📚 NEXT STEPS

1. **Create remaining hooks:**
   - `useMedications.ts` for user_medications table
   - `useDailyLogs.ts` for daily_logs table
   - `useMarkedTips.ts` for marked_tips table

2. **Add loading states:**
   - Show skeleton loaders while queries load
   - Handle error states gracefully

3. **Optimize queries:**
   - Add pagination for large datasets
   - Implement infinite scroll for metrics history

4. **Add real-time updates (optional):**
   ```typescript
   useEffect(() => {
     const channel = supabase
       .channel('health-metrics-changes')
       .on('postgres_changes', 
         { event: 'INSERT', schema: 'public', table: 'health_metrics' },
         () => queryClient.invalidateQueries(['health-metrics'])
       )
       .subscribe();
     
     return () => { supabase.removeChannel(channel); };
   }, []);
   ```

---

## ✅ INTEGRATION COMPLETE!

Your app now has:
- ✅ Secure authentication with Supabase Auth
- ✅ Real database persistence (no more localStorage)
- ✅ Row Level Security protecting user data
- ✅ Type-safe database operations
- ✅ Automatic loading/error states with React Query
- ✅ Zero vendor lock-in (standard PostgreSQL)

**Happy coding! 🎉**
