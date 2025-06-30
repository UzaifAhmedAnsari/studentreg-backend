    // backend/app.js
    const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const connectDB = require('./config/db');

    dotenv.config();
    connectDB();

    const app = express();

    // CORS middleware
    app.use(cors({   
      origin: 'https://studentreg-frontend-qx35.vercel.app/', // <-- Yahan apni Vercel frontend URL dalen
      credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Mount routers
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/registrations', require('./routes/registrationRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));
    app.use('/api/subscriptions', require('./routes/subscriptionRoutes')); 

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    