University Lost & Found Portal – API Reference



**Base URL:** `/api`

Should be done in typescript

It should follow MVC very strictly

**Authentication:** JWT stored in httpOnly cookie (sent automatically).

**Response Format:** JSON. All responses include `success: true/false` and `data` or `error` object.

**Pagination:** List endpoints accept `page` (default 1) and `limit` (default 10) query parameters.

**Soft Delete:** Items have `isActive: Boolean` flag; public endpoints only show active items unless specified.

**Error Handling:** Standard HTTP status codes (200, 201, 400, 401, 403, 404, 500). Error response: `{ success: false, error: { message, code? } }`

---

## 🔐 Authentication


| Method | Endpoint         | Description                                   | Auth   | Request Body / Params       | Response / Notes                           |
| ------ | ---------------- | --------------------------------------------- | ------ | --------------------------- | ------------------------------------------ |
| POST   | `/auth/register` | Register new user (university email required) | Public | `{ name, email, password }` | `{ success: true, data: { user } }`        |
| POST   | `/auth/login`    | Login, sets httpOnly cookie with JWT          | Public | `{ email, password }`       | `{ success: true, data: { user } }`        |
| POST   | `/auth/logout`   | Logout, clears cookie                         | Auth   | –                           | `{ success: true, message: "Logged out" }` |
| GET    | `/auth/me`       | Get current authenticated user info           | Auth   | –                           | `{ success: true, data: { user } }`        |


---

## 📦 Items

### Public/User Endpoints


| Method | Endpoint             | Description                                                                                    | Auth         | Request Body / Params                                                                                                                | Response / Notes                                                               |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| GET    | `/items`             | List active items with filters, search, pagination                                             | Public       | Query: `type` (lost/found), `category`, `location` (regex), `startDate`, `endDate`, `status`, `page`, `limit`, `search` (title/desc) | `{ success: true, data: { items, totalPages, currentPage, count } }`           |
| GET    | `/items/:id`         | Get single item details (populates user: name, email)                                          | Public       | –                                                                                                                                    | `{ success: true, data: { item } }`                                            |
| POST   | `/items`             | Create new lost/found item (image upload)                                                      | Auth         | `multipart/form-data`: `title`, `description`, `category`, `type`, `location`, `dateTime`, `image`                                   | `{ success: true, data: { item } }`                                            |
| PUT    | `/items/:id`         | Update own item. If pending claims exist, changes are logged and claimants notified.           | Auth (owner) | `multipart/form-data` (optional fields)                                                                                              | `{ success: true, data: { item, historyEntry? } }`                             |
| DELETE | `/items/:id`         | Soft delete own item (conditions apply: no approved claims, all pending claims > 30 days old). | Auth (owner) | –                                                                                                                                    | `{ success: true, message: "Item deleted" }`                                   |
| GET    | `/items/:id/history` | Get edit history of an item (for transparency)                                                 | Public       | –                                                                                                                                    | `{ success: true, data: { history: [{ editedAt, previousData, editedBy }] } }` |
| PUT    | `/items/:id/return`  | (Optional) Mark item as returned (status 'closed'). Only owner can call this.                  | Auth (owner) | –                                                                                                                                    | `{ success: true, data: { item } }`                                            |


### Admin Endpoints


| Method | Endpoint                   | Description                                                                | Auth  | Request Body / Params                            | Response / Notes                                              |
| ------ | -------------------------- | -------------------------------------------------------------------------- | ----- | ------------------------------------------------ | ------------------------------------------------------------- |
| GET    | `/admin/items`             | List all items (including inactive/soft-deleted) with filters              | Admin | Query: `includeInactive`, `status`, `type`, etc. | `{ success: true, data: { items, totalPages, currentPage } }` |
| PUT    | `/admin/items/:id`         | Admin edit item (bypasses restrictions, edits logged optionally)           | Admin | `multipart/form-data` or JSON                    | `{ success: true, data: { item } }`                           |
| DELETE | `/admin/items/:id`         | Hard delete or force soft delete (query: `permanent=true` for hard delete) | Admin | –                                                | `{ success: true, message: "Item deleted" }`                  |
| PUT    | `/admin/items/:id/restore` | Restore a soft-deleted item (set `isActive` back to true)                  | Admin | –                                                | `{ success: true, data: { item } }`                           |


---

## 📋 Claims


| Method | Endpoint           | Description                                                          | Auth                  | Request Body / Params                     | Response / Notes                                               |
| ------ | ------------------ | -------------------------------------------------------------------- | --------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| POST   | `/items/:id/claim` | Create a claim on an item (cannot claim own item, item must be open) | Auth                  | `{ message }` (optional)                  | `{ success: true, data: { claim } }`                           |
| GET    | `/claims/my`       | List all claims made by current user (populates item)                | Auth                  | Query: `status`, `page`, `limit`          | `{ success: true, data: { claims, totalPages, currentPage } }` |
| GET    | `/claims/:id`      | Get specific claim details (populates item and claimant)             | Auth (claimant/admin) | –                                         | `{ success: true, data: { claim } }`                           |
| PUT    | `/claims/:id`      | Update claim (e.g., withdraw). Only allowed if status is pending.    | Auth (claimant)       | `{ action: "withdraw" }` or `{ message }` | `{ success: true, data: { claim } }`                           |
| DELETE | `/claims/:id`      | Withdraw claim (same as PUT with withdraw).                          | Auth (claimant)       | –                                         | `{ success: true, message: "Claim withdrawn" }`                |


