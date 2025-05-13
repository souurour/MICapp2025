# MIC Service Laser Backend

This is the backend API for the MIC Service Laser manufacturing platform. It provides the necessary endpoints for managing users, machines, alerts, maintenance, reports, and feedback.

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/micservicelaser
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### Seeding the Database

To populate the database with sample data:

```bash
node utils/seeder -i
```

To clear all data:

```bash
node utils/seeder -d
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/admin-register` - Admin only: Register a new user with any role

### User Management Endpoints (Admin Only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Machine Endpoints

- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get machine by ID
- `POST /api/machines` - Create new machine (Admin/Technician)
- `PUT /api/machines/:id` - Update machine (Admin/Technician)
- `PUT /api/machines/:id/status` - Update machine status (Admin/Technician)
- `PUT /api/machines/:id/metrics` - Update machine metrics (Admin/Technician)
- `DELETE /api/machines/:id` - Delete machine (Admin)

### Alert Endpoints

- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `PUT /api/alerts/:id/assign` - Assign alert to self (Admin/Technician)
- `DELETE /api/alerts/:id` - Delete alert (Admin)

### Maintenance Endpoints

- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:id` - Get maintenance by ID
- `POST /api/maintenance` - Create maintenance record (Admin/Technician)
- `PUT /api/maintenance/:id` - Update maintenance record (Admin/Technician)
- `PUT /api/maintenance/:id/complete` - Mark maintenance as complete (Admin/Technician)
- `DELETE /api/maintenance/:id` - Delete maintenance record (Admin)

### Feedback Endpoints

- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback/:id` - Update feedback status (Admin)
- `DELETE /api/feedback/:id` - Delete feedback (Admin)

### Report Endpoints (Admin Only)

- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Generate new report
- `DELETE /api/reports/:id` - Delete report

## Authentication and Authorization

The API uses JWT-based authentication. Most endpoints require authentication, and some are restricted to specific user roles:

- **Public:** Login and Register endpoints
- **Any authenticated user:** View own profile, read machines, submit alerts/feedback
- **Technicians:** Manage maintenance, update machine status, handle alerts
- **Admins:** Full access to all endpoints and resources

## Models

- **User:** Authentication and staff management
- **Machine:** Manufacturing equipment with monitoring metrics
- **Alert:** Issue reporting and tracking system
- **Maintenance:** Scheduled and ad-hoc maintenance tasks
- **Feedback:** User suggestions and issue reports
- **Report:** Generated analytics and exports

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

Error responses include a message field with details about the error.

## Security Measures

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Environment variable configuration
