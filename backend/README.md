# Gatto Mail Backend API

Express.js backend API for Gatto Mail application using ESM modules.

## Features

- Express.js REST API
- ESM modules (import/export)
- CORS enabled
- Environment variable configuration
- Structured routing and controllers
- Error handling middleware

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

### Emails
- `GET /api/v1/emails` - Get all emails
- `GET /api/v1/emails/:id` - Get email by ID
- `POST /api/v1/emails` - Send new email
- `DELETE /api/v1/emails/:id` - Delete email

### Example Request

```bash
# Get all emails
curl http://localhost:5000/api/v1/emails

# Send email
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
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .env.example         # Example environment variables
└── package.json         # Dependencies and scripts
```

## Development

The backend runs independently from Next.js and can be deployed separately.
