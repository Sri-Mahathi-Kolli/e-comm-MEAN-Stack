const express = require('express');
const router = express.Router();
const contactHandler = require('../handlers/contact-handler');

router.post('/', contactHandler.submitContact);

module.exports = router;
