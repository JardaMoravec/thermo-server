# Termo-Server

A simple Node.js/Express server for storing and displaying measured temperatures (and optionally humidity) from various devices.

Project at a glance:

- Backend: Node.js with TypeScript
- Templating: EJS (Express EJS Layouts)
- Database: SQLite (file at `data/temperatures.db`)

Main features:

- Add and edit devices via the web interface
- Receive measurements via a POST endpoint (supports batch and single records)
- Dashboard showing the latest measurement for each device
- Device detail view with history and pagination

Installation

1. Install dependencies:

```powershell
npm install
```

2. Run in development mode (with reload):

```powershell
npm run start:dev
```

3. Build and start in production:

```powershell
npm run build; npm start
```

Configuration

- The app reads `process.env.PORT` (default 3000).
- SQLite database file: `data/temperatures.db` (will be created automatically on startup).

API / Endpoints

- GET /
  - Dashboard: list of devices with their latest measurement.
- GET /devices/add
  - Form to add a new device.
- POST /devices/add
  - Creates a device. Fields: `name`, `token`, `description`.
- GET /devices/:id
  - Device detail + measurement history (paginated, 50 records per page).
- GET /devices/:id/edit
  - Form to edit a device.
- POST /devices/:id/edit
  - Save changes (name, token, description).
- GET /devices/:id/delete
  - Deletes the device and its measurements.
- POST /measurements
  - Adds new measurement(s); accepts a JSON object or an array of objects with fields `token` (device identifier), `temperature` (required), `humidity` (optional).
  - If a device with the given token does not exist, it will be created automatically.

Libraries and dependencies used

- express — web framework
- body-parser — POST body parsing (JSON / URL-encoded)
- ejs — templating engine
- express-ejs-layouts — EJS layouts
- sqlite3 — SQLite DB driver
- reflect-metadata — metadata for future extensions (typically for TypeScript DI)

Development dependencies

- typescript, ts-node, ts-node-dev — TypeScript and live-reload
- @types/* — type definitions for used libraries
- eslint, @eslint/js, typescript-eslint — linting
- cpx — copying EJS view files during build
- nodemon — alternative tool for dev restarts

Project structure (selected files)

- src/app.ts — app startup and routes
- src/database.ts — SQLite initialization and table definitions
- src/controllers/* — individual routes and logic
- src/views/* — EJS templates (dashboard, device-form, device-detail, layout)
- data/temperatures.db — SQLite DB file (created automatically)

Security and limitations

- Device token is stored in plain text and must be unique.
- The API has no authentication — consider adding API keys or login for production.
- There is no rate-limiting protection for excessive requests.

Possible improvements (ideas)

- Add authentication (admin UI) and restrict access to endpoints.
- Add rate-limiting for POST /measurements.
- Add input validation and better error messages.
- Data export and graphical history visualization.

Contact

For more information, edit the README or inspect the source files in `src/`.
