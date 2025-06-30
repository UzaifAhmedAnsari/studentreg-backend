// models/Subscription.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true // <-- Yeh line bohot zaroori hai. Ensure it is present.
  },
  plan: {
    type: String,
    enum: ['Free', 'Basic', 'Premium'],
    default: 'Free',
  },
  // Yeh fields Stripe remove hone ke baad bhi theek hain, rehne den.
  stripeCustomerId: { type: String, unique: true, sparse: true }, 
  stripeSubscriptionId: { type: String, unique: true, sparse: true }, 
  status: {
    type: String,
    enum: ['active', 'canceled', 'incomplete', 'past_due'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
