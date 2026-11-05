# AURA Atelier - Fashion Shopping Web Application

A full-stack e-commerce web application where customers can browse fashion products, search and filter items, choose sizes and colors, manage a cart, and place orders. Administrators can manage products and customer orders.

## Live Demo

- Website: https://fashion-shop-seven-pi.vercel.app
- API health check: https://fashion-shop-xcrs.onrender.com/api/health

The backend runs on a free Render instance, so the first request after inactivity can take up to 50 seconds.

## Features

**Customers**
- Register, log in, and stay signed in with JWT
- Browse products with search, category, price, size and color filters
- Sort by newest, price and rating, with pagination
- Product page with image gallery, size and color selection, and live stock check
- Shopping cart saved in the browser
- Checkout with address validation (Cash on Delivery)
- Order history

**Admin**
- Dashboard with total orders, revenue, products and users
- Add, edit and delete products with variants (size, color, stock)
- View all orders and update their status (pending, shipped, delivered, cancelled)
- Stock is restored automatically when an order is cancelled

**Security**
- Passwords hashed with bcrypt
- Role-based access (user and admin)
- Prices are recalculated on the server, never trusted from the client
- Helmet and rate limiting on the API

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js (Vite) | Frontend |
| HTML5, CSS3, JavaScript | Structure, styling, interactivity |
| Node.js and Express.js | Backend REST API |
| MongoDB Atlas and Mongoose | Cloud database and data modeling |
| JWT and bcrypt | Authentication |
| Git and GitHub | Version control |
| Vercel and Render | Hosting for client and server |

## Architecture

Browser -> React client (Vercel) -> Express API (Render) -> MongoDB Atlas

## Folder Structure

```
fashion-shop/
├── client/        React app (pages, components, context, api)
└── server/        Express API (models, controllers, routes, middleware, seed)
```

## Local Setup

1. Clone the repository
   ```
   git clone https://github.com/poojithaboinapalli97-collab/fashion-shop.git
   cd fashion-shop
   ```
2. Install dependencies
   ```
   cd server
   npm install
   cd ../client
   npm install
   ```
3. Create `server/.env` and `client/.env` using the values below.
4. Seed the database (from the `server` folder)
   ```
   node seed/seedProducts.js
   node seed/createAdmin.js
   ```
5. Run the apps in two terminals
   ```
   cd server
   npm run dev
   ```
   ```
   cd client
   npm run dev
   ```
6. Open http://localhost:5173

## Environment Variables

**server/.env**

| Variable | Description |
|---|---|
| `PORT` | Server port, for example 5000 |
| `NODE_ENV` | development or production |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `CLIENT_URL` | Frontend address allowed by CORS |
| `ADMIN_EMAIL` | Email for the admin account |
| `ADMIN_PASSWORD` | Password for the admin account |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend address including `/api` |

Never commit real values. `.env` files are listed in `.gitignore`.

## API Endpoints

| Area | Endpoint | Access |
|---|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Public / Logged in |
| Products | `GET /api/products`, `GET /api/products/:id` | Public |
| Products | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | Admin |
| Orders | `POST /api/orders`, `GET /api/orders/mine` | Logged in |
| Orders | `GET /api/orders`, `PUT /api/orders/:id/status` | Admin |
| Admin | `GET /api/admin/stats` | Admin |

## Deployment

- Database: MongoDB Atlas (network access allows the hosting provider)
- Backend: Render web service, root directory `server`, start command `npm start`
- Frontend: Vercel project, root directory `client`, with `VITE_API_URL` set
- `CLIENT_URL` on Render must match the Vercel address exactly

## Known Limitations and Future Work

- Only Cash on Delivery is available. Online payment (Razorpay or Stripe) is planned.
- Customers cannot yet cancel their own orders or write product reviews.
- Each product has one image set, not one per color.

## Author

Poojitha Boinapalli
