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

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zecod/gatto-mail.git
cd gatto-mail
```

### 2. Install dependencies

```bash
npm install # or pnpm install or yarn install
```

### 3. Start the development server

```bash
npm dev # or pnpm run dev or yarn dev
```

The app will be running at [http://localhost:3000](http://localhost:3000)

---

## API Usage

### Check Email

```bash
curl -X POST http://localhost:3000/api/check-email \
  -H "Content-Type: application/json" \
  -d '{"name": "Sam Altman", "domain": "openai.com"}'
```

**Response:**

```json
{
  "success": true,
  "email": "sam@openai.com",
  "message": "Email found and verified."
}
```

### Validate Email

```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "sam@openai.com"}'
```

**Response:**

```json
{
   "success":true,
   "syntax":true,
   "deliverable":true
}
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
