# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with KAVIA brand styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### npm start

Runs the app in development mode. Open http://localhost:3000 to view it in your browser.

### npm test

Launches the test runner in interactive watch mode.

### npm run build

Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Running with and without a backend

The frontend supports two modes:

- With backend: If you set an API base URL, all data operations (list/create/update/delete users) will be performed against your backend REST API.
- Without backend: If no API base URL is configured or the backend is unreachable, the UI gracefully falls back to local demo data so you can still explore the application.

To run with a backend:
1. Copy .env.example to .env.
2. Set REACT_APP_API_BASE to your backend (for example http://localhost:4000). You may also set REACT_APP_BACKEND_URL as an alternative; REACT_APP_API_BASE takes precedence.
3. Start the frontend with npm start. The Users pages will fetch from REACT_APP_API_BASE/users and related endpoints.

To run without a backend:
- Do not set REACT_APP_API_BASE or REACT_APP_BACKEND_URL in .env. The app will render using local demo data for Users pages. Actions like create or delete will simulate success and update in-memory state only.

## How getApiBase() resolves endpoints

The helper getApiBase() in src/utils/config.js determines the API base URL used by the fetch wrapper in src/api/client.js.

Resolution logic:
1. If REACT_APP_API_BASE is set and non-empty, use that value.
2. Else if REACT_APP_BACKEND_URL is set and non-empty, use that value.
3. Otherwise return an empty string, which causes the API client to operate in demo/fallback mode as implemented by hooks/useUsers.js.

Example:
- REACT_APP_API_BASE=https://api.example.com will result in requests like https://api.example.com/users.
- If you pass a fully qualified URL to an API method (for example usersApi.list() ultimately calling apiClient.get('https://other.example.com/users')), the client respects the absolute URL and will not prepend the base.

## Environment variables

Create a .env file based on .env.example. Only REACT_APP_ variables are exposed to the browser.

Common variables:
- REACT_APP_API_BASE: Preferred base URL for the REST API (for example http://localhost:4000).
- REACT_APP_BACKEND_URL: Fallback base URL used if REACT_APP_API_BASE is not set.
- REACT_APP_FRONTEND_URL: The full origin of the frontend, if needed for integrations.
- REACT_APP_WS_URL: WebSocket endpoint when adding realtime features (optional).
- REACT_APP_NODE_ENV: Explicit environment name (development|production|test). Defaults to NODE_ENV.
- REACT_APP_ENABLE_SOURCE_MAPS: Whether to generate source maps for production builds.
- REACT_APP_PORT: Dev server port (CRA typically reads PORT in the shell; we keep a mirrored value here for consistency).
- REACT_APP_TRUST_PROXY: Whether dev middleware should trust proxy headers in certain setups.
- REACT_APP_LOG_LEVEL: Logging level used by getLogLevel() in src/utils/config.js.
- REACT_APP_HEALTHCHECK_PATH: Path segment for health checks; getHealthcheckPath() makes sure it starts with a slash.
- REACT_APP_FEATURE_FLAGS: Comma-separated or JSON flags that toggle UI behaviors.
- REACT_APP_EXPERIMENTS_ENABLED: Global toggle for experimental features.

## Feature flags

Feature flags are read via getFeatureFlag(name, defaultValue) from src/utils/config.js. The environment variable REACT_APP_FEATURE_FLAGS supports two formats:

- JSON: {"enableBulkActions": true, "newNav": false}
- CSV: enableBulkActions,newNav=false

Values true, 1, yes, on are treated as true; false, 0, no, off are treated as false. If a flag is present without a value in CSV form, it is considered true.

Example usage in the app:
- UsersList enables a bulk selection toolbar when the enableBulkActions flag is true:
  - Set REACT_APP_FEATURE_FLAGS=enableBulkActions
  - Or REACT_APP_FEATURE_FLAGS={"enableBulkActions": true}
- In code, this is accessed via getFeatureFlag('enableBulkActions', false). When true, the page shows selection checkboxes and a bulk delete action.

## How URLs are built for API requests

The API client in src/api/client.js uses getApiBase() to compute a baseURL and then combines it with the path you pass to methods like apiClient.get('/users'). If you pass an absolute URL (http:// or https://), the client will use it as-is and will not prefix it with the base. This allows per-call overrides.

## Customization

### Colors

The main brand colors are defined as CSS variables in src/theme.css (the UI has been migrated to shared tokens there). You can adjust theme tokens such as --color-primary, --color-surface, and --focus-ring to change the look and feel.

### Components

This template uses accessible, framework-free components located under src/components/ui. Common elements include:
- Buttons (src/components/ui/Button.jsx)
- Modal with focus trap (src/components/ui/Modal.jsx)
- FormField with hint and error text (src/components/ui/FormField.jsx)
- AlertBanner for error/status messaging (src/components/ui/AlertBanner.jsx)
- Table for data presentation (src/components/ui/Table.jsx)
- Toast notifications (src/components/ui/Toast.jsx)

## Learn More

To learn React, check out the React documentation: https://reactjs.org/

For Create React App topics like splitting, bundle analysis, PWA, configuration, deployment, and troubleshooting, see:
- Code Splitting: https://facebook.github.io/create-react-app/docs/code-splitting
- Analyzing the Bundle Size: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size
- Making a Progressive Web App: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
- Advanced Configuration: https://facebook.github.io/create-react-app/docs/advanced-configuration
- Deployment: https://facebook.github.io/create-react-app/docs/deployment
- npm run build fails to minify: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
