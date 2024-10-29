const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const Driver = require('../models/Driver');
const Dispatcher = require('../models/Dispatcher');

// Create Load
router.post('/add', async (req, res) => {
    const { from_location, to_location, rate, dispatcher_id, driver_id } = req.body;
  
    try {
        // Fetch driver and dispatcher details for calculations
        const driver = await Driver.findById(driver_id);
        const dispatcher = await Dispatcher.findById(dispatcher_id);

        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        if (!dispatcher) return res.status(404).json({ error: 'Dispatcher not found' });

        // Calculate earnings
        const dispatcherEarnings = rate * 0.03;
        const driverEarnings = rate * (driver.pay_rate / 100);

       
        const newLoad = new Load({
            from_location,
            to_location,
            rate,
            dispatcher_id,
            driver_id,
            dispatcherEarnings,
            driverEarnings
        });

        await newLoad.save();
        res.status(201).json(newLoad);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/', async (req, res) => {
  try {
      const loads = await Load.find({})
          .populate('dispatcher_id', 'name email')
          .populate('driver_id', 'name phone pay_rate');

      // Adding earnings calculation with safe access
      const loadsWithEarnings = loads.map(load => {
          const driverEarnings = load.driver_id && load.driver_id.pay_rate
              ? load.rate * (load.driver_id.pay_rate / 100)
              : 0; // Default to 0 if driver is not found

          return {
              ...load.toObject(),
              dispatcherEarnings: load.rate * 0.03,
              driverEarnings: driverEarnings,
          };
      });

      res.status(200).json(loadsWithEarnings);
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
