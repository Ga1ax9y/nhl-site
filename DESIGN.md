# DESIGN — дизайн-система NHL Site

Справочник по текущему визуальному стилю приложения. Читай этот файл, чтобы новые страницы/компоненты выглядели единообразно. Актуально на 19.10.2026.

## Архитектура стилей

- **Sass**, один файл на страницу/компонент, всё собирается через `src/components/App.scss` (`@import` без штриха — перед точкой входа).
- **Именование: BEM** — `.block`, `.block__element`, `.block__element--modifier`. Модификаторы активного состояния: `--active`.
- Каждый SCSS-файл — один корневой класс (`standings`, `teams`, `stats`, `roster`, `player`, `news`, `header`...).
- Стили **не скоупятся**, имена классов — единственная изоляция. Не переиспользовать чужой префикс.
- Контентные таблицы реализованы не `<table>`-строками, а `display: grid` на `tr`/div с фикс. колонками `Xpx 1fr Xpx...`.

## Дизайн-токены (из `src/styles/global.scss :root`)

### Цвета
| Токен | Значение | Использование |
|---|---|---|
| `--color-dark` | `#000000` | Основной текст, тёмные кнопки, активные элементы |
| `--color-dark-alternate` | `#333333` | Шапка сайта, фон таблиц (`thead`), hover кнопок |
| `--color-dark-hover` | `#a9a9a9` | Hover ссылок/активных кнопок |
| `--color-light` | `#FFFFFF` | Фон, текст на тёмном |
| `--color-light-alternate` | `#F8F8F8` | Hover строк, секционные подложки |
| `--color-gray` | `#EEEEEE` | Разделители (1px), бордеры аватаров, скроллбар |

Семантические цвета (не токены, используются прямо):
- Wins: `#008f48` (зелёный), Losses: `#e53935` (красный), Games: `#0864f7` (синий), Points — тёмный/жирный.
- Ошибки: `#d32f2f` + фон `rgba(211,47,47,0.1)` (`.error-message`).

Ни тёмной темы, ни акцентного цвета нет — палитра строго ч/б + эти акценты.

### Типографика
- `--font-family-base: 'Inter', sans-serif` — весь UI (локальные woff2 в `src/styles/fonts`).
- `--font-family-alternate: 'Roboto Slab', serif` — заголовки (глобальные `h1–h6`: weight 700, line-height 1.2).
- Body: 16px, line-height 1.6.
- Заголовок секции (`h1` страницы): **1.5rem**, по центру, `padding-bottom: 0.6rem`, под ним декоративная линия-`::after` (по центру, 60px × 2px, тёмная). Это фирменный приём — повторять на новых страницах.
- Подзаголовки блоков: 1.1–1.5rem.

### Размеры и отступы
- `--container-width: 1200px`, `--container-padding-x: 15px`, `.container = max-width + auto margins`.
- `--transition-duration: 0.2s` — все транзишены.
- Секция страницы: `padding: 2rem var(--container-padding-x)` (мобайл: `1rem`).
- Радиусы: мелкие элементы 4–6px, карточки 8–12px, «пилюли» (позиция игрока, бейджи) — `border-radius: 20px` / полностью круглые.
- Тени: лёгкие — `0 2px 15px rgba(0,0,0,0.05)` таблицы, `0 4px 12px rgba(0,0,0,0.08–0.15)` карточки, `0 10px 30px` модалка.

## Базовые компоненты (как должны выглядеть новые)

### Таблицы данных (standings, stats)
- Фон белый, `border-radius: 8px`, `overflow: hidden`, тонкая тень.
- Шапка: `--color-dark-alternate`, текст светлый, `font-size: 0.7–0.8rem`, uppercase, `letter-spacing: 0.5px`, padding `8px 12px`.
- Строки: padding `6–12px`, разделитель `1px solid --color-gray`, hover — `--color-light-alternate` + pointer.
- Цифры статов по центру; значение-акцент (points) — жирнее/темнее остальных.
- `compact-first`: плотные строки — норма, на экран должно влезать много данных (пользователь явно просил компактность).

### Кнопки
- **Primary** (`.button`): тёмный фон (`--color-dark`), светлый текст, `border-radius: 4px`, hover `--color-dark-alternate`, min-width 200px.
- **Категории/таbs** (`.controls__button`): прозрачный фон + `2px solid` тёмная рамка, uppercase, width 140px, активная = инвертирована (тёмный фон, светлый текст), hover — тёмный фон + `translateY(-2px)`.
- **Вторичные** (`.stats__button`-стиль): тёмная заливка, radius 6px, padding `0.6rem 1.4rem`, hover приподнимается.
- Общее: hover/active со сдвигом `translateY(-2px)` и лёгкой тенью — фирменный паттерн интерактива.

