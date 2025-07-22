# CRM API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except login/register) require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
Login user and get JWT token
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/register
Register new user
```json
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/logout
Logout user (invalidate token)
```json
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/forgot-password
Send password reset email
```json
// Request
{
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /auth/reset-password
Reset password with token
```json
// Request
{
  "token": "reset_token_here",
  "password": "newpassword123"
}

// Response
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👥 Customer Endpoints

### GET /customers
Get all customers with pagination and filters
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- status: string (active|inactive)
- sort: string (name|email|createdAt)
- order: string (asc|desc)
```

```json
// Response
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Acme Corporation",
        "email": "contact@acme.com",
        "phone": "+1-555-0123",
        "company": "Acme Corp",
        "address": "123 Business St, City, State 12345",
        "status": "active",
        "tags": ["enterprise", "priority"],
        "totalValue": 15000.00,
        "lastContact": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### GET /customers/:id
Get single customer by ID
```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "address": "123 Business St, City, State 12345",
    "status": "active",
    "tags": ["enterprise", "priority"],
    "totalValue": 15000.00,
    "lastContact": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "opportunities": [],
    "invoices": [],
    "activities": []
  }
}
```

### POST /customers
Create new customer
```json
// Request
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "company": "Acme Corp",
  "address": "123 Business St, City, State 12345",
  "status": "active",
  "tags": ["enterprise", "priority"]
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "address": "123 Business St, City, State 12345",
    "status": "active",
    "tags": ["enterprise", "priority"],
    "totalValue": 0.00,
    "lastContact": null,
    "createdAt": "2024-01-20T12:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### PUT /customers/:id
Update customer
```json
// Request
{
  "name": "Acme Corporation Updated",
  "email": "new-contact@acme.com",
  "phone": "+1-555-0124",
  "company": "Acme Corp",
  "address": "456 New Business St, City, State 12345",
  "status": "active",
  "tags": ["enterprise", "priority", "updated"]
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Acme Corporation Updated",
    "email": "new-contact@acme.com",
    "phone": "+1-555-0124",
    "company": "Acme Corp",
    "address": "456 New Business St, City, State 12345",
    "status": "active",
    "tags": ["enterprise", "priority", "updated"],
    "totalValue": 15000.00,
    "lastContact": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### DELETE /customers/:id
Delete customer
```json
// Response
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### POST /customers/bulk
Bulk operations on customers
```json
// Request
{
  "action": "delete", // delete|update|export
  "customerIds": [1, 2, 3],
  "data": {} // for update action
}

// Response
{
  "success": true,
  "message": "Bulk operation completed",
  "affected": 3
}
```

---

## 🎯 Opportunity Endpoints

### GET /opportunities
Get all opportunities with filters
```
Query Parameters:
- page: number
- limit: number
- search: string
- stage: string
- customerId: number
- sort: string
- order: string
```

```json
// Response
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "id": 1,
        "title": "Website Redesign Project",
        "description": "Complete website redesign for Acme Corp",
        "value": 15000.00,
        "stage": "proposal",
        "probability": 75,
        "expectedCloseDate": "2024-02-15",
        "customerId": 1,
        "customer": {
          "id": 1,
          "name": "Acme Corporation",
          "email": "contact@acme.com"
        },
        "assignedTo": 1,
        "assignedUser": {
          "id": 1,
          "name": "John Doe",
          "email": "john@company.com"
        },
        "tags": ["web-design", "priority"],
        "customFields": {
          "source": "referral",
          "budget": "15000-20000"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET /opportunities/:id
Get single opportunity
```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Website Redesign Project",
    "description": "Complete website redesign for Acme Corp",
    "value": 15000.00,
    "stage": "proposal",
    "probability": 75,
    "expectedCloseDate": "2024-02-15",
    "customerId": 1,
    "customer": {
      "id": 1,
      "name": "Acme Corporation",
      "email": "contact@acme.com"
    },
    "assignedTo": 1,
    "assignedUser": {
      "id": 1,
      "name": "John Doe",
      "email": "john@company.com"
    },
    "tags": ["web-design", "priority"],
    "customFields": {
      "source": "referral",
      "budget": "15000-20000"
    },
    "activities": [],
    "attachments": [],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /opportunities
Create new opportunity
```json
// Request
{
  "title": "Website Redesign Project",
  "description": "Complete website redesign for Acme Corp",
  "value": 15000.00,
  "stage": "lead",
  "probability": 25,
  "expectedCloseDate": "2024-02-15",
  "customerId": 1,
  "assignedTo": 1,
  "tags": ["web-design", "priority"],
  "customFields": {
    "source": "referral",
    "budget": "15000-20000"
  }
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Website Redesign Project",
    "description": "Complete website redesign for Acme Corp",
    "value": 15000.00,
    "stage": "lead",
    "probability": 25,
    "expectedCloseDate": "2024-02-15",
    "customerId": 1,
    "assignedTo": 1,
    "tags": ["web-design", "priority"],
    "customFields": {
      "source": "referral",
      "budget": "15000-20000"
    },
    "createdAt": "2024-01-20T12:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### PUT /opportunities/:id
Update opportunity
```json
// Request
{
  "title": "Website Redesign Project - Updated",
  "description": "Complete website redesign and mobile app for Acme Corp",
  "value": 18000.00,
  "stage": "proposal",
  "probability": 75,
  "expectedCloseDate": "2024-02-20",
  "customerId": 1,
  "assignedTo": 1,
  "tags": ["web-design", "mobile-app", "priority"],
  "customFields": {
    "source": "referral",
    "budget": "18000-25000"
  }
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Website Redesign Project - Updated",
    "description": "Complete website redesign and mobile app for Acme Corp",
    "value": 18000.00,
    "stage": "proposal",
    "probability": 75,
    "expectedCloseDate": "2024-02-20",
    "customerId": 1,
    "assignedTo": 1,
    "tags": ["web-design", "mobile-app", "priority"],
    "customFields": {
      "source": "referral",
      "budget": "18000-25000"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### DELETE /opportunities/:id
Delete opportunity
```json
// Response
{
  "success": true,
  "message": "Opportunity deleted successfully"
}
```

### GET /opportunities/pipeline
Get pipeline data for Kanban view
```json
// Response
{
  "success": true,
  "data": {
    "stages": [
      {
        "id": "lead",
        "name": "Lead",
        "color": "#3B82F6",
        "opportunities": [
          {
            "id": 1,
            "title": "Website Redesign Project",
            "value": 15000.00,
            "customer": "Acme Corporation",
            "probability": 25,
            "expectedCloseDate": "2024-02-15"
          }
        ],
        "totalValue": 15000.00,
        "count": 1
      }
    ],
    "totalValue": 150000.00,
    "totalCount": 25
  }
}
```

---

## ✅ Task Endpoints

### GET /tasks
Get all tasks with filters
```
Query Parameters:
- page: number
- limit: number
- search: string
- status: string (pending|in_progress|completed|cancelled)
- priority: string (low|medium|high|urgent)
- assignedTo: number
- dueDate: string
- sort: string
- order: string
```

```json
// Response
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Follow up with Acme Corp",
        "description": "Call to discuss project timeline and requirements",
        "status": "pending",
        "priority": "high",
        "dueDate": "2024-01-25T17:00:00Z",
        "assignedTo": 1,
        "assignedUser": {
          "id": 1,
          "name": "John Doe",
          "email": "john@company.com"
        },
        "customerId": 1,
        "customer": {
          "id": 1,
          "name": "Acme Corporation"
        },
        "opportunityId": 1,
        "opportunity": {
          "id": 1,
          "title": "Website Redesign Project"
        },
        "tags": ["follow-up", "urgent"],
        "estimatedHours": 2,
        "actualHours": 0,
        "dependencies": [],
        "subtasks": [],
        "attachments": [],
        "comments": [],
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z",
        "completedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 30,
      "pages": 3
    }
  }
}
```

### GET /tasks/:id
Get single task
```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Follow up with Acme Corp",
    "description": "Call to discuss project timeline and requirements",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-25T17:00:00Z",
    "assignedTo": 1,
    "assignedUser": {
      "id": 1,
      "name": "John Doe",
      "email": "john@company.com"
    },
    "customerId": 1,
    "customer": {
      "id": 1,
      "name": "Acme Corporation"
    },
    "opportunityId": 1,
    "opportunity": {
      "id": 1,
      "title": "Website Redesign Project"
    },
    "tags": ["follow-up", "urgent"],
    "estimatedHours": 2,
    "actualHours": 0,
    "dependencies": [2, 3],
    "subtasks": [
      {
        "id": 1,
        "title": "Prepare call agenda",
        "completed": true
      }
    ],
    "attachments": [],
    "comments": [
      {
        "id": 1,
        "content": "Customer requested to reschedule",
        "userId": 1,
        "user": {
          "name": "John Doe"
        },
        "createdAt": "2024-01-21T09:00:00Z"
      }
    ],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-21T09:00:00Z",
    "completedAt": null
  }
}
```

### POST /tasks
Create new task
```json
// Request
{
  "title": "Follow up with Acme Corp",
  "description": "Call to discuss project timeline and requirements",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-25T17:00:00Z",
  "assignedTo": 1,
  "customerId": 1,
  "opportunityId": 1,
  "tags": ["follow-up", "urgent"],
  "estimatedHours": 2,
  "dependencies": [2, 3],
  "subtasks": [
    {
      "title": "Prepare call agenda",
      "completed": false
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Follow up with Acme Corp",
    "description": "Call to discuss project timeline and requirements",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-25T17:00:00Z",
    "assignedTo": 1,
    "customerId": 1,
    "opportunityId": 1,
    "tags": ["follow-up", "urgent"],
    "estimatedHours": 2,
    "actualHours": 0,
    "dependencies": [2, 3],
    "subtasks": [
      {
        "id": 1,
        "title": "Prepare call agenda",
        "completed": false
      }
    ],
    "createdAt": "2024-01-20T12:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z",
    "completedAt": null
  }
}
```

### PUT /tasks/:id
Update task
```json
// Request
{
  "title": "Follow up with Acme Corp - Updated",
  "description": "Call to discuss project timeline, requirements and budget",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2024-01-26T17:00:00Z",
  "assignedTo": 1,
  "customerId": 1,
  "opportunityId": 1,
  "tags": ["follow-up", "urgent", "budget-discussion"],
  "estimatedHours": 3,
  "actualHours": 1
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Follow up with Acme Corp - Updated",
    "description": "Call to discuss project timeline, requirements and budget",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-26T17:00:00Z",
    "assignedTo": 1,
    "customerId": 1,
    "opportunityId": 1,
    "tags": ["follow-up", "urgent", "budget-discussion"],
    "estimatedHours": 3,
    "actualHours": 1,
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-21T14:00:00Z",
    "completedAt": null
  }
}
```

### DELETE /tasks/:id
Delete task
```json
// Response
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### POST /tasks/:id/comments
Add comment to task
```json
// Request
{
  "content": "Customer confirmed the meeting for tomorrow at 2 PM"
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "content": "Customer confirmed the meeting for tomorrow at 2 PM",
    "taskId": 1,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@company.com"
    },
    "createdAt": "2024-01-21T15:00:00Z"
  }
}
```

