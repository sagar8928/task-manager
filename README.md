# TaskManager — MERN Stack

A full-stack Task Management System built with the MERN stack. Supports JWT-based authentication, personal and assigned tasks, and role-based update permissions.

---

## Live Demo

> **Deployed App:** `https://your-deployed-app.vercel.app`  
> **GitHub Repo:** `https://github.com/sagar8928/task-manager` 

---

## Features

- User registration and login with JWT (stored in HTTP-only cookies)
- Create personal tasks or assign tasks to other users
- Role-based update rules:
  - Personal task creator can edit all fields
  - Assigned task assignee can only update status
  - Assigned task assigner can only update due date
- Delete tasks (creator only)
- Protected routes — users only see their own relevant tasks

---

## Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React.js (Vite)                  |
| Backend  | Node.js, Express.js              |
| Database | MongoDB Atlas, Mongoose          |
| Auth     | JWT, bcryptjs, HTTP-only cookies |
| Styling  | Plain CSS / Inline styles        |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account 
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/sagar8928/task-manager.git
cd task-manager
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

---

## API Endpoints

### Auth

| Method | Endpoint             | Description                | 
| ------ | -------------------- | -------------------------- | 
| POST   | `/api/auth/register` | Register new user          |
| POST   | `/api/auth/login`    | Login user                 | 
| POST   | `/api/auth/logout`   | Logout user                | 
| GET    | `/api/auth/profile`  | Get logged-in user profile | 

### Tasks

| Method | Endpoint         | Description                      | Auth required |
| ------ | ---------------- | -------------------------------- | ------------- |
| GET    | `/api/tasks`     | Get all tasks for logged-in user | Yes           |
| POST   | `/api/tasks`     | Create a new task                | Yes           |
| PUT    | `/api/tasks/:id` | Update a task (role-based)       | Yes           |
| DELETE | `/api/tasks/:id` | Delete a task (creator only)     | Yes           |

---

## Role-Based Permissions

| Task Type | Who                | Can Edit                             |
| --------- | ------------------ | ------------------------------------ |
| Personal  | Creator            | Title, Description, Status, Due Date |
| Assigned  | Assignee           | Status only                          |
| Assigned  | Assigner (Creator) | Due Date only                        |

---

## Sample User Credentials

Use these credentials on the deployed app to test the system:

**User 1 (Assigner)**

```
Email:    sagar@gmail.com
Password: sagar1234
```

**User 2 (Assignee)**

```
Email:    pritesh@gmail.com
Password: pritesh1234
```

**User 3 (Assignee)**

```
Email:    evan@gmail.com
Password: evan1234
```

> To test assigned task flow: log in as `sagar@gmail.com`, create a task and assign it to can use name `pritesh` or `evan` or you can also use email to `pritesh@gmail.com` . Then log in as Pritesh to update the status.

---

## Environment Variables Reference

| Variable     | Description                                 |
| ------------ | ------------------------------------------- |
| `PORT`       | Port for the Express server (default: 5000) |
| `MONGO_URI`  | MongoDB connection string                   |
| `JWT_SECRET` | Secret key used to sign JWT tokens          |

---

## Known Limitations

- Email is validated by format (regex) on registration
- Assign to field accepts name or email (must match exactly as stored in DB)

---

## Author

Built by Sagar Dhebe as part of a MERN stack assignment.
