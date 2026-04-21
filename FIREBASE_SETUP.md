# Firebase Integration Guide

## Overview

This application has been completely refactored to use Firebase as the backend instead of hardcoded mock data. All components now fetch real-time data from Firebase Firestore.

## Project Structure

### New Files Created

- `src/lib/firebase.ts` - Firebase initialization and configuration
- `src/lib/types.ts` - TypeScript interfaces for all data models
- `src/lib/firebaseService.ts` - Service layer with all CRUD operations
- `src/lib/dataContext.tsx` - React Context for app-wide state management
- `.env.example` - Example environment variables

## Setup Instructions

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Go to Project Settings (gear icon) → Service accounts
4. Copy your Web App config

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firestore Database Setup

#### Create Collections

You need to create the following collections in Firestore:

##### a) **inventory** Collection

Document structure:

```typescript
{
  id: string; // Document ID
  flavor: string; // "Orange Burst", "Apple Fresh", etc.
  stock: number; // Current stock count
  capacity: number; // Maximum capacity
  color: string; // Hex color "#FF8A00"
  gradient: string; // CSS gradient string
  icon: string; // Emoji or icon identifier
  trend: number; // Percentage change (+12, -5, etc.)
  createdAt: string; // ISO timestamp
  lastUpdated: string; // ISO timestamp
}
```

##### b) **orders** Collection

Document structure:

```typescript
{
  id: string;
  outletId: string;
  outletName: string;
  status: "placed" | "packing" | "transit" | "delivered";
  items: Array<{
    product: string;
    quantity: number;
  }>;
  total: number;        // Total price in ₹
  time: string;         // Last update time
  assignedDriver?: string;
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

##### c) **outlets** Collection

Document structure:

```typescript
{
  id: string;
  name: string;
  location: {
    x: number;          // Percentage position (0-100)
    y: number;          // Percentage position (0-100)
  };
  salesVolume: "high" | "medium" | "low";
  nextDelivery: string; // "Today, 2:30 PM"
  coolerCapacity: number;
  currentStock: number;
  owedAmount: number;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;    // ISO timestamp
}
```

##### d) **salesReps** Collection

Document structure:

```typescript
{
  id: string;
  name: string;
  avatar?: string;      // Initials or image URL
  casesSold: number;
  target: number;
  revenue: number;      // In ₹
  outlets: number;
  trend: number;        // Percentage
  email?: string;
  phone?: string;
}
```

##### e) **vans** Collection

Document structure:

```typescript
{
  id: string;           // "VAN-01"
  driver: string;
  avatar?: string;      // Initials
  licensePlate: string;
  status: "active" | "idle" | "returning";
  location: string;
  deliveries: number;
  completed: number;
  eta: string;          // "45 mins"
  route: string[];      // Array of stop names
  fuelLevel: number;    // Percentage (0-100)
  lastUpdated: string;  // ISO timestamp
  createdAt: string;    // ISO timestamp
}
```

##### f) **dashboard/metrics** Document

Single document structure:

```typescript
{
  stats: Array<DashboardStat>;
  weeklyRevenue: Array<{
    day: string; // "Mon", "Tue", etc.
    revenue: number;
    target?: number;
  }>;
  topFlavors: Array<{
    id: string;
    name: string;
    casesSold: number;
    percentage: number;
    color: string;
  }>;
  lastUpdated: string; // ISO timestamp
}
```

##### g) **alerts** Collection

Document structure:

```typescript
{
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: string; // ISO timestamp
}
```

### 4. Firestore Security Rules

Set these rules in Firestore Console → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Or allow public access (development only):
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

## Component Updates Summary

All components have been updated to use Firebase:

### Dashboard

- Fetches stats, weekly revenue, top flavors, and alerts from Firestore
- Auto-refreshes every 30 seconds

### InventoryHub

- Displays inventory from `inventory` collection
- Shows real-time stock levels with trends

### OrderPipeline

- Shows orders organized by status (placed, packing, transit, delivered)
- Real-time order tracking

### OutletMap

- Displays outlet locations on an interactive map
- Shows delivery schedules and stock levels

### SalesPerformance

- Tracks sales reps and their performance metrics
- Shows team leaderboard

### Logistics

- Real-time van tracking
- Shows delivery progress and route information
- Fuel level monitoring

### MobileView

- Mobile-friendly interface for field agents
- Shows today's route with outlet details

## API Methods

The `firebaseService` provides the following methods:

### Inventory

```typescript
inventoryService.getAll(); // Get all inventory items
inventoryService.getById(id); // Get single item
inventoryService.create(item); // Create new item
inventoryService.update(id, updates); // Update item
inventoryService.delete(id); // Delete item
```

### Orders

```typescript
orderService.getAll(); // Get all orders
orderService.getByStatus(status); // Get orders by status
orderService.getRecent(limitCount); // Get recent orders
orderService.getById(id); // Get single order
orderService.create(order); // Create new order
orderService.update(id, updates); // Update order
orderService.updateStatus(id, status); // Update order status
orderService.delete(id); // Delete order
```

### Outlets

```typescript
outletService.getAll(); // Get all outlets
outletService.getById(id); // Get single outlet
outletService.create(outlet); // Create new outlet
outletService.update(id, updates); // Update outlet
outletService.delete(id); // Delete outlet
```

### Sales Reps

```typescript
salesRepService.getAll(); // Get all sales reps
salesRepService.getById(id); // Get single rep
salesRepService.create(rep); // Create new rep
salesRepService.update(id, updates); // Update rep
salesRepService.delete(id); // Delete rep
```

### Vans

```typescript
vanService.getAll(); // Get all vans
vanService.getByStatus(status); // Get vans by status
vanService.getById(id); // Get single van
vanService.create(van); // Create new van
vanService.update(id, updates); // Update van
vanService.delete(id); // Delete van
```

### Dashboard

```typescript
dashboardService.getDashboardData(); // Get all dashboard data
dashboardService.updateStats(stats); // Update stats
dashboardService.updateWeeklyRevenue(); // Update revenue data
dashboardService.updateTopFlavors(); // Update flavor data
dashboardService.getAlerts(); // Get all alerts
dashboardService.createAlert(alert); // Create new alert
```

## Using the Data Context

In any component, use the `useDataContext` hook:

```typescript
import { useDataContext } from '../../lib/dataContext';

