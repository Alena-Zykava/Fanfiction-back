const Router = require('express');
const router = new Router();
const fanficController = require('../controllers/fanficController');

router.post('/note', fanficController.noteFanfic);
router.get('/', fanficController.getFanfic);


module.exports = router;