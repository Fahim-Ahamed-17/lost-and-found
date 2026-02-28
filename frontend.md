Modular Frontend Development Sessions – University Lost & Found Portal



you are building a lost and found system make sure follow best practices and also secuyrity is top most and use the mentioned stack if at any point u have a doubt always ask it before implementing you should wait for my signal before each code session and always work in a modular way use the docs as much as possible

This guide breaks the frontend into **independent, focused sessions**. Each session builds a specific page or feature, with clear boundaries to prevent spaghetti code. Follow them in order, but each session is self-contained enough to implement and test separately.

**Testing After Each Session – Instruction for LLM**

When guiding the user through the modular development sessions, **always remind them to test the functionality after completing each session** before moving to the next. This includes:

- Running the app locally.
- Manually verifying all features implemented in that session.
- Checking for console errors or broken flows.
- Ensuring integration with the backend (if applicable).

If the user reports issues during testing, provide debugging help and suggest fixes. Only proceed to the next session after the user confirms that the current session is working correctly.

This approach ensures that each piece is solid and prevents cascading bugs.

### 🏗️ Core Architecture (Session 0 – Setup)

**Goal:** Initialize the project with all dependencies, folder structure, and core configurations.

**Steps:**

1. Create React + Vite project.
2. Install: Redux Toolkit, React Router, Tailwind CSS, shadcn/ui, react-hook-form, date-fns, axios, lucide-react (icons).
3. Configure Tailwind dark mode with `class` strategy.
4. Set up folder structure:

```
src/
├── assets/
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components (customized)
│   ├── layout/         # Navbar, Footer, etc.
│   └── shared/         # ItemCard, FilterSidebar, ImageUpload, etc.
├── pages/              # Page components
│   ├── public/
│   ├── auth/
│   ├── user/
│   └── admin/
├── features/           # Redux slices (auth, items, claims, ui)
├── hooks/              # Custom hooks
├── services/           # API calls (axios instances)
├── utils/              # Helpers, constants, date formatting
├── App.jsx
├── main.jsx
└── index.css


```

1. Create Redux store with slices: `auth`, `items`, `claims`, `ui` (theme, loading, toast).
2. Set up React Router with routes placeholder.
3. Add theme provider and toggle (light/dark mode).
4. Add axios interceptor to include credentials (cookies) for authenticated requests.

**Outcome:** A clean foundation ready for feature development.

---

### 🔐 Session 1 – Authentication (Login, Register, OAuth)

**Goal:** Implement login/register pages and integrate OAuth.

**Components to build:**

- `pages/auth/Login.jsx`
- `pages/auth/Register.jsx`
- `components/layout/Navbar.jsx` (with auth links)
- `features/auth/authSlice.js` (Redux)

