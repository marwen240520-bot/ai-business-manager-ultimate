const express = require('express'); 
const mongoose = require('mongoose'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const http = require('http'); 
const { Server } = require('socket.io'); 
const routes = require('./routes'); 
const logger = require('./utils/logger'); 
const emailService = require('./services/emailService'); 
 
dotenv.config(); 
 
const app = express(); 
const server = http.createServer(app); 
const io = new Server(server, { 
  cors: { 
    credentials: true 
  } 
}); 
 
 
app.use(helmet()); 
app.use(cors({ 
  credentials: true 
})); 
app.use(express.json()); 
 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() =
  logger.info('MongoDB connected successfully'); 
}).catch(err =
  logger.error('MongoDB connection error:', err); 
}); 
 
io.use((socket, next) =
  const token = socket.handshake.auth.token; 
  if (!token) { 
    return next(new Error('Authentication required')); 
  } 
  try { 
    const jwt = require('jsonwebtoken'); 
    socket.userId = decoded.id; 
    next(); 
  } catch (err) { 
    next(new Error('Invalid token')); 
  } 
}); 
 
io.on('connection', (socket) =
  logger.info(`User connected: ${socket.userId}`); 
  socket.join(`user:${socket.userId}`); 
 
  socket.on('disconnect', () =
    logger.info(`User disconnected: ${socket.userId}`); 
  }); 
}); 
 
app.use((req, res, next) =
  req.io = io; 
  next(); 
}); 
 
app.use('/api', routes); 
 
app.get('/health', (req, res) =
  res.json({ status: 'OK', service: 'Notification Service', timestamp: new Date().toISOString() }); 
}); 
 
server.listen(PORT, () =
  logger.info(`Notification Service running on http://localhost:${PORT}`); 
}); 