### POST /tasks/:id/time-tracking
Track time for task
```json
// Request
{
  "hours": 2.5,
  "description": "Called customer and discussed requirements",
  "date": "2024-01-21"
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "taskId": 1,
    "userId": 1,
    "hours": 2.5,
    "description": "Called customer and discussed requirements",
    "date": "2024-01-21",
    "createdAt": "2024-01-21T17:00:00Z"
  }
}
```

---

## 📦 Product Endpoints

### GET /products
Get all products with filters
```
Query Parameters:
- page: number
- limit: number
- search: string
- category: string
- status: string (active|inactive|discontinued)
- minPrice: number
- maxPrice: number
- inStock: boolean
- sort: string
- order: string
```

```json
// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Website Development Package",
        "description": "Complete website development with responsive design",
        "sku": "WEB-DEV-001",
        "category": "Web Services",
        "price": 2500.00,
        "cost": 1500.00,
        "stock": 0,
        "minStock": 0,
        "status": "active",
        "images": [
          "https://example.com/product1.jpg"
        ],
        "tags": ["web", "development", "responsive"],
        "variants": [
          {
            "id": 1,
            "name": "Basic Package",
            "price": 1500.00,
            "sku": "WEB-DEV-001-BASIC"
          }
        ],
        "customFields": {
          "deliveryTime": "2-4 weeks",
          "includes": ["Design", "Development", "Testing"]
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### GET /products/:id
Get single product
```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Website Development Package",
    "description": "Complete website development with responsive design",
    "sku": "WEB-DEV-001",
    "category": "Web Services",
    "price": 2500.00,
    "cost": 1500.00,
    "stock": 0,
    "minStock": 0,
    "status": "active",
    "images": [
      "https://example.com/product1.jpg"
    ],
    "tags": ["web", "development", "responsive"],
    "variants": [
      {
        "id": 1,
        "name": "Basic Package",
        "price": 1500.00,
        "sku": "WEB-DEV-001-BASIC",
        "stock": 0
      }
    ],
    "customFields": {
      "deliveryTime": "2-4 weeks",
      "includes": ["Design", "Development", "Testing"]
    },
    "analytics": {
      "totalSold": 25,
      "revenue": 62500.00,
      "averageRating": 4.8
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /products
Create new product
```json
// Request
{
  "name": "Website Development Package",
  "description": "Complete website development with responsive design",
  "sku": "WEB-DEV-001",
  "category": "Web Services",
  "price": 2500.00,
  "cost": 1500.00,
  "stock": 0,
  "minStock": 0,
  "status": "active",
  "images": [
    "https://example.com/product1.jpg"
  ],
  "tags": ["web", "development", "responsive"],
  "variants": [
    {
      "name": "Basic Package",
      "price": 1500.00,
      "sku": "WEB-DEV-001-BASIC",
      "stock": 0
    }
  ],
  "customFields": {
    "deliveryTime": "2-4 weeks",
    "includes": ["Design", "Development", "Testing"]
  }
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Website Development Package",
    "description": "Complete website development with responsive design",
    "sku": "WEB-DEV-001",
    "category": "Web Services",
    "price": 2500.00,
    "cost": 1500.00,
    "stock": 0,
    "minStock": 0,
    "status": "active",
    "images": [
      "https://example.com/product1.jpg"
    ],
    "tags": ["web", "development", "responsive"],
    "variants": [
      {
        "id": 1,
        "name": "Basic Package",
        "price": 1500.00,
        "sku": "WEB-DEV-001-BASIC",
        "stock": 0
      }
    ],
    "customFields": {
      "deliveryTime": "2-4 weeks",
      "includes": ["Design", "Development", "Testing"]
    },
    "createdAt": "2024-01-20T12:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### PUT /products/:id
Update product
```json
// Request
{
  "name": "Website Development Package - Premium",
  "description": "Complete website development with responsive design and SEO",
  "sku": "WEB-DEV-001",
  "category": "Web Services",
  "price": 3500.00,
  "cost": 2000.00,
  "stock": 0,
  "minStock": 0,
  "status": "active",
  "images": [
    "https://example.com/product1-updated.jpg"
  ],
  "tags": ["web", "development", "responsive", "seo"],
  "customFields": {
    "deliveryTime": "3-5 weeks",
    "includes": ["Design", "Development", "Testing", "SEO"]
  }
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Website Development Package - Premium",
    "description": "Complete website development with responsive design and SEO",
    "sku": "WEB-DEV-001",
    "category": "Web Services",
    "price": 3500.00,
    "cost": 2000.00,
    "stock": 0,
    "minStock": 0,
    "status": "active",
    "images": [
      "https://example.com/product1-updated.jpg"
    ],
    "tags": ["web", "development", "responsive", "seo"],
    "customFields": {
      "deliveryTime": "3-5 weeks",
      "includes": ["Design", "Development", "Testing", "SEO"]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

### DELETE /products/:id
Delete product
```json
// Response
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### GET /products/categories
Get all product categories
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Web Services",
      "description": "Website development and related services",
      "productCount": 15,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Mobile Apps",
      "description": "Mobile application development",
      "productCount": 8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /products/bulk-import
Bulk import products from CSV/Excel
```json
// Request (multipart/form-data)
{
  "file": "products.csv",
  "options": {
    "skipFirstRow": true,
    "updateExisting": true
  }
}

// Response
{
  "success": true,
  "data": {
    "imported": 45,
    "updated": 5,
    "errors": [
      {
        "row": 12,
        "error": "Invalid SKU format"
      }
    ]
  }
}
```

---

## 🧾 Invoice Endpoints

### GET /invoices
Get all invoices with filters
```
Query Parameters:
- page: number
- limit: number
- search: string
- status: string (draft|pending|paid|overdue|cancelled)
- customerId: number
- dateFrom: string
- dateTo: string
- minAmount: number
- maxAmount: number
- sort: string
- order: string
```

```json
// Response
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": 1,
        "invoiceNumber": "INV-2024-001",
        "customerId": 1,
        "customer": {
          "id": 1,
          "name": "Acme Corporation",
          "email": "billing@acme.com"
        },
        "customerName": "Acme Corporation",
        "customerEmail": "billing@acme.com",
        "customerAddress": "123 Business St, City, State 12345",
        "date": "2024-01-20",
        "dueDate": "2024-02-19",
        "status": "pending",
        "paymentMethod": "bank_transfer",
        "subtotal": 2500.00,
        "taxAmount": 200.00,
        "discountAmount": 100.00,
        "totalAmount": 2600.00,
        "paidAmount": 0.00,
        "balanceAmount": 2600.00,
        "notes": "Thank you for your business!",
        "items": [
          {
            "id": 1,
            "productName": "Website Development",
            "description": "Custom responsive website",
            "quantity": 1,
            "price": 2500.00,
            "tax": 200.00,
            "discount": 100.00,
            "total": 2600.00
          }
        ],
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z",
        "paidAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    },
    "summary": {
      "totalAmount": 125000.00,
      "paidAmount": 75000.00,
      "pendingAmount": 50000.00,
      "overdueAmount": 15000.00
    }
  }
}
```

### GET /invoices/:id
Get single invoice
```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "INV-2024-001",
    "customerId": 1,
    "customer": {
      "id": 1,
      "name": "Acme Corporation",
      "email": "billing@acme.com",
      "address": "123 Business St, City, State 12345"
    },
    "customerName": "Acme Corporation",
    "customerEmail": "billing@acme.com",
    "customerAddress": "123 Business St, City, State 12345",
    "date": "2024-01-20",
    "dueDate": "2024-02-19",
    "status": "pending",
    "paymentMethod": "bank_transfer",
    "subtotal": 2500.00,
    "taxAmount": 200.00,
    "discountAmount": 100.00,
    "totalAmount": 2600.00,
    "paidAmount": 0.00,
    "balanceAmount": 2600.00,
    "notes": "Thank you for your business!",
    "items": [
      {
        "id": 1,
        "productName": "Website Development",
        "description": "Custom responsive website",
        "quantity": 1,
        "price": 2500.00,
        "tax": 200.00,
        "discount": 100.00,
        "total": 2600.00
      }
    ],
    "payments": [
      {
        "id": 1,
        "amount": 1000.00,
        "method": "bank_transfer",
        "date": "2024-01-25",
        "reference": "TXN-12345",
        "notes": "Partial payment"
      }
    ],
    "activities": [
      {
        "id": 1,
        "type": "created",
        "description": "Invoice created",
        "userId": 1,
        "user": {
          "name": "John Doe"
        },
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-25T14:00:00Z",
    "paidAt": null
  }
}
```

### POST /invoices
Create new invoice
```json
// Request
{
  "invoiceNumber": "INV-2024-001",
  "customerId": 1,
  "customerName": "Acme Corporation",
  "customerEmail": "billing@acme.com",
  "customerAddress": "123 Business St, City, State 12345",
  "date": "2024-01-20",
  "dueDate": "2024-02-19",
  "status": "draft",
  "paymentMethod": "bank_transfer",
  "notes": "Thank you for your business!",
  "items": [
    {
      "productName": "Website Development",
      "description": "Custom responsive website",
      "quantity": 1,
      "price": 2500.00,
      "tax": 200.00,
      "discount": 100.00
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "INV-2024-001",
    "customerId": 1,
    "customerName": "Acme Corporation",
    "customerEmail": "billing@acme.com",
    "customerAddress": "123 Business St, City, State 12345",
    "date": "2024-01-20",
    "dueDate": "2024-02-19",
    "status": "draft",
    "paymentMethod": "bank_transfer",
    "subtotal": 2500.00,
    "taxAmount": 200.00,
    "discountAmount": 100.00,
    "totalAmount": 2600.00,
    "paidAmount": 0.00,
    "balanceAmount": 2600.00,
    "notes": "Thank you for your business!",
    "items": [
      {
        "id": 1,
        "productName": "Website Development",
        "description": "Custom responsive website",
        "quantity": 1,
        "price": 2500.00,
        "tax": 200.00,
        "discount": 100.00,
        "total": 2600.00
      }
    ],
    "createdAt": "2024-01-20T12:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z",
    "paidAt": null
  }
}
```

### PUT /invoices/:id
Update invoice
```json
// Request
{
  "invoiceNumber": "INV-2024-001",
  "customerId": 1,
  "customerName": "Acme Corporation",
  "customerEmail": "billing@acme.com",
  "customerAddress": "123 Business St, City, State 12345",
  "date": "2024-01-20",
  "dueDate": "2024-02-20",
  "status": "pending",
  "paymentMethod": "credit_card",
  "notes": "Thank you for your business! Updated terms.",
  "items": [
    {
      "id": 1,
      "productName": "Website Development",
      "description": "Custom responsive website with SEO",
      "quantity": 1,
      "price": 3000.00,
      "tax": 240.00,
      "discount": 100.00
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "INV-2024-001",
    "customerId": 1,
    "customerName": "Acme Corporation",
    "customerEmail": "billing@acme.com",
    "customerAddress": "123 Business St, City, State 12345",
    "date": "2024-01-20",
    "dueDate": "2024-02-20",
    "status": "pending",
    "paymentMethod": "credit_card",
    "subtotal": 3000.00,
    "taxAmount": 240.00,
    "discountAmount": 100.00,
    "totalAmount": 3140.00,
    "paidAmount": 0.00,
    "balanceAmount": 3140.00,
    "notes": "Thank you for your business! Updated terms.",
    "items": [
      {
        "id": 1,
        "productName": "Website Development",
        "description": "Custom responsive website with SEO",
        "quantity": 1,
        "price": 3000.00,
        "tax": 240.00,
        "discount": 100.00,
        "total": 3140.00
      }
    ],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T15:00:00Z",
    "paidAt": null
  }
}
```

### DELETE /invoices/:id
Delete invoice
```json
// Response
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

### POST /invoices/:id/send
Send invoice via email
```json
// Request
{
  "to": "billing@acme.com",
  "cc": ["manager@acme.com"],
  "subject": "Invoice INV-2024-001 from Your Company",
  "message": "Please find attached your invoice. Payment is due within 30 days.",
  "attachPdf": true
}

// Response
{
  "success": true,
  "data": {
    "emailId": "email_123456",
    "sentAt": "2024-01-20T16:00:00Z",
    "recipients": ["billing@acme.com", "manager@acme.com"]
  }
}
```

### POST /invoices/:id/payments
Record payment for invoice
```json
// Request
{
  "amount": 1300.00,
  "method": "bank_transfer",
  "date": "2024-01-25",
  "reference": "TXN-12345",
  "notes": "Partial payment received"
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceId": 1,
    "amount": 1300.00,
    "method": "bank_transfer",
    "date": "2024-01-25",
    "reference": "TXN-12345",
    "notes": "Partial payment received",
    "createdAt": "2024-01-25T10:00:00Z",
    "invoice": {
      "id": 1,
      "totalAmount": 2600.00,
      "paidAmount": 1300.00,
      "balanceAmount": 1300.00,
      "status": "pending"
    }
  }
}
```

### GET /invoices/:id/pdf
Generate and download invoice PDF
```
Response: PDF file download
Content-Type: application/pdf
Content-Disposition: attachment; filename="INV-2024-001.pdf"
```

### POST /invoices/duplicate/:id
Duplicate existing invoice
```json
// Response
{
  "success": true,
  "data": {
    "id": 2,
    "invoiceNumber": "INV-2024-002",
    "customerId": 1,
    "customerName": "Acme Corporation",
    "customerEmail": "billing@acme.com",
    "customerAddress": "123 Business St, City, State 12345",
    "date": "2024-01-21",
    "dueDate": "2024-02-20",
    "status": "draft",
    "paymentMethod": "credit_card",
    "subtotal": 3000.00,
    "taxAmount": 240.00,
    "discountAmount": 100.00,
    "totalAmount": 3140.00,
    "paidAmount": 0.00,
    "balanceAmount": 3140.00,
    "notes": "Thank you for your business! Updated terms.",
    "items": [
      {
        "id": 2,
        "productName": "Website Development",
        "description": "Custom responsive website with SEO",
        "quantity": 1,
        "price": 3000.00,
        "tax": 240.00,
        "discount": 100.00,
        "total": 3140.00
      }
    ],
    "createdAt": "2024-01-21T12:00:00Z",
    "updatedAt": "2024-01-21T12:00:00Z",
    "paidAt": null
  }
}
```

---

## 📊 Dashboard & Analytics Endpoints

### GET /dashboard/stats
Get dashboard statistics
```json
// Response
{
  "success": true,
  "data": {
    "customers": {
      "total": 150,
      "active": 120,
      "new": 15,
      "growth": 12.5
    },
    "opportunities": {
      "total": 45,
      "totalValue": 450000.00,
      "won": 12,
      "wonValue": 125000.00,
      "conversionRate": 26.7
    },
    "tasks": {
      "total": 89,
      "pending": 34,
      "inProgress": 25,
      "completed": 30,
      "overdue": 8
    },
    "invoices": {
      "total": 78,
      "totalAmount": 195000.00,
      "paid": 45,
      "paidAmount": 112500.00,
      "pending": 25,
      "pendingAmount": 62500.00,
      "overdue": 8,
      "overdueAmount": 20000.00
    },
    "revenue": {
      "thisMonth": 25000.00,
      "lastMonth": 22000.00,
      "growth": 13.6,
      "thisYear": 275000.00,
      "lastYear": 245000.00,
      "yearGrowth": 12.2
    }
  }
}
```

### GET /dashboard/charts
Get chart data for dashboard
```
Query Parameters:
- period: string (7d|30d|90d|1y)
- type: string (revenue|customers|opportunities|tasks)
```

```json
// Response
{
  "success": true,
  "data": {
    "revenue": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "datasets": [
        {
          "label": "Revenue",
          "data": [15000, 18000, 22000, 19000, 25000, 28000],
          "backgroundColor": "#3B82F6"
        }
      ]
    },
    "customers": {
      "labels": ["New", "Active", "Inactive"],
      "datasets": [
        {
          "data": [15, 120, 30],
          "backgroundColor": ["#10B981", "#3B82F6", "#EF4444"]
        }
      ]
    },
    "opportunities": {
      "labels": ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
      "datasets": [
        {
          "data": [12, 8, 15, 6, 12, 4],
          "backgroundColor": ["#8B5CF6", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#6B7280"]
        }
      ]
    }
  }
}
```

### GET /dashboard/recent-activities
Get recent activities
```
Query Parameters:
- limit: number (default: 10)
- type: string (all|customer|opportunity|task|invoice)
```

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "customer_created",
      "title": "New customer added",
      "description": "Acme Corporation was added to the system",
      "entityType": "customer",
      "entityId": 1,
      "userId": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "avatar": "https://example.com/avatar1.jpg"
      },
      "createdAt": "2024-01-20T10:00:00Z"
    },
    {
      "id": 2,
      "type": "invoice_paid",
      "title": "Invoice payment received",
      "description": "Payment of $2,600 received for INV-2024-001",
      "entityType": "invoice",
      "entityId": 1,
      "userId": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "avatar": "https://example.com/avatar1.jpg"
      },
      "createdAt": "2024-01-20T09:30:00Z"
    }
  ]
}
```

---

## 🔍 Search & Filter Endpoints

### GET /search
Global search across all entities
```
Query Parameters:
- q: string (search query)
- type: string (all|customers|opportunities|tasks|products|invoices)
- limit: number (default: 20)
```

```json
// Response
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Acme Corporation",
        "email": "contact@acme.com",
        "type": "customer"
      }
    ],
    "opportunities": [
      {
        "id": 1,
        "title": "Website Redesign Project",
        "customer": "Acme Corporation",
        "value": 15000.00,
        "type": "opportunity"
      }
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Follow up with Acme Corp",
        "status": "pending",
        "dueDate": "2024-01-25",
        "type": "task"
      }
    ],
    "products": [
      {
        "id": 1,
        "name": "Website Development Package",
        "price": 2500.00,
        "type": "product"
      }
    ],
    "invoices": [
      {
        "id": 1,
        "invoiceNumber": "INV-2024-001",
        "customer": "Acme Corporation",
        "totalAmount": 2600.00,
        "type": "invoice"
      }
    ],
    "total": 5
  }
}
```

---

## 📁 File Upload Endpoints

### POST /upload/image
Upload image file
```json
// Request (multipart/form-data)
{
  "file": "image.jpg",
  "type": "customer_avatar|product_image|attachment"
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "image.jpg",
    "originalName": "customer-logo.jpg",
    "mimeType": "image/jpeg",
    "size": 245760,
    "url": "https://example.com/uploads/images/image.jpg",
    "thumbnailUrl": "https://example.com/uploads/thumbnails/image.jpg",
    "createdAt": "2024-01-20T12:00:00Z"
  }
}
```

### POST /upload/document
Upload document file
```json
// Request (multipart/form-data)
{
  "file": "document.pdf",
  "type": "contract|proposal|attachment",
  "entityType": "customer|opportunity|task",
  "entityId": 1
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "originalName": "contract.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "url": "https://example.com/uploads/documents/document.pdf",
    "entityType": "customer",
    "entityId": 1,
    "createdAt": "2024-01-20T12:00:00Z"
  }
}
```

### DELETE /upload/:id
Delete uploaded file
```json
// Response
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## 📧 Email & Notification Endpoints

