const express = require('express'); 
const mongoose = require('mongoose'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const routes = require('./routes'); 
const logger = require('./utils/logger'); 
 
dotenv.config(); 
 
const app = express(); 
 
app.use(helmet()); 
app.use(cors({ 
  credentials: true 
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() =
  logger.info('MongoDB connected successfully'); 
}).catch(err =
  logger.error('MongoDB connection error:', err); 
}); 
 
app.use('/api', routes); 
 
app.get('/health', (req, res) =
  res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date().toISOString() }); 
}); 
 
app.use((err, req, res, next) =
  logger.error(err.stack); 
  res.status(500).json({ error: 'Internal server error' }); 
}); 
 
app.listen(PORT, () =
  logger.info(`Auth Service running on http://localhost:${PORT}`); 
}); 
