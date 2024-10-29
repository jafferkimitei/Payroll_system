const express = require('express');
const mongoose = require('mongoose');
const dispatchersRoute = require('./routes/dispatchers');
const driversRoute = require('./routes/drivers');
const loadsRoute = require('./routes/loads');
const paymentsRoute = require('./routes/payments');

const app = express();
app.use(express.json());

const uri = "mongodb+srv://yunghavy:<tEK1k1qVgzc18yhB>@payroll.jmsis.mongodb.net/?retryWrites=true&w=majority&appName=Payroll";
mongoose.connect(uri, { dbName: 'payroll', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/dispatchers', dispatchersRoute);
app.use('/drivers', driversRoute);
app.use('/loads', loadsRoute);
app.use('/payments', paymentsRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Payroll API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