### POST /notifications/send
Send notification
```json
// Request
{
  "type": "email|sms|push",
  "recipients": ["user@example.com"],
  "subject": "Task Reminder",
  "message": "You have a task due tomorrow",
  "data": {
    "taskId": 1,
    "dueDate": "2024-01-25"
  }
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "type": "email",
    "recipients": ["user@example.com"],
    "subject": "Task Reminder",
    "status": "sent",
    "sentAt": "2024-01-20T12:00:00Z"
  }
}
```

### GET /notifications
Get user notifications
```
Query Parameters:
- page: number
- limit: number
- read: boolean
- type: string
```

```json
// Response
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "task_reminder",
        "title": "Task Due Tomorrow",
        "message": "Follow up with Acme Corp is due tomorrow",
        "read": false,
        "data": {
          "taskId": 1,
          "dueDate": "2024-01-25"
        },
        "createdAt": "2024-01-20T12:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### PUT /notifications/:id/read
Mark notification as read
```json
// Response
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## ⚙️ Settings & Configuration Endpoints

### GET /settings
Get system settings
```json
// Response
{
  "success": true,
  "data": {
    "company": {
      "name": "Your Company Name",
      "email": "info@yourcompany.com",
      "phone": "+1-555-0123",
      "address": "123 Company St, City, State 12345",
      "logo": "https://example.com/logo.png",
      "website": "https://yourcompany.com"
    },
    "invoice": {
      "prefix": "INV",
      "nextNumber": 1001,
      "defaultDueDays": 30,
      "taxRate": 8.5,
      "currency": "USD",
      "terms": "Payment is due within 30 days"
    },
    "email": {
      "smtpHost": "smtp.gmail.com",
      "smtpPort": 587,
      "smtpUser": "your-email@gmail.com",
      "smtpSecure": true
    },
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": false,
      "pushEnabled": true,
      "taskReminders": true,
      "invoiceReminders": true
    }
  }
}
```

