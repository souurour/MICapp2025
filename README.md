# MIC Service Laser - Manufacturing Management System

A comprehensive manufacturing management system with machine monitoring, maintenance tracking, alerts, and predictive analytics.

## Project Overview

This application consists of two main parts:

1. **Frontend**: React application with TypeScript, Tailwind CSS, and Shadcn UI components
2. **Backend**: Node.js/Express API with MongoDB database

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Setup Instructions

#### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Run the setup script:

   ```
   chmod +x setup.sh
   ./setup.sh
   ```

   This will:

   - Install dependencies
   - Create a .env file
   - Set up the uploads directory
   - Optionally seed the database with initial data

3. Start the backend server:
   ```
   npm run dev
   ```
   The server will run at http://localhost:5000

#### Frontend Setup

1. In the project root directory, create a `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_ADMIN_CODE=ADMIN2025
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will run at http://localhost:5173

## Test Users

After seeding the database, you can use these test accounts:

| Role       | Email             | Password  |
| ---------- | ----------------- | --------- |
| Admin      | admin@example.com | Admin123! |
| Technician | tech@example.com  | Tech123!  |
| User       | user@example.com  | User123!  |

## Features

- **User Management**: Admin can create and manage user accounts with different roles
- **Machine Monitoring**: Track machine status, metrics, and performance
- **Alerts**: Create and manage alerts for machine issues
- **Maintenance**: Schedule and track maintenance activities
- **Reports**: Generate and export reports in different formats
- **Predictive Analytics**: AI-powered predictions for maintenance needs

## Project Structure

- `/backend`: Server-side code with Express and MongoDB

  - `/controllers`: API endpoint controllers
  - `/models`: Mongoose data models
  - `/routes`: API routes
  - `/middleware`: Express middleware
  - `/config`: Configuration files

- `/src`: Frontend React application
  - `/components`: Reusable UI components
  - `/pages`: Application page components
  - `/context`: React context providers
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and services
  - `/types`: TypeScript type definitions

## Environment Variables

### Backend (.env)

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: JWT token expiration time

### Frontend (.env)

- `VITE_API_URL`: Backend API URL
- `VITE_ADMIN_CODE`: Admin registration code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
