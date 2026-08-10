# NHL Site

A modern, responsive web application for tracking the National Hockey League. NHL Site delivers live standings, team rosters, player profiles, and season statistics through a fast, intuitive interface — filling the gap for hockey fans who want a clean, mobile-friendly alternative to cluttered league dashboards.

## Tech Stack

- **React 19** — UI library
- **TypeScript 5** — typed application code
- **Vite 7** — build tooling and dev server (SWC-powered)
- **SCSS Modules** — scoped, maintainable styling
- **React Router 7** — client-side routing
- **Axios** — HTTP client for the backend API
- **ESLint 9** — linting and static analysis

## Features

- **Responsive layout** — optimized for desktop and mobile with touch-friendly navigation
- **Standings by season** — browse league tables for any available season
- **Team rosters** — view current forwards, defensemen, and goaltenders per team
- **Player profiles** — detailed landing-page stats for individual players
- **Season stats leaders** — combined skater and goaltender leaderboards
- **Transactions feed** — latest league news parsed from the Elite Prospects RSS feed
- **Multiple views** — Home, Teams, Schedule, Standings, Stats, Roster, and Player Info pages
- **404 handling** — dedicated `NotFound` route for unknown URLs
- **Typed data models** — TypeScript interfaces for teams, players, stats, and seasons

## Installation & Setup

### Prerequisites

- Node.js 18+
- The [nhl-api](https://github.com/Ga1ax9y/nhl-site-server) backend running on port `3000`

### Steps

1. Clone the repository and enter the `nhl-site` directory:

   ```bash
   git clone <repository-url>
   cd nhl-site/nhl-site
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend API first (see the `nhl-api` README), then launch the dev server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:

   ```
   http://localhost:5173
   ```

## Usage Examples

### Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check then build for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### API service usage

All data access is centralized in `src/services/nhlApi.ts`, which points at the backend base URL `http://localhost:3000/api`:

```ts
import {
  fetchSeasons,
  fetchTeams,
  fetchRoster,
  fetchPlayerById,
  fetchNews,
  fetchStats,
} from './services/nhlApi';

// List the latest seasons
const seasons = await fetchSeasons();

// Fetch standings for a season
const teams = await fetchTeams(seasons[0]);

// Get the roster for a 3-letter team code
const roster = await fetchRoster('TOR');

// Load a player profile by ID
const player = await fetchPlayerById('8478402');

// Fetch transaction news
const news = await fetchNews();

// Fetch stat leaders
const stats = await fetchStats(seasons[0]);
```

### Routes

| Route                  | Description                       |
| ---------------------- | --------------------------------- |
| `/`                    | Home                              |
| `/teams`               | Team list                         |
| `/schedule`            | Schedule                          |
| `/standings/:season`   | Standings for a season            |
| `/stats/:season`       | Stat leaders for a season         |
| `/roster/:teamAbbrev`  | Roster for a team code            |
| `/player/:playerId`    | Player profile                    |
| `*`                    | 404 / Not Found                   |

## Folder Structure

```
nhl-site/
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration (host + port)
├── eslint.config.js         # ESLint configuration
├── tsconfig.json            # TypeScript project references
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node-side TypeScript config
├── package.json
├── public/                  # Static assets (e.g. NHL logo)
└── src/
    ├── main.tsx             # React bootstrap
    ├── vite-env.d.ts
    ├── styles/              # Global SCSS
    ├── types/               # TypeScript data models
    │   ├── news.ts
    │   ├── player.ts
    │   ├── season.ts
    │   ├── stats.ts
    │   ├── statsCategory.ts
    │   └── team.ts
    ├── services/
    │   └── nhlApi.ts        # Centralized API client
    ├── scripts/
    │   ├── helpers/         # Utility helpers
    │   └── hooks/           # Custom React hooks
    ├── pages/               # Route-level components + SCSS
    │   ├── Home.tsx
    │   ├── Teams.tsx
    │   ├── Schedule.tsx
    │   ├── Standings.tsx
    │   ├── Stats.tsx
    │   ├── Roster.tsx
    │   ├── PlayerInfo.tsx
    │   └── NotFound.tsx
    └── components/
        ├── App.tsx          # Router configuration & layout
        ├── App.scss
        ├── layout/          # Header, Footer, ScrollToTop
        └── features/        # Reusable UI widgets
            ├── Controls.tsx
            ├── Dropdown.tsx
            ├── PlayerCard.tsx
            ├── StandingsCell.tsx
            ├── StandingsTable.tsx
            ├── StatsTable.tsx
            └── TeamCard.tsx
```

## Data Sources

- [NHL-API-Reference](https://github.com/Zmalski/NHL-API-Reference) — teams, players, rosters, and statistics
- [Elite Prospects RSS feed](https://www.eliteprospects.com/rss/league/nhl/transactions) — league transactions and news
