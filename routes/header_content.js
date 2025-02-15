const express = require('express');
const router = express.Router();
const { all, add, remove, edit, header_content, } = require("../controllers/header_content");
const { auth } = require("../middleware/auth");

router.get('/', all);
router.get('/:id', header_content);
router.post('/add', auth, add);
router.post('/remove/:id', auth, remove);
router.put('/edit/:id', auth, edit);

module.exports = router;