### PUT /settings
Update system settings
```json
// Request
{
  "company": {
    "name": "Updated Company Name",
    "email": "info@updatedcompany.com",
    "phone": "+1-555-0124",
    "address": "456 New Company St, City, State 12345",
    "website": "https://updatedcompany.com"
  },
  "invoice": {
    "prefix": "INV",
    "nextNumber": 1001,
    "defaultDueDays": 45,
    "taxRate": 10.0,
    "currency": "USD",
    "terms": "Payment is due within 45 days"
  }
}

// Response
{
  "success": true,
  "data": {
    "company": {
      "name": "Updated Company Name",
      "email": "info@updatedcompany.com",
      "phone": "+1-555-0124",
      "address": "456 New Company St, City, State 12345",
      "logo": "https://example.com/logo.png",
      "website": "https://updatedcompany.com"
    },
    "invoice": {
      "prefix": "INV",
      "nextNumber": 1001,
      "defaultDueDays": 45,
      "taxRate": 10.0,
      "currency": "USD",
      "terms": "Payment is due within 45 days"
    }
  }
}
```

---

## 📈 Reports Endpoints

### GET /reports/sales
Get sales report
```
Query Parameters:
- period: string (daily|weekly|monthly|yearly)
- dateFrom: string
- dateTo: string
- groupBy: string (day|week|month|year)
```

