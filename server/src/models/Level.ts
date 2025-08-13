import mongoose from 'mongoose';

const levelRewardSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true // one record per level
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward', // link to avatar/title reward
    required: true
  },
  description: {
    type: String,
    default: '' // e.g., "Unlocks Cyber Ninja avatar at level 50"
  },
  issuedTo: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      issuedAt: { type: Date, default: Date.now },
      claimedAt: { type: Date },
      isClaimed: { type: Boolean, default: false }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Level', levelRewardSchema);
