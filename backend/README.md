# Gatto Mail Backend API

Express.js backend API for Gatto Mail application using ESM modules.

## Features

- Express.js REST API
- ESM modules (import/export)
- CORS enabled (all origins)
- Environment variable configuration
- Structured routing and controllers
- Error handling middleware
- Email validation with SMTP verification
- Email discovery/guessing from name and domain
- Rate limiting (10 requests per hour per IP)

## Getting Started

### Development Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

### Production Setup

```bash
npm start
```

### Docker Setup

#### Build and run with Docker

```bash
# Build the image
docker build -t gatto-mail-backend .

# Run the container
docker run -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e API_PREFIX=/api/v1 \
  gatto-mail-backend
```

#### Using Docker Compose (Recommended)

From the project root:
```bash
docker-compose up -d backend
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=3001
NODE_ENV=development
API_PREFIX=/api/v1
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Email Validation & Discovery
- `POST /api/v1/validate-email` - Validate email syntax and SMTP deliverability
- `POST /api/v1/check-email` - Generate and verify email guesses based on name and domain

### Example Requests

#### Health Check
```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-11-01T12:00:00.000Z"
}
```

#### Validate Email
```bash
curl -X POST http://localhost:3001/api/v1/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Response:**
```json
{
  "success": true,
  "syntax": true,
  "deliverable": false
}
```

#### Check Email (Find email from name)
```bash
curl -X POST http://localhost:3001/api/v1/check-email \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "domain": "company.com"}'
```

**Response (if found):**
```json
{
  "success": true,
  "email": "john.doe@company.com",
  "message": "ok"
}
```

**Response (if not found):**
```json
{
  "success": false,
  "message": "No valid email found"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/                      # Configuration files
│   │   └── index.js                 # Environment config
│   ├── controllers/                 # Route controllers
│   │   ├── checkEmailController.js  # Email discovery logic
│   │   └── validateEmailController.js # Email validation logic
│   ├── routes/                      # API routes
│   │   ├── emailCheckRoutes.js      # Email check/validate routes
│   │   └── index.js                 # Main router
│   ├── utils/                       # Utility functions
│   │   ├── checkEmailSMTP.js        # SMTP verification
│   │   └── rateLimiter.js           # Rate limiting middleware
│   └── server.js                    # Main server file
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Example environment variables
├── .dockerignore                    # Docker ignore file
├── Dockerfile                       # Docker configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with --watch flag

## Development Notes

- The backend runs independently and can be deployed separately from the frontend
- Port 25 access is required for SMTP email verification
- Rate limiting is configured to 10 requests per hour per IP address
- CORS is configured to allow all origins (*)

## Troubleshooting

### Port 25 is blocked
Some ISPs and hosting providers block port 25. For email verification to work, you need to:
- Deploy on a VPS that allows outbound port 25 connections
- Or use a hosting provider that doesn't block SMTP ports

### Rate limit errors
If you're getting rate limited, wait an hour or adjust the limits in `src/utils/rateLimiter.js`
