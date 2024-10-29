const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');


  // Create Payment
  router.post('/add', async (req, res) => {
    const { load_id, driver_id, dispatcher_id, amount, payment_date } = req.body;
  
    try {
      const newPayment = new Payment({ load_id, driver_id, dispatcher_id, amount, payment_date });
      await newPayment.save();
      res.status(201).json(newPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Read Payments
router.get('/', async (req, res) => {
    try {
      const payments = await Payment.find({});
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Payment
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete Payment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Payment.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Payment not found' });
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;