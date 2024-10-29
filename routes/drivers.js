const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Load = require('../models/Load');

// Create Driver
router.post('/add', async (req, res) => {
    const { name, phone, pay_rate, license_number } = req.body;
  
    try {
        const newDriver = new Driver({ name, phone, pay_rate, license_number });
        await newDriver.save();
        res.status(201).json(newDriver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find({});
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Driver with Loads and Earnings
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const driver = await Driver.findById(id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        // Find all loads for this driver
        const loads = await Load.find({ driver_id: id });
        
        // Calculate earnings based on pay rate for each load
        let totalEarnings = 0;
        const loadData = loads.map(load => {
            const earnings = load.rate * (driver.pay_rate / 100);
            totalEarnings += earnings;
            return {
                ...load.toObject(),
                earnings
            };
        });

        res.status(200).json({
            driver,
            loads: loadData,
            totalEarnings
        });
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
