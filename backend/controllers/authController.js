const User = require('../models/User');
const Rider = require('../models/Rider');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerRider = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, phone, password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create rider
    const rider = new Rider({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'rider'
    });

    await rider.save();

    const token = generateToken(rider._id, 'rider');

    res.status(201).json({
      message: 'Rider registered successfully',
      token,
      user: {
        id: rider._id,
        name: rider.name,
        email: rider.email,
        role: rider.role
      }
    });
  } catch (error) {
    console.error('Register rider error:', error);
    res.status(500).json({ message: error.message });
  }
};

const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, password, licenseNumber, vehicleNumber, vehicleType } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !licenseNumber || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, phone, password, licenseNumber, vehicleNumber, vehicleType' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create driver
    const driver = new Driver({
      name,
      email,
      phone,
      password: hashedPassword,
      licenseNumber,
      vehicleNumber,
      vehicleType,
      role: 'driver',
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });

    await driver.save();

    const token = generateToken(driver._id, 'driver');

    res.status(201).json({
      message: 'Driver registered successfully',
      token,
      user: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        role: driver.role
      }
    });
  } catch (error) {
    console.error('Register driver error:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, profileImage, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerRider,
  registerDriver,
  login,
  getProfile,
  updateProfile
};
