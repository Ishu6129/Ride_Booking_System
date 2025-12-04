const User = require('../models/User');
const Rider = require('../models/Rider');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured in environment variables');
  }
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerRider = async (req, res) => {
  try {
    console.log('📝 Registering Rider with data:', req.body);
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      console.log('❌ Missing fields:', { name: !!name, email: !!email, phone: !!phone, password: !!password });
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, phone, password' 
      });
    }

    // Validate email format
    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format (basic check)
    if (phone.length < 10) {
      return res.status(400).json({ message: 'Phone number must be at least 10 digits' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create rider using User model with role discriminator
    console.log('🔄 Creating rider in database...');
    const rider = await Rider.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'rider'
    });
    console.log('✅ Rider created successfully:', rider._id);

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
    console.error('❌ Register rider error:', error.message);
    console.error('Error details:', error);
    
    // Handle specific Mongoose errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} is already registered` });
    }
    
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

const registerDriver = async (req, res) => {
  try {
    console.log('📝 Registering Driver with data:', req.body);
    const { name, email, phone, password, licenseNumber, vehicleNumber, vehicleType } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !licenseNumber || !vehicleNumber || !vehicleType) {
      console.log('❌ Missing fields:', { name: !!name, email: !!email, phone: !!phone, password: !!password, licenseNumber: !!licenseNumber, vehicleNumber: !!vehicleNumber, vehicleType: !!vehicleType });
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, phone, password, licenseNumber, vehicleNumber, vehicleType' 
      });
    }

    // Validate email format
    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format
    if (phone.length < 10) {
      return res.status(400).json({ message: 'Phone number must be at least 10 digits' });
    }

    // Validate vehicle type
    if (!['economy', 'premium', 'xl'].includes(vehicleType)) {
      return res.status(400).json({ message: 'Invalid vehicle type. Use economy, premium, or xl' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Check if license number is already registered
    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'License number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create driver using Driver model
    console.log('🔄 Creating driver in database...');
    const driver = await Driver.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      licenseNumber: licenseNumber.trim(),
      vehicleNumber: vehicleNumber.trim(),
      vehicleType,
      role: 'driver',
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
    console.log('✅ Driver created successfully:', driver._id);

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
    console.error('❌ Register driver error:', error.message);
    console.error('Error details:', error);
    
    // Handle specific Mongoose errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} is already registered` });
    }
    
    res.status(500).json({ message: error.message || 'Registration failed' });
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
