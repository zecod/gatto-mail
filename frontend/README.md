# Gatto Mail Frontend

Next.js 15 frontend application for Gatto Mail - Email finder and validator.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Dark mode support
- Responsive design
- Email validation interface
- Email discovery interface

## Getting Started

### Development Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and configure the backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The application will start on `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Setup

#### Build and run with Docker

```bash
# Build the image
docker build -t gatto-mail-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 \
  gatto-mail-frontend
```

#### Using Docker Compose (Recommended)

From the project root:
```bash
docker-compose up -d frontend
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Note:** Make sure the backend is running on port 3001 or update the URL accordingly.

## Project Structure

```
frontend/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes (legacy, now in backend)
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── ui/                     # UI components
│   │   ├── app/                # App-specific components
│   │   │   ├── email-finder.tsx
│   │   │   ├── email-validate.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── nav-bar.tsx
│   │   │   └── ...
│   │   └── ...                 # Shadcn UI components
│   └── theme-provider.tsx      # Dark mode provider
├── lib/                        # Utility functions
│   └── utils.ts                # Helper utilities
├── public/                     # Static assets
│   └── logo-*.png              # Logo files
├── .env.example                # Environment variables example
├── .env.local                  # Local environment variables (gitignored)
├── Dockerfile                  # Docker configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Theme**: next-themes

## Development Notes

- The frontend communicates with the Express backend API
- All API calls use the `NEXT_PUBLIC_API_URL` environment variable
- The app supports dark mode via next-themes
- Components are built with accessibility in mind

## API Integration

The frontend expects the backend to be running and accessible. By default:
- Development: `http://localhost:3001/api/v1`
- Production: Configure via `NEXT_PUBLIC_API_URL` environment variable

### API Endpoints Used

- `POST /api/v1/validate-email` - Validate email address
- `POST /api/v1/check-email` - Find email from name and domain

## Troubleshooting

### API Connection Failed
- Make sure the backend is running on port 3001
- Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`
- Verify CORS is enabled on the backend

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Try `npm run build` again
