# Full-Stack E-Commerce Platform | MERN Stack

A full-stack e-commerce web application built using the **MERN stack (MongoDB, Express.js, React.js, and Node.js)** with secure authentication, role-based access control, product and order management, wishlist functionality, and Razorpay payment integration.

The platform provides separate experiences for customers and administrators, enabling users to browse products, manage wishlists, place orders, and complete secure online payments, while administrators can manage products, monitor orders, and track store performance through an analytics dashboard.

## 🚀 Key Features

### 👤 User Features

- **User Authentication:** Secure registration and login functionality.
- **Role-Based Access Control:** Access permissions based on user roles.
- **Product Browsing:** Browse products and view detailed product information.
- **Wishlist Management:** Add and remove products from a personal wishlist.
- **Shopping Cart:** Add products, update quantities, and manage cart items.
- **Checkout:** Review cart items, enter delivery details, and place orders.
- **Razorpay Payment Integration:** Secure online payment processing.
- **Order Management:** Place orders and view order history.
- **Order Tracking:** View order status and updates.

### 🔐 Admin Features

- **Admin Dashboard:** Centralized dashboard for managing the e-commerce platform.
- **Product Management:** Add, edit, update, and remove products.
- **Order Management:** View customer orders and manage order statuses.
- **User Management:** View registered users and manage platform access.
- **Sales Overview:** Monitor orders, revenue, and overall store performance.
- **Access-Based Authorization:** Restrict administrative operations to authorized users.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Authorization | Role-Based Access Control (RBAC) |
| Payment Gateway | Razorpay |
| API Communication | REST APIs, Axios |
| Version Control | Git, GitHub |

## 🏗️ Application Architecture

The application follows a client-server architecture.

1. **Frontend:** React.js provides the customer interface and admin dashboard.
2. **Backend:** Express.js and Node.js handle business logic, authentication, authorization, and API requests.
3. **Database:** MongoDB stores user accounts, products, wishlists, carts, and order information.
4. **Authentication:** JWT-based authentication manages user sessions.
5. **Authorization:** Role-based middleware protects admin-only endpoints.
6. **Payment:** Razorpay handles payment processing, with server-side payment verification.

## 🔑 Role-Based Access Control

The application supports two primary roles:

| Functionality | User | Admin |
|---|:---:|:---:|
| Register / Login | ✅ | ✅ |
| Browse Products | ✅ | ✅ |
| Add to Cart | ✅ | — |
| Manage Wishlist | ✅ | — |
| Checkout & Payment | ✅ | — |
| View Own Orders | ✅ | — |
| Manage Products | ❌ | ✅ |
| Manage All Orders | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ✅ |
| View Sales Analytics | ❌ | ✅ |

Authorization is enforced on the backend to prevent unauthorized access to protected resources.

## 💳 Payment Integration

Integrated Razorpay to support online payments during checkout.

**Payment Workflow:**

1. User adds products to the shopping cart.
2. User proceeds to checkout.
3. Backend creates a Razorpay order.
4. Razorpay Checkout handles the payment.
5. Backend verifies the payment signature.
6. Order status is updated after successful verification.

Payment verification is performed server-side to ensure transaction integrity.

## 📂 Project Structure

```text
ecommerce-platform/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── routes/
│       └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js
- MongoDB
- npm
- Razorpay account (for payment integration)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ecommerce-platform
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLIENT_URL=http://localhost:5173
```

Never expose secret keys or commit your `.env` file to GitHub.

### 4. Start the Backend

```bash
npm run dev
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 🔒 Security Considerations

- Password hashing using bcrypt.
- JWT-based authentication.
- Backend-enforced role-based authorization.
- Protected API routes.
- Server-side Razorpay payment signature verification.
- Environment variables for sensitive credentials.
- Server-side validation of product prices and order amounts.

## 🔮 Future Enhancements

- Product search, filtering, and sorting.
- Product reviews and ratings.
- Coupon and discount management.
- Email notifications for order updates.
- Inventory and stock management.
- Shipment tracking.
- Advanced sales analytics.
- Deployment with CI/CD integration.

## 👩‍💻 Project Objective

The objective of this project is to develop a scalable full-stack e-commerce application that demonstrates practical implementation of RESTful APIs, database design, authentication, role-based authorization, payment gateway integration, and end-to-end order processing using the MERN stack.

---

**Tech Stack:** MongoDB | Express.js | React.js | Node.js | Razorpay

**Project Type:** Full-Stack Web Application
