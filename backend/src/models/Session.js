import mongoose from 'mongoose';
// One record per signed-in browser. Deleting this record revokes that session immediately.
const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  },
}, { timestamps: true });
export const Session = mongoose.model('Session', sessionSchema);
