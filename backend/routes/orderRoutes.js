const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// 1. CREATE ORDER (Now includes Phone, Structured Address & Notes)
router.post('/', async (req, res) => {
  try {
    // ---> REMOVED: customerAddress
    // ---> ADDED: phone, shippingAddress, orderNotes
    const { 
      user, 
      customerName, 
      phone, 
      shippingAddress, 
      orderNotes, 
      items, 
      totalAmount, 
      paymentMethod 
    } = req.body; 

    const newOrder = new Order({
      user, 
      customerName,
      phone,             // <--- NEW
      shippingAddress,   // <--- NEW (Object containing line1, line2, city, state, pincode)
      orderNotes,        // <--- NEW
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'COD', 
      paymentStatus: 'Pending' 
    });

    const savedOrder = await newOrder.save();

    // --- ORIGINAL: REDUCE STOCK LOGIC (UNTOUCHED) ---
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = product.stock - item.quantity;
        await product.save();
      }
    }
    // ------------------------------------------------

    res.status(201).json(savedOrder);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. GET ORDERS FOR A SPECIFIC USER (For Profile Page)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET ALL ORDERS (LOCKED: Only for Admins) - NOW WITH PAGINATION
router.get('/', protect, admin, async (req, res) => {
  try {
    // 1. Get page and limit from the query string (default to page 1, 10 items per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // 2. Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 3. Get the total count of orders in the DB
    const totalOrders = await Order.countDocuments();

    // 4. Fetch only the specific chunk of orders for this page
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'id name email');

    // 5. Send back the orders PLUS the pagination metadata
    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 4. UPDATE ORDER STATUS (Admin Only - Delivery Status)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---> NEW ROUTE 5: UPDATE PAYMENT STATUS (Admin Only)
// You will use this in your admin panel when the delivery boy brings the cash
router.put('/:id/payment-status', protect, admin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = paymentStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;