### Admin Claim Endpoints


| Method | Endpoint            | Description                                                                                  | Auth  | Request Body / Params                                                            | Response / Notes                                               |
| ------ | ------------------- | -------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| GET    | `/admin/claims`     | List all claims with filters (status, date range, item, claimant)                            | Admin | Query: `status`, `itemId`, `claimantId`, `startDate`, `endDate`, `page`, `limit` | `{ success: true, data: { claims, totalPages, currentPage } }` |
| PUT    | `/admin/claims/:id` | Update claim status (approve/reject). On approve, item status becomes 'claimed' or 'closed'. | Admin | `{ status }` (enum: approved/rejected)                                           | `{ success: true, data: { claim } }`                           |


---

## 👤 Users


| Method | Endpoint           | Description                                                        | Auth | Request Body / Params                               | Response / Notes                                              |
| ------ | ------------------ | ------------------------------------------------------------------ | ---- | --------------------------------------------------- | ------------------------------------------------------------- |
| GET    | `/users/me`        | Get own profile                                                    | Auth | –                                                   | `{ success: true, data: { user } }`                           |
| PUT    | `/users/me`        | Update own profile (name, password)                                | Auth | `{ name, currentPassword, newPassword }` (optional) | `{ success: true, data: { user } }`                           |
| GET    | `/users/me/items`  | List items posted by current user (includes inactive if requested) | Auth | Query: `includeInactive` (boolean), pagination      | `{ success: true, data: { items, totalPages, currentPage } }` |
| GET    | `/users/me/claims` | Same as `/claims/my`                                               | Auth | –                                                   | –                                                             |


### Admin User Endpoints


| Method | Endpoint                | Description                                    | Auth  | Request Body / Params               | Response / Notes                                              |
| ------ | ----------------------- | ---------------------------------------------- | ----- | ----------------------------------- | ------------------------------------------------------------- |
| GET    | `/admin/users`          | List all users                                 | Admin | Query: `role`, `search`, pagination | `{ success: true, data: { users, totalPages, currentPage } }` |
| PUT    | `/admin/users/:id/role` | Change user role                               | Admin | `{ role }` (enum: user/admin)       | `{ success: true, data: { user } }`                           |
| DELETE | `/admin/users/:id`      | Soft delete user (or hard if `permanent=true`) | Admin | –                                   | `{ success: true, message: "User deleted" }`                  |


---

## 📂 Categories & Utilities


| Method | Endpoint      | Description                                                      | Auth   | Request Body / Params | Response / Notes                          |
| ------ | ------------- | ---------------------------------------------------------------- | ------ | --------------------- | ----------------------------------------- |
| GET    | `/categories` | Retrieve list of allowed item categories (for frontend dropdown) | Public | –                     | `{ success: true, data: { categories } }` |
| GET    | `/health`     | Health check (optional)                                          | Public | –                     | `{ success: true, status: "OK" }`         |


---

## 📝 Additional Details & Notes

### 🔹 Item Edit/Delete Rules

- **Edit:** Always allowed for owner. If there are **pending claims**, changes are tracked in `editHistory` and claimants receive a notification (optional). Approved claims do **not** block edits.
- **Delete:** Allowed for owner only if:
  - No **approved** claims exist.
  - All **pending** claims (if any) are older than `CLAIM_STALE_DAYS` (default 30 days). Otherwise delete is blocked with an appropriate error message.
- **Soft Delete:** Items are flagged with `isActive: false`. They are excluded from public listings but remain in DB for admin review. Admins can restore via `PUT /admin/items/:id/restore`.

### 🔹 Claim Status Transitions

- `pending` → `approved` or `rejected` (admin only).
- `approved` → cannot be changed back; triggers item status to `claimed`.
- `rejected` → can be re-created by same user? (Optional: allow new claim after rejection.)

### 🔹 Pagination

All list endpoints accept:

- `page` (default 1)
- `limit` (default 10, max 100) Response includes `totalPages`, `currentPage`, `count` (total items matching query).

### 🔹 Filter Parameters for `/items`

- `type` – 'lost' or 'found'
- `category` – one of predefined categories
- `location` – case-insensitive regex search (e.g., `?location=library`)
- `startDate`, `endDate` – ISO date strings (filter `dateTime`)
- `status` – 'open', 'claimed', 'closed'
- `search` – text search in title and description (if implemented)

### 🔹 Environment Variables

- `CLAIM_STALE_DAYS` – number of days after which a pending claim is considered stale (default: 30).
- `JWT_SECRET` – secret for signing tokens.
- `CLOUDINARY_URL` – Cloudinary credentials for image uploads.
- `UNIVERSITY_EMAIL_DOMAIN` – e.g., `@university.edu` for registration validation.

### 🔹 Example Error Response

```json
{
  "success": false,
  "error": {
    "message": "Cannot delete item: there are approved claims.",
    "code": "DELETE_BLOCKED_APPROVED_CLAIMS"
  }
}


```

---

This API is designed to support the complete Lost & Found portal functionality with the hybrid edit/delete rules, soft delete, and transparent claim management. All endpoints are RESTful and should be implemented with appropriate validation and security.