```json
// Response
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 125000.00,
      "totalInvoices": 78,
      "averageInvoiceValue": 1602.56,
      "paidInvoices": 45,
      "pendingInvoices": 25,
      "overdueInvoices": 8
    },
    "chartData": [
      {
        "period": "2024-01",
        "revenue": 15000.00,
        "invoices": 12,
        "customers": 8
      },
      {
        "period": "2024-02",
        "revenue": 18000.00,
        "invoices": 15,
        "customers": 10
      }
    ]
  }
}
```

### GET /reports/customers
Get customer report
```json
// Response
{
  "success": true,
  "data": {
    "summary": {
      "totalCustomers": 150,
      "activeCustomers": 120,
      "newCustomers": 15,
      "topCustomers": [
        {
          "id": 1,
          "name": "Acme Corporation",
          "totalValue": 25000.00,
          "invoiceCount": 8
        }
      ]
    },
    "chartData": [
      {
        "period": "2024-01",
        "newCustomers": 8,
        "activeCustomers": 95
      }
    ]
  }
}
```

### GET /reports/export
Export report data
```
Query Parameters:
- type: string (sales|customers|opportunities|tasks|invoices)
- format: string (csv|excel|pdf)
- period: string
- dateFrom: string
- dateTo: string
```

```
Response: File download
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="sales-report-2024.xlsx"
```

