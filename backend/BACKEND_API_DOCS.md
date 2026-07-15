# WardTech Backend — Architecture & API Documentation

> **Backend Member 1** modules: Authentication, User Profile, Citizen Services, Complaints, Feedback, and Notifications.  
> Base URL: `http://localhost:9001`  
> Stack: Node.js · Express.js · MongoDB (Mongoose) · JWT · Yup · BcryptJS · Multer · Nodemailer

---

## Table of Contents

1. [What Was Implemented](#1-what-was-implemented)
2. [Project Architecture](#2-project-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Tech Stack & Environment](#4-tech-stack--environment)
5. [Getting Started](#5-getting-started)
6. [Authentication & Roles](#6-authentication--roles)
7. [Data Models](#7-data-models)
8. [API Reference](#8-api-reference)
9. [Common Error Responses](#9-common-error-responses)
10. [Ownership Notes (Member 2)](#10-ownership-notes-member-2)

---

## 1. What Was Implemented

| Area | Deliverables |
|------|----------------|
| **Config** | MongoDB connection (`config/db.js`), `.env` template |
| **Models** | `User`, `Application`, `Complaint`, `Feedback`, `Notification` |
| **Middleware** | Yup validator, JWT protect/authorize, Multer upload |
| **Validation schemas** | Register, login, password reset, profile, applications, complaints, feedback |
| **Auth** | Citizen register/login, **separate employee login**, **separate admin login**, logout (JWT blacklist), forgot/reset password (Nodemailer) |
| **Profile** | View/edit profile, change password, upload profile picture |
| **Citizen Services** | Unified application collection for 6 certificate types, tracking IDs, soft delete |
| **Complaints** | Submit, list, view, update, soft-delete |
| **Feedback** | Submit, list, view, soft-delete |
| **Notifications** | List, mark one as read, mark all as read |
| **Server** | CORS, JSON body, static `/uploads`, health route, 404 & global error handlers |
| **Seed script** | `scripts/seedStaff.js` for employee/admin test accounts |

---

## 2. Project Architecture

```
┌─────────────┐     HTTP/JSON      ┌──────────────────────────────────────┐
│   Frontend  │ ─────────────────► │           Express Server             │
│  (React…)   │ ◄───────────────── │              server.js               │
└─────────────┘     JWT Bearer     └───────────────┬──────────────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    │                              │                              │
                    ▼                              ▼                              ▼
            ┌───────────────┐            ┌─────────────────┐            ┌─────────────────┐
            │    Routes     │            │   Middleware    │            │  Static files   │
            │  /api/auth    │──►protect  │  validate(Yup)  │            │   /uploads/*    │
            │  /api/citizen │──►authorize│  auth (JWT)     │            └─────────────────┘
            │  /api/services│──►upload   │  multer         │
            │  /api/…       │            └────────┬────────┘
            └───────┬───────┘                     │
                    │                             ▼
                    ▼                    ┌─────────────────┐
            ┌───────────────┐            │  Controllers    │
            │   Controllers │◄───────────│  business logic │
            └───────┬───────┘            └────────┬────────┘
                    │                             │
                    ▼                             ▼
            ┌───────────────┐            ┌─────────────────┐
            │    Models     │───────────►│    MongoDB      │
            │   (Mongoose)  │            │   wardtech DB   │
            └───────────────┘            └─────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Nodemailer    │  (password reset emails)
            └───────────────┘
```

### Request flow

1. Client sends request → Express router  
2. Optional: Multer (file uploads) → Yup `validate` → `protect` (JWT) → `authorize` (role)  
3. Controller runs business logic → Mongoose model → MongoDB  
4. JSON response with standard shape: `{ success, message?, data?, errors? }`

---

## 3. Folder Structure

```
backend/
├── .env                          # Environment variables (not committed)
├── .gitignore
├── package.json                  # "type": "module", scripts
├── server.js                     # App entry — middleware + route mounting
├── config/
│   └── db.js                     # MongoDB connection
├── controllers/
│   ├── authController.js         # Register, role logins, logout, password reset
│   ├── userController.js         # Profile CRUD, password, picture
│   ├── serviceController.js      # Citizen service applications
│   ├── complaintController.js
│   ├── feedbackController.js
│   └── notificationController.js
├── middleware/
│   ├── validate.js               # Reusable Yup wrapper
│   ├── schemas.js                # All Yup schemas
│   ├── authMiddleware.js         # JWT protect, authorize, token blacklist
│   └── uploadMiddleware.js       # Multer (images + PDF → /uploads)
├── models/
│   ├── User.js
│   ├── Application.js
│   ├── Complaint.js
│   ├── Feedback.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── citizenRoutes.js
│   ├── serviceRoutes.js
│   ├── complaintRoutes.js
│   ├── feedbackRoutes.js
│   └── notificationRoutes.js
├── scripts/
│   └── seedStaff.js              # Seed employee + admin users
├── utils/
│   └── emailService.js           # Nodemailer password-reset template
└── uploads/                      # Local file storage
```

---

## 4. Tech Stack & Environment

| Concern | Library / approach |
|---------|-------------------|
| Database | MongoDB via Mongoose |
| Validation | Yup |
| Passwords | BcryptJS (pre-save hook, salt rounds 12) |
| Auth | JWT (`Authorization: Bearer <token>`) |
| Uploads | Multer → `/uploads` (max 5 MB, images + PDF) |
| Email | Nodemailer (mocks to console if SMTP not configured) |

### `.env` variables

```env
PORT=9001
MONGODB_URI=mongodb://127.0.0.1:27017/wardtech
JWT_SECRET=wardtech_jwt_secret_change_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=WardTech <noreply@wardtech.local>
CLIENT_URL=http://localhost:3000
```

---

## 5. Getting Started

```bash
cd backend
npm install
# Ensure MongoDB is running, then:
npm run dev          # nodemon
# or
npm start            # node server.js

# Optional — create employee & admin test accounts:
node scripts/seedStaff.js
```

**Seeded staff (after seed script):**

| Role | Email | Password |
|------|-------|----------|
| Employee | `employee@wardtech.local` | `Employee@123` |
| Admin | `admin@wardtech.local` | `Admin@1234` |

**Health check:** `GET /api/health`

---

## 6. Authentication & Roles

### Roles

| Role | Self-register? | Login endpoint | Notes |
|------|----------------|----------------|-------|
| `citizen` | Yes | `POST /api/auth/login` | Default role on register |
| `employee` | No | `POST /api/auth/employee/login` | Provisioned via seed / Member 2 |
| `admin` | No | `POST /api/auth/admin/login` | Provisioned via seed / Member 2 |
| `superadmin` | No | — | **Owned by Backend Member 2** |

### Auth header (protected routes)

```http
Authorization: Bearer <jwt_token>
```

JWT payload includes `{ id, role }` and expires per `JWT_EXPIRE` (default 7d).  
Logout adds the current token to an in-memory blacklist.

### Password rules (register / reset / change)

- Min 8 characters  
- At least one lowercase, one uppercase, one number, one special character  

---

## 7. Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | unique, indexed |
| password | String | hashed, `select: false` |
| profilePicture | String | path e.g. `/uploads/...` |
| role | Enum | `citizen` \| `employee` \| `admin` \| `superadmin` |
| resetPasswordToken | String | hashed |
| resetPasswordExpire | Date | |
| isActive | Boolean | default `true` |
| timestamps | createdAt, updatedAt | |

### Application (unified citizen services)

| Field | Type | Notes |
|-------|------|-------|
| citizenId | ObjectId → User | |
| applicationType | Enum | See list below |
| trackingId | String | unique, e.g. `WARD-2026-00001` |
| status | Enum | `Pending`, `Approved`, `Rejected` |
| details | Mixed | Dynamic form data |
| attachments | [String] | File paths |
| remarks | String | |
| isDeleted | Boolean | soft delete |

**Application types:**  
`Birth Certificate`, `Death Certificate`, `Marriage Certificate`, `Migration Certificate`, `Recommendation Letter`, `Character Certificate`

### Complaint

| Field | Type | Notes |
|-------|------|-------|
| citizenId | ObjectId → User | |
| title, description | String | |
| category | Enum | Infrastructure, Sanitation, Water Supply, Electricity, Public Safety, Administrative, Other |
| status | Enum | `Pending`, `In-Progress`, `Resolved` |
| attachments | [String] | |
| isDeleted | Boolean | |

### Feedback

| Field | Type | Notes |
|-------|------|-------|
| citizenId | ObjectId → User | |
| subject | String | |
| rating | Number | 1–5 |
| message | String | |
| isDeleted | Boolean | |

### Notification

| Field | Type | Notes |
|-------|------|-------|
| citizenId | ObjectId → User | |
| title, message | String | |
| isRead | Boolean | default `false` |

---

## 8. API Reference

All successful responses follow:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { }
}
```

Unless noted, **Content-Type:** `application/json`.  
Upload endpoints use `multipart/form-data`.

---

### 8.1 Auth — `/api/auth`

#### Register (Citizen)

| | |
|--|--|
| **Method / URL** | `POST /api/auth/register` |
| **Access** | Public |
| **Payload** | |

```json
{
  "name": "Ram Sharma",
  "email": "ram@example.com",
  "password": "Citizen@123"
}
```

**Success `201`:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "Ram Sharma",
      "email": "ram@example.com",
      "role": "citizen",
      "profilePicture": ""
    }
  }
}
```

**Error `400`:** Email already exists / validation failed.

---

#### Citizen Login

| | |
|--|--|
| **Method / URL** | `POST /api/auth/login` |
| **Access** | Public (citizen role only) |
| **Payload** | |

```json
{
  "email": "ram@example.com",
  "password": "Citizen@123"
}
```

**Success `200`:**

```json
{
  "success": true,
  "message": "Citizen login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "Ram Sharma",
      "email": "ram@example.com",
      "role": "citizen",
      "profilePicture": ""
    }
  }
}
```

**Error `401`:** Invalid credentials · **`403`:** Wrong role / deactivated account.

---

#### Employee Login

| | |
|--|--|
| **Method / URL** | `POST /api/auth/employee/login` |
| **Access** | Public (employee role only) |
| **Payload** | Same as login: `{ "email", "password" }` |

**Success `200`:** Same shape as citizen login; `message`: `"Employee login successful"`, `role`: `"employee"`.

---

#### Admin Login

| | |
|--|--|
| **Method / URL** | `POST /api/auth/admin/login` |
| **Access** | Public (admin role only) |
| **Payload** | `{ "email", "password" }` |

**Success `200`:** Same shape; `message`: `"Admin login successful"`, `role`: `"admin"`.

---

#### Logout

| | |
|--|--|
| **Method / URL** | `POST /api/auth/logout` |
| **Access** | Private (Bearer token) |
| **Payload** | None |

**Success `200`:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Forgot Password

| | |
|--|--|
| **Method / URL** | `POST /api/auth/forgot-password` |
| **Access** | Public |
| **Payload** | |

```json
{
  "email": "ram@example.com"
}
```

**Success `200`:**

```json
{
  "success": true,
  "message": "If an account with that email exists, a reset link has been sent.",
  "resetToken": "<raw-token>"
}
```

> `resetToken` is only included when `NODE_ENV !== "production"` (for testing).  
> Email is mocked to console if SMTP credentials are placeholders.

---

#### Reset Password

| | |
|--|--|
| **Method / URL** | `PUT /api/auth/reset-password/:token` |
| **Access** | Public |
| **URL param** | `token` — raw token from email / forgot response |
| **Payload** | |

```json
{
  "password": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

**Success `200`:**

```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "Ram Sharma",
      "email": "ram@example.com",
      "role": "citizen"
    }
  }
}
```

**Error `400`:** Invalid or expired reset token.

---

### 8.2 Citizen Profile — `/api/citizen`

All routes require **Bearer JWT**. Allowed roles: `citizen`, `employee`, `admin`.

#### View Profile

| | |
|--|--|
| **Method / URL** | `GET /api/citizen/profile` |
| **Payload** | None |

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Ram Sharma",
      "email": "ram@example.com",
      "role": "citizen",
      "profilePicture": "",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

#### Edit Profile

| | |
|--|--|
| **Method / URL** | `PUT /api/citizen/profile` |
| **Payload** | |

```json
{
  "name": "Ram Bahadur Sharma",
  "email": "ram.new@example.com"
}
```

(Both fields optional; at least one typically sent.)

**Success `200`:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { "user": { /* updated user */ } }
}
```

---

#### Change Password

| | |
|--|--|
| **Method / URL** | `PUT /api/citizen/change-password` |
| **Payload** | |

```json
{
  "oldPassword": "Citizen@123",
  "newPassword": "Citizen@456",
  "confirmPassword": "Citizen@456"
}
```

**Success `200`:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error `400`:** Current password incorrect / validation failed.

---

#### Upload Profile Picture

| | |
|--|--|
| **Method / URL** | `PUT /api/citizen/profile-picture` |
| **Content-Type** | `multipart/form-data` |
| **Form field** | `profilePicture` (file: image) |

**Success `200`:**

```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "data": {
    "profilePicture": "/uploads/photo-1712345678901.jpg",
    "user": { /* updated user */ }
  }
}
```

Public file URL example: `http://localhost:9001/uploads/photo-1712345678901.jpg`

---

### 8.3 Citizen Services — `/api/services`

All routes require **Bearer JWT** + role **`citizen`**.

#### Submit Application

| | |
|--|--|
| **Method / URL** | `POST /api/services/applications` |
| **Content-Type** | `application/json` or `multipart/form-data` |
| **Payload (JSON)** | |

```json
{
  "applicationType": "Birth Certificate",
  "details": {
    "childName": "Sita Sharma",
    "dateOfBirth": "2024-01-15",
    "placeOfBirth": "Kathmandu",
    "fatherName": "Ram Sharma",
    "motherName": "Gita Sharma"
  }
}
```

**Multipart:** fields `applicationType`, `details` (JSON string), optional files field `attachments` (max 5).

**Success `201`:**

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "...",
      "citizenId": "...",
      "applicationType": "Birth Certificate",
      "trackingId": "WARD-2026-00001",
      "status": "Pending",
      "details": { /* ... */ },
      "attachments": [],
      "isDeleted": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

Also creates a notification for the citizen.

---

#### Save Draft Application

| | |
|--|--|
| **Method / URL** | `POST /api/services/applications/draft` |
| **Payload** | Same as submit |

**Success `201`:** Same shape; `message`: `"Application saved successfully"`; `remarks`: `"Draft / saved for later"`.

---

#### List My Applications

| | |
|--|--|
| **Method / URL** | `GET /api/services/my-applications` |
| **Query (optional)** | `?status=Pending` · `?applicationType=Birth Certificate` |

**Success `200`:**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "applications": [ /* ... */ ]
  }
}
```

---

#### Track by Tracking ID

| | |
|--|--|
| **Method / URL** | `GET /api/services/track/:trackingId` |
| **Example** | `GET /api/services/track/WARD-2026-00001` |

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "application": {
      "trackingId": "WARD-2026-00001",
      "status": "Pending",
      "citizenId": { "name": "Ram Sharma", "email": "ram@example.com" },
      /* ... */
    }
  }
}
```

**Error `403`:** Citizen trying to track someone else’s application.  
**Error `404`:** Not found.

---

#### Get Application by Mongo `_id`

| | |
|--|--|
| **Method / URL** | `GET /api/services/applications/:id` |

**Success `200`:** `{ "success": true, "data": { "application": { ... } } }`

---

#### Edit Application

| | |
|--|--|
| **Method / URL** | `PUT /api/services/applications/:id` |
| **Constraint** | Only `Pending` applications |
| **Payload** | |

```json
{
  "details": {
    "childName": "Sita Sharma Updated",
    "dateOfBirth": "2024-01-15"
  },
  "applicationType": "Birth Certificate"
}
```

Optional multipart `attachments` to append files.

**Success `200`:** `{ "success": true, "message": "Application updated successfully", "data": { "application": { ... } } }`

---

#### Delete Application (soft)

| | |
|--|--|
| **Method / URL** | `DELETE /api/services/applications/:id` |
| **Constraint** | Cannot delete `Approved` applications |

**Success `200`:**

```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### 8.4 Complaints — `/api/complaints`

All routes require **Bearer JWT** + role **`citizen`**.

#### Submit Complaint

| | |
|--|--|
| **Method / URL** | `POST /api/complaints` |
| **Payload (JSON)** | |

```json
{
  "title": "Broken street light",
  "description": "The street light near ward office has been broken for two weeks.",
  "category": "Infrastructure"
}
```

**Multipart:** same fields + optional `attachments` files.

**Categories:** `Infrastructure` | `Sanitation` | `Water Supply` | `Electricity` | `Public Safety` | `Administrative` | `Other`

**Success `201`:**

```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "complaint": {
      "_id": "...",
      "citizenId": "...",
      "title": "Broken street light",
      "description": "...",
      "category": "Infrastructure",
      "status": "Pending",
      "attachments": [],
      "isDeleted": false,
      "createdAt": "..."
    }
  }
}
```

---

#### List My Complaints

| | |
|--|--|
| **Method / URL** | `GET /api/complaints` |
| **Query** | `?status=Pending` (optional) |

**Success `200`:**

```json
{
  "success": true,
  "count": 1,
  "data": { "complaints": [ /* ... */ ] }
}
```

---

#### Get Complaint by ID

| | |
|--|--|
| **Method / URL** | `GET /api/complaints/:id` |

**Success `200`:** `{ "success": true, "data": { "complaint": { ... } } }`

---

#### Update Complaint

| | |
|--|--|
| **Method / URL** | `PUT /api/complaints/:id` |
| **Constraint** | Only `Pending` |
| **Payload** | Any of `title`, `description`, `category` (+ optional attachments) |

**Success `200`:** `{ "success": true, "message": "Complaint updated successfully", "data": { "complaint": { ... } } }`

---

#### Delete Complaint (soft)

| | |
|--|--|
| **Method / URL** | `DELETE /api/complaints/:id` |

**Success `200`:** `{ "success": true, "message": "Complaint deleted successfully" }`

---

### 8.5 Feedback — `/api/feedback`

All routes require **Bearer JWT** + role **`citizen`**.

#### Submit Feedback

| | |
|--|--|
| **Method / URL** | `POST /api/feedback` |
| **Payload** | |

```json
{
  "subject": "Service experience",
  "rating": 5,
  "message": "Very smooth process for birth certificate application."
}
```

**Success `201`:**

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "feedback": {
      "_id": "...",
      "citizenId": "...",
      "subject": "Service experience",
      "rating": 5,
      "message": "...",
      "isDeleted": false,
      "createdAt": "..."
    }
  }
}
```

