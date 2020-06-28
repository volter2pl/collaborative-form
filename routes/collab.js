const
    router = require('express').Router(),
    collabController = require('../controllers/collab');

router.get('/', collabController.index);

module.exports = router;
