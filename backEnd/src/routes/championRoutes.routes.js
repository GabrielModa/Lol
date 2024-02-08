const express = require('express');
const router = express.Router();
const championController = require('../controllers/championController');

router.post('/selected-champions', championController.fetchAndSaveChampions); // Corrigido

module.exports = router;
