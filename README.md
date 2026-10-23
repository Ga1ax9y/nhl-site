# NHL Site

Учебный проект: сайт со статистикой НХЛ из двух частей — React-фронтенд (`nhl-site/`) и Express-прокси к официальным NHL API (`nhl-api/`). Прокси предохраняет браузер от CORS-ограничений NHL и нормализует ответы третьих источников (RSS Elite Prospects).

**Монорепозиторий** (https://github.com/Ga1ax9y/nhl-site): git-команды выполняются из корня воркспейса — здесь единственный `.git`. История прежних репозиториев (фронт + `nhl-site-server`) сохранена через subtree-мержи.

## Структура

```
nhl-site/                  ← корень воркспейса = корень монорепо (origin: Ga1ax9y/nhl-site)
├── README.md               ← этот файл (обзор проекта)
├── DESIGN.md               ← дизайн-система: токены, компоненты, правила (читать перед UI-работой)
├── nhl-api/                ← бэкенд-прокси (TypeScript, слои routes → services → upstream → http)
│   ├── src/
│   │   ├── index.ts        ← композиционный корень (ручной DI: config → NhlApi → сервисы → роутер)
│   │   ├── config/         ← порт, CORS-origin, upstream-URL (единый источник)
│   │   ├── types/          ← публичные контракты ответов (ping, news, error)
│   │   ├── http/           ← app, HttpClient (порт+axios), ProxyError, error-middleware
│   │   ├── upstream/       ← NhlApi: все NHL-эндпоинты поверх HttpClient
│   │   ├── services/       ← доменная логика: мерж лидеров, RSS-обрезка «Status: …»
│   │   └── routes/         ← Router на домен + валидация на границе (deps.ts — DI)
│   ├── API_DOCS.md         ← неофициальный справочник по NHL API (club-schedule, edge, gamecenter…)
│   └── README.md           ← описание прокси и его эндпоинтов
└── nhl-site/               ← фронтенд (Vite)
    └── src/
        ├── types/          ← ITeam, IPlayer(=ISkater|IGoalie), IStats, ISeason, INews, schedule.ts
        ├── services/nhlApi.ts  ← axios-клиент к http://localhost:3000/api
        ├── pages/          ← страница = TSX + одноимённый _page.scss
        └── components/
            ├── features/   ← Controls, Dropdown, TeamCard, PlayerCard, StatsTable, StandingsTable…
            └── layout/     ← Header, Footer, ScrollToTop, Loader (единый лоадер)
```

## Быстрый старт (два терминала)

```bash
# 1) бэкенд — http://localhost:3000
cd nhl-api
npm install
npm run server:dev          # или: node index.js

# 2) фронтенд — http://localhost:5173
cd nhl-site
npm install
npm run dev
```

| Команда (в `nhl-site/`) | Описание |
|---|---|
| `npm run dev` | Vite dev-сервер (:5173) |
| `npm run lint` | ESLint |
| `npx tsc -b` | Проверка типов |
| `npm run server:dev` (в `nhl-api/`) | сервер с nodemon + tsx (TypeScript без сборки) |
| `npm run build` / `npm start` (в `nhl-api/`) | сборка `tsc` → `dist/` и запуск из собранного |

Бэкенд слушает `0.0.0.0:3000`; CORS разрешает только origin `http://localhost:5173` и метод GET. Frontend `nhlApi.ts` жёстко указывает на `http://localhost:3000/api` — при смене порта править оба места (для работы с телефона закомментирован вариант `172.20.10.2`).

## Фронтенд (nhl-site)

**Стек:** React 19, TypeScript, Vite 7 (SWC), react-router-dom 7, axios, Sass.

**Роуты** (`src/components/App.tsx`, createBrowserRouter, общий Layout: Header + Outlet + Footer + ScrollToTop):

| Роут | Страница | Данные |
|---|---|---|
| `/` | Home — RSS-лента транзакций («Latest transfers») | `/api/news` |
| `/schedule` | Расписание лиги по дням | `/api/schedule/:date?` |
| `/game/:gameId` | Матч: шапка (счёт/статус), превью, три звезды, счёт по периодам, протокол (голы/штрафы), счёт-таблица | `/api/game/:gameId/landing` |
| `/standings/:season` | Таблицы: league / division / conference / wildcard (+ сезонный селектор) | `/api/standings/...`, `/api/standings-season` |
| `/stats/:season` | Топ-5 + модалка (1–50) лидеров: снайперы и вратари, 4 категории | `/api/stats/:season` |
| `/teams` | Карточки команд, две секции (Eastern / Western) | `/api/standings/now` |
| `/roster/:teamAbbrev` | Состав команды | `/api/roster/:teamAbbrev` |
| `/player/:playerId` | Карточка игрока (регулярка/плей-офф/карьера, ветка вратарей) | `/api/player/:playerId` |

**Конвенции:**
- Стили: Sass, BEM, один файл на страницу; всё собирается через `src/components/App.scss` (`@import` на каждый файл). Токены и общие правила — в `src/styles/global.scss`.
- Общие UI: `.page-title` (заголовок страницы с линией), `<Loader />` (layout/loader), `.button`, `.controls__button` (категории-табы), `.error-message`.
- Визуальный стиль и правила — строго по **DESIGN.md** (компактность, ч/б палитра + семантические цвета, никаких img без CSS-размера).

## Бэкенд (nhl-api)

**Стек:** Node 22, Express 5, TypeScript (tsx для dev, tsc → dist для запуска), axios, rss-parser, cors, nodemon.

Все маршруты — прозрачные прокси к NHL API с централизованным `try/catch` → `{ error }` + статус 5xx:

| Маршрут | Upstream | Заметки |
|---|---|---|
| `/api/ping` | — | health-check |
| `/api/teams` | `stats/rest/en/franchise` | (не используется фронтом) |
| `/api/standings/:season` | `api-web /v1/standings/{season}` | `season` = `now` или `standingsEnd` из standings-season |
| `/api/standings-season` | `api-web /v1/standings-season` | список сезонных id |
| `/api/stats/:season` | `skater-stats-leaders` + `goalie-stats-leaders` | два запроса через `Promise.all`, мерж `Object.assign`; `current` → `/current`, иначе `{season}/2` |
| `/api/roster/:teamAbbrev` | `/v1/roster/{team}/current` | валидация `^[A-Z]{3}$` → 400 |
| `/api/player/:playerId` | `/v1/player/{id}/landing` | |
| `/api/news` | RSS eliteprospects.com | обрезает `contentSnippet` до первой строки «Status: …» |
| `/api/schedule/:date` | `/v1/schedule/{date}` | `date` = `now` или `YYYY-MM-DD` (регэкс-валидация); без параметра → `now` |
| `/api/game/:gameId/landing` | `/v1/gamecenter/{id}/landing` | превью (`matchup`) для FUT, `summary` (голы/штрафы/звёзды) для сыгранных |
| `/api/game/:gameId/boxscore` | `/v1/gamecenter/{id}/boxscore` | состав и статистика игроков; на странице не используется (landing содержит score/sog) |
| `/api/game/:gameId/play-by-play` | `/v1/gamecenter/{id}/play-by-play` | сырые события; протокол собирается из landing.summary, эндпоинт — для будущих фич |

Валидация входных параметров на прокси (дат, аббревиатур) — осознанно, чтобы не пересылать мусор в NHL API.

## Ключевые решения и причины (зачем так сделано)

- **Прокси-шлюз вместо прямых запросов из браузера.** NHL API не отдаёт CORS на localhost:5173; плюс единая точка нормализации (RSS-парсинг, мерж статистики) и валидации. Альтернатива — Vite proxy middleware — не выбрана: прокси нужен и вне dev-сервера.
- **Два маршрута `/api/schedule` и `/api/schedule/:date` вместо одного `:date?`.** Express 5 (path-to-regexp v8) не поддерживает опциональные сегменты `:date?` — брошяет `TypeError` на старте (проверено).
- **Расписание по дням, а не по неделям.** `/v1/schedule/{date}` всегда возвращает 7 дней независимо от параметра; из каждой выборки рендерится только выбранный день (`pickDay` с фолбэком на ближайший день с играми). Навигация ←/→ сдвигает ровно на день, «Today» — локальная дата в формате `en-CA` (YYYY-MM-DD).
- **Клубное расписание** (`club-schedule-season/{team}/{season}`) — не реализовано; кандидаты на будущее: своя страница «Schedule команды», club-stats, игрок game-log, playoff bracket (см. `nhl-api/API_DOCS.md`; там же `limit=-1` = все результаты для стат-лидеров).
- **Единый `Loader` и `.page-title`** — раньше каждый лоадер и заголовок дублировались на каждой странице; вынесены в общие компоненты/классы.
- **Компактные таблицы** — по явному запросу пользователя плотность данных > воздуха: позже всё приведено к маленьким паддингам и шрифтам 0.7–1rem.

## Известные грабли (gotchas)

- **Express 5 + `:param?`** = TypeError при старте. См. решение выше.
- **`<img>` без CSS-размера** рендерится в натуральной величине (SVG-логотипы NHL огромны) — всегда задавать width/height + `object-fit: contain`.
- **`/v1/schedule/{date}` возвращает неделю**, а не один день — не рендерить `gameWeek` целиком, если UI по дням.
- **score у матчей опционален** (`score?: number`) — есть только у состоявшихся игр; TS строгий, `!`/`??` где следует.
- **Изменения `src/` в `nhl-api`** подхватывает nodemon автоматически (dev-режим); если запущен `npm start` без nodemon — нужен перезапуск. Мёртвая страница = проверить сначала бэкенд (`/api/ping`).
- **CORS origin жёстко `localhost:5173`** — при смене порта/хоста править `index.js` и `nhlApi.ts`.
- В `App.scss` старые `@import` дают deprecation-предупреждения Sass — это шум, не ошибка (но «expected }» = реально сломанный файл).
