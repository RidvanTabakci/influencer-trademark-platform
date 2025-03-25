const express = require('express');
const router = express.Router();
const {createTrip , getTrip,addExpenses , getAllTrip} = require('../controllers/trip.js');


router.post('/createTrip',createTrip);
router.get('/getTrip/:tripId',getTrip);
router.get('/getAllTrip/:userId',getAllTrip);
router.post('/addExpenses/:tripId/:userId',addExpenses);
module.exports = router;