---

## 🔧 System Endpoints

### GET /health
Health check endpoint
```json
// Response
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-20T12:00:00Z",
    "version": "1.0.0",
    "database": "connected",
    "redis": "connected",
    "email": "configured"
  }
}
```

### GET /version
Get API version
```json
// Response
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "buildDate": "2024-01-20T00:00:00Z",
    "environment": "production"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}

// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}

// 500 Internal Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

API endpoints are rate limited:
- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute
- **Export endpoints**: 5 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

---

## Pagination

List endpoints support pagination with consistent parameters:
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10, max: 100)
- sort: string (field name)
- order: string (asc|desc, default: desc)
```

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering & Sorting

Most list endpoints support filtering and sorting:

### Common Filters:
- `search`: Text search across relevant fields
- `status`: Filter by status
- `dateFrom` / `dateTo`: Date range filtering
- `createdAt`: Filter by creation date
- `updatedAt`: Filter by last update

### Sorting Options:
- `name`: Sort by name (A-Z)
- `createdAt`: Sort by creation date
- `updatedAt`: Sort by last update
- `value`: Sort by monetary value
- `dueDate`: Sort by due date

### Example:
```
GET /api/customers?search=acme&status=active&sort=createdAt&order=desc&page=1&limit=20
```

---

## Webhooks

