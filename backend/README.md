# Gatto Mail Backend API

Express.js backend API for Gatto Mail application using ESM modules.

## Features

- Express.js REST API
- ESM modules (import/export)
- CORS enabled
- Environment variable configuration
- Structured routing and controllers
- Error handling middleware
- Email validation with SMTP verification
- Email discovery/guessing from name and domain
- Rate limiting (10 requests per hour per IP)

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Email Validation & Discovery
- `POST /api/v1/validate-email` - Validate email syntax and SMTP deliverability
- `POST /api/v1/check-email` - Generate and verify email guesses based on name and domain

### Emails (Sample endpoints)
- `GET /api/v1/emails` - Get all emails
- `GET /api/v1/emails/:id` - Get email by ID
- `POST /api/v1/emails` - Send new email
- `DELETE /api/v1/emails/:id` - Delete email

### Example Requests

#### Validate Email
```bash
curl -X POST http://localhost:5000/api/v1/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Response:
```json
{
  "success": true,
  "syntax": true,
  "deliverable": false
}
```

#### Check Email (Find email from name)
```bash
curl -X POST http://localhost:5000/api/v1/check-email \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "domain": "company.com"}'
```

Response (if found):
```json
{
  "success": true,
  "email": "john.doe@company.com",
  "message": "ok"
}
```

#### Send Email (Sample)
```bash
curl -X POST http://localhost:5000/api/v1/emails \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello",
    "body": "Email content here"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Route controllers
│   │   ├── checkEmailController.js  # Email discovery logic
│   │   ├── validateEmailController.js # Email validation logic
│   │   └── mailController.js        # Sample mail endpoints
│   ├── routes/                      # API routes
│   │   ├── emailCheckRoutes.js      # Email check/validate routes
│   │   ├── mailRoutes.js            # Sample mail routes
│   │   └── index.js                 # Main router
│   ├── utils/                       # Utility functions
│   │   ├── checkEmailSMTP.js        # SMTP verification
│   │   └── rateLimiter.js           # Rate limiting
│   ├── middleware/                  # Custom middleware
│   └── server.js                    # Main server file
├── .env                             # Environment variables
├── .env.example                     # Example environment variables
└── package.json                     # Dependencies and scripts
```

## Development

The backend runs independently from Next.js and can be deployed separately.