---

#### List My Feedback

| | |
|--|--|
| **Method / URL** | `GET /api/feedback` |

**Success `200`:**

```json
{
  "success": true,
  "count": 1,
  "data": { "feedbacks": [ /* ... */ ] }
}
```

---

#### Get Feedback by ID

| | |
|--|--|
| **Method / URL** | `GET /api/feedback/:id` |

**Success `200`:** `{ "success": true, "data": { "feedback": { ... } } }`

---

#### Delete Feedback (soft)

| | |
|--|--|
| **Method / URL** | `DELETE /api/feedback/:id` |

**Success `200`:** `{ "success": true, "message": "Feedback deleted successfully" }`

---

### 8.6 Notifications — `/api/notifications`

All routes require **Bearer JWT**. Roles: `citizen`, `employee`, `admin`.

#### List Notifications

| | |
|--|--|
| **Method / URL** | `GET /api/notifications` |
| **Query** | `?isRead=false` (optional) |

**Success `200`:**

```json
{
  "success": true,
  "count": 2,
  "unreadCount": 1,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "citizenId": "...",
        "title": "Application Submitted",
        "message": "Your Birth Certificate application (WARD-2026-00001) has been submitted...",
        "isRead": false,
        "createdAt": "..."
      }
    ]
  }
}
```

