const User = require('../models/User'); 
const RefreshToken = require('../models/RefreshToken'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const { validationResult } = require('express-validator'); 
const logger = require('../utils/logger'); 
const redis = require('../utils/redis'); 
 
exports.register = async (req, res) =
  try { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() }); 
    } 
 
    const { name, email, password, role, company } = req.body; 
 
    const existingUser = await User.findOne({ email }); 
    if (existingUser) { 
      return res.status(400).json({ error: 'Email already exists' }); 
    } 
 
    const emailVerificationToken = crypto.randomBytes(32).toString('hex'); 
 
    const user = new User({ 
      name, 
      email, 
      password, 
      company, 
      emailVerificationToken 
    }); 
 
    await user.save(); 
 
    const token = user.generateAuthToken(); 
    const refreshToken = crypto.randomBytes(40).toString('hex'); 
    const expires = new Date(); 
    expires.setDate(expires.getDate() + 30); 
 
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user._id, 
      expires 
    }); 
 
    await redis.setEx(`refresh:${user._id}`, 30 * 24 * 60 * 60, refreshToken); 
 
    res.status(201).json({ 
      token, 
      refreshToken, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        company: user.company 
      } 
    }); 
  } catch (error) { 
    logger.error('Registration error:', error); 
    res.status(500).json({ error: 'Registration failed' }); 
  } 
}; 
 
exports.login = async (req, res) =
  try { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() }); 
    } 
 
    const { email, password } = req.body; 
 
    const user = await User.findOne({ email }); 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
 
    const isValid = await user.comparePassword(password); 
    if (!isValid) { 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
 
    user.lastLogin = new Date(); 
    await user.save(); 
 
    const token = user.generateAuthToken(); 
    const refreshToken = crypto.randomBytes(40).toString('hex'); 
    const expires = new Date(); 
    expires.setDate(expires.getDate() + 30); 
 
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user._id, 
      expires 
    }); 
 
    await redis.setEx(`refresh:${user._id}`, 30 * 24 * 60 * 60, refreshToken); 
 
    res.json({ 
      token, 
      refreshToken, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        company: user.company, 
        permissions: user.permissions 
      } 
    }); 
  } catch (error) { 
    logger.error('Login error:', error); 
    res.status(500).json({ error: 'Login failed' }); 
  } 
}; 
 
