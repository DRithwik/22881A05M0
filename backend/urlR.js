const express = require('express');
const router = express.Router();
const { createShortUrl } = require('../controllers/urlC');

router.post('/', createShortUrl);

module.exports = router;