### Селект сезона (`Dropdown`)
Кастомный `<select>`: `2px solid` тёмная рамка, radius 6px, padding `0.8rem`, собственная стрелка-треугольник через `::after` родителя (`.appearance: none`). Прижат к правому краю.

### Модалка (Stats)
Overlay `rgba(0,0,0,0.6)` + белое окно radius 12px, max-width 800px, max-height 80vh, scroll внутри (тонкий скроллбар), крестик сверху справа, анимация появления scale 0.9→1 (0.3s). При открытии body фиксируется от скролла (JS).

### Карточки (TeamCard, PlayerCard, stat-card)
Белая карточка radius 8–12px, лёгкая тень, hover: `translateY(-3..-5px)` + усиление тени; аватар/логотип круглый с рамкой `--color-gray`/`--color-dark`.

### Лоадеры / ошибки
- Loader: `min-height 200px`, по центру, текст "Loading..." + спиннер (круг с анимацией `spin`, border `--color-gray`, верх — тёмный).
- `.error-message`: центрированный блок 2rem padding, красная гамма `#d32f2f` (или просто тёмный текст 1.2rem на player).

## Раскладка

- Верхняя навигация (`.header`): тёмная полоса 72px (`--color-dark-alternate`), логотип слева (55×65), меню текстом справа; на `<=640px` — бургер + fullscreen overlay-меню с анимацией slideDown, пункты — светлые «пилюли» uppercase.
- Footer — тёмный, простой.
- ScrollToTop — плавающая кнопка, показывается после прокрутки (поддерживает контейнер для модалки).

## Адаптивность — брейкпоинты

| Брейкпоинт | Что ломается |
|---|---|
| `<= 1024px` | (если используется) |
| `<= 768px` | Плейсхолдеры stats, карточки игрока grid 5→3→2 колонки, размеры контролов |
| `<= 640px` | Бургер-меню вместо навигации; шапки tables 1.4rem; grid команд 8→5 колонок |
| `<= 480px / 420px / 380px` | Дальнейшее ужимание таблиц (шрифты 0.8–0.95rem, лого 26–40px), колонки до 4 |
| `prefers-reduced-motion` | Все анимации/транзишены отключаются |

## Иконки и изображения

- Логотипы команд — внешние CDN URL из NHL API (`teamLogo`), рендер через `object-fit: contain` с жёсткими width/height в CSS (обязательно! иначе рендерятся в натуральном размере).
- Хедшоты игроков — круглые, `object-fit: cover`.
- SVG в коде (бургер и т.п.) — инline, `stroke: currentColor`.

## Do / Don't (чтобы не ломать стиль)

- ✅ Новый заголовок секции = `.page__title` с `::after`-линией 60×2px по центру.
- ✅ Новая таблица = grid-строки, тёмная шапка uppercase 0.7–0.8rem, строки 6–12px.
- ✅ Все размеры в `rem`/`px` (не крупнее указанных выше значений — компактность важна).
- ❌ Не вводить новые цвета вне палитры (только перечисленные семантические).
- ❌ Не делать крупные заголовки >1.5–2rem и щедрые отступы >2rem.
- ❌ Не оставлять `<img>` без CSS-размера.
- ❌ Не использовать sticky/floating хедеров и тяжёлых фонов — стиль минималистичный ч/б.

## Структура исходников

```
nhl-site/src/
├── styles/            # глобальные токены, шрифты (woff2), global.scss
├── components/
│   ├── App.scss/.tsx  # точка входа стилей + роуты + Layout
│   ├── layout/        # header, footer, scrollToTop, loader (scss рядом)
│   │                  # Loader — единый лоадер всех страниц: <Loader /> / <Loader label="..."/>
│   └── features/      # Controls, Dropdown, TeamCard, PlayerCard,
│                      # StatsTable, StandingsTable, StandingsCell
├── pages/             # TSX страница + _page.scss рядом
├── services/nhlApi.ts # axios к прокси http://localhost:3000/api
└── types/             # ITeam, IPlayer(=ISkater|IGoalie), IStats, ISeason,
                       # INews, schedule.ts (ILeagueSchedule, IScheduleGame)
```
