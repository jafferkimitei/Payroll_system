
const express = require('express');
const router = express.Router();
const Load = require('../models/Load');



  // Create Load
  router.post('/add', async (req, res) => {
    const { from_location, to_location, rate, dispatcher_id, driver_id } = req.body;
  
    try {
      const newLoad = new Load({ from_location, to_location, rate, dispatcher_id, driver_id });
      await newLoad.save();
      res.status(201).json(newLoad);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Read Loads
router.get('/', async (req, res) => {
    try {
      const loads = await Load.find({});
      res.status(200).json(loads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Load
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const load = await Load.findByIdAndUpdate(id, updateData, { new: true });
      if (!load) return res.status(404).json({ error: 'Load not found' });
      res.status(200).json(load);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete Load
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Load.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Load not found' });
      res.status(200).json({ message: 'Load deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;