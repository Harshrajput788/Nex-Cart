# 🛒 Nex-Cart

> A production-ready, scalable E-Commerce platform built using the MERN Stack and Microservices Architecture.

![GitHub stars](https://img.shields.io/github/stars/Harshrajput788/Nex-Cart?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Harshrajput788/Nex-Cart?style=for-the-badge)
![License](https://img.shields.io/github/license/Harshrajput788/Nex-Cart?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success?style=for-the-badge)

---

## 📖 About

Nex-Cart is a modern full-stack e-commerce platform designed using a **Microservices Architecture**. It provides a scalable, secure, and high-performance shopping experience with features for customers, sellers, and administrators.

The project focuses on production-level backend architecture, authentication, caching, payment integration, and scalable service communication.

---

# ✨ Features

## 👤 Authentication

- JWT Authentication
- Secure HTTP-only Cookies
- Login & Registration
- Email Verification
- Password Reset
- Role-Based Access Control (RBAC)

---

## 🛍 Customer Features

- Browse Products
- Product Search
- Category Filtering
- Product Variants
- Shopping Cart
- Wishlist
- Address Management
- Order Placement
- Razorpay Payments
- Cash on Delivery
- Order Tracking
- Order History
- User Profile

---

## 🏪 Seller Features

- Seller Dashboard
- Product Management
- Inventory Management
- Variant Management
- Sales Analytics
- Order Management
- Revenue Dashboard

---

## 👑 Admin Features

- Dashboard
- User Management
- Seller Approval
- Product Moderation
- Category Management
- Order Monitoring
- Analytics
- Reports

---

# ⚡ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Query
- React Router
- Tailwind CSS
- Axios

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

---

## Authentication

- JWT
- Cookies
- bcrypt

---

## Cloud

- Cloudinary

---

## Cache

- Redis

---

## Queue

- BullMQ

---

## Validation

- Joi
- Zod

---

## Payment

- Razorpay

---

## DevOps

- Docker
- GitHub
- Vercel
- Render

---

# 📂 Project Structure

```
Nex-Cart
│
├── frontend
│
├── backend
│   ├── gateway
│   ├── services
│   │     ├── auth
│   │     ├── product
│   │     ├── order
│   ││
└── README.md
```

---

# 🏗 Architecture

```
             Client
                │
                ▼
          API Gateway
                │
────────────────────────────────────────
│        │        │        │          │
▼        ▼        ▼        ▼          ▼

User   Product   Cart    Order    Payment
Service Service Service Service   Service
                 │
                 ▼
              Redis
                 │
                 ▼
              BullMQ
                 │
                 ▼
            Cloudinary

```

---

# 🔒 Security

- JWT Authentication
- Role-Based Authorization
- Password Hashing
- Secure Cookies
- CORS
- Helmet
- Rate Limiting
- Request Validation
- MongoDB Injection Protection

---

# 🚀 Performance Optimizations

- Redis Caching
- Database Indexing
- Pagination
- Lazy Loading
- Image Optimization
- Queue-based Processing
- Background Jobs
- Aggregation Pipelines

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/Harshrajput788/Nex-Cart.git
```

---

## Install Dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file.

Example

```env
PORT=

MONGO_URI=

JWT_SECRET=

REDIS_URL=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

FRONTEND_URL=
```

---

## Run Frontend

```bash
npm run dev
```

---

## Run Backend

```bash
npm run dev
```

---

# 📸 Screenshots

## Home Page

(Add Screenshot)

---

## Product Page

(Add Screenshot)

---

## Cart

(Add Screenshot)

---

## Checkout

(Add Screenshot)

---

## Seller Dashboard

(Add Screenshot)

---

## Admin Dashboard

(Add Screenshot)

---

# 🔮 Future Improvements

- Email Notifications
- Coupons
- Reviews & Ratings
- Product Recommendations
- AI Search
- Chat Support
- Inventory Forecasting
- Multi Vendor Marketplace
- PWA Support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "feat: add amazing feature"
```

4. Push

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork it

📢 Share it with others

---

# 👨‍💻 Author

**Harsh Singh Chouhan**

GitHub

https://github.com/Harshrajput788

---

# 📄 License

This project is licensed under the MIT License.
