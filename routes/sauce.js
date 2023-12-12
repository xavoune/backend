const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSaucesById);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
// router.post(':id/like', auth, sauceCtrl.likeASauce)

module.exports = router;