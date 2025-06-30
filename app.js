    const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const connectDB = require('./config/db');

    // Load env vars
    dotenv.config();

    // Connect to database
    connectDB();

    const app = express();

    // CORS middleware - allow frontend origin
    app.use(cors({
      origin: 'https://studentreg-frontend-app.vercel.app/', // Aapke frontend ka URL
      credentials: true
    }));

    // Body Parser Middleware
    // Yeh lines bohot zaroori hain aur is order mein honi chahiye
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Mount routers - Yeh section bohot zaroori hai
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/registrations', require('./routes/registrationRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));
    // *** Zaroori: Yeh line confirm karein ke maujood hai aur theek hai ***
    app.use('/api/subscriptions', require('./routes/subscriptionRoutes')); 

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    