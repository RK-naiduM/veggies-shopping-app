const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    // The Magic Security Rule: Password is only required if googleId is missing
    required: function() {
      return !this.googleId; 
    }
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true // This is crucial! It allows multiple regular users to have a "null" googleId without throwing a "duplicate key" error.
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;