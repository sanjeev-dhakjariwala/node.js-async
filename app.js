const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

// Custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Middleware to log requests
app.use(morgan(':method :url :status :response-time ms - :body'));
app.use(express.json()); // Middleware to parse JSON bodies

// Middleware to identify the user based on the request body
app.use((req, res, next) => {
    const { user } = req.body;
    if (!user) {
        return res.status(400).send('User is required');
    }
    req.user = user;
    next();
});

// Simulate a non-blocking delay
const simulateNonBlockingOperation = (duration) => {
    return new Promise((resolve) => {
        console.log(`[${new Date().toISOString()}] Start non-blocking operation for ${duration} ms`);
        setTimeout(() => {
            console.log(`[${new Date().toISOString()}] End non-blocking operation`);
            resolve();
        }, duration);
    });
};

// Route to solve linear equations
app.post('/solve', async (req, res) => {
    const { user, a, b, c } = req.body; // Linear equation ax + b = c
    const startTime = new Date().toISOString();

    // Log the start time of the request
    console.log(`[${startTime}] ${user} started processing.`);

    // Simulate a non-blocking request for a specific user
    if (user === 'Shyam') {
        console.log(`[${startTime}] Simulating non-blocking operation for ${user}`);
        await simulateNonBlockingOperation(5000); // Simulate a 5-second delay
    }

    if (a === 0) {
        const invalidTime = new Date().toISOString();
        console.log(`[${invalidTime}] ${user} requested an invalid equation: a cannot be zero`);
        return res.status(400).send('Coefficient a cannot be zero');
    }

    const solution = (c - b) / a;
    const endTime = new Date().toISOString();

    console.log(`[${endTime}] ${user} requested to solve the equation: ${a}x + ${b} = ${c}, solution is ${solution}`);
    res.json({ user, solution });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