The API supports webhooks for real-time notifications:

### Available Events:
- `customer.created`
- `customer.updated`
- `customer.deleted`
- `opportunity.created`
- `opportunity.updated`
- `opportunity.stage_changed`
- `task.created`
- `task.completed`
- `task.overdue`
- `invoice.created`
- `invoice.sent`
- `invoice.paid`
- `invoice.overdue`

### Webhook Payload:
```json
{
  "event": "invoice.paid",
  "timestamp": "2024-01-20T12:00:00Z",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-2024-001",
    "totalAmount": 2600.00,
    "paidAmount": 2600.00,
    "customer": {
      "id": 1,
      "name": "Acme Corporation"
    }
  }
}
```

---

## API Testing

### Postman Collection
A complete Postman collection is available with:
- All endpoints pre-configured
- Environment variables for easy switching
- Example requests and responses
- Authentication setup

### Test Data
Sample data endpoints for development:
- `POST /api/dev/seed` - Populate database with test data
- `DELETE /api/dev/reset` - Clear all test data
- `GET /api/dev/status` - Check development environment status

---

## Implementation Notes

### Technology Stack Recommendations:
- **Backend**: Node.js with Express.js or Fastify
- **Database**: PostgreSQL or MySQL
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 or local storage
- **Email**: SendGrid, Mailgun, or SMTP
- **Caching**: Redis
- **Queue**: Bull Queue or AWS SQS
- **Documentation**: Swagger/OpenAPI

