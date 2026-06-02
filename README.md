# ArthaFlow

A personal finance tracker mobile app to manage income and expenses across categories.

## Features

- Track income and expenses with categories
- Dashboard summary (balance, income, expense totals)
- Transaction history with delete support
- Session-based authentication
- API rate limiting

## Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Mobile        | React Native 0.81, Expo 54, Expo Router, TypeScript |
| Backend       | Bun, Express 5, TypeScript                          |
| Auth          | Better Auth                                         |
| Database      | PostgreSQL (NeonDB) + Drizzle ORM                   |
| Validation    | Zod                                                 |
| Rate Limiting | Upstash Redis                                       |
| Deployment    | Render                                              |

## Project Structure

```text
arthFlow-mobile/
├── mobile/     # Expo React Native app
└── server/     # Bun + Express REST API
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- NeonDB PostgreSQL database
- Upstash Redis instance

### Environment Variables

**Server** (`server/.env`):

```env
PORT=3000
DATABASE_URL=
BETTER_AUTH_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Mobile** (`mobile/.env`):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Running Locally

```bash
# Server
cd server
bun install
bun run db:generate
bun run db:migrate
bun run dev

# Mobile (separate terminal)
cd mobile
bun install
bun run start
```

## API

| Method   | Endpoint                           | Description           |
| -------- | ---------------------------------- | --------------------- |
| `GET`    | `/api/transaction/:userId`         | Get user transactions |
| `POST`   | `/api/transaction`                 | Create a transaction  |
| `DELETE` | `/api/transaction/:id`             | Delete a transaction  |
| `GET`    | `/api/transaction/summary/:userId` | Get balance summary   |
| `GET`    | `/health`                          | Health check          |

Deployed on **Render**.
