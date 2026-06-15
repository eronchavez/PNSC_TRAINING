# StudySprint API README

Mock API for the **StudySprint** test project for **WorldSkills Philippines 2026**.

This API is intended to provide a prebuilt backend for a front-end competition module. Competitors are expected to build only the client application. The API supports:

- token-based authentication
- dashboard summary data
- protected CRUD operations for tasks

## Base URL

Upload the API folder (studysprint) to your localhost.

It should be accessible at:

`http://localhost/studysprint`

## Endpoints

### Public
- `POST /api/login`

### Protected (`auth:sanctum`)
- `POST /api/logout`
- `GET /api/dashboard`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{task}`
- `PATCH /api/tasks/{task}`
- `DELETE /api/tasks/{task}`

## Authentication

This API uses **Laravel Sanctum** with bearer tokens.

### Login request
`POST /api/login`

#### Required fields
- `email` — required, must be a valid email
- `password` — required

### Example request
```json
{
  "email": "demo@pnsc2026.com",
  "password": "Pnsc@2026"
}
```

### Successful response
```json
{
  "access_token": "12|6oyFe9w2VLC51WB7vzqJSyDH9gGIsUafZUZeVlA4d0a59e4e",
  "token_type": "Bearer",
  "user": {
    "id": 2,
    "name": "Demo User",
    "email": "demo@pnsc2026.com",
    "email_verified_at": null,
    "created_at": "2026-04-28T11:57:55.000000Z",
    "updated_at": "2026-04-28T11:57:55.000000Z"
  }
}
```

### Failed login response
HTTP `401`
```json
{
  "message": "Invalid credentials"
}
```

## Notes
- `access_token` must be used for protected endpoints.
- `token_type` is `"Bearer"`.
- `user` contains the authenticated user record returned by the API.

## Using the token

For protected endpoints, send the token using the `Authorization` header:

```http
Authorization: Bearer 12|6oyFe9w2VLC51WB7vzqJSyDH9gGIsUafZUZeVlA4d0a59e4e
Accept: application/json
```

## Logout

`POST /api/logout`

Deletes **all tokens** for the authenticated user.

### Success response
```json
{
  "message": "Logged out successfully"
}
```

---

# Dashboard endpoint

## `GET /api/dashboard`

Returns dashboard summary data for the authenticated user.

## Actual response shape
```json
{
  "user": "Demo User",
  "summary": {
    "today_count": 2,
    "overdue_count": 1,
    "completed_count": 2,
    "pending_count": 4
  },
  "next_due_task": {
    "id": 3,
    "title": "Study fetch API and async/await",
    "subject": "JavaScript",
    "due_date": "2026-05-19",
    "priority": "Medium",
    "completed": false
  },
  "recent_tasks": [
    {
      "id": 1,
      "title": "Review CSS Shapes",
      "subject": "Web Technologies",
      "due_date": "2026-05-20",
      "priority": "High",
      "completed": false
    }
  ],
  "tip": {
    "title": "Study in short focused blocks",
    "content": "Work in focused study sessions with short breaks in between to maintain concentration."
  }
}
```

## Notes
- `user` is returned as the authenticated user's **name string**, not as an object.
- `next_due_task` may contain `null` values if no upcoming incomplete task exists.
- `recent_tasks` returns up to **5** most recently created tasks for the authenticated user.
- `tip` returns only:
  - `title`
  - `content`

---

# Tasks endpoints

## `GET /api/tasks`

Returns a paginated task list for the authenticated user.

## Supported query parameters
- `search`
- `subject`
- `priority`
- `completed`
- `sort`
- `direction`
- `per_page`

## Actual filtering behavior
- `search` filters by **title only**
- `subject` filters exact subject match
- `priority` filters exact priority match
- `completed` is parsed using PHP `FILTER_VALIDATE_BOOLEAN`
- `sort` supports:
  - `title`
  - `subject`
  - `due_date`
  - `priority`
  - `completed`
- invalid `sort` falls back to `due_date`
- invalid `direction` falls back to `asc`
- default `per_page` is `10`

## Example request
```http
GET /api/tasks?subject=Web%20Technologies&priority=High&completed=false&sort=due_date&direction=asc&per_page=10
```

## Example response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Review CSS Shapes",
      "subject": "Web Technologies",
      "due_date": "2026-05-20",
      "priority": "High",
      "completed": false,
      "notes": "Practice circle(), ellipse(), and polygon() layouts.",
      "created_at": "2026-05-15T09:00:00.000000Z",
      "updated_at": "2026-05-15T09:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 1,
    "filters": {
      "search": null,
      "subject": "Web Technologies",
      "priority": "High",
      "completed": "false",
      "sort": "due_date",
      "direction": "asc"
    },
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "last_page": 1,
      "from": 1,
      "to": 1
    }
  },
  "links": {
    "first": "http://localhost/studysprint/api/tasks?page=1",
    "last": "http://localhost/studysprint/api/tasks?page=1",
    "prev": null,
    "next": null
  }
}
```

