const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to your User model
    },
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    // The simple text box for them to type what they want
    orderDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);