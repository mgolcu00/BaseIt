const {realtime} = require('../controllers');
const router = require('express').Router();

router.post('/create', realtime.create);
router.get('/data', realtime.getData);
router.post('/data', realtime.setData);
router.post('/stop', realtime.stop);
router.get('/listen', realtime.listen);

module.exports = router;