function MyComponent() {
  const {
    state,                    // Current app state
    loading,                  // Is data loading?
    error,                    // Any errors?
    refreshDashboard,         // Refresh functions
    addInventoryItem,         // CRUD operations
    updateOrder,
    // ... all other methods
  } = useDataContext();

  // Access data
  console.log(state.inventory);  // Array of InventoryItem
  console.log(state.orders);     // Array of Order

  // Use methods
  await addInventoryItem({ flavor: 'New Flavor', ... });
}
```

## Data Refresh Strategy

- **Initial Load**: App loads all data on mount
- **Auto-Refresh**: Data refreshes every 30 seconds
- **Manual Refresh**: Call specific refresh functions (e.g., `refreshOrders()`)
- **Full Refresh**: Call `refreshAll()` to refresh everything

## Error Handling

All components include:

- Loading states while fetching data
- Error boundaries with retry buttons
- Graceful fallbacks for empty states

## Troubleshooting

### "Firebase is not initialized"

- Ensure `.env.local` has all required variables
- Restart dev server after changing environment variables

### "Permission denied" errors

- Check Firestore security rules
- Verify user is authenticated (if rules require it)

### "Collection not found"

- Ensure collections exist in Firestore
- Use exact collection names (case-sensitive)

### Data not updating

- Check network tab in browser DevTools
- Verify Firestore rules allow read/write
- Check browser console for error messages

## Next Steps

1. **Set up Authentication** (optional):
   - Add `Auth` component to wrap your app
   - Use `auth` object from `src/lib/firebase.ts`

2. **Add Real-time Listeners** (optional):
   - Import `onSnapshot` from 'firebase/firestore'
   - Use for live updates without polling

3. **Set up Cloud Functions** (optional):
   - Automate data processing
   - Schedule periodic tasks
   - Trigger notifications

4. **Add Storage** (optional):
   - Store images and documents
   - Use Firebase Storage

## Production Checklist

- [ ] Update Firestore security rules for production
- [ ] Set up proper authentication
- [ ] Enable Firestore backups
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Review and optimize Firestore indexes
- [ ] Set up logging and error tracking
- [ ] Test all CRUD operations
