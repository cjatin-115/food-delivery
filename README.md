# 🍜 TastyTrail — Minimalistic Food Delivery App

A soft, minimal fullstack food-delivery web app: browse restaurants, explore menus,
build a cart, check out and track your order — frontend, backend and database included.

## Stack (this workspace)

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS v4 | All pages & UI |
| Backend | Next.js Route Handlers (`src/app/api/**`) | REST API + validation |
| Database | PostgreSQL + Drizzle ORM (`src/db/**`) | Data layer |

> This sandbox runs **Next.js + PostgreSQL** (the platform runtime). It plays exactly the
> same role as **Spring Boot + MySQL**: an API layer talking to a relational database.
> The architecture maps 1:1 — see *Mapping to Spring Boot* at the bottom.

## Run it in VS Code

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL (local or Docker)
docker run -d --name tastytrail-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app_db -p 5432:5432 postgres:16

# 3. Point .env at your database
echo "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db" > .env

# 4. Create the tables and seed 6 restaurants + 45 menu items
npm run db:push
npm run db:seed

# 5. Start the dev server
npm run dev    # → http://localhost:3000
```

## Features

- **Home** — hero with search, cuisine shortcuts, "loved near you" grid, how-it-works
- **Browse** — `/restaurants` with live search, cuisine pills and 5 sort options
- **Menus** — `/restaurants/[slug]` with category-grouped menus, veg/non-veg marks,
  bestseller tags, quantity steppers and a sticky cart bar
- **Cart** — `/cart` with quantity controls, free-delivery progress and validated checkout
- **Orders** — `/orders` list (filter by phone) and `/orders/[id]` live 5-step tracker
- **Toasts**, soft pastel design system, responsive on mobile and desktop

## API reference

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/restaurants?q=&cuisine=&sort=` | List / filter / sort restaurants |
| `GET` | `/api/restaurants/[slug]` | One restaurant + full menu |
| `GET` | `/api/orders?phone=` | List orders (optional phone filter) |
| `POST` | `/api/orders` | Place an order (server re-computes the bill) |
| `GET` | `/api/orders/[id]` | Order details |
| `PATCH` | `/api/orders/[id]` | Advance status: `placed → confirmed → preparing → on_the_way → delivered` |

Example:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Aarav Sharma","phone":"9876543210",
       "address":"42 MG Road, Bengaluru 560001","restaurantId":1,
       "restaurantName":"Nonna'"'"'s Wood-Fired Pizza","restaurantEmoji":"🍕",
       "items":[{"id":1,"name":"Margherita Pizza","price":24900,"emoji":"🍕","qty":2}]}'
```

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Home
│   ├── restaurants/                # Browse + restaurant detail (menu)
│   ├── cart/page.tsx               # Cart + checkout form
│   ├── orders/                     # Order list + live tracking
│   └── api/                        # Backend REST routes
├── components/                     # Header, Footer, cards, cart, tracker, icons…
├── db/
│   ├── schema.ts                   # restaurants, menu_items, orders tables
│   └── index.ts                    # Drizzle + pg pool
└── lib/                            # queries, formatting, constants, order status
seed.sql                            # 6 restaurants · 45 menu items
```

## Mapping to Spring Boot + MySQL

If you later move the backend to **Spring Boot + MySQL**, the mapping is:

| Here (Next.js + Postgres) | Spring Boot + MySQL |
| --- | --- |
| `src/db/schema.ts` tables | `@Entity` JPA classes |
| `src/lib/queries.ts` | `@Repository` / `JpaRepository` |
| `src/app/api/**/route.ts` | `@RestController` |
| Drizzle `db.select()` | `repository.findAll()` |
| JSON validation in `route.ts` | `@Valid` + Bean Validation |
| `DELIVERY_FEE` in `lib/constants.ts` | `application.properties` config |

The React frontend would stay almost identical — only the fetch URLs change.
