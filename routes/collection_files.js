const express = require('express');
const router = express.Router();
const { all, collection_file, add, remove, edit } = require("../controllers/collection_files");
const { auth } = require('../middleware/auth');

router.get('/', auth, all);
router.get('/:id', auth, collection_file);
router.post('/add', auth, add);
router.post('/remove/:id', auth, remove);
router.put('/edit/:id', auth, edit);

module.exports = router;