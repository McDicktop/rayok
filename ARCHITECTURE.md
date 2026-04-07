# Архитектура приложения — Студия «Раёк»

## Структура монорепозитория

```
rayok/
├── frontend/          # SvelteKit-приложение
└── backend/           # Node.js REST API
```

---

## Frontend (`rayok/frontend`)

### Стек

| Инструмент | Версия | Роль |
|---|---|---|
| SvelteKit | ^2.x | Фреймворк (роутинг, SSR/SPA) |
| Svelte | ^4.x | UI-компоненты |
| Tailwind CSS | ^4.x | Стилизация (только utility-классы, без `<style>`) |
| Vite | ^7.x | Сборщик |
| `@tailwindcss/typography` | ^0.5.x | Плагин для prose-контента |

> **Важно:** используется **Svelte 5**, синтаксис компонентов — runes (`$state`, `$derived`, `$effect`) или legacy (`export let`, `on:`, `$:`). В проекте пока применяется legacy-синтаксис — не менять без явного запроса.

### Структура директорий

```
frontend/
├── src/
│   ├── app.html                        # HTML-шаблон
│   ├── routes/
│   │   ├── +layout.svelte              # Корневой layout (импорт Tailwind через layout.css)
│   │   ├── layout.css                  # @import 'tailwindcss'; @plugin typography
│   │   ├── +page.svelte                # Публичная страница: список мероприятий
│   │   └── admin/
│   │       ├── +page.svelte            # «Админ панель»
│   │       └── event/
│   │           ├── new/
│   │           │   └── +page.svelte    # Форма создания мероприятия
│   │           └── [id]/
│   │               └── +page.svelte    # Просмотр / редактирование мероприятия
│   └── lib/
│       ├── index.js
│       ├── assets/
│       │   └── favicon.svg
│       └── components/
│           └── Modal.svelte            # Переиспользуемый модальный компонент
├── package.json
├── svelte.config.js
└── vite.config.js
```

### Роутинг

| Маршрут | Файл | Назначение |
|---|---|---|
| `/` | `routes/+page.svelte` | Публичная афиша: сетка карточек мероприятий с фильтром по категориям |
| `/admin` | `routes/admin/+page.svelte` | Точка входа в панель администратора |
| `/admin/event/new` | `routes/admin/event/new/+page.svelte` | Форма создания мероприятия (multipart/form-data) |
| `/admin/event/[id]` | `routes/admin/event/[id]/+page.svelte` | Просмотр (view) + inline-редактирование (edit) мероприятия |

### Proxy

В `vite.config.js` запросы `/api/*` проксируются на `http://localhost:3000`, при этом префикс `/api` обрезается:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

Таким образом, `fetch('/api/event')` на фронте → `GET http://localhost:3000/event` на бэке.

### Дизайн-система

Все визуальные токены — через Tailwind-утилиты или CSS-переменные в `layout.css`. Шрифты подключаются через Google Fonts в `<svelte:head>` каждой страницы:

- **Playfair Display** — заголовки, цены, логотип
- **Jost** — основной текст, навигация, формы

Цветовая палитра:

| Токен | Hex | Использование |
|---|---|---|
| Фон | `#111009` | `body`, карточки (`#1a1810`) |
| Основной текст | `#e8e0d0` | Контент |
| Золото (акцент) | `#c9a84c` | Иконки, ссылки, активные элементы |
| Мутный текст | `#9a9080` | Метаданные, лейблы |
| Ошибка | `#c0392b` | Деструктивные действия |

### Компонент Modal

`$lib/components/Modal.svelte` — universal-модалка с пропсами:

```svelte
<Modal bind:open={showModal} title="Заголовок">
  <!-- слот: контент + кнопки -->
</Modal>
```

Закрывается кликом по backdrop. Стилизуется через Tailwind-классы (не `<style>`).

---

## Backend (`rayok/backend`)

### Стек

| Инструмент | Версия | Роль |
|---|---|---|
| Node.js | — | Среда выполнения |
| Express | ^5.x | HTTP-фреймворк |
| Mongoose | ^9.x | ODM для MongoDB |
| Multer | ^2.x | Парсинг `multipart/form-data`, хранение в памяти |
| AWS SDK v3 | ^3.x | Загрузка изображений в S3-совместимое хранилище (MinIO) |
| dotenv | ^17.x | Переменные окружения |
| uuid | ^13.x | Генерация ключей файлов |
| nodemon | ^3.x | Dev-режим |

### Структура директорий

```
backend/
├── index.js                    # Точка входа: Express + Mongoose
├── routes/
│   └── event.router.js         # Все маршруты смонтированы на "/"
├── controllers/
│   └── eventController.js      # Класс EventController, экспортируется как { controller }
├── models/
│   └── event.js                # Mongoose-схемы Event и Category
├── middlewares/                 # (зарезервировано)
├── utils/
│   ├── eventValidator.js       # Валидаторы полей (чистые функции)
│   ├── multer.js               # Конфигурация multer + обёртка multerErrorHandler
│   └── s3.js                   # uploadToS3 / listS3Objects / deleteFromS3
└── package.json
```

