const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
// Expects an "Authorization: Bearer <token>" header on the request
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.status(401).json({ message: 'Authorization header required' });
    }

    const headers = authHeader.split(' ');
    if (headers.length < 2 || headers[0] !== 'Bearer') {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.status(401).json({ message: 'Malformed authorization header' });
    }

    const token = headers[1];
    if (!token) {
        console.log('Null Bearer Token');
        return res.status(401).json({ message: 'Bearer token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({ message: 'Token Validation Error!' });
        }
        req.auth = verified; // Set the auth param to the decoded object
        next(); // Continue or this will hang forever
    });
}

// define routes for authentication
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList)                      // GET Method routes tripList
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST Method adds a Trip (secured)

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter (secured)
// DELETE Method routes tripsDeleteTrip - requires parameter (secured)
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
