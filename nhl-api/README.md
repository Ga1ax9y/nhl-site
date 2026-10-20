# NHL API Proxy

A lightweight backend proxy that aggregates and normalizes data from the public NHL REST APIs and delivers it to the frontend through a single, CORS-enabled gateway. It shields the client from third-party API quirks, centralizes error handling, and exposes a consistent `/api/*` contract for the [NHL Site](https://github.com/Ga1ax9y/nhl-site) frontend.

## Tech Stack

- **Node.js** — JavaScript runtime
- **TypeScript** — typed server code (strict; `tsx` for dev, `tsc` → `dist/` for production)
- **Express 5** — HTTP server and routing
- **Axios** — outbound HTTP client for upstream NHL APIs
- **rss-parser** — RSS feed parsing for news/transactions
- **cors** — cross-origin resource sharing middleware
- **nodemon** — development auto-restart (dev dependency)

## Features

- Proxies the official NHL franchise, standings, stats, roster, and player data
- Enriches skater and goaltender leaderboard data in a single request (`Promise.all`)
- Merges combined stats payloads via `Object.assign`
- Parses and cleans the Elite Prospects transactions RSS feed into news items
- Centralized JSON error responses with HTTP status codes
- Validates team abbreviations (`/^[A-Z]{3}$/`) to reject malformed requests
- Restricts CORS to the configured frontend origin with GET-only methods
- Health-check endpoint for uptime verification

## Installation & Setup

1. Clone the repository and enter the `nhl-api` directory:

   ```bash
   git clone <repository-url>
   cd nhl-site/nhl-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server (with auto-restart):

   ```bash
   npm run server:dev
   ```

   Alternatively, run it directly with Node:

   ```bash
   node index.js
   ```

4. The server listens on `http://localhost:3000` bound to `0.0.0.0`, allowing access from the Vite frontend at `http://localhost:5173`.

## Usage Examples

The service exposes the following endpoints:

| Method | Endpoint                         | Description                                   |
| ------ | -------------------------------- | --------------------------------------------- |
| GET    | `/api/ping`                      | Health check                                  |
| GET    | `/api/teams`                     | NHL franchise list                            |
| GET    | `/api/standings/:season`         | Standings for a season                        |
| GET    | `/api/standings-season`          | Available seasons                             |
| GET    | `/api/stats/:season`             | Skater & goaltender stat leaders              |
| GET    | `/api/roster/:teamAbbrev`        | Current roster for a 3-letter team code       |
| GET    | `/api/player/:playerId`          | Landing-page player info                      |
| GET    | `/api/news`                      | Latest Elite Prospects transactions           |

### curl examples

```bash
# Health check
curl http://localhost:3000/api/ping

# Current standings
curl http://localhost:3000/api/standings/now

# Roster for a specific team
curl http://localhost:3000/api/roster/TOR

# Skater and goalie stat leaders for the current season
curl http://localhost:3000/api/stats/current

# Latest transactions news
curl http://localhost:3000/api/news
```

## Folder Structure

```
nhl-api/
├── src/
│   ├── index.ts        # Server bootstrap (port 3000, 0.0.0.0)
│   ├── app.ts          # Express app, CORS, route mounting under /api
│   ├── routes.ts       # All route handlers (standings, stats, roster, player, news, schedule)
│   ├── contracts.ts    # Public response/error contracts + boundary param validation
│   └── upstream.ts     # NHL API base URLs + fetchJson helper
├── dist/               # Compiled output (tsc build)
├── package.json        # Project metadata and scripts
├── package-lock.json   # Locked dependency tree
├── tsconfig.json       # TypeScript configuration
└── .gitignore
```

### Scripts

```bash
npm run server:dev   # Dev server (nodemon + tsx, watches src/)
npm run build        # TypeScript build → dist/
npm start            # Run compiled build (node dist/index.js)
```
