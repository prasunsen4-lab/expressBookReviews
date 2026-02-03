const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// Import route modules
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// Configure session middleware for /customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken'];

    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" });
      }
      // Attach decoded user info to request
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Access token missing" });
  }
});

// Mount route handlers
app.use("/customer", customer_routes); // authenticated user routes
app.use("/", genl_routes);             // general/public routes

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));