# ticket-sales-api
# 🎟️ Ticket Sales API

A high-performance transactional ticket-purchase API built using **Node.js**, **Express**, **TypeScript**, **Prisma**, and **SQLite/PostgreSQL**. This API simulates a real-world concurrent ticketing system with idempotency and race condition prevention.

---

## 🚀 Features

- Purchase up to **10 tickets** per request.
- **5000 ticket** maximum capacity.
- **Idempotent requests** using `Idempotency-Key` header.
- Prevents **overselling** with safe transactional logic.
- Uses **Prisma** ORM with **TypeScript** for robust type safety.
- Works with **SQLite** (dev) or **PostgreSQL** (prod).
- Easy to test with Thunder Client or Postman.

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** SQLite (default), PostgreSQL (optional)
- **Dev Tools:** Thunder Client / Postman

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/ticket-sales-api.git
cd ticket-sales-api
npm install

