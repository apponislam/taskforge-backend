# TaskForge Backend

RESTful API for TaskForge - a project and task collaboration system, built with TypeScript, Express, and MongoDB.

## Features

- ✅ **User Authentication** - JWT-based authentication and authorization
- ✅ **Role-based Access Control** - Admin, Project Manager, Team Member
- ✅ **Project Management** - Full CRUD operations for projects
- ✅ **Task Management** - Full CRUD with validation
- ✅ **Activity Log** - Automatic activity tracking on all actions
- ✅ **Dashboard Analytics** - Get overview statistics
- ✅ **Robust Validation** - Zod schema validations
- ✅ **Error Handling** - Centralized error handling middleware

## Live Demo

- **Backend**: https://taskforge-backend-chi.vercel.app/
- **Frontend**: https://taskforge-frontend-alpha.vercel.app/

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe code
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Zod** - Schema validation
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
Create a `.env` file in the root directory (see `.env.example`)
```env
# Node Environment
NODE_ENV=development

# Server Port
PORT=5333

# MongoDB
MONGODB_URL=mongodb://localhost:27017/taskforge

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_ACCESS_EXPIRE=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=7d

# Super Admin
SUPERADMINEMAIL=admin@example.com
SUPERADMINPASSWORD=admin123
```

3. Run the server in development mode
```bash
npm run dev
```

4. API is now running at http://localhost:5333

## Demo Credentials

| Role             | Email                | Password |
|------------------|----------------------|----------|
| Admin            | admin@demo.com       | 123456   |
| Project Manager  | manager@demo.com     | 123456   |
| Team Member      | member@demo.com      | 123456   |

## API Endpoints

### Auth
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/users` - Get all users
- `POST /api/v1/auth/seed-demo` - Seed demo users (optional)

### Projects
- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create new project
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create new task
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Activity
- `GET /api/v1/activity` - Get all activity logs

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start development server                 |
| `npm run build` | Compile TypeScript                       |
| `npm start`     | Start production server                  |

## Deployment

### Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel Dashboard
3. Deploy!

The project already includes a `vercel.json` config file.

## Project Structure

```
taskforge-backend/
├── public/                 # Static files
├── src/
│   ├── app/
│   │   ├── config/         # Configuration
│   │   ├── errors/         # Error handlers
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── middlewares/    # Middlewares
│   │   ├── modules/        # API modules
│   │   ├── routes/         # Main router
│   │   ├── types/          # Global types
│   │   └── utils/          # Utility functions
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── .env.example            # Example environment variables
└── vercel.json             # Vercel configuration
```

## License

MIT
