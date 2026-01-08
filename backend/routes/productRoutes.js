const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category (vegetables or powders)
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STOCK ROUTE
router.put('/:id/stock', protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // THE FIX: ADD to existing stock
      product.stock = product.stock + Number(stock); 
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- UPDATE PRODUCT DETAILS (Name, Price, Desc, etc.) ---
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, image, description, category, price } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.image = image || product.image;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW ROUTE: CREATE PRODUCT ---
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, image, description, category, price, stock } = req.body;

    // Simple validation
    if (!name || !image || !description || !category || !price) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = new Product({
      name,
      image,
      description,
      category,
      price: Number(price),
      stock: Number(stock) || 0, // Default to 0 if not sent
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;