---

#### Mark One as Read

| | |
|--|--|
| **Method / URL** | `PUT /api/notifications/:id/read` |

**Success `200`:**

```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notification": { /* isRead: true */ }
  }
}
```

---

#### Mark All as Read

| | |
|--|--|
| **Method / URL** | `PUT /api/notifications/read-all` |

**Success `200`:**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": { "modifiedCount": 3 }
}
```

---

### 8.7 Health & Root

| Method / URL | Access | Response |
|--------------|--------|----------|
| `GET /` | Public | `{ "success": true, "message": "Welcome to WardTech Digital Ward API", "version": "1.0.0" }` |
| `GET /api/health` | Public | `{ "success": true, "message": "WardTech API is running", "timestamp": "..." }` |

---

## 9. Common Error Responses

### Validation `400`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "password", "message": "Password must contain at least one uppercase letter" }
  ]
}
```

### Unauthorized `401`

```json
{
  "success": false,
  "message": "Not authorized. No token provided."
}
```

### Forbidden `403`

```json
{
  "success": false,
  "message": "Access denied. Requires one of: citizen"
}
```

### Not Found `404`

```json
{
  "success": false,
  "message": "Application not found"
}
```

### Server Error `500`

```json
{
  "success": false,
  "message": "Server error while submitting application"
}
```

