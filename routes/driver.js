const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');


  // Create Driver
  router.post('/add', async (req, res) => {
    const { name, phone, pay_rate } = req.body;
  
    try {
      const newDriver = new Driver({ name, phone, pay_rate });
      await newDriver.save();
      res.status(201).json(newDriver);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Read Drivers
router.get('/', async (req, res) => {
    try {
      const drivers = await Driver.find({});
      res.status(200).json(drivers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Driver
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const driver = await Driver.findByIdAndUpdate(id, updateData, { new: true });
      if (!driver) return res.status(404).json({ error: 'Driver not found' });
      res.status(200).json(driver);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete Driver
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Driver.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Driver not found' });
      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;