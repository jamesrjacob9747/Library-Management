# 📚 Library Management System

A full-stack Library Management System built with **Node.js + Express**, **PostgreSQL**, and **React**.

---

## 🗂 Project Structure

```
library-management/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express entry point
│   │   ├── config/database.js      # Sequelize + PostgreSQL config
│   │   ├── middleware/
│   │   │   ├── auth.js             # API Key authentication
│   │   │   └── errorHandler.js     # Global error handler
│   │   ├── models/
│   │   │   ├── Member.js
│   │   │   ├── Book.js
│   │   │   └── Issuance.js
│   │   ├── controllers/
│   │   │   ├── memberController.js
│   │   │   ├── bookController.js
│   │   │   ├── issuanceController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── member.js
│   │   │   ├── book.js
│   │   │   ├── issuance.js
│   │   │   └── analytics.js
│   │   ├── utils/pagination.js
│   │   └── seeds/run.js            # Seed script (50 members, 100 books, 200+ issuances)
│   ├── queries.sql                 # Standalone SQL analytics queries
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── pages/Dashboard.jsx     # Pending returns dashboard
│   │   └── services/api.js         # Axios instance with API key
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── package.json                    # Root monorepo scripts
└── .gitignore
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- PostgreSQL (running locally on port 5432)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd library-management
npm run install:all
```

### 3. Set Up Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and API key
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Set VITE_API_KEY to match your backend API_KEY
```

### 4. Create the Database

```bash
# In PostgreSQL:
CREATE DATABASE library_management;
```

### 5. Seed the Database

```bash
npm run seed
# Inserts 50 members, 100 books, 200+ issuances
```

### 6. Run the App

```bash
# From root — starts both backend and frontend
npm run dev

# Or individually:
npm run dev:backend    # http://localhost:3001
npm run dev:frontend   # http://localhost:5173
```

---

## 🔑 Authentication

All API calls require the `X-API-Key` header:

```
X-API-Key: your-secret-api-key-here
```

Missing or invalid key returns `401 Unauthorized`.

---

## 📡 API Endpoints

Base URL: `http://localhost:3001/api`

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/member` | List all members (paginated, ?search=) |
| GET | `/member/:id` | Get member by ID |
| POST | `/member` | Create member |
| PUT | `/member/:id` | Update member |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/book` | List all books (paginated, ?search=) |
| GET | `/book/:id` | Get book by ID |
| POST | `/book` | Create book |
| PUT | `/book/:id` | Update book |

### Issuances
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/issuance` | List issuances (?status=active\|returned\|overdue, ?date=YYYY-MM-DD) |
| GET | `/issuance/:id` | Get issuance by ID |
| POST | `/issuance` | Create issuance |
| PUT | `/issuance/:id` | Update / mark as returned |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/books-never-borrowed` | Books never borrowed |
| GET | `/analytics/outstanding-books` | All currently issued books |
| GET | `/analytics/top-borrowed-books` | Top 10 most borrowed |

### Health Check (no auth)
```
GET /health
```

---

## 🧪 Example cURL Requests

```bash
# Set your key
API_KEY="your-secret-api-key-here"
BASE="http://localhost:3001/api"

# Get all members
curl -H "X-API-Key: $API_KEY" "$BASE/member"

# Create a member
curl -X POST -H "X-API-Key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-9999"}' \
  "$BASE/member"

# Create a book
curl -X POST -H "X-API-Key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert C. Martin","isbn":"978-0132350884","publication_year":2008,"copies_available":3}' \
  "$BASE/book"

# Issue a book
curl -X POST -H "X-API-Key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"member_id":1,"book_id":1,"target_return_date":"2026-07-10"}' \
  "$BASE/issuance"

# Mark as returned
curl -X PUT -H "X-API-Key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"actual_return_date":"2026-06-25"}' \
  "$BASE/issuance/1"

# Get overdue books
curl -H "X-API-Key: $API_KEY" "$BASE/issuance?status=overdue"

# Analytics: top 10 most borrowed
curl -H "X-API-Key: $API_KEY" "$BASE/analytics/top-borrowed-books"
```

---

## 🗄 SQL Analytics Queries

See `backend/queries.sql` for the three analytics queries:

1. **Books Never Borrowed** — finds books with no issuance records
2. **Outstanding Books** — all books currently out (no return date)
3. **Top 10 Most Borrowed** — ranked by borrow count with unique member count

---

## 🖥 Dashboard

Open `http://localhost:5173` to view the **Pending Returns Dashboard**:
- Date picker to filter returns due on or before a date
- Search by member name or book title
- Color-coded rows: 🔴 Overdue, 🟡 Due Today, 🟢 Active
- Summary bar with counts
- CSV export

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, CommonJS |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Authentication | API Key (X-API-Key header) |
| Frontend | React 18, Vite |
| HTTP Client | Axios |
| Date Utilities | date-fns |
