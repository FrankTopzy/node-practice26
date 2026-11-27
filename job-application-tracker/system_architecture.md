# Job Application Tracker

## 1. Project Overview

A multi-user web application that allows users to save job opportunities, track applications, monitor recruitment progress, manage interviews and view application statistics.

## 2. Technology Stack

- Backend: Node.js and Express
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Authentication: JWT with access and refresh tokens
- Password security: bcrypt
- Module system: ES Modules

## 3. Functional Requirements

### User Management
- Register, log in and log out.
- Retrieve the authenticated user's profile.
- Protect private resources.
- Ensure users can only access their own records.

### Application Management
- Create wishlist items and job applications.
- View all applications and individual applications.
- Update application details and status.
- Delete applications and their associated records.
- Search, filter, sort and paginate applications.

### Status Tracking
Supported statuses:
- WISHLIST
- APPLIED
- ASSESSMENT
- INTERVIEW
- OFFER
- REJECTED
- WITHDRAWN

Record every status change in the activity timeline.

### Activity Timeline
- Automatically record application creation and status changes.
- Support manual activity entries.
- Record previous status, new status, source and timestamp.
- Preserve activity history while the application exists.

### Interview Management
- Schedule multiple interviews per application.
- Record interview stages, dates and notes.
- Update and delete interview records.

### Dashboard
Display:
- Total applications.
- Application counts by status.
- Upcoming interviews.
- Recent activities.

## 4. Non-Functional Requirements

- Security: Authentication, authorization, validation and protection of user data.
- Reliability: Consistent database operations and error handling.
- Performance: Efficient queries, indexes and pagination.
- Maintainability: Modular architecture and reusable services.
- Data integrity: Foreign keys, constraints and database transactions.
- Usability: Clear API responses and predictable application behavior.

## 5. Database Entities

### User
`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`

### Application
`id`, `userId`, `company`, `jobTitle`, `jobUrl`, `location`, `status`, `appliedAt`, `notes`, `createdAt`, `updatedAt`

### ApplicationActivity
`id`, `applicationId`, `previousStatus`, `newStatus`, `source`, `description`, `createdAt`

### Interview
`id`, `applicationId`, `stage`, `scheduledAt`, `notes`, `createdAt`, `updatedAt`

### Relationships
- User → Application: One-to-many.
- Application → ApplicationActivity: One-to-many.
- Application → Interview: One-to-many.

Deleting an application permanently cascades to its activities and interviews.

## 6. API Specification

Base URL: `/api/v1`

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |

### Applications

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/applications` | Create |
| GET | `/applications` | List |
| GET | `/applications/:id` | Retrieve one |
| PATCH | `/applications/:id` | Update |
| DELETE | `/applications/:id` | Delete |

### Activities

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/applications/:id/activities` | Retrieve history |
| POST | `/applications/:id/activities` | Add manual activity |

Status-change activity records are generated automatically by the backend.

### Interviews

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/applications/:id/interviews` | Create |
| GET | `/applications/:id/interviews` | List |
| PATCH | `/interviews/:id` | Update |
| DELETE | `/interviews/:id` | Delete |

### Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard` | Retrieve dashboard statistics |

## 7. Query Parameters

Applications support:
- `page`
- `limit`
- `status`
- `search`
- `sortBy`
- `sortOrder`

Example:

`GET /api/v1/applications?page=1&limit=10&status=INTERVIEW&search=frontend&sortBy=createdAt&sortOrder=desc`

## 8. Security Requirements

- Hash passwords before storage.
- Authenticate protected requests.
- Enforce ownership checks on every user-owned resource.
- Never trust a frontend-supplied user ID.
- Validate incoming data with Zod.
- Use database transactions for operations that must succeed together.
- Never expose password hashes or authentication secrets in API responses.

## 9. Error Response Convention

Use consistent JSON error responses:

`{ "message": "Resource not found" }`

HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## 10. Future Enhancements

Email integration may later detect recruitment-related messages and suggest application updates. It is outside the initial MVP.

Automated email classifications must not silently be treated as verified recruitment events.
