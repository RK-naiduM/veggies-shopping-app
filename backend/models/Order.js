const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },

  // --- STRUCTURED SHIPPING ADDRESS ---
  shippingAddress: {
    line1: { type: String, required: true },
    line2: { type: String }, // Optional
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  
  orderNotes: { type: String }, // <--- NEW (Optional)
  // --------------------------------


  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  
  // This is your Delivery Status (e.g., Pending, Shipped, Delivered)
  status: { type: String, default: 'Pending' }, 
  
  // --- NEW FIELDS FOR PAYMENTS ---
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['COD', 'Online'], // Restricts inputs to only these two valid options
    default: 'COD'
  },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Paid', 'Failed'], // Pending means cash not yet collected
    default: 'Pending' 
  },
  paymentId: { 
    type: String // Left empty for COD. We will save the Razorpay ID here later.
  },
  // -------------------------------

  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;