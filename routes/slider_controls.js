const express = require('express');
const router = express.Router();
const { all, slider_control, add, remove, edit  } = require("../controllers/slider_controls");
const { auth } = require("../middleware/auth");

router.get('/', all);
router.get('/:id', slider_control);
router.post('/add', auth, add);
router.post('/remove/:id', auth, remove);
router.put('/edit/:id', auth, edit);

module.exports = router;