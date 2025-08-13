import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  rewardId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true // e.g., "Master Coder Avatar", "Bug Slayer Title"
  },
  description: {
    type: String,
    default: ''
  },
  rewardType: {
    type: String,
    enum: ['avatar', 'title'], // only avatar or title
    required: true
  },
  rewardImage: {
    type: String // image preview for avatar or title banner
  },
  avatar: {
    type: String, // avatar image URL or asset ID
  },
  title: {
    type: String, // profile title text
  },

  unlockType: {
    type: String,
    enum: ['level_based', 'rank_based'],
    required: true
  },

  // For level-based rewards
  requiredLevel: {
    type: Number // minimum level needed to unlock
  },

  // For rank-based rewards
  requiredRank: {
    type: Number // e.g., 10 means "Top 10 players"
  },

  issuedTo: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      issuedAt: { type: Date, default: Date.now },
      claimedAt: { type: Date },
      isClaimed: { type: Boolean, default: false }
    }
  ],

  startDate: {
    type: Date // reward availability start
  },
  endDate: {
    type: Date // reward expiration
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Reward', rewardSchema);
