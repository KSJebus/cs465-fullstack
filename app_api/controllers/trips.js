const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    try {
        const q = await Model
            .find({}) // No filter, return all records
            .exec();

        if (!q || q.length === 0) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: 'No trips found' });
        }
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error retrieving trips', error: err.message });
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model
            .find({ 'code': req.params.tripCode }) // Return single record
            .exec();

        if (!q || q.length === 0) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found: ${req.params.tripCode}` });
        }
        // Return resulting trip
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error retrieving trip', error: err.message });
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const q = await newTrip.save();

        // Return new trip
        return res
            .status(201)
            .json(q);
    } catch (err) {
        // Validation failures (e.g. missing required fields) are client errors
        return res
            .status(400)
            .json({ message: 'Error adding trip', error: err.message });
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { new: true, runValidators: true } // Return the updated record
            )
            .exec();

        if (!q) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found: ${req.params.tripCode}` });
        }
        // Return resulting updated trip
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(400)
            .json({ message: 'Error updating trip', error: err.message });
    }
};

// DELETE: /trips/:tripCode - Deletes an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndDelete({ 'code': req.params.tripCode })
            .exec();

        if (!q) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found: ${req.params.tripCode}` });
        }
        // Return the deleted trip
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error deleting trip', error: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
