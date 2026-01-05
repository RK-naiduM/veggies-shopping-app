# 🌾 Agro Tech Harvest - MERN E-Commerce Platform

Link to App
https://veggies-shopping-app.vercel.app/

Agro Tech Harvest is a full-stack E-commerce web application designed for selling fresh organic vegetables and raw powders. It features a complete shopping experience for users and a robust management dashboard for administrators.

Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## 🚀 Features

### 👤 Customer Experience

- **Secure Authentication:** User Login & Registration protected by JWT & Bcrypt.
- **Product Discovery:** Browse by categories (Vegetables, Powders) or use the real-time Search Bar.
- **Smart Cart System:**
  - **"Rule of 10":** Intelligent logic preventing users from hoarding items (Max 10 per order).
  - **Stock Awareness:** Prevents adding more items than currently available in inventory.
  - **Live Price Calculation:** Auto-updates totals with accurate rounding.
- **Order Management:**
  - Simple, secure checkout form.
  - Order History & Status tracking (Pending ➝ Shipped ➝ Delivered) in the User Profile.
- **Inventory Alerts:** Visual cues for low stock (e.g., _"🔥 Hurry! Only 3 left!"_).

### 🛡️ Admin Dashboard

- **Central Hub:** A secured area to manage the entire business (protected by Admin Route Guards).
- **Order Control:** View all customer orders and update shipping statuses instantly.
- **Inventory Management:**
  - **Live Stock Updates:** The dashboard polls the server every 5 seconds to show real-time stock levels without refreshing.
  - **Easy Restocking:** "Add Stock" feature to increment inventory when new shipments arrive.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router v6, Axios, CSS Modules.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT).
- **State Management:** React Hooks (`useState`, `useEffect`, `useContext`).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URL)
- [Git](https://git-scm.com/)

### 2. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/golden-harvest-shop.git](https://github.com/YOUR_USERNAME/golden-harvest-shop.git)
cd golden-harvest-shop

3. Install Dependencies
You must install dependencies for both the backend and frontend.

Backend:

cd backend
npm install

Frontend:

cd ../frontend
npm install

4. Environment Variables
Create a .env file inside the backend folder and add your configuration:

Code snippet

PORT=5000
MONGO_URI=mongodb://localhost:27017/agrotechharvest
JWT_SECRET=your_super_secret_key_here
(Note: If using MongoDB Atlas, replace the URI with your cloud connection string).

🏃‍♂️ Running the App
Run the Backend and Frontend in two separate terminals.

Terminal 1: Start Backend

Bash

cd backend
npm run dev
(Runs on http://localhost:5000)

Terminal 2: Start Frontend

Bash

cd frontend
npm start
(Runs on http://localhost:3000)

💾 Seeding Database (Optional)
To instantly populate your database with sample products (Spinach, Turmeric, etc.):

Open a terminal in the backend folder.

Run the seed script:

Bash

node seed.js
You should see: ✅ Database Seeded!

🔑 Admin Credentials
To test the Admin Dashboard and Inventory features, use the default admin account:

Email: admin@agrotechharvest.com
Password: admin123

📂 Project Structure
Plaintext

golden-harvest/
│
├── backend/            # API Server
│   ├── config/         # Database Connection
│   ├── models/         # Mongoose Schemas (User, Product, Order)
│   ├── routes/         # API Routes
│   ├── middleware/     # Auth & Admin Middleware
│   └── server.js       # Entry Point
│
├── frontend/           # React Client
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, ScrollToTop)
│   │   ├── pages/      # Views (Home, Cart, Admin, Inventory)
│   │   └── App.js      # Main Router & State
│   └── public/
│
└── README.md           # Documentation
```