**API Endpoints:**

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me` (to fetch user after login)
- OAuth: `GET /auth/google` (redirect from backend)

**Flow:**

- have a manual sign in and sign up forms dont ikmplement the oAuth for now
- Login form (email/password) + "Sign in with Google" button.
- On Google click, redirect to backend OAuth URL.
- After OAuth, backend redirects to frontend callback (e.g., `/oauth-redirect`) – this page simply redirects to home after cookie is set.
- for now have the login with google but dont implement it while clicking it show please use the normal manual login
- Fetch current user via `/auth/me` and update Redux state.
- Protect routes using a `PrivateRoute` wrapper (checks Redux auth state).

**State Management:**

- `authSlice` stores `user`, `isAuthenticated`, `isAdmin`, `loading`, `error`.
- Actions: `login`, `register`, `logout`, `setUser`, `clearError`.

**Integration Notes:**

- Use react-hook-form for forms.
- Store JWT in httpOnly cookie – no need to handle token in JS.
- Redirect to home after successful login.

**Outcome:** Users can sign in/up via email/password or Google (university domain only).

---

### 🏠 Session 2 – Home Page (Browse Items)

**Goal:** Build the main listing page with search, filters, and pagination.

**Components to build:**

- `pages/public/Home.jsx`
- `components/shared/ItemCard.jsx`
- `components/shared/FilterSidebar.jsx`
- `components/shared/Pagination.jsx`
- `features/items/itemsSlice.js` (list state)

**API Endpoint:**

- `GET /items` with query params: `type`, `category`, `location`, `startDate`, `endDate`, `search`, `page`, `limit`

**Flow:**

- Fetch items on mount and when filters change.
- Display items as grid/list of `ItemCard`.
- FilterSidebar: collapsible, with checkboxes for category/type, date range pickers, location input.
- Search bar (simple text input) triggers search.
- Pagination component receives `currentPage`, `totalPages`, and handles page change.

**State Management:**

- `itemsSlice` stores `items`, `totalPages`, `currentPage`, `loading`, `filters`.
- Thunks: `fetchItems` (accepts filters), `updateFilters`.

**Integration Notes:**

- Use URL query params to persist filters (optional: sync with Redux).
- Debounce search input.

**Outcome:** Users can browse all active items with powerful filtering.

---

### 🔍 Session 3 – Item Detail Page

**Goal:** Display full item details and handle claiming.

**Components to build:**

- `pages/public/ItemDetail.jsx`
- `components/shared/ClaimButton.jsx` (context-aware)
- `features/items/itemDetailSlice.js` (or reuse slice with single item)

**API Endpoints:**

- `GET /items/:id`
- `POST /items/:id/claim`

**Flow:**

- Fetch item by ID on mount.
- Display image, title, description, location, date, status, poster info (name/email if allowed).
- Claim button: text = "I found this" if item type is 'lost', else "I lost this". Hidden if user is owner or already claimed.
- On click, open a modal (ConfirmationModal) with optional message field.
- Submit claim, show toast on success, disable button.
- If item has pending claims by current user, show "Claim pending" instead.

**State Management:**

- `itemDetailSlice` stores current item, loading, error.
- Thunk: `fetchItemById`, `submitClaim`.

**Integration Notes:**

- Handle 404 gracefully.
- Show edit/delete buttons if user is owner (with rules from Session 5).

**Outcome:** Users can view item details and claim it (if applicable).

---

### 📝 Session 4 – Submit Item Form

**Goal:** Create a form to report lost/found items.

**Components to build:**

- `pages/user/SubmitItem.jsx`
- `components/shared/ImageUpload.jsx` (preview, validation)
- `features/items/submitSlice.js`

**API Endpoint:**

- `POST /items` (multipart/form-data)

**Flow:**

- Form fields: title, description, category (dropdown), type (lost/found radio), location, dateTime (datetime picker), image upload.
- Use react-hook-form with validation.
- On submit, send FormData to API.
- Show success toast and redirect to My Items page.

**State Management:**

- `submitSlice` stores submitting status, error.

**Integration Notes:**

- ImageUpload: handle file selection, preview, size/type validation.
- Categories fetched from `GET /categories` (or hardcoded initially).

**Outcome:** Users can post new lost/found items.

---

### ✏️ Session 5 – My Items & Edit/Delete

**Goal:** List user's items with edit/delete functionality (respecting hybrid rules).

**Components to build:**

- `pages/user/MyItems.jsx`
- `pages/user/EditItem.jsx` (reuses SubmitItem form with prefill)
- `features/items/userItemsSlice.js`

**API Endpoints:**

- `GET /users/me/items` (with `includeInactive` optional)
- `PUT /items/:id` (multipart/form-data)
- `DELETE /items/:id`

**Flow:**

- MyItems page fetches user's items.
- Each item card shows edit/delete buttons (if rules allow).
- Delete button: disabled with tooltip if not allowed (e.g., "Cannot delete: approved claims exist"). On click, show confirmation modal.
- Edit button: navigates to EditItem page (pre-filled form). On submit, PUT request.
- After edit/delete, refresh list.

**State Management:**

- `userItemsSlice` stores items list, loading.
- Thunks: `fetchUserItems`, `updateItem`, `deleteItem`.

**Integration Notes:**

- Enforce hybrid rules on frontend (but backend also enforces).
- For edit, if pending claims exist, show a warning: "Changes will be logged and claimants notified."

**Outcome:** Users manage their own items with appropriate restrictions.

---

### 📋 Session 6 – My Claims & Claim Detail

**Goal:** Display user's claims and individual claim details.

**Components to build:**

- `pages/user/MyClaims.jsx`
- `pages/user/ClaimDetail.jsx`
- `features/claims/claimsSlice.js`

**API Endpoints:**

- `GET /claims/my`
- `GET /claims/:id`
- `PUT /claims/:id` (withdraw)

**Flow:**

- MyClaims page lists claims with status (pending/approved/rejected), linked to item.
- Click on claim to go to ClaimDetail.
- ClaimDetail shows full claim info, item details, and if pending, a "Withdraw" button.
- Withdraw action: PUT with `{ action: "withdraw" }`, then redirect.

**State Management:**

- `claimsSlice` stores user's claims list, current claim detail.
- Thunks: `fetchMyClaims`, `fetchClaimById`, `withdrawClaim`.

**Integration Notes:**

- Claims list should show item title and image thumbnail.
- Withdraw only allowed if pending.

**Outcome:** Users track their claims and can withdraw if needed.

---

### 👤 Session 7 – Profile Page

**Goal:** Allow users to view and edit their profile.

**Components to build:**

- `pages/user/Profile.jsx`
- `features/auth/profileSlice.js`

**API Endpoints:**

- `GET /users/me`
- `PUT /users/me`

**Flow:**

- Display current user info (name, email).
- Edit form: change name, password (requires current password).
- Use react-hook-form.
- On success, update Redux store.

**State Management:**

- Reuse `authSlice` or separate `profileSlice` for update status.

**Integration Notes:**

- Password change fields appear optionally.

**Outcome:** Users can update their profile.

---

### 🛡️ Session 8 – Admin Dashboard & Manage Items

**Goal:** Build admin overview and item management.

**Components to build:**

- `pages/admin/Dashboard.jsx`
- `pages/admin/ManageItems.jsx`
- `components/admin/AdminItemTable.jsx`
- `features/admin/adminItemsSlice.js`

**API Endpoints:**

- `GET /admin/items` (with filters, includeInactive)
- `PUT /admin/items/:id` (admin edit)
- `DELETE /admin/items/:id` (soft/hard)
- `PUT /admin/items/:id/restore`

**Flow:**

- Dashboard shows stats (total items, claims, users).
- ManageItems: table/list of all items with filters. Actions: edit, delete (soft), restore (if inactive).
- Click edit opens admin edit modal (simplified form).
- After actions, refresh list.

**State Management:**

- `adminItemsSlice` stores items list, stats.
- Thunks: `fetchAdminItems`, `adminUpdateItem`, `adminDeleteItem`, `adminRestoreItem`.

**Integration Notes:**

- Include a toggle to show inactive items.
- Soft delete sets `isActive: false`.

**Outcome:** Admins can oversee all items.

---

### 📊 Session 9 – Admin Manage Claims

**Goal:** Admin approval/rejection of claims.

**Components to build:**

- `pages/admin/ManageClaims.jsx`
- `pages/admin/AdminClaimDetail.jsx`
- `components/admin/ClaimRow.jsx`
- `features/admin/adminClaimsSlice.js`

**API Endpoints:**

- `GET /admin/claims` (with filters)
- `GET /admin/claims/:id`
- `PUT /admin/claims/:id` (approve/reject)

**Flow:**

- ManageClaims lists all pending claims (or filtered). Each row shows item, claimant, date, and Approve/Reject buttons.
- Click on claim to go to AdminClaimDetail for full view.
- Approve/reject triggers PUT request, updates list.

**State Management:**

- `adminClaimsSlice` stores claims list, current claim.
- Thunks: `fetchAdminClaims`, `fetchAdminClaimById`, `updateClaimStatus`.

**Integration Notes:**

- On approve, item status becomes 'claimed' automatically (handled by backend).
- Show success toast.

**Outcome:** Admins manage claim lifecycle.

---

### 👥 Session 10 – Admin Manage Users

**Goal:** Admin user management.

**Components to build:**

- `pages/admin/ManageUsers.jsx`
- `components/admin/UserRow.jsx`
- `features/admin/adminUsersSlice.js`

**API Endpoints:**

- `GET /admin/users`
- `PUT /admin/users/:id/role`
- `DELETE /admin/users/:id`

**Flow:**

- List all users with name, email, role, status.
- Actions: change role (dropdown), delete (soft).
- On role change/delete, refresh list.

**State Management:**

- `adminUsersSlice` stores users list.
- Thunks: `fetchAdminUsers`, `updateUserRole`, `deleteUser`.

**Integration Notes:**

- Soft delete sets `isActive: false`.

**Outcome:** Admins control user access.

---

### 🎨 Session 11 – Polish & Dark Mode Finalization

**Goal:** Ensure consistent dark/light mode across all pages, add toast notifications, error boundaries, and final responsive tweaks.

**Steps:**

1. Review all pages for dark mode compatibility.
2. Add toast notifications for all async actions (using react-toastify or shadcn toast).
3. Implement error boundaries for each major section.
4. Add loading spinners consistently.
5. Test responsiveness on mobile/tablet.
6. Add favicon and metadata.

**Outcome:** Polished, production-ready frontend.

---

## 🔗 Integration & Communication

- Each session builds on the previous ones but remains modular.
- Shared components (`ItemCard`, `ImageUpload`, `FilterSidebar`) are developed in Session 2 and reused later.
- Redux slices are added incrementally; each feature has its own slice.
- API service layer (`services/api.js`) centralizes all calls.
- Use custom hooks for reusable logic (e.g., `useAuth`, `useItems`).

This session-based approach ensures you can build the frontend step by step without creating tangled code. Each session delivers a working piece of functionality that integrates cleanly with the rest.