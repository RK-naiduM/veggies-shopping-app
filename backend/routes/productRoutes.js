const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. IMPORT YOUR NEW CLOUDINARY UPLOAD MIDDLEWARE
// (Ensure the path is correct relative to this file's location)
const upload = require('../config/uploadConfig'); 

// GET all products (No changes)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category (No changes)
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STOCK ROUTE (No changes)
router.put('/:id/stock', protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
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

// --- UPDATE PRODUCT DETAILS (Handles URL OR File) ---
router.put('/:id', protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, stock, image: imageURL,about, keyBenefits, usageInfo, recommendeddosage, manufacturingInfo, highlights } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.about = about || product.about;
      product.keyBenefits = keyBenefits || product.keyBenefits;
      product.usageInfo = usageInfo || product.usageInfo;
      product.manufacturingInfo = manufacturingInfo || product.manufacturingInfo;
      product.recommendeddosage = recommendeddosage || product.recommendeddosage;
      product.highlights = highlights || product.highlights;

      if (stock !== undefined) {
        product.stock = Number(stock);
      }

      // 2. USE REQ.FILE.PATH FOR CLOUDINARY URL
      if (req.file) {
          product.image = req.file.path; 
      } else if (imageURL) {
          product.image = imageURL;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CREATE PRODUCT (Handles URL OR File) ---
router.post('/', protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, stock, image: imageURL, about, keyBenefits, usageInfo, recommendeddosage, manufacturingInfo, highlights } = req.body;

    let image_filename = ""; 
    
    // 3. USE REQ.FILE.PATH FOR CLOUDINARY URL
    if (req.file) {
        image_filename = req.file.path;
    } else if (imageURL) {
        image_filename = imageURL;
    } else {
        return res.status(400).json({ message: 'Image (File or URL) is required' });
    }

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = new Product({
      name,
      image: image_filename, 
      description,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      about,
      keyBenefits,
      usageInfo,
      recommendeddosage,
      manufacturingInfo,
      highlights
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// --- DELETE PRODUCT ---
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;