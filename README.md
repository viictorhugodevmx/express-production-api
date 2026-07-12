# Express Production API

Production-oriented REST API foundation built with Express, TypeScript and Node.js.

The project focuses on infrastructure, security, observability and operational reliability rather than business-specific features. It provides a reusable backend base for APIs that need consistent error handling, request tracing, health monitoring and production-ready middleware.

## Main Features

- Express 5
- TypeScript with strict mode
- Centralized environment configuration
- Structured JSON logs
- Request tracing with `X-Request-Id`
- Request duration logging
- `X-Response-Time` header
- `Server-Timing` header
- Security headers with Helmet
- Configurable CORS validation
- Global rate limiting
- JSON body size limits
- Invalid JSON handling
- `Content-Type` validation
- HTTP response compression
- Global request timeout
- Centralized error handling
- Consistent API error responses
- Health endpoint
- Readiness endpoint
- Graceful shutdown
- Automated smoke test

## Tech Stack

- Node.js 20
- TypeScript 5.9
- Express 5
- Helmet
- CORS
- Express Rate Limit
- Compression
- dotenv
- ts-node-dev

## Project Structure

```text
src/
├── config/
│   └── env.ts
├── modules/
│   └── health/
│       ├── health.controller.ts
│       └── health.routes.ts
├── shared/
│   ├── errors/
│   │   └── app-error.ts
│   ├── middlewares/
│   │   ├── compression.middleware.ts
│   │   ├── content-type.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── not-found.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── request-id.middleware.ts
│   │   ├── request-logger.middleware.ts
│   │   ├── request-timeout.middleware.ts
│   │   └── response-time.middleware.ts
│   └── utils/
│       ├── async-handler.ts
│       └── logger.ts
├── types/
│   └── express.d.ts
├── app.ts
└── server.ts

scripts/
└── smoke-test.sh
```

## Requirements

- Node.js `20.19.4`
- npm
- curl
- jq

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

## Environment Variables

| Variable | Description | Default example |
|---|---|---|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | HTTP server port | `3003` |
| `APP_NAME` | Application identifier | `express-production-api` |
| `CORS_ORIGIN` | Allowed origin or comma-separated origins | `http://localhost:5173` |
| `JSON_BODY_LIMIT` | Maximum accepted JSON body size | `100kb` |
| `REQUEST_TIMEOUT_MS` | Maximum request duration in milliseconds | `5000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit time window | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per client during the window | `100` |

Multiple CORS origins can be configured using commas:

```env
CORS_ORIGIN=http://localhost:5173,https://example.com
```

## Development

Start the API with automatic reload:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3003
```

## Build

Compile TypeScript:

```bash
npm run build
```

## Production Start

Compile and run the generated JavaScript:

```bash
npm run build
npm start
```

## Available Endpoints

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "app": "express-production-api",
  "environment": "development",
  "requestId": "56f0df55-7822-4ce8-a6c5-cadab4d3f90e",
  "uptimeSeconds": 20.41,
  "timestamp": "2026-07-12T15:00:00.000Z"
}
```

### Readiness Check

```http
GET /api/health/readiness
```

Example response:

```json
{
  "status": "ready",
  "app": "express-production-api",
  "requestId": "c9acd63b-a830-4c30-8798-1bdac4baa913",
  "checks": {
    "environment": true,
    "port": true,
    "corsOrigin": true,
    "rateLimit": true
  },
  "timestamp": "2026-07-12T15:00:00.000Z"
}
```

## Request Tracing

Every request receives an identifier through:

```http
X-Request-Id
```

Clients may also provide their own identifier:

```bash
curl -i \
  http://localhost:3003/api/health \
  -H "X-Request-Id: frontend-request-001"
```

The same identifier is included in:

- Response headers
- API responses
- Structured logs
- Error logs

## Performance Headers

Responses include:

```http
X-Response-Time: 2.15ms
Server-Timing: app;dur=2.15
```

These headers help inspect application response time from clients, browsers and monitoring tools.

## Error Format

Controlled errors follow a consistent structure:

```json
{
  "message": "Route not found",
  "code": "ROUTE_NOT_FOUND",
  "requestId": "ec994ed1-5549-405e-824f-20f12f7dfa55"
}
```

Unknown routes also include the requested path:

```json
{
  "message": "Route not found",
  "code": "ROUTE_NOT_FOUND",
  "path": "/api/unknown",
  "requestId": "ec994ed1-5549-405e-824f-20f12f7dfa55"
}
```

## HTTP Protections

The API includes:

- Security headers
- Hidden Express technology header
- Origin validation
- Request rate limiting
- JSON payload size limits
- Invalid JSON detection
- Unsupported media type detection
- Global request timeout
- Response compression

## Smoke Test

Start the API:

```bash
npm run dev
```

In another terminal:

```bash
npm run smoke:test
```

The smoke test validates:

- Health endpoint
- Readiness endpoint
- HTTP status codes
- Request IDs
- Response timing headers
- Hidden `X-Powered-By` header
- Standardized `404` responses

A successful execution ends with:

```text
Smoke test summary
Passed: 12
Failed: 0

Smoke test completed successfully
```

A custom URL can also be used:

```bash
BASE_URL=https://api.example.com npm run smoke:test
```

## Graceful Shutdown

The server handles:

```text
SIGINT
SIGTERM
```

When one of these signals is received, the application:

1. Stops accepting new connections.
2. Waits for active requests to finish.
3. Closes the HTTP server.
4. Exits with the appropriate process code.
5. Forces shutdown after the configured safety timeout if necessary.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run smoke:test
```

## Future Extensions

This infrastructure can be extended with:

- Database connections
- Authentication and authorization
- Business modules
- Redis
- Background jobs
- OpenAPI documentation
- Automated unit and integration tests
- Docker
- CI/CD pipelines
- Metrics and distributed tracing

## Author

Víctor Hugo Segundo Aguilar

Frontend Developer with experience in React, Angular, JavaScript and TypeScript, expanding backend expertise with Node.js and production-oriented API architecture.