---

## 10. Ownership Notes (Member 2)

Backend Member 1 does **not** implement:

- Superadmin dashboard / monitoring APIs  
- Employee/admin workflows for approving/rejecting applications or updating complaint status  
- Staff user-management UI/API beyond seed + separate login endpoints  

The `User.role` enum already includes `"superadmin"` for Member 2 integration. Application `status` and complaint `status` fields are ready for staff-side updates.

---

## Quick Endpoint Index

| Method | URL | Access |
|--------|-----|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public (citizen) |
| POST | `/api/auth/employee/login` | Public (employee) |
| POST | `/api/auth/admin/login` | Public (admin) |
| POST | `/api/auth/forgot-password` | Public |
| PUT | `/api/auth/reset-password/:token` | Public |
| POST | `/api/auth/logout` | Private |
| GET | `/api/citizen/profile` | Private |
| PUT | `/api/citizen/profile` | Private |
| PUT | `/api/citizen/change-password` | Private |
| PUT | `/api/citizen/profile-picture` | Private |
| POST | `/api/services/applications` | Private (citizen) |
| POST | `/api/services/applications/draft` | Private (citizen) |
| GET | `/api/services/my-applications` | Private (citizen) |
| GET | `/api/services/track/:trackingId` | Private (citizen) |
| GET | `/api/services/applications/:id` | Private (citizen) |
| PUT | `/api/services/applications/:id` | Private (citizen) |
| DELETE | `/api/services/applications/:id` | Private (citizen) |
| POST | `/api/complaints` | Private (citizen) |
| GET | `/api/complaints` | Private (citizen) |
| GET | `/api/complaints/:id` | Private (citizen) |
| PUT | `/api/complaints/:id` | Private (citizen) |
| DELETE | `/api/complaints/:id` | Private (citizen) |
| POST | `/api/feedback` | Private (citizen) |
| GET | `/api/feedback` | Private (citizen) |
| GET | `/api/feedback/:id` | Private (citizen) |
| DELETE | `/api/feedback/:id` | Private (citizen) |
| GET | `/api/notifications` | Private |
| PUT | `/api/notifications/:id/read` | Private |
| PUT | `/api/notifications/read-all` | Private |
| GET | `/api/health` | Public |

---

*Document generated for WardTech Backend Member 1 — Authentication, Profile, Services, Complaints, Feedback & Notifications.*
