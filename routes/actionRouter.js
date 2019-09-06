const express = require('express');

const router = express.Router();

const Actions = require('../data/helpers/actionModel.js');

router.get('/', (req, res) => {
    Actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: 'Actions data could not be retrieved from the server.' });
    })
})


module.exports = router;