const express = require('express');
const router = express.Router();
const Dispatcher = require('../models/Dispatcher');


// Create dispatcher
router.post('/add', async (req, res) => {
    const { name, email, phone, commission_rate } = req.body;
  
    try {
      const newDispatcher = new Dispatcher({ name, email, phone, commission_rate });
      await newDispatcher.save();
      res.status(201).json(newDispatcher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Read Dispatchers
router.get('/', async (req, res) => {
    try {
      const dispatchers = await Dispatcher.find({});
      res.status(200).json(dispatchers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Dispatcher
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const dispatcher = await Dispatcher.findByIdAndUpdate(id, updateData, { new: true });
      if (!dispatcher) return res.status(404).json({ error: 'Dispatcher not found' });
      res.status(200).json(dispatcher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete Dispatcher
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Dispatcher.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Dispatcher not found' });
      res.status(200).json({ message: 'Dispatcher deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;