### Security Considerations:
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- API key management
- Data encryption at rest
- Secure file upload handling

### Performance Optimizations:
- Database indexing
- Query optimization
- Caching strategies
- Pagination for large datasets
- Lazy loading for related data
- Background job processing
- CDN for file delivery

This comprehensive API documentation provides all the endpoints needed for a full-featured CRM system. Each endpoint includes detailed request/response examples, error handling, and implementation guidance.
```

Mükemmel! CRM projeniz için kapsamlı bir API dokümantasyonu hazırladım. Bu dokümantasyon şunları içeriyor:

## 🚀 **API Özellikleri:**

### **1. Temel Modüller:**
- **🔐 Authentication**: Login, register, password reset
- **👥 Customers**: CRUD, bulk operations, search
- **🎯 Opportunities**: Pipeline management, stages
- **✅ Tasks**: Task management, time tracking, comments
- **📦 Products**: Inventory, categories, variants
- **🧾 Invoices**: Billing, payments, PDF generation

### **2. Gelişmiş Özellikler:**
- **📊 Dashboard**: Analytics, charts, statistics
- **🔍 Search**: Global search across all entities
- **📁 File Upload**: Images, documents, attachments
- **📧 Notifications**: Email, SMS, push notifications
- **⚙️ Settings**: System configuration
- **📈 Reports**: Sales, customer, export functionality

### **3. Teknik Özellikler:**
- **Rate Limiting**: Endpoint bazlı limit kontrolü
- **Pagination**: Tutarlı sayfalama sistemi
- **Filtering & Sorting**: Gelişmiş filtreleme
- **Webhooks**: Real-time event notifications
- **Error Handling**: Standart hata yanıtları
- **Security**: JWT, validation, sanitization

### **4. Geliştirici Dostu:**
- **Postman Collection**: Hazır test koleksiyonu
- **Test Data**: Development için örnek veri
- **Documentation**: Swagger/OpenAPI desteği
- **Examples**: Her endpoint için örnek request/response

Bu API dokümantasyonu ile backend geliştirmeye başlayabilirsiniz! 🎯
