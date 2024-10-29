const express = require('express');
const router = express.Router();
const Load = require('../models/Load');




router.get('/', async (req, res) => {
    const { driver_id, dispatcher_id } = req.query;

    try {
        let loads = [];

        
        if (driver_id) {
            loads = await Load.find({ driver_id })
                .populate('driver_id', 'name pay_rate')
                .populate('dispatcher_id', 'name email');
        } 
        
        else if (dispatcher_id) {
            loads = await Load.find({ dispatcher_id })
                .populate('driver_id', 'name pay_rate')
                .populate('dispatcher_id', 'name email');
        } 
        
        else {
            return res.status(400).json({ message: 'Please provide either a driver_id or a dispatcher_id.' });
        }

        
        if (loads.length === 0) {
            return res.status(404).json({ message: 'No loads found for this driver or dispatcher.' });
        }

        
        let totalDriverEarnings = 0;
        let totalDispatcherEarnings = 0;

       
        const payments = {
            driverPayments: [],
            dispatcherPayments: []
        };

        loads.forEach(load => {
            const dispatcherEarnings = load.rate * 0.03;
            const driverEarnings = load.rate * (load.driver_id.pay_rate / 100);

           
            if (driver_id && load.driver_id._id.toString() === driver_id) {
                payments.driverPayments.push({
                    loadId: load._id,
                    fromLocation: load.from_location,
                    toLocation: load.to_location,
                    totalPrice: load.rate,
                    driverName: load.driver_id.name,
                    driverEarnings: parseFloat(driverEarnings.toFixed(2)),
                    createdAt: load.createdAt
                });
                
                totalDriverEarnings += driverEarnings;
            }

            
            if (dispatcher_id && load.dispatcher_id._id.toString() === dispatcher_id) {
                payments.dispatcherPayments.push({
                    loadId: load._id,
                    fromLocation: load.from_location,
                    toLocation: load.to_location,
                    totalPrice: load.rate,
                    dispatcherName: load.dispatcher_id.name,
                    dispatcherEmail: load.dispatcher_id.email,
                    dispatcherEarnings: parseFloat(dispatcherEarnings.toFixed(2)),
                    createdAt: load.createdAt
                });
                
                totalDispatcherEarnings += dispatcherEarnings;
            }
        });

        
        res.status(200).json({
          totalDriverEarnings: parseFloat(totalDriverEarnings.toFixed(2)),
          totalDispatcherEarnings: parseFloat(totalDispatcherEarnings.toFixed(2)),
            payments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

