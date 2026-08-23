const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// SECRET KEY (In a real app, put this in .env file)
const JWT_SECRET = 'my_super_secret_key_123'; 

// 1. SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token (The "ID Card")
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 3. GOOGLE SSO ROUTE
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; // This is the Google ticket sent from the frontend

    // 1. Verify the ticket with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // 2. Extract user info from the verified ticket
    const { name, email, sub: googleId } = ticket.getPayload();

    // 3. Check if user already exists in our database
    let user = await User.findOne({ email });

    if (user) {
      // If they exist but don't have a googleId (e.g., they originally signed up with a password),
      // we can link their Google account now.
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // 4. If they don't exist, create a new user! 
      // Notice: We do NOT need a password here because of our Database update.
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    // 5. Generate our standard 1-hour JWT for the app
    const appToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // 6. Send the user data and token back to the frontend
    res.json({
      token: appToken,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
});



module.exports = router;