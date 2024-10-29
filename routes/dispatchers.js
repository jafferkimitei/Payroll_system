const express = require('express');
const router = express.Router();
const Dispatcher = require('../models/Dispatcher');
const Load = require('../models/Load');

// Create Dispatcher
router.post('/add', async (req, res) => {
    const { name, email, phone, commission_rate = 0.03 } = req.body;
  
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

// Read Dispatchers with Load and Earnings
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const dispatcher = await Dispatcher.findById(id);
        if (!dispatcher) return res.status(404).json({ error: 'Dispatcher not found' });

        const loads = await Load.find({ dispatcher_id: id });
        
        // Calculate total earnings from loads
        let totalCommission = 0;
        const loadData = loads.map(load => {
            const commission = load.rate * dispatcher.commission_rate;
            totalCommission += commission;
            return {
                ...load.toObject(),
                commission
            };
        });

        res.status(200).json({
            dispatcher,
            loads: loadData,
            totalCommission
        });
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