---

## `POST /api/tasks`

Creates a new task for the authenticated user.

### Validation rules
- `title` — required, string, max 255
- `subject` — required, string, max 255
- `due_date` — nullable, valid date
- `priority` — nullable, one of `Low`, `Medium`, `High`
- `notes` — nullable, string

### Example request
```json
{
  "title": "Write task editor validation",
  "subject": "Frontend Development",
  "due_date": "2026-05-23",
  "priority": "High",
  "notes": "Show both field-level and form-level feedback."
}
```

### Success response
HTTP `201`

The current controller returns the **raw created task model** as JSON.

Example shape:
```json
{
  "id": 21,
  "user_id": 2,
  "title": "Write task editor validation",
  "subject": "Frontend Development",
  "due_date": "2026-05-23",
  "priority": "High",
  "completed": 0,
  "notes": "Show both field-level and form-level feedback.",
  "created_at": "2026-05-15T12:00:00.000000Z",
  "updated_at": "2026-05-15T12:00:00.000000Z"
}
```

---

## `GET /api/tasks/{task}`

Returns one task.

### Current response shape
```json
{
  "id": 1,
  "title": "Review CSS Shapes",
  "subject": "Web Technologies",
  "due_date": "2026-05-20",
  "priority": "High",
  "completed": false,
  "notes": "Practice circle(), ellipse(), and polygon() layouts.",
  "created_at": "2026-05-15T09:00:00.000000Z",
  "updated_at": "2026-05-15T09:00:00.000000Z"
}
```

### Authorization note
This action explicitly calls `Gate::authorize('view', $task)`. If authorization fails, the application-level exception handler returns:

HTTP `403`
```json
{
  "message": "Forbidden."
}
```

---

## `PATCH /api/tasks/{task}`

Updates an existing task.

### Validation rules
- `title` — sometimes required, string, max 255
- `subject` — sometimes required, string, max 255
- `due_date` — sometimes nullable, valid date
- `priority` — sometimes nullable, one of `Low`, `Medium`, `High`
- `completed` — sometimes boolean
- `notes` — sometimes nullable, string

### Example request
```json
{
  "title": "Write task editor validation",
  "priority": "Medium",
  "completed": true
}
```

### Success response
The current controller returns the **raw updated task model** as JSON.

Example shape:
```json
{
  "id": 21,
  "user_id": 2,
  "title": "Write task editor validation",
  "subject": "Frontend Development",
  "due_date": "2026-05-23",
  "priority": "Medium",
  "completed": true,
  "notes": "Show both field-level and form-level feedback.",
  "created_at": "2026-05-15T12:00:00.000000Z",
  "updated_at": "2026-05-15T12:30:00.000000Z"
}
```

---

## `DELETE /api/tasks/{task}`

Deletes a task.

### Success response
```json
{
  "message": "Task deleted successfully"
}
```

---

# Error handling

The application-level exception configuration returns JSON for API requests.

## Unauthenticated
HTTP `401`
```json
{
  "message": "Unauthenticated."
}
```

## Forbidden
HTTP `403`
```json
{
  "message": "Forbidden."
}
```

## Resource not found
HTTP `404`
```json
{
  "message": "Resource not found."
}
```

## Validation failed
HTTP `422`
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": [
      "The title field is required."
    ]
  }
}
```
