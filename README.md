# Unified Butterfly Recorder (UBR)

The UBR web app is a React progressive web app (PWA) for recording butterfly surveys.

This project was **recovered from the deployed site**. The original repository wasn't available, so the code was rebuilt from what was published in the S3 bucket:

- `src/` was extracted from the deployed source maps (`main.*.js.map`, `main.*.css.map` and `service-worker.js.map`). The images came from `static/media` and from one image embedded in the bundle.
- `package.json` was rebuilt from the libraries found in the bundle. Where the bundle recorded a version (React 18.2.0, React Router 6.9.0, @mui/material 5.11.11, Bootstrap 5.2.3, sweetalert2 11.7.3, workbox 6.5.3), it is pinned exactly. The other packages were resolved as of the build date (March 2023) with `npm install --before=2023-03-15`, and `package-lock.json` records the result.
- `public/` was rebuilt from the deployed `index.html`, manifest and icons.

A production build reproduces the deployed CSS byte-for-byte, and the JS bundle is within 0.5% of the deployed size. Two things could not be recovered: comments in files that the build dropped, and any files that weren't part of the bundle, such as tests.

## Prerequisites

- **Node.js 18** (see `.nvmrc`; run `nvm use` if you use nvm). `npm run build` has also been checked with Node 22.
- **npm**, which comes with Node.

## Setup

```sh
npm ci
cp .env.example .env.local
```

Use `npm ci` rather than `npm install`. It installs exactly what's in `package-lock.json`, which keeps the 2023 dependency versions. npm will warn about deprecated packages and security vulnerabilities; this is expected for a 2023 dependency set.

Then fill in the API keys in `.env.local`; see [Configuration](#configuration). If a value is missing, the app fails to start, and its error message names the missing setting.

## Day-to-day development

```sh
npm start
```

This runs the Create React App dev server at http://localhost:3000, and the page reloads when you save a change.

The browser opens before the first compile finishes, and that compile can take a while. Until it's done, the browser shows "localhost refused to connect". Wait for the terminal to print `Compiled with warnings.`, then reload the page. Set `BROWSER=none` if you'd rather open the page yourself.

> **Warning: the dev server talks to the live backend.** The values in `.env.example` are the production Cognito user pool and API Gateway endpoints, so a local session uses them unless you point `.env.local` at a separate test backend. Anything you create while testing, such as accounts, surveys or sightings, goes into production data.

The service worker (offline support) is only registered in production builds, so `npm start` doesn't cache anything.

### Imports

`jsconfig.json` sets `baseUrl` to `src`, so modules can be imported from `src` without a relative path:

```js
import { ListContext } from "contexts/listContext";
```

### Linting

ESLint runs during `npm start` and `npm run build` using the Create React App `react-app` config. The recovered code produces many `no-unused-vars` warnings. These came with the original code and don't stop the build.

### Tests

`npm test` runs Jest in watch mode, but no tests were recovered. You can add new ones as `*.test.js` files under `src/`.

## Code layout

| Path | Contents |
| --- | --- |
| `src/index.js` | Entry point. Wraps `App` in the `Offline` and `Account` (auth) providers and registers the service worker |
| `src/App.js` | Routes |
| `src/pages/` | One component per route |
| `src/components/` | Shared UI: navbar, survey cards, timer, maps, dialogs |
| `src/contexts/` | React contexts: auth (Cognito), surveys, butterfly lists, user preferences |
| `src/css/`, `src/images/` | Styles and images imported by the components |
| `src/service-worker.js` | Workbox service worker for offline use and caching |
| `public/` | Static files copied into the build as-is |

## Configuration

Settings come from `REACT_APP_*` environment variables, which `src/config.js` reads. Create React App loads them from `.env.local` for both `npm start` and `npm run build`.

| Variable | Used for |
| --- | --- |
| `REACT_APP_COGNITO_USER_POOL_ID`, `REACT_APP_COGNITO_CLIENT_ID` | AWS Cognito user pool for sign-in |
| `REACT_APP_SURVEY_API_URL` | Survey API (API Gateway) |
| `REACT_APP_LIST_API_URL` | Butterfly lists API (API Gateway) |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API (survey map) and Static Maps API (survey thumbnails) |
| `REACT_APP_OPENWEATHER_API_KEY` | OpenWeather current-weather lookups |

- **Committed:** `.env.example`. It has the real Cognito IDs and API URLs, which are public identifiers, not secrets, and blanks for the API keys.
- **Not committed:** `.env.local` and any other `.env*` file, which `.gitignore` excludes. Don't commit API keys.
- **Keys are still public in the deployed site.** Values are compiled into the JavaScript bundle at build time, so they stay out of the repository but are visible to anyone who loads the site. Browser keys need restrictions on the provider's side:
  - **Google Maps:** restrict the key to the site's domain (HTTP referrers) and to the two APIs above.
  - **OpenWeather:** this key can't be restricted that way. The proper fix is to call OpenWeather from a backend Lambda that keeps the key in AWS SSM Parameter Store, so the key leaves the frontend entirely.

The backend code (Lambda functions behind the API Gateway endpoints) isn't part of this project.

## Building and deploying

```sh
npm run build
```

This writes an optimized build to `build/`, using the values in `.env.local`. The app assumes it is served from the site root (`/`).

To deploy, sync the build output to the S3 bucket:

```sh
aws s3 sync build/ s3://YOUR-BUCKET-NAME --delete
```

- `--delete` removes files from the bucket that aren't in the new build, such as old hashed bundles. Run it with `--dryrun` first to see what it would change.
- If the site is served through CloudFront, invalidate the cached copies afterward:
  ```sh
  aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
  ```
- Because the app is a PWA, returning users may keep seeing the old version until every open tab of the app has been closed. That's when the new service worker takes over.
- The build includes source maps (`*.map`), which publish the full source code. Set `GENERATE_SOURCEMAP=false` when you run `npm run build` if you don't want them deployed.
