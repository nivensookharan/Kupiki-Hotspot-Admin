'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./hotspot.controller');

var router = express.Router();

router.get('/configuration', auth.isAuthenticated(), controller.getConfiguration);
router.post('/configuration', auth.isAuthenticated(), controller.setConfiguration);

module.exports = router;
