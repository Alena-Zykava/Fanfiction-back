const Router = require('express');
const router = new Router();
const fanficController = require('../controllers/fanficController');

router.post('/add', fanficController.addFanfic);
router.delete('/delete/:id', fanficController.deleteFanfic);
router.patch('/update', fanficController.updateFanfic);


router.get('/', fanficController.getFanfics);

router.get('/:id', fanficController.getFanfic);
router.get('/user/:userId', fanficController.getUserFanfics);


module.exports = router;