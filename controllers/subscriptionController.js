// controllers/subscriptionController.js
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// @desc    Get user's current subscription
// @route   GET /api/subscriptions/my-subscription
// @access  Private
exports.getMySubscription = async (req, res) => {
    console.log('SUBSCRIPTION DEBUG: Inside getMySubscription for user:', req.user?._id);
    try {
        if (!req.user || !req.user._id) {
            console.error('SUBSCRIPTION DEBUG: User ID missing in req.user for getMySubscription');
            return res.status(401).json({ message: 'User not authenticated or ID missing.' });
        }
        const subscription = await Subscription.findOne({ user: req.user._id });
        if (!subscription) {
            console.log('SUBSCRIPTION DEBUG: No subscription found for user:', req.user._id, '. Returning default Free plan.');
            return res.status(200).json({ plan: 'Free', status: 'active', message: 'Default free plan' });
        }
        console.log('SUBSCRIPTION DEBUG: Successfully fetched subscription for user:', req.user._id, 'Plan:', subscription.plan);
        res.status(200).json(subscription);
    } catch (error) {
        console.error("SUBSCRIPTION DEBUG: Error fetching subscription for user:", req.user?._id, error.message, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user's subscription plan (No Stripe integration, direct update)
// @route   PUT /api/subscriptions/update-plan
// @access  Private
exports.updateMySubscription = async (req, res) => {
    const { plan } = req.body;
    console.log('SUBSCRIPTION DEBUG: Inside updateMySubscription for user:', req.user?._id, 'Attempting to change to plan:', plan);

    try {
        if (!req.user || !req.user._id) {
            console.error('SUBSCRIPTION DEBUG: User ID missing in req.user for updateMySubscription');
            return res.status(401).json({ message: 'User not authenticated or ID missing.' });
        }

        let subscription = await Subscription.findOne({ user: req.user._id });

        if (!subscription) {
            console.warn('SUBSCRIPTION DEBUG: Subscription record missing for user:', req.user._id, 'during update. Attempting to create new Free plan as fallback.');
            subscription = await Subscription.create({
                user: req.user._id,
                plan: 'Free',
                status: 'active'
            });
        }

        const validPlans = ['Free', 'Basic', 'Premium'];
        if (!validPlans.includes(plan)) {
            console.error('SUBSCRIPTION DEBUG: Invalid plan received:', plan);
            return res.status(400).json({ message: 'Invalid plan selected.' });
        }

        subscription.plan = plan;
        subscription.status = 'active'; 
        await subscription.save();
        console.log('SUBSCRIPTION DEBUG: Successfully updated subscription for user:', req.user._id, 'New plan:', plan);

        res.status(200).json({ message: 'Subscription plan updated successfully.', subscription });

    } catch (error) {
        console.error("SUBSCRIPTION DEBUG: Error updating subscription for user:", req.user?._id, error.message, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
