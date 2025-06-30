// controllers/authController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription'); // Subscription model import kiya gaya
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      // Agar user pehle se maujood hai
      console.warn('Registration attempt for existing user:', email);

      // Check karein ke agar user exist karta hai lekin uski subscription nahi hai
      // (Yeh scenario ideal nahi, lekin robustness ke liye)
      const existingSubscription = await Subscription.findOne({ user: userExists._id });
      if (!existingSubscription) {
          console.log('Existing user found without a subscription. Attempting to create one.');
          try {
              const newSubscriptionForExistingUser = await Subscription.create({
                  user: userExists._id,
                  plan: 'Free',
                  status: 'active'
              });
              console.log('Successfully created Free Subscription for existing user:', userExists.email, 'Subscription ID:', newSubscriptionForExistingUser._id);
          } catch (subError) {
              console.error('Error creating subscription for existing user (fallback):', subError.message);
              // Agar user field par unique constraint violation hai (code 11000),
              // to iska matlab hai ke record exist karta hai.
              if (subError.code === 11000 && subError.keyPattern && subError.keyPattern.user) {
                  console.warn('Subscription record already exists for this user (unique key violation during fallback creation).');
              } else {
                 // Koi aur tarah ka error hai, to usko re-throw karein
                 throw subError;
              }
          }
      }
      return res.status(400).json({ message: 'User already exists' });
    }

    // Agar user naya hai, to yahan se aage badhen
    const user = await User.create({ name, email, password, role });
    console.log('New user created successfully:', user.email, 'User ID:', user._id);

    // *** Zaroori Code: Naye User Ke Liye Free Subscription Create Karein ***
    try {
        const newSubscription = await Subscription.create({
            user: user._id, // Naye user ki _id pass ki ja rahi hai
            plan: 'Free',
            status: 'active'
        });
        console.log('New Free Subscription created for NEW user:', user.email, 'Subscription ID:', newSubscription._id);
    } catch (subCreationError) {
        // Agar yahan error aata hai, to woh subscription na banne ki wajah hai
        console.error('*** CRITICAL ERROR: Subscription creation failed for new user:', user.email, 'Error:', subCreationError.message, 'Details:', subCreationError);
        // Yahan aap decide kar sakte hain ke user ko register hone den ya nahi
        // Filhaal, hum user ko register hone denge lekin subscription failure log karenge.
    }
    // *** Subscription Creation Code End ***

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("General error during user registration process:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};
