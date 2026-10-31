# Fashion Shopping Web Application - Project Context

## Stack
- **Frontend**: React (Vite), HTML5, CSS3, JavaScript, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT + bcrypt
- **Version Control**: Git & GitHub

## Project Structure
```
fashion-shop/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   └── admin/
│       ├── context/
│       ├── api/
│       └── utils/
└── server/
    ├── config/
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── seed/
    └── server.js
```

## Data Models

### User
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String ('user' | 'admin')
- Timestamps (`createdAt`, `updatedAt`)

### Product
- `name`: String
- `description`: String
- `price`: Number
- `category`: String
- `brand`: String
- `images`: Array of Strings (`images[]`)
- `rating`: Number
- `variants`: Array of objects `[{ size, color, stock }]`
- Timestamps (`createdAt`, `updatedAt`)

### Order
- `user`: ObjectId (ref to User)
- `items`: Array of objects `[{ product (ref), name, size, color, qty, price }]`
- `shippingAddress`: Object `{ fullName, address, city, postalCode, phone }`
- `paymentMethod`: String
- `totalPrice`: Number
- `status`: String ('pending' | 'shipped' | 'delivered' | 'cancelled')
- Timestamps (`createdAt`, `updatedAt`)

## Engineering & Development Rules
- Use `async`/`await` with structured `try/catch` error handling across all backend and asynchronous routines.
- Maintain consistent JSON error responses (e.g. `{ "message": "...", "error": "..." }`).
- Never commit secrets or credentials (always use `.env` files and keep `.env` ignored).
- Emphasize reusable, modular components.
- Clean, modern UI styling with a polished neutral palette.
