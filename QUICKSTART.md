# Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- Firebase account
- Text editor or IDE

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials from Firebase Console
3. Save the file

### 3. Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create Cloud Firestore database
3. Start in test mode (or set production rules)
4. See `FIREBASE_SETUP.md` for collection structure

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## First Time Setup

### Sample Data (Optional)

To populate your database with sample data, you can:

1. **Manual Method**: Use Firebase Console to add documents manually
2. **Script Method**: Create a setup script (see example below)
3. **Import Method**: Use Firebase CLI to import data

#### Example: Add Sample Inventory

In Firebase Console → Firestore → Collection `inventory` → Add Document:

```json
{
  "flavor": "Orange Burst",
  "stock": 1840,
  "capacity": 2000,
  "color": "#FF8A00",
  "gradient": "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
  "icon": "🍊",
  "trend": 12,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T10:00:00Z"
}
```

## Project Structure

```
src/
├── lib/
│   ├── firebase.ts           # Firebase config
│   ├── types.ts              # TypeScript interfaces
│   ├── firebaseService.ts    # Service layer
│   └── dataContext.tsx       # State management
├── app/
│   ├── App.tsx               # Main app
│   └── components/
│       ├── Dashboard.tsx
│       ├── InventoryHub.tsx
│       ├── OrderPipeline.tsx
│       ├── OutletMap.tsx
│       ├── SalesPerformance.tsx
│       ├── Logistics.tsx
│       └── MobileView.tsx
└── ...
```

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Common Tasks

### Adding a New Feature

1. **Create types** in `src/lib/types.ts`
2. **Add service methods** in `src/lib/firebaseService.ts`
3. **Add context methods** in `src/lib/dataContext.tsx`
4. **Create component** in `src/app/components/`
5. **Use context** in your component:

```typescript
const { state, loading, error } = useDataContext();
```

### Modifying Firestore Structure

1. Update types in `src/lib/types.ts`
2. Update service methods in `src/lib/firebaseService.ts`
3. Update components to use new fields

### Testing Data Flow

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Look for Firestore requests
4. Check Console for errors

## Environment Variables

Required environment variables (in `.env.local`):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

## Troubleshooting

### App won't start

1. Check Node.js version: `node --version` (should be 16+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check for errors in console

### Firebase connection issues

1. Verify `.env.local` file exists
2. Check all Firebase credentials are correct
3. Ensure Firestore database is created
4. Check browser console for error messages

### No data showing

1. Verify collections exist in Firestore
2. Check Firestore security rules allow reads
3. Look at Network tab in DevTools for API errors
4. Check browser console for JavaScript errors

## Next Steps

1. Review `FIREBASE_SETUP.md` for detailed information
2. Add authentication if needed
3. Set up custom security rules for production
4. Create admin panel for data management
5. Add real-time listeners for live updates

## Support

For issues or questions:

1. Check `FIREBASE_SETUP.md` troubleshooting section
2. Review Firebase documentation
3. Check browser console for errors
4. Verify Firestore database structure
