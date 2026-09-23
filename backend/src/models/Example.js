import mongoose from 'mongoose';
// Removable sample module. Copy its route/controller/service/model pattern for your feature.
const exampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });
exampleSchema.index({ owner: 1, createdAt: -1 });
export const Example = mongoose.model('Example', exampleSchema);
