# 💸 Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system inspired by Bkash/Nagad. Built with **Express.js**, **TypeScript**, and **Mongoose**, it supports three roles (`admin`, `user`, `agent`) and robust financial operations.

---

## 🚀 Live URL

[🔗](https://library-management-api-a4.vercel.app/)

## 📦 Features

- 🔐 JWT Authentication with `bcrypt` password hashing
- 🎭 Role-based Authorization (admin / user / agent)
- 🏦 Auto wallet creation on registration (initial balance: ৳50)
- 💳 Financial operations: Add, Withdraw, Send Money
- 🧾 Agent cash-in/cash-out support
- 🛂 Admin management capabilities
- 🧱 Modular code architecture for scalability
- 🧮 Trackable transaction records
- 📋 Comprehensive validations and error handling

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript** for static typing
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt** for security
- **Dotenv** for environment config

---

## 🛠️ Installation & Setup

```Bash
git clone https://github.com/DeveloperMonirBD/Digital-E-Wallet-API.git
npm install
```

## 🌐 Create `.env` File

```Bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 🔧 Run Locally

```Bash
npm run dev
```

## Folder Structure
src/
├── modules/
│   ├── auth/           # Login, Registration
│   ├── user/           # User & Agent logic
│   ├── wallet/         # Wallet operations
│   └── transaction/    # Transaction handling
├── middlewares/        # Auth & Error middleware
├── config/             # DB & environment config
├── utils/              # Helpers & constants
├── app.ts              # Express app setup


## 🧪 API Endpoints Summary

### 🔐 Auth

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /api/v1/auth/register   | Register as user or agent|
| POST   | /api/v1/auth/login   | Login and receive JWT|

### 👤 Users

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /api/v1/wallets/add-money   | Top-up own wallet|
| POST   | /api/v1/wallets/send   | Send money to another user|
| POST   | /api/v1/wallets/withdraw  | Withdraw funds|
| GET    | /api/v1/transactions/me   | View transaction history |

### 🧑‍💼 Agents

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /api/v1/agents/cash-in   | Add money to user wallet|
| POST   | /api/v1/agents/cash-out   | Withdraw from user wallet|
| GET    | /api/v1/agents/commissions   | View commission records |
| GET    | /books/:id     | Get book by ID              |
| PUT    | /edit-book/:id | Update book                 |
| DELETE | /books/:id     | Delete book                 |

### 🛂 Admin

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET   | /api/v1/admin/users   | List all users|
| GET    | /api/v1/admin/agents    | List all agents    |
| GET    | /api/v1/admin/wallets   | List all wallets    |
| PATCH  | /api/v1/admin/wallets/block/:id | Block/unblock wallet | 
| PATCH  | /api/v1/admin/agents/suspend/:id | Suspend agent |

## ✅ Validation Rules

- 🔒 Blocked wallets cannot transact
- 🛑 Insufficient balance throws error
- 💸 Negative or zero amounts are rejected
- 👻 Invalid receiver IDs are handled gracefully

## 🎥 Demo Video

A 10-minute walkthrough covering:
- 📂 Folder structure
- 🔐 Auth flow + JWT verification
- 💳 User features (Add, Withdraw, Send money)
- 🧑‍💼 Agent features (Cash-in, Cash-out)
- 🛂 Admin overview (Blocking, Approvals)
- 📮 Postman testing
- 📃 README review


## 🧩 Business Logic Highlights

## 🧠 Business Logic Overview

This section explains how key financial and administrative operations are implemented across users, agents, and admins within the Digital Wallet ecosystem.

---

### 👤 User Logic

- **Registration**
  - On signup, a wallet is automatically created with an initial balance of **৳50**
  - Role assigned: `user`

- **Add Money (Top-up)**
  - Users can increase wallet balance via an endpoint
  - Validations include: amount > 0

- **Send Money**
  - Transfers funds to another user’s wallet
  - Validation: sender’s wallet must be active, have sufficient funds, and recipient must exist
  - A transaction record is created with sender, receiver, and amount

- **Withdraw Money**
  - Withdraws from user’s wallet balance
  - Validation: wallet must be active and balance must be sufficient

- **Transaction History**
  - Users can view all personal transactions (sent, received, withdrawal)

---

### 🧑‍💼 Agent Logic

- **Registration**
  - On signup, a wallet is also created with an initial balance of **৳50**
  - Role assigned: `agent`, initially `pending` unless auto-approved

- **Cash-In**
  - Agent adds money to a user’s wallet
  - Commission may be applied (optional feature)

- **Cash-Out**
  - Agent withdraws money from a user's wallet
  - Validation: user's wallet must have sufficient funds and not be blocked

- **Commission Tracking**
  - Agents may earn a percentage per transaction (optional logic)

---

### 🛂 Admin Logic

- **Manage Users/Agents**
  - View all users, wallets, agents, and transactions
  - Suspend/Approve agents

- **Wallet Control**
  - Block/unblock user wallets
  - Blocked wallets cannot perform send, withdraw, or receive operations

- **System Settings**
  - Can optionally configure transaction fees or agent commission rates (if implemented)

---

### 🔁 Transaction Logic

- **Atomic Transactions**
  - Wallet balance updates and transaction creation occur together
  - Uses database sessions or transactions to ensure consistency

- **Transaction Schema**
  - Fields include: `type`, `amount`, `fee`, `senderId`, `receiverId`, `status`, `timestamp`
  - Types: `deposit`, `withdraw`, `send`, `cash-in`, `cash-out`

- **Validation Rules**
  - No negative or zero amounts
  - Wallet must be active (not blocked)
  - Wallet must have enough funds for outgoing transactions
  - Receiver wallet must exist and be active

---

### 🎭 Role-Based Access Control

- ✅ Middleware verifies JWT and decodes role
- ✅ Routes are protected using role-specific guards
  - `user`: can manage own wallet, transactions
  - `agent`: can manage other wallets via cash-in/out
  - `admin`: full access to all data and controls

---

## ⚠️ Common Error Scenarios

| Error Scenario | Message       | Status                 |
| ------ | -------------- | --------------------------- |
| Unauthorized Access  | "Forbidden: You do not have access"   | 403|
| Wallet Blocked   | "Sender wallet is blocked"   | 400   |
| Insufficient Balance    | "Insufficient balance"  | 400   |
| Unexpected Error  | "Internal Server Error" | 500 | 

## What to Submit

-   [Public Github Repo Link ] (https://github.com/DeveloperMonirBD/Digital-E-Wallet-API.git)
-   [Live Deployment Link] (,,,,,,,,,,,,,,,,)
-   [Video Explanation (Public Link)] ()

## 🙌 Author

Md. Monirul Islam
