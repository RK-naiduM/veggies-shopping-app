const express = require('express');
const router = express.Router();
const BulkOrder = require('../models/BulkOrder');
const { protect, admin } = require('../middleware/authMiddleware');

// --- POST: CREATE A NEW BULK ORDER (Public Route) ---
router.post('/', async (req, res) => {
  try {
    const { 
      companyName, 
      contactPerson, 
      email, 
      phoneNumber, 
      shippingAddress, 
      orderDetails 
    } = req.body;

    // Basic validation
    if (!companyName || !contactPerson || !email || !phoneNumber || !shippingAddress || !orderDetails) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const bulkOrder = new BulkOrder({
      companyName,
      contactPerson,
      email,
      phoneNumber,
      shippingAddress,
      orderDetails
    });

    const createdOrder = await bulkOrder.save();
    res.status(201).json(createdOrder);
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// --- GET: FETCH ALL BULK ORDERS (Admin Only) ---
router.get('/', protect, admin, async (req, res) => {
  try {
    // Fetches all orders, newest first
    const orders = await BulkOrder.find().sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- PUT: UPDATE ORDER STATUS (Admin Only) ---
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await BulkOrder.findById(req.params.id);

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

module.exports = router;