### REST API

Базовый URL: `http://localhost:3000` (без префикса `/api`).

#### Мероприятия

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/event` | Список всех мероприятий |
| `POST` | `/event` | Создать мероприятие (`multipart/form-data`) |
| `PUT` | `/event/:id` | Обновить мероприятие (`multipart/form-data`) |
| `DELETE` | `/event/:id` | Удалить мероприятие + файлы из S3 |
| `POST` | `/event/status/:id` | Сменить статус `{ status }` |
| `GET` | `/event/files` | Листинг S3-бакета (query: `?prefix=cover/`) |

#### Категории

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/event/category` | Список категорий |
| `POST` | `/event/category` | Создать категорию `{ slug, label }` |
| `PUT` | `/event/category/:id` | Обновить категорию |
| `DELETE` | `/event/category/:id` | Удалить (нельзя, если есть мероприятия) |

#### Формат тела POST/PUT `/event`

Тело — `multipart/form-data`. Скалярные поля — строки, объекты передаются как JSON-строки:

```
title             string (required)
description       string (required)
category          ObjectId string (required)
cancellationPolicy string
pricing           JSON: { amount: number }
booking           JSON: { type: "ticket"|"request", ticketUrl?: string, maxParticipants: number }
schedule          JSON: { dates: string[] }
duration          JSON: { minutes: number, isApproximate: boolean }
restrictions      JSON: { ageMin: number, ageMax: number, requiresAdult: boolean }
organizer         JSON: { name: string, email: string, phone: string }
seo               JSON: { metaTitle: string, metaDescription: string, slug: string }
cover             File (image/jpeg|png|webp, max 10 MB)
gallery           File[] (до 5 файлов)
```

### Модели MongoDB

#### `Category`

```
slug    String  unique, required
label   String  required
```

#### `Event`

```
title              String   (max 200)
description        String   (max 5000)
category           ObjectId → Category
media.cover        String   (URL изображения, required)
media.gallery      String[] (URL изображений)
pricing.amount     Number   (0–100000)
pricing.isFree     Boolean  (вычисляется pre-save: amount === 0)
booking.type       "ticket" | "request"
booking.ticketUrl  String   (required при type=ticket)
booking.maxParticipants Number (1–100)
schedule.isSubscription Boolean (true если дат > 1)
schedule.dates     Date[]
restrictions.ageMin  Number (0–100, default 0)
restrictions.ageMax  Number (0–100, default 100)
restrictions.requiresAdult Boolean
duration.minutes   Number (15–1440)
duration.isApproximate Boolean
organizer.name     String
organizer.email    String
organizer.phone    String
status             "published" | "unpublished" | "archived"  (default "unpublished")
cancellationPolicy String
seo.metaTitle      String
seo.metaDescription String
seo.slug           String  unique, sparse (auto-генерируется из title если пусто)
```

**Бизнес-правила (pre-save middleware):**
- Абонемент (`isSubscription`) только при `booking.type === "ticket"`
- Абонемент требует минимум 2 даты
- `booking.type === "ticket"` → `ticketUrl` обязателен
- `ageMin` ≤ `ageMax`
- Даты сортируются по возрастанию
- Slug авто-транслитерируется из `title` если не задан

### Загрузка файлов

1. Multer принимает файлы в `memoryStorage` (буфер в RAM).
2. `uploadToS3(file, folder)` загружает в MinIO/S3, возвращает публичный URL вида `${S3_ENDPOINT}/${BUCKET}/${folder}/${uuid}${ext}`.
3. При удалении/обновлении мероприятия старые файлы удаляются из S3 через `deleteFromS3(key)`.

### Переменные окружения (`.env`)

```
PORT=3000
DB_URL=mongodb://...
S3_ENDPOINT=http://...
S3_REGION=us-east-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
```

---

## Взаимодействие слоёв

```
Browser
  │  fetch('/api/event')
  ▼
Vite Dev Server (proxy: /api → localhost:3000)
  │  GET /event
  ▼
Express (backend/index.js → routes/event.router.js)
  │
  ├── Multer middleware (парсинг файлов)
  ├── EventController
  │     ├── eventValidator.js  (валидация полей)
  │     ├── Event / Category   (Mongoose → MongoDB)
  │     └── s3.js              (загрузка/удаление файлов)
  │
  └── JSON response
```

---

## Соглашения разработки

- **Стили** — только Tailwind utility-классы в атрибутах `class=""`. Блок `<style>` в `.svelte`-файлах **не используется**.
- **Шрифты** — подключаются через `<svelte:head>` на каждой странице (Google Fonts).
- **API-запросы** — всегда через `/api/...` на фронте (Vite proxy обрезает `/api`).
- **Медиафайлы** — хранятся только в S3 (MinIO). В MongoDB хранятся только URL.
- **Статус мероприятия** меняется отдельным эндпоинтом `POST /event/status/:id`, а не через общий `PUT /event/:id`.
- **`booking.type` нельзя изменить** после создания мероприятия.
- **Категорию нельзя удалить**, если к ней привязаны мероприятия.
