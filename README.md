# Gatto Mail

<p align="center">
  <img src="https://gatto.suonora.com/logo-black.png" alt="Gatto Mail Logo (Light Mode)" width="120" style="background:#fff;" />
  <img src="https://gatto.suonora.com/logo-white.png" alt="Gatto Mail Logo (Dark Mode)" width="120" style="background:#222;" />
</p>

## What is Gatto Mail?

**Gatto Mail** is a free, open source email finder and validator. It helps you find and verify professional email addresses using only a name and company domain. No signup required. Built for privacy and transparency.

- **Live preview:** [gatto.suonora.com](https://gatto.suonora.com)
- **Source code:** [https://github.com/zecod/gatto-mail](https://github.com/zecod/gatto-mail)

---

## How does it work?

1. **Generate emails:**

   - From the first and last name, Gatto Mail generates the most common email permutations (e.g. `firstlast@company.com`, `first.last@company.com`, `last@company.com`, etc).

2. **Check mail server:**

   - Determines if the domain has valid MX records (mail server entries).

3. **Check connection:**

   - Simulates sending an email by connecting to the mail server via SMTP (no real email is sent).

4. **Check Catch-All:**
   - To check if an address is valid, we ask the mail server if it knows this address. Some mail servers do not reply or do not provide verification, so we can't always verify if an email is valid or not.

**Notice:** Some mail servers do not reply or do not provide verification, so we can't always verify if an email is valid or not.

---

## Architecture

Gatto Mail uses a modern stack with separated frontend and backend:

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Express.js with ESM modules (standalone API)
- **Deployment**: Docker & Docker Compose ready

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to run the entire application:

```bash
# Clone the repository
git clone https://github.com/zecod/gatto-mail.git
cd gatto-mail

# Start with Docker Compose
docker-compose up -d
```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

### Option 2: Manual Setup

#### Frontend

```bash
# Install dependencies
npm install  # or pnpm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev  # or pnpm dev
```

Frontend will run at [http://localhost:3000](http://localhost:3000)

#### Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start server
npm run dev  # Development mode
npm start    # Production mode
```

Backend API will run at [http://localhost:3001](http://localhost:3001)

---

## API Usage

The backend API runs independently on port 3001. All API endpoints are prefixed with `/api/v1`.

### Check Email

Find and verify email addresses based on name and domain:

```bash
curl -X POST http://localhost:3001/api/v1/check-email \
  -H "Content-Type: application/json" \
  -d '{"name": "Sam Altman", "domain": "openai.com"}'
```

**Response:**

```json
{
  "success": true,
  "email": "sam@openai.com",
  "message": "ok"
}
```

### Validate Email

Validate email syntax and check SMTP deliverability:

```bash
curl -X POST http://localhost:3001/api/v1/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "sam@openai.com"}'
```

**Response:**

```json
{
  "success": true,
  "syntax": true,
  "deliverable": true
}
```

### Health Check

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

---

## Docker Deployment

### Building and Running

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services

Build and run services separately:

```bash
# Backend only
docker build -t gatto-mail-backend ./backend
docker run -p 3001:3001 gatto-mail-backend

# Frontend only
docker build -t gatto-mail-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 gatto-mail-frontend
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

#### Backend (backend/.env)
```
PORT=3001
NODE_ENV=production
API_PREFIX=/api/v1
```

---

## Project Structure

```
gatto-mail/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Express server
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Frontend Docker config
└── README.md
```

---

## Important Notice ⚠️

- **Port 25 Block:**

  - The app needs to connect to mail servers via SMTP (port 25). Some ISPs and hosting providers block port 25 by default, so the email validation may not work locally. For best results, deploy on a VPS or a provider that allows outbound connections on port 25.

- **Privacy:**

  - No emails are stored. All checks are performed in real time and are never saved or shared.

- **Rate Limiting:**

  - Default rate limit is 5 requests per hour per user to prevent spam and abuse.

- **Legal:**
  - Do not use this project for any illegal activity. Use responsibly and ethically.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

Built by [zecod](https://github.com/zecod) · Open source and community friendly!
