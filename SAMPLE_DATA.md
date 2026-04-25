# Sample Data for Firebase Firestore

Copy and paste this data directly into your Firestore collections to get started.

## Collection: `inventory`

### Document 1: Orange Burst

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
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

### Document 2: Apple Fresh

```json
{
  "flavor": "Apple Fresh",
  "stock": 245,
  "capacity": 2000,
  "color": "#EF4444",
  "gradient": "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
  "icon": "🍎",
  "trend": -8,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

### Document 3: Tropical Mix

```json
{
  "flavor": "Tropical Mix",
  "stock": 1650,
  "capacity": 2000,
  "color": "#F59E0B",
  "gradient": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  "icon": "🥭",
  "trend": 5,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

### Document 4: Grape Delight

```json
{
  "flavor": "Grape Delight",
  "stock": 980,
  "capacity": 2000,
  "color": "#8B5CF6",
  "gradient": "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  "icon": "🍇",
  "trend": 3,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

### Document 5: Green Detox

```json
{
  "flavor": "Green Detox",
  "stock": 1420,
  "capacity": 2000,
  "color": "#2ECC71",
  "gradient": "linear-gradient(135deg, #2ECC71 0%, #6EE7B7 100%)",
  "icon": "🥬",
  "trend": 18,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

### Document 6: Berry Blast

```json
{
  "flavor": "Berry Blast",
  "stock": 180,
  "capacity": 2000,
  "color": "#EC4899",
  "gradient": "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
  "icon": "🫐",
  "trend": -15,
  "createdAt": "2024-04-21T10:00:00Z",
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

## Collection: `outlets`

### Document 1: Super Mart Downtown (Chennai)

```json
{
  "name": "Super Mart Downtown",
  "location": {
    "lat": 13.0827,
    "lng": 80.2707
  },
  "salesVolume": "high",
  "nextDelivery": "Today, 2:30 PM",
  "coolerCapacity": 120,
  "currentStock": 45,
  "owedAmount": 0,
  "phone": "9876543210",
  "email": "supermart@example.com",
  "address": "123 Main Street, Downtown Chennai",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 2: Green Valley Store (Coimbatore)

```json
{
  "name": "Green Valley Store",
  "location": {
    "lat": 11.0086,
    "lng": 76.9011
  },
  "salesVolume": "medium",
  "nextDelivery": "Tomorrow, 9:00 AM",
  "coolerCapacity": 80,
  "currentStock": 62,
  "owedAmount": 340,
  "phone": "9876543211",
  "email": "greenvalley@example.com",
  "address": "456 Valley Road, Coimbatore",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 3: City Plaza Retail (Madurai)

```json
{
  "name": "City Plaza Retail",
  "location": {
    "lat": 9.9252,
    "lng": 78.1198
  },
  "salesVolume": "high",
  "nextDelivery": "Today, 4:00 PM",
  "coolerCapacity": 150,
  "currentStock": 30,
  "owedAmount": 0,
  "phone": "9876543212",
  "email": "cityplaza@example.com",
  "address": "789 Plaza Avenue, Madurai",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 4: Corner Shop Express (Trichy)

```json
{
  "name": "Corner Shop Express",
  "location": {
    "lat": 10.7905,
    "lng": 78.7047
  },
  "salesVolume": "low",
  "nextDelivery": "Apr 22, 10:00 AM",
  "coolerCapacity": 40,
  "currentStock": 35,
  "owedAmount": 180,
  "phone": "9876543213",
  "email": "cornershop@example.com",
  "address": "321 Corner Street, Trichy",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 5: Healthy Living Market (Salem)

```json
{
  "name": "Healthy Living Market",
  "location": {
    "lat": 11.6643,
    "lng": 78.146
  },
  "salesVolume": "medium",
  "nextDelivery": "Tomorrow, 1:00 PM",
  "coolerCapacity": 90,
  "currentStock": 50,
  "owedAmount": 0,
  "phone": "9876543214",
  "email": "healthymarket@example.com",
  "address": "555 Health Road, Salem",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 6: Quick Stop Station (Vellore)

```json
{
  "name": "Quick Stop Station",
  "location": {
    "lat": 12.9689,
    "lng": 79.1288
  },
  "salesVolume": "high",
  "nextDelivery": "Today, 3:15 PM",
  "coolerCapacity": 100,
  "currentStock": 22,
  "owedAmount": 520,
  "phone": "9876543215",
  "email": "quickstop@example.com",
  "address": "999 Quick Lane, Vellore",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

## Collection: `orders`

### Document 1: Order 1

```json
{
  "outletId": "outlet-1",
  "outletName": "Super Mart Downtown",
  "status": "transit",
  "items": [
    {
      "product": "Orange Burst",
      "quantity": 24
    },
    {
      "product": "Green Detox",
      "quantity": 24
    }
  ],
  "total": 1440,
  "time": "2 hours ago",
  "assignedDriver": "Mike Johnson",
  "createdAt": "2024-04-21T13:00:00Z",
  "updatedAt": "2024-04-21T15:30:00Z"
}
```

### Document 2: Order 2

```json
{
  "outletId": "outlet-3",
  "outletName": "City Plaza Retail",
  "status": "packing",
  "items": [
    {
      "product": "Tropical Mix",
      "quantity": 72
    }
  ],
  "total": 2160,
  "time": "45 mins ago",
  "createdAt": "2024-04-21T14:45:00Z",
  "updatedAt": "2024-04-21T15:30:00Z"
}
```

### Document 3: Order 3

```json
{
  "outletId": "outlet-6",
  "outletName": "Quick Stop Station",
  "status": "placed",
  "items": [
    {
      "product": "Orange Burst",
      "quantity": 36
    }
  ],
  "total": 1080,
  "time": "15 mins ago",
  "createdAt": "2024-04-21T15:15:00Z",
  "updatedAt": "2024-04-21T15:30:00Z"
}
```

### Document 4: Order 4

```json
{
  "outletId": "outlet-2",
  "outletName": "Green Valley Store",
  "status": "transit",
  "items": [
    {
      "product": "Apple Fresh",
      "quantity": 54
    }
  ],
  "total": 1620,
  "time": "3 hours ago",
  "assignedDriver": "Sarah Chen",
  "createdAt": "2024-04-21T12:30:00Z",
  "updatedAt": "2024-04-21T15:30:00Z"
}
```

### Document 5: Order 5

```json
{
  "outletId": "outlet-5",
  "outletName": "Healthy Living Market",
  "status": "delivered",
  "items": [
    {
      "product": "Green Detox",
      "quantity": 60
    }
  ],
  "total": 1800,
  "time": "5 hours ago",
  "assignedDriver": "David Wilson",
  "createdAt": "2024-04-21T10:30:00Z",
  "updatedAt": "2024-04-21T15:30:00Z"
}
```

## Collection: `salesReps`

### Document 1: Mike Johnson

```json
{
  "name": "Mike Johnson",
  "avatar": "MJ",
  "casesSold": 845,
  "target": 800,
  "revenue": 25350,
  "outlets": 12,
  "trend": 18,
  "email": "mike@example.com",
  "phone": "9876543220"
}
```

### Document 2: Sarah Chen

```json
{
  "name": "Sarah Chen",
  "avatar": "SC",
  "casesSold": 920,
  "target": 800,
  "revenue": 27600,
  "outlets": 15,
  "trend": 24,
  "email": "sarah@example.com",
  "phone": "9876543221"
}
```

### Document 3: David Wilson

```json
{
  "name": "David Wilson",
  "avatar": "DW",
  "casesSold": 765,
  "target": 800,
  "revenue": 22950,
  "outlets": 10,
  "trend": -5,
  "email": "david@example.com",
  "phone": "9876543222"
}
```

### Document 4: Emma Rodriguez

```json
{
  "name": "Emma Rodriguez",
  "avatar": "ER",
  "casesSold": 1050,
  "target": 800,
  "revenue": 31500,
  "outlets": 18,
  "trend": 35,
  "email": "emma@example.com",
  "phone": "9876543223"
}
```

## Collection: `vans`

### Document 1: VAN-01

```json
{
  "driver": "Mike Johnson",
  "avatar": "MJ",
  "licensePlate": "JF-2847",
  "status": "active",
  "location": "Downtown District",
  "deliveries": 5,
  "completed": 3,
  "eta": "45 mins",
  "route": [
    "Super Mart Downtown",
    "City Plaza Retail",
    "Quick Stop Station",
    "Corner Shop Express",
    "Urban Fresh Market"
  ],
  "fuelLevel": 68,
  "lastUpdated": "2024-04-21T15:30:00Z",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 2: VAN-02

```json
{
  "driver": "Sarah Chen",
  "avatar": "SC",
  "licensePlate": "JF-2848",
  "status": "active",
  "location": "Green Valley Zone",
  "deliveries": 4,
  "completed": 2,
  "eta": "1 hour 20 mins",
  "route": [
    "Green Valley Store",
    "Healthy Living Market",
    "Nature's Best",
    "Fresh Corner"
  ],
  "fuelLevel": 82,
  "lastUpdated": "2024-04-21T15:30:00Z",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 3: VAN-03

```json
{
  "driver": "David Wilson",
  "avatar": "DW",
  "licensePlate": "JF-2849",
  "status": "returning",
  "location": "Highway 5",
  "deliveries": 6,
  "completed": 6,
  "eta": "20 mins",
  "route": [],
  "fuelLevel": 35,
  "lastUpdated": "2024-04-21T15:30:00Z",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### Document 4: VAN-04

```json
{
  "driver": "Emma Rodriguez",
  "avatar": "ER",
  "licensePlate": "JF-2850",
  "status": "idle",
  "location": "Warehouse Hub",
  "deliveries": 0,
  "completed": 0,
  "eta": "Ready",
  "route": [],
  "fuelLevel": 95,
  "lastUpdated": "2024-04-21T15:30:00Z",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

## Collection: `alerts`

### Document 1: Alert 1

```json
{
  "title": "Low Stock Alert",
  "message": "Apple Fresh stock critically low (245 cases)",
  "severity": "warning",
  "timestamp": "2024-04-21T15:15:00Z"
}
```

### Document 2: Alert 2

```json
{
  "title": "Restock Required",
  "message": "Berry Blast requires immediate restock",
  "severity": "warning",
  "timestamp": "2024-04-21T14:30:00Z"
}
```

### Document 3: Alert 3

```json
{
  "title": "New Registration",
  "message": "New outlet registration pending approval",
  "severity": "info",
  "timestamp": "2024-04-21T13:00:00Z"
}
```

## Collection: `dashboard` → Document: `metrics`

```json
{
  "stats": [
    {
      "id": "revenue",
      "label": "Total Revenue",
      "value": 127450,
      "trend": 18.2,
      "trendLabel": "Up from last week"
    },
    {
      "id": "cases",
      "label": "Cases Sold",
      "value": 3580,
      "trend": 12.5,
      "trendLabel": "On track"
    },
    {
      "id": "outlets",
      "label": "Active Outlets",
      "value": 48,
      "trend": 3,
      "trendLabel": "Growing"
    },
    {
      "id": "deliveries",
      "label": "Active Deliveries",
      "value": 12,
      "trend": null,
      "trendLabel": "On Schedule"
    }
  ],
  "weeklyRevenue": [
    {
      "day": "Mon",
      "revenue": 18400
    },
    {
      "day": "Tue",
      "revenue": 22100
    },
    {
      "day": "Wed",
      "revenue": 25300
    },
    {
      "day": "Thu",
      "revenue": 21800
    },
    {
      "day": "Fri",
      "revenue": 28900
    },
    {
      "day": "Sat",
      "revenue": 16200
    },
    {
      "day": "Sun",
      "revenue": 12500
    }
  ],
  "topFlavors": [
    {
      "id": "flavor-1",
      "name": "Orange Burst",
      "casesSold": 1840,
      "percentage": 32,
      "color": "#FF8A00"
    },
    {
      "id": "flavor-2",
      "name": "Tropical Mix",
      "casesSold": 1650,
      "percentage": 29,
      "color": "#F59E0B"
    },
    {
      "id": "flavor-3",
      "name": "Green Detox",
      "casesSold": 1420,
      "percentage": 25,
      "color": "#2ECC71"
    },
    {
      "id": "flavor-4",
      "name": "Grape Delight",
      "casesSold": 980,
      "percentage": 14,
      "color": "#8B5CF6"
    }
  ],
  "lastUpdated": "2024-04-21T15:30:00Z"
}
```

## How to Import This Data

### Option 1: Manual Entry (Easiest)

1. Go to Firebase Console → Firestore
2. Click "Add Collection"
3. Name it (e.g., "inventory")
4. Click "Add Document"
5. Copy the JSON and paste field by field

### Option 2: Firestore Console (Faster)

1. Go to Firebase Console
2. Click "Add Collection"
3. Create collection
4. Click "Add Document"
5. Switch to "Edit as text"
6. Paste the JSON

### Option 3: Firebase CLI (Script)

Create a script using Firebase Admin SDK to import bulk data

### Option 4: Import Tool

Use Firebase's import/export feature

## Notes

- All timestamps use ISO format
- All prices are in ₹ (Indian Rupees)
- IDs are auto-generated by Firestore
- Modify data to match your business logic
- Add more documents as needed
- Update timestamps to current time

## Next Steps

1. Create collections in Firebase
2. Import sample data
3. Verify data appears in app
4. Modify data to your needs
5. Start using the application
