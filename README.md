# YQN Pay - Merchant Management System (Backend)

This is a server-side application built with Node.js and Express. It manages the onboarding, KYB (Know Your Business) verification, and status tracking for merchants.


## Prerequisites

Make sure you have the following installed on your computer:
* [Node.js](https://nodejs.org/) (Version 14 or higher)

## Setup Instructions

Follow these step-by-step instructions to set up and run the server locally:

**1. Clone the repository**
```bash
git clone <repo link>
cd merchant-management-system

```

**2. Install dependencies**

```bash
npm install

```

**3. Set up environment variables**
Create a new file named `.env` in the root folder of the project. You can copy the structure from the provided `.env.example` file.

Inside your new `.env` file, add your secret keys:

```text
PORT=3000
JWT_KEY=your_super_secret_jwt_key_here
WEBHOOK_SECRET=your_super_secret_webhook_key_here

```

**4. Start the server**

```bash
node app.js

```

The server will start running at `http://localhost:3000`.

## Database Simulation

This project does not connect to a live external database. Instead, it uses local JSON files inside the `data` folder (`users.json`, `merchants.json`, `auditlogs.json`, `webhooks.json`) to simulate a real database.

## API Overview

All routes are protected and require a valid token in the `Authorization` header (`Bearer <token>`).

**Authentication**

* `POST /api/auth/signin` - Log in an operator
* `GET /api/auth/refresh` - Get a fresh 15-minute token

**Merchants**

* `POST /api/merchants` - Add a new merchant
* `GET /api/merchants` - Get a paginated and filtered list of merchants
* `GET /api/merchants/:id` - Get a single merchant
* `PATCH /api/merchants/:id` - Edit general details
* `DELETE /api/merchants/:id` - Delete a merchant (Admin only)
* `PATCH /api/merchants/:id/tier` - Change pricing tier (Admin only)

**Verification & Status**

* `PATCH /api/merchants/:id/documents/upload` - Mark a document as uploaded
* `PATCH /api/merchants/:id/documents/verify` - Mark a document as verified
* `PATCH /api/merchants/:id/status` - Change merchant status (triggers KYB rules and audit logs)
* `GET /api/merchants/:id/auditlogs` - View paginated history logs for a merchant

**Webhooks**

* `POST /api/webhooks/subscribe` - Register a URL to receive automated notifications

