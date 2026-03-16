const express = require('express'); 
const { createProxyMiddleware } = require('http-proxy-middleware'); 
const rateLimit = require('express-rate-limit'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const compression = require('compression'); 
const { expressjwt: jwt } = require('express-jwt'); 
const redis = require('redis'); 
const winston = require('winston'); 
const dotenv = require('dotenv'); 
const axios = require('axios'); 
 
dotenv.config(); 
 
const app = express(); 
 
const logger = winston.createLogger({ 
  level: 'info', 
  format: winston.format.combine( 
    winston.format.timestamp(), 
    winston.format.json() 
  ), 
  transports: [ 
    new winston.transports.File({ filename: '../../logs/api-gateway.log' }), 
    new winston.transports.Console({ format: winston.format.simple() }) 
  ] 
}); 
 
const redisClient = redis.createClient({ 
}); 
 
redisClient.connect().catch(err =
  logger.error('Redis connection error:', err); 
}); 
 
redisClient.on('connect', () =
  logger.info('Redis connected'); 
}); 
 
app.use(helmet({ 
  contentSecurityPolicy: false 
})); 
 
app.use(cors({ 
  credentials: true 
})); 
 
app.use(compression()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
 
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { error: 'Too many requests, please try again later' }, 
  standardHeaders: true, 
  legacyHeaders: false 
}); 
 
app.use('/api', limiter); 
 
app.use((req, res, next) =
  logger.info(`${req.method} ${req.url} - ${req.ip} - ${req.headers['user-agent']}`); 
  next(); 
}); 
 
const checkBlacklist = async (req, res, next) =
  const token = req.headers.authorization?.split(' ')[1]; 
  if (token) { 
    try { 
      const isBlacklisted = await redisClient.get(`blacklist:${token}`); 
      if (isBlacklisted) { 
        return res.status(401).json({ error: 'Token revoked' }); 
      } 
    } catch (error) { 
      logger.error('Blacklist check error:', error); 
    } 
  } 
  next(); 
}; 
 
const authenticate = jwt({ 
  algorithms: ['HS256'], 
  credentialsRequired: false, 
  getToken: (req) =
    const authHeader = req.headers.authorization; 
      return authHeader.split(' ')[1]; 
    } 
    return null; 
  } 
}); 
 
app.use(checkBlacklist); 
app.use(authenticate); 
 
const publicRoutes = [ 
  '/api/auth/login', 
  '/api/auth/register', 
  '/api/auth/forgot-password', 
  '/api/auth/reset-password', 
  '/health' 
]; 
 
app.use((req, res, next) =
    return next(); 
  } 
  if (!req.auth) { 
    return res.status(401).json({ error: 'Authentication required' }); 
  } 
  next(); 
}); 
 
const serviceProxy = (target, pathRewrite) =
  return createProxyMiddleware({ 
    target, 
    changeOrigin: true, 
    pathRewrite, 
    onProxyReq: (proxyReq, req, res) =
      if (req.auth) { 
        proxyReq.setHeader('X-User-Id', req.auth.id); 
        proxyReq.setHeader('X-User-Role', req.auth.role); 
        proxyReq.setHeader('X-User-Email', req.auth.email); 
      } 
        const bodyData = JSON.stringify(req.body); 
        proxyReq.setHeader('Content-Type', 'application/json'); 
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData)); 
        proxyReq.write(bodyData); 
      } 
    }, 
    onProxyRes: (proxyRes, req, res) =
      logger.info(`Proxy response: ${req.method} ${req.url} -
    }, 
    onError: (err, req, res) =
      logger.error(`Proxy error for ${req.url}:`, err); 
      res.status(503).json({ 
        error: 'Service temporarily unavailable', 
        service: req.url.split('/')[2] 
      }); 
    }, 
    timeout: 30000 
  }); 
}; 
 
app.use('/api/auth', serviceProxy('http://localhost:8001', { '/api/auth': '/api' })); 
app.use('/api/crm', serviceProxy('http://localhost:8002', { '/api/crm': '/api' })); 
app.use('/api/erp', serviceProxy('http://localhost:8003', { '/api/erp': '/api' })); 
app.use('/api/ai', serviceProxy('http://localhost:8004', { '/api/ai': '/api' })); 
app.use('/api/finance', serviceProxy('http://localhost:8005', { '/api/finance': '/api' })); 
app.use('/api/notifications', serviceProxy('http://localhost:8006', { '/api/notifications': '/api' })); 
app.use('/api/analytics', serviceProxy('http://localhost:8007', { '/api/analytics': '/api' })); 
app.use('/api/payments', serviceProxy('http://localhost:8008', { '/api/payments': '/api' })); 
app.use('/api/inventory', serviceProxy('http://localhost:8009', { '/api/inventory': '/api' })); 
app.use('/api/hr', serviceProxy('http://localhost:8010', { '/api/hr': '/api' })); 
app.use('/api/projects', serviceProxy('http://localhost:8011', { '/api/projects': '/api' })); 
app.use('/api/marketing', serviceProxy('http://localhost:8012', { '/api/marketing': '/api' })); 
app.use('/api/support', serviceProxy('http://localhost:8013', { '/api/support': '/api' })); 
app.use('/api/documents', serviceProxy('http://localhost:8014', { '/api/documents': '/api' })); 
app.use('/api/search', serviceProxy('http://localhost:8015', { '/api/search': '/api' })); 
app.use('/api/audit', serviceProxy('http://localhost:8016', { '/api/audit': '/api' })); 
app.use('/api/websocket', serviceProxy('http://localhost:8017', { '/api/websocket': '/api' })); 
 
app.get('/health', async (req, res) =
  const services = { 
    gateway: 'running', 
    auth: false, 
    crm: false, 
    erp: false, 
    ai: false 
  }; 
 
  const checkService = async (url) =
    try { 
      const response = await axios.get(url, { timeout: 2000 }); 
      return response.status === 200; 
    } catch { 
      return false; 
    } 
  }; 
 
  services.auth = await checkService('http://localhost:8001/health'); 
  services.crm = await checkService('http://localhost:8002/health'); 
  services.erp = await checkService('http://localhost:8003/health'); 
  services.ai = await checkService('http://localhost:8004/health'); 
 
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    uptime: process.uptime(), 
    services 
  }); 
}); 
 
app.use((err, req, res, next) =
  logger.error('Unhandled error:', err); 
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  }); 
}); 
 
app.listen(PORT, () =
  logger.info(`API Gateway started on http://localhost:${PORT}`); 
}); 
 
module.exports = app; 
