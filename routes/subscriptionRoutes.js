    // routes/subscriptionRoutes.js
    const express = require('express');
    const router = express.Router();
    const { 
        getMySubscription,    
        updateMySubscription  
    } = require('../controllers/subscriptionController');
    const { protect } = require('../middleware/authMiddleware'); 

    // Route to get user's current subscription
    router.get('/my-subscription', protect, getMySubscription); 

    // Route to update user's subscription plan
    router.put('/update-plan', protect, updateMySubscription);   

    module.exports = router;
    