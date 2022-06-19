const controller = require('../controllers');
const router = require('express').Router();


// realtime
router.post('/realtime/create', controller.realtime.create);
router.get('/realtime/data', controller.realtime.getData);
router.post('/realtime/data', controller.realtime.setData);

// router.get('/realtime/data', controller.realtime.getDataOnFile);
// router.post('/realtime/data', controller.realtime.insertDataOnFile);
// router.post('/realtime/create', controller.realtime.createRealtimeDatabase);

module.exports = router;

