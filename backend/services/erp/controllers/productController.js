const Product = require('../models/Product'); 
const Inventory = require('../models/Inventory'); 
const logger = require('../utils/logger'); 
const redis = require('../utils/redis'); 
 
exports.getProducts = async (req, res) =
  try { 
    const { page = 1, limit = 20, category, status, search } = req.query; 
    const skip = (page - 1) * limit; 
    const query = {}; 
 
    if (category) query.category = category; 
    if (status) query.status = status; 
    if (search) { 
      query.$or = [ 
        { name: new RegExp(search, 'i') }, 
        { sku: new RegExp(search, 'i') }, 
        { barcode: search } 
      ]; 
    } 
 
    const products = await Product.find(query) 
      .skip(skip) 
      .limit(parseInt(limit)) 
      .sort({ name: 1 }); 
 
    const total = await Product.countDocuments(query); 
 
    res.json({ 
      products, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    }); 
  } catch (error) { 
    logger.error('Get products error:', error); 
    res.status(500).json({ error: 'Failed to fetch products' }); 
  } 
}; 
 
exports.getProductById = async (req, res) =
  try { 
    const product = await Product.findById(req.params.id); 
    if (!product) { 
      return res.status(404).json({ error: 'Product not found' }); 
    } 
    res.json(product); 
  } catch (error) { 
    logger.error('Get product by id error:', error); 
    res.status(500).json({ error: 'Failed to fetch product' }); 
  } 
}; 
 
exports.createProduct = async (req, res) =
  try { 
    const product = new Product({ 
      ...req.body, 
      createdBy: req.headers['x-user-id'] 
    }); 
    await product.save(); 
 
    const inventory = new Inventory({ 
      productId: product._id, 
    }); 
    await inventory.save(); 
 
    logger.info(`Product created: ${product.name}`); 
    res.status(201).json(product); 
  } catch (error) { 
    logger.error('Create product error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
exports.updateProduct = async (req, res) =
  try { 
    const product = await Product.findByIdAndUpdate( 
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true, runValidators: true } 
    ); 
    if (!product) { 
      return res.status(404).json({ error: 'Product not found' }); 
    } 
 
    await Inventory.findOneAndUpdate( 
      { productId: product._id }, 
      { quantity: product.stock, available: product.stock } 
    ); 
 
    res.json(product); 
  } catch (error) { 
    logger.error('Update product error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
exports.deleteProduct = async (req, res) =
  try { 
    const product = await Product.findByIdAndDelete(req.params.id); 
    if (!product) { 
      return res.status(404).json({ error: 'Product not found' }); 
    } 
    await Inventory.findOneAndDelete({ productId: req.params.id }); 
    res.json({ message: 'Product deleted successfully' }); 
  } catch (error) { 
    logger.error('Delete product error:', error); 
    res.status(500).json({ error: 'Failed to delete product' }); 
  } 
}; 
 
exports.getLowStock = async (req, res) =
  try { 
    const products = await Product.find({ 
      $expr: { $lte: [ "$stock", "$minStock" ] }, 
      status: 'active' 
    }); 
    res.json(products); 
  } catch (error) { 
    logger.error('Get low stock error:', error); 
    res.status(500).json({ error: 'Failed to fetch low stock products' }); 
  } 
}; 
