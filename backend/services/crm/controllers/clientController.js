const Client = require('../models/Client'); 
const logger = require('../utils/logger'); 
 
exports.getClients = async (req, res) =
  try { 
    const { page = 1, limit = 20, status, industry, search } = req.query; 
    const skip = (page - 1) * limit; 
    const query = {}; 
 
    if (status) query.status = status; 
    if (industry) query.industry = industry; 
    if (search) { 
      query.$or = [ 
        { companyName: new RegExp(search, 'i') }, 
        { email: new RegExp(search, 'i') }, 
        { 'contacts.email': new RegExp(search, 'i') } 
      ]; 
    } 
 
    const clients = await Client.find(query) 
      .skip(skip) 
      .limit(parseInt(limit)) 
      .sort({ createdAt: -1 }); 
 
    const total = await Client.countDocuments(query); 
 
    res.json({ 
      clients, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    }); 
  } catch (error) { 
    logger.error('Get clients error:', error); 
    res.status(500).json({ error: 'Failed to fetch clients' }); 
  } 
}; 
 
exports.getClientById = async (req, res) =
  try { 
    const client = await Client.findById(req.params.id); 
    if (!client) { 
      return res.status(404).json({ error: 'Client not found' }); 
    } 
    res.json(client); 
  } catch (error) { 
    logger.error('Get client by id error:', error); 
    res.status(500).json({ error: 'Failed to fetch client' }); 
  } 
}; 
 
exports.createClient = async (req, res) =
  try { 
    const client = new Client({ 
      ...req.body, 
      createdBy: req.headers['x-user-id'] 
    }); 
    await client.save(); 
    logger.info(`Client created: ${client.companyName}`); 
    res.status(201).json(client); 
  } catch (error) { 
    logger.error('Create client error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
exports.updateClient = async (req, res) =
  try { 
    const client = await Client.findByIdAndUpdate( 
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true, runValidators: true } 
    ); 
    if (!client) { 
      return res.status(404).json({ error: 'Client not found' }); 
    } 
    res.json(client); 
  } catch (error) { 
    logger.error('Update client error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
exports.deleteClient = async (req, res) =
  try { 
    const client = await Client.findByIdAndDelete(req.params.id); 
    if (!client) { 
      return res.status(404).json({ error: 'Client not found' }); 
    } 
    res.json({ message: 'Client deleted successfully' }); 
  } catch (error) { 
    logger.error('Delete client error:', error); 
    res.status(500).json({ error: 'Failed to delete client' }); 
  } 
}; 
