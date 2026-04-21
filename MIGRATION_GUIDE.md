# Migration Guide: From Hardcoded to Firebase

## What Changed

### Before: Hardcoded Data

Previously, all data was hardcoded inside each component:

```typescript
// OLD - In Dashboard.tsx
export function Dashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹127,450", ... },
    // ... more hardcoded data
  ];
  const weeklyRevenue = [
    { day: "Mon", revenue: 18400 },
    // ... more hardcoded data
  ];
  // Render static data
}
```

### Now: Firebase Integration

All data comes from Firestore database:

```typescript
// NEW - In Dashboard.tsx
export function Dashboard() {
  const { state, loading, error } = useDataContext();

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Data from Firebase
  const stats = state.dashboardData?.stats || [];
  const weeklyRevenue = state.dashboardData?.weeklyRevenue || [];
  // Render live data
}
```

## Key Differences

| Aspect                | Before                 | After                  |
| --------------------- | ---------------------- | ---------------------- |
| **Data Source**       | Hardcoded in component | Firebase Firestore     |
| **Real-time Updates** | None                   | Every 30 seconds       |
| **Data Persistence**  | None (lost on refresh) | Persistent in database |
| **CRUD Operations**   | Not possible           | Full CRUD support      |
| **Scalability**       | Limited                | Unlimited              |
| **State Management**  | Component-local        | Global via Context     |
| **API Calls**         | None                   | Firestore queries      |
| **Error Handling**    | None                   | Proper error states    |
| **Loading States**    | None                   | Proper loading UI      |

## Component Migration Pattern

### Old Pattern (Hardcoded)

```typescript
// 1. Define data as constants
const orders = [{ id: 1, ... }, { id: 2, ... }];

// 2. Render directly
return (
  <div>
    {orders.map(order => <OrderCard key={order.id} order={order} />)}
  </div>
);
```

### New Pattern (Firebase)

```typescript
// 1. Use data from context
const { state, loading, error } = useDataContext();

// 2. Load on mount
useEffect(() => {
  refreshOrders();
}, [refreshOrders]);

// 3. Handle loading/error states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

// 4. Render data from state
return (
  <div>
    {state.orders.map(order => <OrderCard key={order.id} order={order} />)}
  </div>
);
```

## File Organization Changes

### New Files Added

```
src/lib/
├── firebase.ts              # Firebase initialization
├── types.ts                 # TypeScript interfaces
├── firebaseService.ts       # All database operations
└── dataContext.tsx          # Global state & hooks
```

### Modified Files

All components were updated to:

- Remove hardcoded data
- Import `useDataContext`
- Use `useEffect` for data loading
- Handle loading/error states
- Display real data from Firestore

## Database Structure

### Collections Created

1. **inventory** - Juice products and stock levels
2. **orders** - Customer orders and status
3. **outlets** - Retail store locations
4. **salesReps** - Sales team members
5. **vans** - Delivery vehicles
6. **alerts** - System notifications
7. **dashboard/metrics** - Dashboard statistics

### Data Types (TypeScript)

All data now follows strict TypeScript interfaces:

```typescript
// Example: InventoryItem
interface InventoryItem {
  id: string;
  flavor: string;
  stock: number;
  capacity: number;
  color: string;
  gradient: string;
  icon: string;
  trend: number;
  lastUpdated?: string;
}
```

## Benefits of Firebase

### 1. Real-time Updates

- Data syncs across all users
- No manual refresh needed
- Live notifications possible

### 2. Scalability

- Handle unlimited data
- Auto-scaling infrastructure
- No server management

### 3. Persistence

- Data saved permanently
- Historical tracking
- Analytics ready

### 4. Security

- Built-in authentication
- Row-level security rules
- Audit logging

### 5. Developer Experience

- Simple API
- Automatic indexing
- Query optimization

## API Usage Examples

### Reading Data

```typescript
const { state } = useDataContext();

// Access any data collection
console.log(state.inventory); // InventoryItem[]
console.log(state.orders); // Order[]
console.log(state.outlets); // Outlet[]
console.log(state.salesReps); // SalesRep[]
console.log(state.vans); // DeliveryVan[]
console.log(state.dashboardData); // DashboardData
```

### Creating Data

```typescript
const { addInventoryItem } = useDataContext();

await addInventoryItem({
  flavor: "Mango Splash",
  stock: 500,
  capacity: 2000,
  color: "#FFA500",
  gradient: "linear-gradient(...)",
  icon: "🥭",
  trend: 5,
});
```

### Updating Data

```typescript
const { updateOrder } = useDataContext();

await updateOrder("ORD-123", {
  status: "delivered",
  assignedDriver: "John Doe",
});
```

### Deleting Data

```typescript
const { deleteOutlet } = useDataContext();

await deleteOutlet("outlet-456");
```

## Performance Considerations

### Optimization Done

- ✅ Real-time updates every 30 seconds (configurable)
- ✅ Efficient Firestore queries
- ✅ Context-based state management
- ✅ Component memoization ready
- ✅ Loading states to prevent janky UI

### Further Optimization (Optional)

```typescript
// Use real-time listeners instead of polling
import { onSnapshot } from "firebase/firestore";

// Implement pagination for large datasets
orderService.getRecent(20); // Limit to 20 records

// Add caching layer
// Implement query optimization
```

## Error Handling

All components now properly handle:

```typescript
// Loading state
if (loading) return <Loader />;

// Error state
if (error) return <ErrorBoundary error={error} onRetry={refresh} />;

// Empty state
if (state.orders.length === 0) return <EmptyState />;

// Success state
return <OrderList orders={state.orders} />;
```

## Testing

### Before (Hardcoded)

- Easy to mock in tests
- No async operations
- Simple unit tests

### After (Firebase)

- Mock Firebase in tests
- Handle async operations
- Test with Firestore emulator
- Integration tests with real data

Example test setup:

```typescript
import { FirebaseApp, initializeApp } from "firebase/app";
import { connectFirestoreEmulator } from "firebase/firestore";

// Connect to emulator in tests
const app = initializeApp(config);
connectFirestoreEmulator(db, "localhost", 8080);
```

## Deployment

### Environment Setup

```bash
# .env.local (local development)
VITE_FIREBASE_API_KEY=dev_key
VITE_FIREBASE_PROJECT_ID=dev_project

# Production
VITE_FIREBASE_API_KEY=prod_key
VITE_FIREBASE_PROJECT_ID=prod_project
```

### Build Process

```bash
npm run build  # Creates optimized bundle
npm run preview # Test production build locally
```

## Common Questions

### Q: Can I still use hardcoded data?

A: Yes, but override data in Firestore or modify components to use local state alongside Firebase.

### Q: How do I migrate my existing data?

A: Export data and import into Firestore using Firebase Console or Cloud Functions.

### Q: What about offline support?

A: Firebase Realtime Database or use Service Workers for offline-first app.

### Q: How do I implement real-time sync?

A: Use `onSnapshot` instead of `getDocs` for live listeners.

### Q: Can I use this with other backends?

A: Yes, modify `firebaseService.ts` to use your preferred backend API.

## Rollback Plan

If you need to revert to hardcoded data:

1. Keep the old hardcoded component versions (Git history)
2. Replace Firebase calls with local constants
3. Remove `useDataContext` usage
4. Update component state to local state
5. Remove DataProvider from `main.tsx`

## Next Steps

1. Set up your Firebase project
2. Create Firestore collections
3. Add sample data
4. Test all components
5. Set up security rules
6. Deploy to production
7. Monitor and optimize
