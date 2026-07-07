# gold-invest

## Overview

A lightweight Node.js application that streams live gold prices to connected browsers and allows users to **buy gold**. Each purchase is persisted to `data/data.json`, a PDF receipt is generated, and a confirmation email (with the receipt attached) is sent. The email status (**pending / success / failed**) is tracked directly on the transaction object.

## Features

- Server‑Sent Events (SSE) streaming live gold prices every 3 seconds.
- Simple REST endpoint `POST /buy` to record a purchase.
- PDF receipt generation using **pdfkit**.
- Email delivery with **nodemailer** (Gmail SMTP).
- Transaction status tracking (`emailStatus`).
- Automatic restart on `.env` changes thanks to `nodemon -e js,json,env`.

## Project Structure

```
gold-price-tracker/
├─ data/                 # Persistent JSON store (data.json)
├─ invoices/             # Generated PDF receipts
├─ public/               # Front‑end assets (HTML, CSS, JS)
├─ utils/                # Helper modules
│   ├─ addBuyData.js          # Persists purchase & adds emailStatus="pending"
│   ├─ generateTransactionsPdf.js  # Creates receipt PDF
│   ├─ sendMail.js            # Sends email and updates status
│   ├─ updateEmailStatus.js   # Helper to mutate emailStatus field
│   └─ … (other utilities)
├─ handlers/             # HTTP route handlers
├─ events/               # EventEmitter for purchase flow
├─ server.js             # Core HTTP server
├─ .env                  # Email credentials (not committed)
└─ README.md             # Documentation (this file)
```

## Setup

1. **Clone the repository** (you already have it locally).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a `.env` file** (do **not** commit it):
   ```env
   EMAIL_USER="your‑gmail‑address@gmail.com"
   EMAIL_PASS="your‑app‑password"
   ```
   > Use an **App Password** if you have 2‑FA enabled on Gmail.
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The server will listen on **http://localhost:8000**.

## Usage

- Open `http://localhost:8000` in a browser to see live gold prices.
- Use the UI (or `curl`) to POST a purchase:
  ```bash
  curl -X POST http://localhost:8000/buy \
       -H "Content-Type: application/json" \
       -d '{"email":"you@example.com","quantity":2,"price":1800}'
  ```
- The response contains the saved transaction, initially with `"emailStatus":"pending"`.
- After the email attempt completes, the status updates to `"success"` or `"failed"` inside `data/data.json`.

## Development Tips

- **File watching**: `nodemon` restarts automatically when you edit JS/JSON files **or** the `.env` file because we watch extensions `js,json,env`.
- **Inspect transaction data**: Open `data/data.json` to see all purchases and their email statuses.
- **Error handling**: `updateEmailStatus.js` now gracefully handles an empty `data.json` file, avoiding `SyntaxError: Unexpected end of JSON input`.

## License

MIT – feel free to adapt or extend.

---

