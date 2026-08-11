const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const BulkOrder = require('../models/BulkOrder');
const { protect, admin } = require('../middleware/authMiddleware');

// --- POST: CREATE A NEW BULK ORDER (Public Route) ---
router.post('/', protect, async (req, res) => {
  try {
    const { 
      companyName, contactPerson, email, 
      phoneNumber, shippingAddress, orderDetails 
    } = req.body;

    // 1. Basic validation
    if (!companyName || !contactPerson || !email || !phoneNumber || !shippingAddress || !orderDetails) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // 2. Save to Database
    const bulkOrder = new BulkOrder({
      user: req.user._id,companyName, contactPerson, email,
      phoneNumber, shippingAddress, orderDetails
    });
    const createdOrder = await bulkOrder.save();

    // 3. --- SEND EMAIL NOTIFICATION ---

      try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Tells Node to use Port 587 (STARTTLS)
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Sending to yourself so you get the alert
        subject: `🚨 New Bulk Order Alert: ${companyName}`,
        text: `
          You have received a new bulk order request!
          
          Company: ${companyName}
          Contact Person: ${contactPerson}
          Phone: ${phoneNumber}
          Email: ${email}
          Shipping Address: ${shippingAddress}
          
          Order Details:
          ${orderDetails}
          
          Log into your Admin Dashboard to update the status.
        `
      };

      transporter.sendMail(mailOptions)
        .then(() => console.log('Background email sent successfully!'))
        .catch((err) => console.error('Background email failed:', err));

      
    } catch (emailError) {
      // If email fails, we still want to return a success response to the customer 
      // because the order WAS saved in the database.
      console.error('Order saved, but email failed to send:', emailError);
    }
    // ----------------------------------

    // 4. Send success back to React frontend
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